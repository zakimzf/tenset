const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { BN, ether, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const { getEvents } = require('./helpers');

const Configurator = contract.fromArtifact('Configurator');
const Token = contract.fromArtifact('TenSetToken');
const FreezeTokenWallet = contract.fromArtifact('FreezeTokenWallet');
const CommonSale = contract.fromArtifact('CommonSale');
const ERC20Mock = contract.fromArtifact('ERC20Mock');

describe('FreezeTokenWallet', async function () {

  const [ account1, account2, account3, donor ] = accounts;
  const OWNER_ADDRESS             = '0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303';
  const TEAM_WALLET_OWNER_ADDRESS = '0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7';
  const DEPLOYER_ADDRESS          = '0x6E9DC3D20B906Fd2B52eC685fE127170eD2165aB';
  const STAGE1_START_DATE         = 1612116000;

  beforeEach(async function () {
    this.configurator = await Configurator.new();

    this.tokenAddress = await this.configurator.token();
    this.freezeWalletAddress = await this.configurator.freezeWallet();
    this.commonSaleAddress = await this.configurator.commonSale();

    this.token = await Token.at(this.tokenAddress);
    this.freezeWallet = await FreezeTokenWallet.at(this.freezeWalletAddress);
    this.commonSale = await CommonSale.at(this.commonSaleAddress);

    await web3.eth.sendTransaction({ from: donor, to: OWNER_ADDRESS, value: ether("10")})
    await web3.eth.sendTransaction({ from: donor, to: TEAM_WALLET_OWNER_ADDRESS, value: ether("10")})
    await web3.eth.sendTransaction({ from: donor, to: DEPLOYER_ADDRESS, value: ether("10")})
    await this.commonSale.transferOwnership(OWNER_ADDRESS, {from: DEPLOYER_ADDRESS});
  });

  describe('Wallet', function() {
    it('should have owner', async function () {
      expect(await this.freezeWallet.owner()).to.equal(TEAM_WALLET_OWNER_ADDRESS);
    });

    it('should not allow premature withdrawal of tokens', async function () {
      await expectRevert(this.freezeWallet.retrieveWalletTokens(account1, {from: TEAM_WALLET_OWNER_ADDRESS}), "No tokens available for retrieving at this moment.");
    });

    it('should not allow to withdraw TesSet tokens with retriveTokens method', async function () {
      await expectRevert(this.freezeWallet.retrieveTokens(TEAM_WALLET_OWNER_ADDRESS, this.tokenAddress, {from: TEAM_WALLET_OWNER_ADDRESS}), "You should only use this method to withdraw extraneous tokens.");
    });

    it('should allow to retrieve tokens other than TenSetToken', async function () {
      const alienToken = await ERC20Mock.new('TEST', 'TST', account1, new BN(1000), {from: account1});
      await alienToken.transfer(this.freezeWalletAddress, new BN(1000), {from: account1});
      const {receipt: {transactionHash}} = await this.freezeWallet.retrieveTokens(account1, alienToken.address, {from: TEAM_WALLET_OWNER_ADDRESS});
      const events = await getEvents(transactionHash, alienToken,'Transfer', web3);
      const amountToTransfer = events[0].args.value;
      expect(new BN(amountToTransfer)).to.be.bignumber.equal(new BN(1000));
    });

    it('should allow withdrawal of tokens in accordance with the withdrawal policy', async function () {
      const initialBalance = await this.token.balanceOf(this.freezeWalletAddress);
      const tranche = initialBalance.mul(new BN(98)).div(new BN(1000)); // 98% of (initialBalance / 10)
      const months = n => n * 30 * 24 * 3600;
      const tenths = n => initialBalance.mul(new BN(`${n}`)).div(new BN(10));
      const intervals = [
        {idx: 0, delay: months(3), tranche, remainder: tenths(9)},
        {idx: 1, delay: months(6), tranche, remainder: tenths(8)},
        {idx: 2, delay: months(9), tranche, remainder: tenths(7)},
        {idx: 3, delay: months(12), tranche, remainder: tenths(6)},
        {idx: 4, delay: months(15), tranche, remainder: tenths(5)},
        {idx: 5, delay: months(18), tranche, remainder: tenths(4)},
        {idx: 6, delay: months(21), tranche, remainder: tenths(3)},
        {idx: 7, delay: months(24), tranche, remainder: tenths(2)},
        {idx: 8, delay: months(27), tranche, remainder: tenths(1)},
        {idx: 9, delay: months(30), tranche, remainder: tenths(0)},
      ];
      for (const {idx, delay, tranche, remainder} of intervals) {
        const currentDate = await time.latest();
        if (currentDate < STAGE1_START_DATE + delay) await time.increaseTo(STAGE1_START_DATE + delay);
        const {receipt: {transactionHash}} = await this.freezeWallet.retrieveWalletTokens(account1, {from: TEAM_WALLET_OWNER_ADDRESS});
        const events = await getEvents(transactionHash, this.token,'Transfer', web3);
        const tokensToSend = new BN(events[1].args.value);
        const tokensRemained = await this.token.balanceOf(this.freezeWalletAddress);
        if (idx !== 9) {
          expect(tokensToSend).to.be.bignumber.equal(tranche);
          expect(tokensRemained).to.be.bignumber.gte(remainder);
        } else {
          // the last withdrawal should send all remained tokens
          // the amount to send should be slightly larger as RFI increases the balance with every transaction
          expect(tokensToSend).to.be.bignumber.gte(tranche);
          expect(tokensRemained).to.be.bignumber.equal(new BN('0'));
        }
      }
    });
  })

});


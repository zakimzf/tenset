const fs = require('fs');
const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert, expect } = require('chai');
const { getEvents } = require('./helpers');

const Configurator = contract.fromArtifact('Configurator');
const TokenReplacementConfigurator = contract.fromArtifact('TokenReplacementConfigurator');
const Token = contract.fromArtifact('TenSetToken');
const FreezeTokenWallet = contract.fromArtifact('FreezeTokenWallet');
const CommonSale = contract.fromArtifact('CommonSale');
const TokenDistributor = contract.fromArtifact('TokenDistributor');

const tokenHolders = fs.readFileSync(`${__dirname}/tokenholders.csv`, 'utf8')
  .split('\n')
  .filter(s => s !== '')
  .map(row => {
    const [address, balance] = row.replace(/"/g, '').split(',');
    return {address: address, balance: ether(balance.replace(/"/g, ''))};
  })
  .filter(a => a.balance.lte(ether('5250000'))); // filter out team acount, marketing account, etc.

const tokenHolderGroups = splitArray(tokenHolders, 100);

// balances inclue a bonus of 10% to the initial value and compensation for the transfer fee 
const tokenDistributorArgs = tokenHolderGroups.map(group => {
  return {
    addresses: group.map(account => account.address),
    balances: group.map(account => account.balance.mul(new BN(110)).div(new BN(98)))
  };
});

describe('TokenReplacementConfigurator', async function () {

  const [ nonWhiteListedAccount, account1, account2, account3, donor ] = accounts;
  const NULL_ADDRESS              = '0x0000000000000000000000000000000000000000';
  const OWNER_ADDRESS             = '0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303';
  const TEAM_WALLET_OWNER_ADDRESS = '0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7';
  const MARKETING_WALLET_ADDRESS  = '0x127D069DC8B964a813889D349eD3dA3f6D35383D';
  const COMPANY_RESERVE_ADDRESS   = '0x7BD3b301f3537c75bf64B7468998d20045cfa48e';
  const LIQUIDITY_WALLET_ADDRESS  = '0x91E84302594deFaD552938B6D0D56e9f39908f9F';
  const ETH_WALLET_ADDRESS        = '0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303';
  const DEPLOYER_ADDRESS          = '0x6E9DC3D20B906Fd2B52eC685fE127170eD2165aB';
  const PRICE                     = new BN(10000);
  const COMPANY_RESERVE_AMOUNT    = ether('21000000');
  const TEAM_AMOUNT               = ether('21000000');
  const MARKETING_AMOUNT_1        = ether('5250000');
  const MARKETING_AMOUNT_2        = ether('5250000');
  const LIQUIDITY_RESERVE         = ether('10500000').sub(ether('3000000')); // 3 000 000 goes to the SALE_AOUNT
  const SALE_AMOUNT               = ether('147000000').mul(new BN('100')).div(new BN('98'));
  const STAGE1_START_DATE         = 1612116000;
  const STAGE1_END_DATE           = 1612720800;
  const STAGE1_BONUS              = 10;
  const STAGE1_TOKEN_HARDCAP      = ether("11000000");
  const STAGE1_MIN_INVESTMENT     = ether("0.1");
  const STAGE1_MAX_INVESTMENT     = ether("40");
  const STAGE2_START_DATE         = 1615140000;
  const STAGE3_START_DATE         = 1615744800;
  
  beforeEach(async function () {
    this.configurator = await Configurator.new();
    this.commonSaleAddress = await this.configurator.commonSale();

    this.commonSale = await CommonSale.at(this.commonSaleAddress);

    this.tokenReplacementConfigurator = await TokenReplacementConfigurator.new();
    this.newTokenAddress = await this.tokenReplacementConfigurator.token();
    this.companyReserveWalletAddress = await this.tokenReplacementConfigurator.companyReserveWallet();
    this.teamWalletAddress = await this.tokenReplacementConfigurator.teamWallet();
    this.marketingWalletAddress = await this.tokenReplacementConfigurator.marketingWallet();
    this.tokenDistributorAddress = await this.tokenReplacementConfigurator.tokenDistributor();
    
    this.newToken = await Token.at(this.newTokenAddress);
    this.companyReserveWallet = await FreezeTokenWallet.at(this.companyReserveWalletAddress);
    this.teamWallet = await FreezeTokenWallet.at(this.teamWalletAddress);
    this.marketingWallet = await FreezeTokenWallet.at(this.marketingWalletAddress);
    this.tokenDistributor = await TokenDistributor.at(this.tokenDistributorAddress);
    
    await web3.eth.sendTransaction({ from: donor, to: OWNER_ADDRESS, value: ether("10")})
    await web3.eth.sendTransaction({ from: donor, to: TEAM_WALLET_OWNER_ADDRESS, value: ether("10")})
    await web3.eth.sendTransaction({ from: donor, to: DEPLOYER_ADDRESS, value: ether("10")})
    await web3.eth.sendTransaction({ from: donor, to: COMPANY_RESERVE_ADDRESS, value: ether("10")})
    await this.commonSale.transferOwnership(OWNER_ADDRESS, {from: DEPLOYER_ADDRESS});

  });
  
  describe('Addresses', function() {
    it('should have correct initial balances', async function () {
      // Company Reserve (10%): 21,000,000 10SET
      expect(await this.newToken.balanceOf(this.companyReserveWalletAddress)).to.be.bignumber.equal(COMPANY_RESERVE_AMOUNT);
      // Team (10%): 21,000,000 10SET
      expect(await this.newToken.balanceOf(this.teamWalletAddress)).to.be.bignumber.equal(TEAM_AMOUNT);
      // Marketing (5%): 10,500,000 10SET
      expect(await this.newToken.balanceOf(this.marketingWalletAddress)).to.be.bignumber.equal(MARKETING_AMOUNT_1);
      expect(await this.newToken.balanceOf(MARKETING_WALLET_ADDRESS)).to.be.bignumber.equal(MARKETING_AMOUNT_2);
      // Sales: 150,000,000 10SET
      expect(await this.newToken.balanceOf(this.tokenDistributorAddress)).to.be.bignumber.equal(SALE_AMOUNT);
      // Liquidity Reserve: 7,500,000 10SET
      expect(await this.newToken.balanceOf(LIQUIDITY_WALLET_ADDRESS)).to.be.bignumber.equal(LIQUIDITY_RESERVE);
    });
  })

  describe('TokenDistributor', function() {
    it('should correctly distribute tokens', async function () {
      for(const {addresses, balances} of tokenDistributorArgs) {
        await this.tokenDistributor.distribute(addresses, balances, {from: DEPLOYER_ADDRESS})
      }
      for(const {address, balance} of tokenHolders) {
        expect(await this.newToken.balanceOf(address)).to.be.bignumber.gt(balance.mul(new BN(11)).div(new BN(10)));
      }
    }).timeout(30000);
  })

  describe('CommonSale', function() {
    it('should correctly replace token', async function () {
      await this.commonSale.setToken(this.newTokenAddress, {from: OWNER_ADDRESS});
      expect(await this.newToken.balanceOf(this.commonSaleAddress)).to.be.bignumber.equal(ether('0'));
    });

    it('should be able to sell tokens after replacement of the token contract', async function () {
      await this.commonSale.setToken(this.newTokenAddress, {from: OWNER_ADDRESS});
      const tokenDistributorBalance = await this.newToken.balanceOf(this.tokenDistributorAddress);
      await this.tokenDistributor.distribute([this.commonSaleAddress], [tokenDistributorBalance], {from: DEPLOYER_ADDRESS});
      await this.commonSale.addToWhiteList(account1, {from: OWNER_ADDRESS});
      const currentDate = await time.latest()
      if (currentDate < STAGE2_START_DATE) await time.increaseTo(STAGE2_START_DATE);
      const etherToSend = ether("21");
      const tokenToSend = etherToSend.mul(PRICE).mul(new BN(105)).div(new BN(100));
      const { receipt: { transactionHash } } = await this.commonSale.sendTransaction({value: etherToSend, from: account1});
      const events = await getEvents(transactionHash, this.newToken,'Transfer', web3);
      expect(new BN(events[1].args.value)).to.be.bignumber.equal(tokenToSend)
    });
  })
  describe('CompanyReserveWallet', function() {
    it('should allow withdrawal of tokens', async function () {
      const initialBalance = await this.newToken.balanceOf(this.companyReserveWalletAddress);
      const tranche = initialBalance.mul(new BN(98)).div(new BN(400)); // 98% of (initialBalance / 4)
      const months = n => n * 30 * 24 * 3600;
      const fourths = n => initialBalance.mul(new BN(`${n}`)).div(new BN(4));
      const intervals = [
        {idx: 0, delay: months(12), tranche, remainder: fourths(3)},
        {idx: 1, delay: months(24), tranche, remainder: fourths(2)},
        {idx: 2, delay: months(36), tranche, remainder: fourths(1)},
        {idx: 3, delay: months(48), tranche, remainder: fourths(0)},
      ];
      for (const {idx, delay, tranche, remainder} of intervals) {
        const currentDate = await time.latest();
        if (currentDate < STAGE1_START_DATE + delay) await time.increaseTo(STAGE1_START_DATE + delay);
        const {receipt: {transactionHash}} = await this.companyReserveWallet.retrieveWalletTokens(account1, {from: COMPANY_RESERVE_ADDRESS});
        const events = await getEvents(transactionHash, this.newToken,'Transfer', web3);
        const tokensToSend = new BN(events[1].args.value);
        const tokensRemained = await this.newToken.balanceOf(this.companyReserveWalletAddress);
        await expectRevert.unspecified(this.companyReserveWallet.retrieveWalletTokens(account1, {from: COMPANY_RESERVE_ADDRESS}));
        if (idx !== 3) {
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

function splitArray(arr, chunkSize) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const chunk = Math.floor(i / chunkSize);
    const index = i % chunkSize;
    if (!result[chunk]) result[chunk] = [];
    result[chunk][index] = arr[i];
  }
  return result;
}

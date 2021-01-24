const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert, expect } = require('chai');
const { getEvents } = require('./helpers');

const Configurator = contract.fromArtifact('Configurator');
const Token = contract.fromArtifact('TenSetToken');
const FreezeTokenWallet = contract.fromArtifact('FreezeTokenWallet');
const CommonSale = contract.fromArtifact('CommonSale');

describe('Configurator', async function () {

  const [ nonWhiteListedAccount, account1, account2, account3, donor ] = accounts;
  const NULL_ADDRESS            = '0x0000000000000000000000000000000000000000';
  const OWNER_ADDRESS           = '0xf62158b03Edbdb92a12c64E4D8873195AC71aF6A';
  const PRICE                   = new BN(10000);
  const STAGE1_START_DATE       = 1612072800;
  const STAGE1_END_DATE         = 1612677600;
  const STAGE1_BONUS            = 10;
  const STAGE1_TOKEN_HARDCAP    = ether("11000000");
  const STAGE1_MIN_INVESTMENT   = ether("0.1");
  const STAGE1_MAX_INVESTMENT   = ether("40");

  const calculateTokens = function(etherToSend, stage) {
    switch (stage) {
      case 0: return etherToSend.mul(PRICE).mul(new BN(11)).div(new BN(10));
      case 1: return etherToSend.mul(PRICE).mul(new BN(105)).div(new BN(100));
      default: return etherToSend.mul(PRICE);
    }
  }

  beforeEach(async function () {
    this.configurator = await Configurator.new();
    
    this.tokenAddress = await this.configurator.token();
    this.freezeWalletAddress = await this.configurator.freezeWallet();
    this.commonSaleAddress = await this.configurator.commonSale();
    
    this.token = await Token.at(this.tokenAddress);
    this.freezeWallet = await FreezeTokenWallet.at(this.freezeWalletAddress);
    this.commonSale = await CommonSale.at(this.commonSaleAddress);
    
    await web3.eth.sendTransaction({ from: donor, to: OWNER_ADDRESS, value: ether("10")})
  });

  it('should have owner', async function () {
    expect(await this.commonSale.owner()).to.equal(OWNER_ADDRESS);
  });
  
  it('should not accept ETH before crowdsale start', async function () {
    await expectRevert.unspecified(this.commonSale.sendTransaction({value: ether("1"), from: account1}));
  });

  describe('STAGE_1', function () {
    
    beforeEach(async function () {
      const currentDate = await time.latest()
      if(currentDate < STAGE1_START_DATE) await time.increaseTo(STAGE1_START_DATE);
    });

    describe('non-whitelisted accounts', function () {
      it('should not be able to send ETH', async function () {
        await expectRevert(this.commonSale.sendTransaction({value: ether("1"), from: nonWhiteListedAccount}), "The address must be whitelisted!");
      });

      it('should be able to send ETH if whitelisting is disabled ', async function () {
        await this.commonSale.unsetMilestoneWithWhitelist(0, {from: OWNER_ADDRESS});
        const etherToSend = ether('31');
        const tokenToReceive = calculateTokens(etherToSend, 0);
        const { receipt } = await this.commonSale.sendTransaction({value: etherToSend, from: nonWhiteListedAccount});
        await expectEvent.inTransaction(receipt.transactionHash, this.token, 'Transfer', {
          from: this.commonSaleAddress,
          to: nonWhiteListedAccount,
          value: tokenToReceive
        })
      });
    });

    describe('whitelisted accounts', function () {
      beforeEach(async function () {
        await this.commonSale.addToWhiteList(account1, {from: OWNER_ADDRESS});
      });

      it('should not be able to send ETH below the minimum limit', async function () {
        await expectRevert(this.commonSale.sendTransaction({value: STAGE1_MIN_INVESTMENT.subn(1), from: account1}), "The amount is too small");
      });
      
      it('should not be able to send more than maximum limit', async function () {
        const balanceBefore = await balance.current(account1, 'ether');
        const etherToSend = ether("50");
        const etherToBeAccepted = ether("40");
        const tokenToReceive = calculateTokens(etherToBeAccepted, 0);
        const { receipt } = await this.commonSale.sendTransaction({value: etherToSend, from: account1});
        await expectEvent.inTransaction(receipt.transactionHash, this.token,'Transfer', {
          from: this.commonSaleAddress,
          to: account1,
          value: tokenToReceive.addn(1) // .addn(1) is a dirty workaround to compensate integer calculcations issue 
        });
        const balanceAfter = await balance.current(account1, 'ether');
        expect(balanceAfter.add(etherToBeAccepted).eq(balanceBefore));
        await expectRevert(this.commonSale.sendTransaction({value: STAGE1_MIN_INVESTMENT.addn(1), from: account1}), "Investment limit exceeded!");
      });

      it('should receive the appropriate number of tokens', async function () {
        const etherToSend = ether("27");
        const tokenTotal = etherToSend.mul(PRICE).mul(new BN(110)).div(new BN(98));
        const tokenToBurn = tokenTotal.div(new BN(100));
        const tokenToSend = calculateTokens(etherToSend, 0);
        const { receipt } = await this.commonSale.sendTransaction({value: etherToSend, from: account1});
        await expectEvent.inTransaction(receipt.transactionHash, this.token,'Transfer', {
          from: this.commonSaleAddress,
          to: NULL_ADDRESS,
          value: tokenToBurn
        });
        await expectEvent.inTransaction(receipt.transactionHash, this.token,'Transfer', {
          from: this.commonSaleAddress,
          to: account1,
          value: tokenToSend
        });
      });
      
    });

  });

  
  
});


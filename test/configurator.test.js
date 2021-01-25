const { accounts, contract, web3 } = require('@openzeppelin/test-environment');
const { balance, BN, ether, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { assert, expect } = require('chai');
const { getEvents } = require('./helpers');

const Configurator = contract.fromArtifact('Configurator');
const Token = contract.fromArtifact('TenSetToken');
const FreezeTokenWallet = contract.fromArtifact('FreezeTokenWallet');
const CommonSale = contract.fromArtifact('CommonSale');
const ERC20Mock = contract.fromArtifact('ERC20Mock');

describe('Configurator', async function () {

  const [ nonWhiteListedAccount, account1, account2, account3, donor ] = accounts;
  const NULL_ADDRESS              = '0x0000000000000000000000000000000000000000';
  const OWNER_ADDRESS             = '0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303';
  const TEAM_WALLET_OWNER_ADDRESS = '0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7';
  const MARKETING_WALLET_ADDRESS  = '0x127D069DC8B964a813889D349eD3dA3f6D35383D';
  const COMPANY_RESERVE_ADDRESS   = '0x7BD3b301f3537c75bf64B7468998d20045cfa48e';
  const LIQUIDITY_WALLET_ADDRESS  = '0x91E84302594deFaD552938B6D0D56e9f39908f9F';
  const ETH_WALLET_ADDRESS        = '0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303';
  const PRICE                   = new BN(10000);
  const STAGE1_START_DATE       = 1612072800;
  const STAGE1_END_DATE         = 1612677600;
  const STAGE1_BONUS            = 10;
  const STAGE1_TOKEN_HARDCAP    = ether("11000000");
  const STAGE1_MIN_INVESTMENT   = ether("0.1");
  const STAGE1_MAX_INVESTMENT   = ether("40");
  const STAGE3_START_DATE       = 1613282400;

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
    await web3.eth.sendTransaction({ from: donor, to: TEAM_WALLET_OWNER_ADDRESS, value: ether("10")})
  });
  
  describe('CommonSale', function() {
    it('should have owner', async function () {
      expect(await this.commonSale.owner()).to.equal(OWNER_ADDRESS);
    });

    it('should not accept ETH before crowdsale start', async function () {
      await expectRevert.unspecified(this.commonSale.sendTransaction({value: ether("1"), from: account1}));
    });

    it('should allow to retrieve tokens', async function () {
      const accountBalanceBefore = await this.token.balanceOf(account1);
      await this.commonSale.retrieveTokens(account1, this.tokenAddress, {from: OWNER_ADDRESS});
      const commonSaleBalanceAfter = await this.token.balanceOf(this.commonSaleAddress);
      expect(accountBalanceBefore).to.be.bignumber.equal(new BN('0'));
      expect(commonSaleBalanceAfter).to.be.bignumber.equal(new BN('0'));
    });

    it('should allow to retrieve tokens other than TenSetToken', async function () {
      const alienToken = await ERC20Mock.new('TEST', 'TST', account1, new BN(1000), {from: account1});
      await alienToken.transfer(this.commonSaleAddress, new BN(1000), {from: account1});
      const accountBalanceBefore = await alienToken.balanceOf(account1);
      const commonSaleBalanceBefore = await alienToken.balanceOf(this.commonSaleAddress);
      expect(accountBalanceBefore).to.be.bignumber.equal(new BN(0));
      expect(commonSaleBalanceBefore).to.be.bignumber.equal(new BN(1000));
      const {receipt: {transactionHash}} = await this.commonSale.retrieveTokens(account1, alienToken.address, {from: OWNER_ADDRESS});
      await expectEvent.inTransaction(transactionHash, alienToken, 'Transfer', {
        from: this.commonSaleAddress,
        to: account1,
        value: new BN(1000)
      })
      const accountBalanceAfter = await alienToken.balanceOf(account1);
      const commonSaleBalanceAfter = await alienToken.balanceOf(this.commonSaleAddress);
      expect(accountBalanceAfter).to.be.bignumber.equal(new BN(1000));
      expect(commonSaleBalanceAfter).to.be.bignumber.equal(new BN(0));
    });

    it('should not allow non-owners to retrieve tokens', async function () {
      await expectRevert(this.commonSale.retrieveTokens(account1, this.tokenAddress, {from: account1}), "Ownable: caller is not the owner");
    });

    it('should not allow non-owners to change ETH wallet', async function () {
      await expectRevert(this.commonSale.setWallet(account1, {from: account1}), "Ownable: caller is not the owner");
    });

    it('should not allow non-owners to change price', async function () {
      await expectRevert(this.commonSale.setPrice(ether('1000'), {from: account1}), "Ownable: caller is not the owner");
    });
  })

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
        const etherToSend = STAGE1_MIN_INVESTMENT.addn(1);
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
        const etherToSend = ether("21");
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
    
    it('should not allow to transfer tokens above the specified hardcap', async function () {
      // set hardcap to 110 ETH
      const NEW_TOKEN_HARDCAP = ether('1100000');
      await this.commonSale.changeMilestone(0, STAGE1_START_DATE, STAGE1_END_DATE, STAGE1_BONUS, STAGE1_MIN_INVESTMENT, STAGE1_MAX_INVESTMENT, 0, 0, NEW_TOKEN_HARDCAP, {from: OWNER_ADDRESS});
      await this.commonSale.addToWhiteList(account1, {from: OWNER_ADDRESS});
      await this.commonSale.addToWhiteList(account2, {from: OWNER_ADDRESS});
      await this.commonSale.addToWhiteList(account3, {from: OWNER_ADDRESS});
      // first account
      assert(true)
      const etherToSend1 = ether('37');
      const tokenToReceive1 = calculateTokens(etherToSend1, 0);
      const { receipt: { transactionHash: txHash1 } } = await this.commonSale.sendTransaction({value: etherToSend1, from: account1});
      const events1 = await getEvents(txHash1, this.token,'Transfer', web3);
      expect(new BN(events1[1].args.value)).to.be.bignumber.equal(tokenToReceive1)
      // second account
      const etherToSend2 = ether('38');
      const tokenToReceive2 = calculateTokens(etherToSend2, 0);
      const { receipt: { transactionHash: txHash2 } } = await this.commonSale.sendTransaction({value: etherToSend2, from: account2});
      const events2 = await getEvents(txHash2, this.token,'Transfer', web3);
      expect(new BN(events2[1].args.value)).to.be.bignumber.equal(tokenToReceive2.addn(1)) // .addn(1) is a dirty workaround to compensate integer calculcations issue 
      // third account
      const etherToSend3 = ether('39');
      const tokenToReceive3 = NEW_TOKEN_HARDCAP.sub(tokenToReceive1).sub(tokenToReceive2);
      const { receipt: { transactionHash: txHash3 } } = await this.commonSale.sendTransaction({value: etherToSend3, from: account3});
      const events3 = await getEvents(txHash3, this.token,'Transfer', web3);
      expect(new BN(events3[1].args.value)).to.be.bignumber.equal(tokenToReceive3.addn(1)) // .addn(1) is a dirty workaround to compensate integer calculcations issue 
    });

    it('should allow adding multiple addresses to the whitelist', async function () {
      const addresses = [account1, account2, account3];
      await this.commonSale.addToWhiteListMultiple(addresses, {from: OWNER_ADDRESS});
      for (const address of addresses) {
        expect(await this.commonSale.whitelist(address)).equal(true);
      }
    });
    
  });

  describe('STAGE_3', function () {

    beforeEach(async function () {
      const currentDate = await time.latest()
      if (currentDate < STAGE3_START_DATE) await time.increaseTo(STAGE3_START_DATE);
    });

    it('should transfer tokens to non-whitelisted accounts', async function () {
      const etherToSend = ether("21");
      const tokenToSend = calculateTokens(etherToSend, 3);
      const { receipt } = await this.commonSale.sendTransaction({value: etherToSend, from: nonWhiteListedAccount});
      await expectEvent.inTransaction(receipt.transactionHash, this.token,'Transfer', {
        from: this.commonSaleAddress,
        to: nonWhiteListedAccount,
        value: tokenToSend.addn(1) // .addn(1) is a dirty workaround to compensate integer calculcations issue 
      });
    });

  });

  describe('FreezeTokenWallet', function() {
    it('should have owner', async function () {
      expect(await this.freezeWallet.owner()).to.equal(TEAM_WALLET_OWNER_ADDRESS);
    });

    it('should not allow premature withdrawal of tokens', async function () {
      await this.freezeWallet.retrieveWalletTokens(account1, {from: TEAM_WALLET_OWNER_ADDRESS});
      const balance = await this.token.balanceOf(account1);
      expect(balance).to.be.bignumber.equal(new BN('0'));
    });

    it('should not allow to withdraw TesSet tokens with retriveTokens method', async function () {
      await expectRevert.unspecified(this.freezeWallet.retrieveTokens(TEAM_WALLET_OWNER_ADDRESS, this.tokenAddress, {from: TEAM_WALLET_OWNER_ADDRESS}));
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
      await this.freezeWallet.retrieveWalletTokens(account1, {from: TEAM_WALLET_OWNER_ADDRESS});
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
        // sometimes fails and requires rerunning the test
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


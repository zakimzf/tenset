const { BN, toWei } = web3.utils;
const CommonSale = artifacts.require("CommonSale");
const Configurator = artifacts.require("Configurator");
const TenSetToken = artifacts.require("TenSetToken");
const TokenDistributor = artifacts.require("TokenDistributor");
const TokenReplacementConfigurator = artifacts.require("TokenReplacementConfigurator");

module.exports = async function(deployer, network, accounts) {
  const [admin, owner, buyer] = accounts
  const configurator = await Configurator.deployed();
  const oldTokenAddress = await configurator.token();
  const oldToken = await TenSetToken.at(oldTokenAddress);
  const commonSaleAddress = await configurator.commonSale();
  const commonSale = await CommonSale.at(commonSaleAddress);

  await deployer.deploy(TokenReplacementConfigurator, {from: admin});
  
  const tokenReplacementConfigurator = await TokenReplacementConfigurator.deployed();
  const newTokenAddress = await tokenReplacementConfigurator.token();
  const newToken = await TenSetToken.at(newTokenAddress);
  const tokenDistributorAddress = await tokenReplacementConfigurator.tokenDistributor();
  const tokenDistributor = await TokenDistributor.at(tokenDistributorAddress);
  
  console.log('commonSale.setToken')
  await commonSale.setToken(newTokenAddress, {from: admin});
  
  const balance = await oldToken.balanceOf.call(buyer);
  const addresses = [buyer, admin, owner];
  const balances = [balance, toWei('1', 'ether'), toWei('2', 'ether')].map(b => (new BN(b)).mul(new BN(110)).div(new BN(98)));

  console.log('tokenDistributor.distribute')
  await tokenDistributor.distribute(addresses, balances, {from: admin});
  
  const remaining = await newToken.balanceOf.call(tokenDistributorAddress);

  console.log('tokenDistributor.distribute')
  await tokenDistributor.distribute([commonSaleAddress], [remaining]);

  console.log('commonSale.transferOwnership')
  await commonSale.transferOwnership(owner, {from: admin});
};

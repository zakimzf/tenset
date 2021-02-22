const {toWei} = web3.utils;
const CommonSale = artifacts.require("CommonSale");
const Configurator = artifacts.require("Configurator");
const TenSetToken = artifacts.require("TenSetToken");

module.exports = async function(deployer, network, accounts) {
  const [admin, owner, buyer1, buyer2] = accounts;
  const configurator = await Configurator.deployed();
  const commonSaleAddress = await configurator.commonSale();
  const commonSale = await CommonSale.at(commonSaleAddress);
  const isWhitelisted = await commonSale.whitelist.call(buyer2);

  if (!isWhitelisted) {
    console.log('commonSale.addToWhiteList')
    await commonSale.addToWhiteList(buyer2, {from: owner});
  }

  console.log('commonSale.sendTransaction')
  await commonSale.sendTransaction({value: toWei('0.4', 'ether'), from: buyer2});
};

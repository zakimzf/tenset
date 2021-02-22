const {toWei} = web3.utils;
const CommonSale = artifacts.require("CommonSale");
const Configurator = artifacts.require("Configurator");

module.exports = async function(deployer, network, accounts) {
  const [admin, owner, buyer] = accounts;
  const configurator = await Configurator.deployed();
  const commonSaleAddress = await configurator.commonSale();
  const commonSale = await CommonSale.at(commonSaleAddress);
  const isWhitelisted = await commonSale.whitelist.call(buyer);
  
  if (!isWhitelisted) {
    console.log('commonSale.addToWhiteList')
    await commonSale.addToWhiteList(buyer, {from: admin});
  }

  console.log('commonSale.sendTransaction')
  await commonSale.sendTransaction({value: toWei('0.3', 'ether'), from: buyer});
};

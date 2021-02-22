const {toWei} = web3.utils;
const CommonSale = artifacts.require("CommonSale");
const Configurator = artifacts.require("Configurator");

const STAGE2_START_DATE       = 1615140000;           // Jan 31 2021 19:00:00 GMT+0100
const STAGE2_END_DATE         = 1615744800;           // Feb 07 2021 19:00:00 GMT+0100
const STAGE2_BONUS            = 5;
const STAGE2_MIN_INVESTMENT   = toWei('0.1', 'ether');
const STAGE2_MAX_INVESTMENT   = toWei('100', 'ether');
const STAGE2_TOKEN_HARDCAP    = toWei('52500000', 'ether');

module.exports = async function(deployer, network, accounts) {
  const [admin] = accounts;
  
  await deployer.deploy(Configurator, {from: admin});
  
  const configurator = await Configurator.deployed();
  const commonSaleAddress = await configurator.commonSale();
  const commonSale = await CommonSale.at(commonSaleAddress);
  
  const NEW_STAGE1_START_DATE = Math.floor((new Date()).getTime() / 1000);

  console.log('commonSale.changeMilestone')
  await commonSale.changeMilestone(1, NEW_STAGE1_START_DATE, STAGE2_END_DATE, STAGE2_BONUS, STAGE2_MIN_INVESTMENT, STAGE2_MAX_INVESTMENT, 0, 0, STAGE2_TOKEN_HARDCAP, {from: admin});
};

const {toWei} = web3.utils;
const TenSetToken = artifacts.require("TenSetToken");

module.exports = async function(deployer, network, accounts) {
  const [admin, owner, buyer] = accounts;
  const addresses = [admin, owner, buyer];
  const balances = [toWei('100', 'ether'), toWei('200', 'ether'), toWei('300', 'ether')];
  await deployer.deploy(TenSetToken, addresses, balances);
  const token = await TenSetToken.deployed();
  
  console.log(token.transfer);
  await token.transfer(owner, toWei('50', 'ether'), {from: admin});
};

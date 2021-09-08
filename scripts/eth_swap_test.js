const { toWei } = web3.utils;
const Swapper = artifacts.require("Swapper");
const TenSetToken = artifacts.require("TenSetToken");

async function deploy() {
  const addresses = (await web3.eth.getAccounts()).slice(0, 3);
  const [owner, user1, user2] = addresses;
  const balances = [toWei('100', 'ether'), toWei('200', 'ether'), toWei('300', 'ether')];

  const token = await TenSetToken.new([user1, user2, owner], balances, { from: owner });
  console.log("1")
  const swapper = await Swapper.new(owner, { from: owner });
  console.log("2")
  await swapper.setToken(token.address, { from: owner });
  console.log("3")

  await token.increaseAllowance(swapper.address, toWei('10', 'ether'), { from: user1 });
  console.log("4")
  await token.increaseAllowance(swapper.address, toWei('20', 'ether'), { from: user2 });
  console.log("5")
  await swapper.startSwap(toWei('10', 'ether'), { from: user1 })
  console.log("6")
  await swapper.startSwap(toWei('20', 'ether'), { from: user2 })
  console.log("7")
}

module.exports = async function main(callback) {
  try {
    await deploy();
    console.log('success');
    callback(0);
  } catch (e) {
    console.log('error');
    console.log(e);
    callback(1);
  }
}

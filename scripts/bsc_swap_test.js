const { toWei } = web3.utils;
const Swapper = artifacts.require("Swapper");
const TenSetToken = artifacts.require("TenSetToken");

async function deploy() {
  const addresses = (await web3.eth.getAccounts()).slice(0, 3);
  const [owner] = addresses;
  const swapper = await Swapper.new(owner, { from: owner });
  console.log("1")
  const token = await TenSetToken.new([swapper.address], [0], { from: owner });
  console.log("2")
  await swapper.setToken(token.address, { from: owner });
  console.log("3")
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

const Migrations = artifacts.require("Migrations");

module.exports = async function(deployer, network, accounts) {
  const [admin] = accounts;
  
  deployer.deploy(Migrations, {from: admin});
};

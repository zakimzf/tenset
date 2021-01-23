module.exports = {
  contracts: {
    defaultGas: 20e6, // Maximum gas for contract calls (when unspecified)
  },
  node: { // Options passed directly to Ganache client
    gasLimit: 20e6, // Maximum gas per block
    unlocked_accounts: ['0xf62158b03Edbdb92a12c64E4D8873195AC71aF6A']
  }
};
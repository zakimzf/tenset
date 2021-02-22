![10SET Token](logo.png "10SET Token")

# 10Set Token smart contract

* _Standart_        : [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)
* _[Name](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#name)_            : 10Set Token
* _[Ticker](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#symbol)_          : 10SET
* _[Decimals](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#decimals)_        : 18
* _Emission_        : Single, 210 000 000 tokens
* _Fiat dependency_ : No
* _Token offers_    : 3
* _Token locks_     : No

## Devevelopment and project management
* Michał Pomykała
* Gabriel Domanowski
* Andrey Ovcharenko
* Evgeny Deev

## Audit
* Radosław Cymer
* Tomasz Keczkowski


## Smart-contracts description

10SET Token smart-contract

### Contracts:
1. _TenSETToken_ - Token contract
2. _CommonSale_ - Sale contract 
3. _FreezeWallet_ - A wallet for frozen team tokens. The total freezing period is 30 months. Every 3 months, 10% of the initial amount is unfrozen and transferred to the Team's wallet.
4. _Configurator_

### Contracts arch

![Arch](arch1.jpg "Arch")

### Contract features

#### RFI mechanism
1. 1% distributed proportionally to all token holder with every transaction
2. It is possible to block some addresses from receiving a staking bonus (exchange liquidity pools)

#### Token burning mechanism
1. 1% is burned with every transaction
2. Burning process stops when the total number of tokens drops to 1% (2,100,000)

### How to manage contract
To start working with the contract you should follow theese steps:
1. Compile the conttract using Remix with `enamble optimization` flag and compiler version set to 0.6.2
2. Deploy the contract using Remix + MetaMask. Set Gas limit to 7,000,000 (actually 6,433,413).

### Wallets with ERC20 support
1. [MyEtherWallet](https://www.myetherwallet.com)
2. Parity 
3. Mist/Ethereum wallet

EXODUS does not support ERC20, but provides the ability to export the private key to MyEtherWallet - http://support.exodus.io/article/128-how-do-i-receive-unsupported-erc20-tokens

## Main network configuration 

### Token distribution
1. Company Reserve (10%): 21,000,000 10SET. The total freezing period is 48 months. Every 12 months, 25% of the initial amount will be unfrozen and ready for withdrawal using address 0x7BD3b301f3537c75bf64B7468998d20045cfa48e.
2. Team (10%): 21,000,000 10SET. The total freezing period is 30 months. Every 3 months, 10% of the initial amount will be unfrozen and ready for withdrawal using address 0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7.
3. Marketing (5%): 10,500,000 10SET. A half (5,250,000 10SET) will be transferred immediately to the address 0x127D069DC8B964a813889D349eD3dA3f6D35383D. The remaining 5,250,000 10SET will be frozen for 12 months. Every 3 months, 25% of the initial amount will be unfrozen and ready for withdrawal using address 0x127D069DC8B964a813889D349eD3dA3f6D35383D.
4. Sales: 150,000,000 10SET (147,000,000 10SET plus compensation for the initial 2% transferring costs). These tokens will be distributed between CommonSale contract and existing users who participated in the first phase of the sale. 
5. Liquidity Reserve: 7,500,000 10SET (10,500,000 10SET minus tokens that went to compensation in paragraph 4). The entire amount will be unfrozen from the start and sent to the address 0x91E84302594deFaD552938B6D0D56e9f39908f9F.

### Sale stages

common price: 1 ETH = 10000 10SET

#### Stage 1
* Minimum purchase volume           : 0.1 ETH
* Maximum purchase volume           : 40ETH
* Bonus                             : 10%
* HardCap                           : 11,000,000 10SET
* Start date                        : 31/01/2021 (7pm GMT+1 time) (ethereum timestamp: 1612072800)
* End date                          : 07/02/2021 (7pm GMT+1 time) (ethereum timestamp: 1612677600)

#### Stage 2
* Minimum purchase volume           : 0.1 ETH
* Maximum purchase volume           : 100 ETH
* Bonus                             : 5%
* HardCap                           : 52,500,000 10SET
* Start date                        : 07/03/2021 (7pm GMT+1 time) (ethereum timestamp: 1612677600)
* End date                          : 14/03/2021 (7pm GMT+1 time) (ethereum timestamp: 1613282400)

#### Stage 3
* Minimum purchase volume           : 0 ETH
* Maximum purchase volume           : 9999999999999999999999 ETH
* Bonus                             : 0%
* HardCap                           : 80,000,000 10SET
* Start date                        : 14/03/2021 (7pm GMT+1 time) (ethereum timestamp: 1613282400)
* End date                          : 14/03/9999 (7pm GMT+1 time) (ethereum timestamp: 253374588000)

### Links 
1. _TenSETToken_ contract           : [0x7FF4169a6B5122b664c51c95727d87750eC07c84](https://etherscan.io/token/0x7FF4169a6B5122b664c51c95727d87750eC07c84)
2. _CommonSale_ contract            : [0x93314827393cc16f1b0f1cf4172f1cfc79897b28](https://etherscan.io/address/0x93314827393cc16f1b0f1cf4172f1cfc79897b28)
3. _Company wallet_ contract        : [0x610F6B9fB1945a7A3c2E15519d697c4dC6cE365C](https://etherscan.io/address/0x610F6B9fB1945a7A3c2E15519d697c4dC6cE365C)
3. _Team wallet_ contract           : [0x33b896b1ac1633d6bffb5c5e1f33ed5a75a33604](https://etherscan.io/address/0x33b896b1ac1633d6bffb5c5e1f33ed5a75a33604)
3. _Marketing wallet_ contract      : [0x497783aa46bc0f6a250e56e1ce5db977b03db318](https://etherscan.io/address/0x497783aa46bc0f6a250e56e1ce5db977b03db318)
4. _Configurator_ contract          : [0x9253512d48D806F4F7588b886f49976e55db7e48](https://etherscan.io/address/0x9253512d48D806F4F7588b886f49976e55db7e48)
5. ETH wallet address               : [0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303](https://etherscan.io/address/0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303)
5. Company wallet owner address     : [0x7BD3b301f3537c75bf64B7468998d20045cfa48e](https://etherscan.io/address/0x7BD3b301f3537c75bf64B7468998d20045cfa48e)
6. Team wallet owner address        : [0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7](https://etherscan.io/address/0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7)
8. Marketig wallet owner address    : [0x127d069dc8b964a813889d349ed3da3f6d35383d](https://etherscan.io/address/0x127d069dc8b964a813889d349ed3da3f6d35383d)
9. Liquidity reserve wallet address : [0x91e84302594defad552938b6d0d56e9f39908f9f](https://etherscan.io/address/0x91e84302594defad552938b6d0d56e9f39908f9f)
10. Admin wallet address            : [0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303](https://etherscan.io/address/0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303)

### Addresses
1. _TenSETToken_ contract           : 0x7FF4169a6B5122b664c51c95727d87750eC07c84
2. _CommonSale_ contract            : 0x93314827393cc16f1b0f1cf4172f1cfc79897b28
3. _Company wallet_ contract        : 0x610F6B9fB1945a7A3c2E15519d697c4dC6cE365C
3. _Team wallet_ contract           : 0x33b896b1ac1633d6bffb5c5e1f33ed5a75a33604
3. _Marketing wallet_ contract      : 0x497783aa46bc0f6a250e56e1ce5db977b03db318
4. _Configurator_ contract          : 0x9253512d48D806F4F7588b886f49976e55db7e48
5. ETH wallet address               : 0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303
6. Company wallet owner address     : 0x7BD3b301f3537c75bf64B7468998d20045cfa48e
7. Team wallet owner address        : 0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7
8. Marketig wallet owner address    : 0x127d069dc8b964a813889d349ed3da3f6d35383d
9. Liquidity reserve wallet address : 0x91e84302594defad552938b6d0d56e9f39908f9f
10. Admin wallet address            : 0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303

## Old token configuration 

### Token distibution
1. Company Reserve (10%)            : 21,000,000 
2. Team (10%)                       : 21,000,000
3. Marketing (5%)                   : 10,500,000 
4. Liquidity Reserve (5%)           : 10,500,000
5. Sales                            : 147,000,000

### Sale stages

common price: 1 ETH = 10000 10SET

#### Stage 1
* Minimum purchase volume           : 0.1 ETH
* Maximum purchase volume           : 40ETH
* Bonus                             : 10%
* HardCap                           : 11,000,000 10SET
* Start date                        : 31/01/2021 (7pm GMT+1 time) (ethereum timestamp: 1612072800)
* End date                          : 07/02/2021 (7pm GMT+1 time) (ethereum timestamp: 1612677600)

#### Stage 2
* Minimum purchase volume           : 0.1 ETH
* Maximum purchase volume           : 100 ETH
* Bonus                             : 5%
* HardCap                           : 52,500,000 10SET
* Start date                        : 07/03/2021 (7pm GMT+1 time) (ethereum timestamp: 1612677600)
* End date                          : 14/03/2021 (7pm GMT+1 time) (ethereum timestamp: 1613282400)

#### Stage 3
* Minimum purchase volume           : 0 ETH
* Maximum purchase volume           : 9999999999999999999999 ETH
* Bonus                             : 0%
* HardCap                           : 80,000,000 10SET
* Start date                        : 14/03/2021 (7pm GMT+1 time) (ethereum timestamp: 1613282400)
* End date                          : 14/03/9999 (7pm GMT+1 time) (ethereum timestamp: 253374588000)


### Links 
1. _TenSETToken_ contract           : [0x7353c5f127895c2d7ba5d801fd8d81ff5760ff9f](https://etherscan.io/token/0x7353c5f127895c2d7ba5d801fd8d81ff5760ff9f)
2. _CommonSale_ contract            : [0x93314827393cc16f1b0f1cf4172f1cfc79897b28](https://etherscan.io/address/0x93314827393cc16f1b0f1cf4172f1cfc79897b28)
3. _FreezeWallet_ contract          : [0x0e862fd2a5b1094eeb0b6279d315b6c1adc191b3](https://etherscan.io/address/0x0e862fd2a5b1094eeb0b6279d315b6c1adc191b3)
4. _Configurator_ contract          : [0xed6601B73b831B0Bb2b59215d3E82c7016c9f2D5](https://etherscan.io/address/0xed6601b73b831b0bb2b59215d3e82c7016c9f2d5)
5. ETH wallet address               : [0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303](https://etherscan.io/address/0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303)
6. Company reserve wallet address   : [0x7BD3b301f3537c75bf64B7468998d20045cfa48e](https://etherscan.io/address/0x7BD3b301f3537c75bf64B7468998d20045cfa48e)
7. Team wallet owner address        : [0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7](https://etherscan.io/address/0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7)
8. Marketig wallet address          : [0x127D069DC8B964a813889D349eD3dA3f6D35383D](https://etherscan.io/address/0x127D069DC8B964a813889D349eD3dA3f6D35383D)
9. Liquidity reserve wallet address : [0x91E84302594deFaD552938B6D0D56e9f39908f9F](https://etherscan.io/address/0x91E84302594deFaD552938B6D0D56e9f39908f9F)
10. Admin wallet address            : [0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303](https://etherscan.io/address/0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303)

### Addresses 
1. _TenSETToken_ contract           : 0x7353c5f127895c2d7ba5d801fd8d81ff5760ff9f
2. _CommonSale_ contract            : 0x93314827393cc16f1b0f1cf4172f1cfc79897b28
3. _FreezeWallet_ contract          : 0x0e862fd2a5b1094eeb0b6279d315b6c1adc191b3
4. _Configurator_ contract          : 0xed6601B73b831B0Bb2b59215d3E82c7016c9f2D5
5. ETH wallet address               : 0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303
6. Company reserve wallet address   : 0x7BD3b301f3537c75bf64B7468998d20045cfa48e
7. Team wallet owner address        : 0x44C4A8d57B22597a2c0397A15CF1F32d8A4EA8F7
8. Marketig wallet address          : 0x127D069DC8B964a813889D349eD3dA3f6D35383D
9. Liquidity reserve wallet address : 0x91E84302594deFaD552938B6D0D56e9f39908f9F
10. Admin wallet address            : 0x68CE6F1A63CC76795a70Cf9b9ca3f23293547303

### Transactions

## Test network configuration (Ropsten)
### Contracts
* [Configurator](https://ropsten.etherscan.io/address/0x02188d0794a6884a46f0f0cb0ff013f4bf5a0d0c#readContract)
* [TenSetToken](https://ropsten.etherscan.io/address/0x174aF188EAF33126b1a752Ff404c8EBE3B760A8D#readContract)
* [CommonSale](https://ropsten.etherscan.io/address/0x10f90d929ef720ba83ab794ec1e861d3058997c5#readContract)
* [FreezeWallet](https://ropsten.etherscan.io/address/0x3c6daaf31b2ce9fe33d00a13c0e117f830ad4ff4#readContract)
### Transactions
#### Initial
1. [deploy](https://ropsten.etherscan.io/tx/0xa8d936fa5f9063a0ab86c42807104c991941060768225e5be5c541ce8cf63a33) (6,433,413 gas)
#### CommonSale
1. [call changeMilestone() from the owner's address](https://ropsten.etherscan.io/tx/0xb27d3b1dcdf6243b3897e149fb5615b43e4d4917f902c6f03a4c022591b3ceb7) - the start of the sale is set to Jan 28 2021 17:30:00 GMT+0300, max investment limit decreased to 0.1 Eth, token hardcap decreased to 0.2
2. [send 3 Eth from the investor's address](https://ropsten.etherscan.io/tx/0xab08db17a916c25037aab8859692e0da357a7d1cb1d01b06a56bc6ac0c2fab09) - failed due to out of gas
3. [call addToWhitelistMultiple() from the owner's address](https://ropsten.etherscan.io/tx/0x0fbb54d471038362c535a97a13116d30639d696deddead5c6f0823a6af602503) - two addresses were added: "0xf62158b03Edbdb92a12c64E4D8873195AC71aF6A" and "0x48d37E33dF3Df67bcfD99e2827D2f0c0aF7076Ef"
4. [send 3 Eth from the investor's address](https://ropsten.etherscan.io/tx/0xf8e1a2cf77eef3033f8e5ecefe6216df8e323f8a5a67efe6e80fda1cca5fcaf7) 0.2 10SET transferred (maximum according to stage's hardcap), 193,582 gas used, 0.0000(18) Eth was sent to ETH wallet, 2.9999(81) Eth returned to the investor
5. [send 3 Eth from the investor's address](https://ropsten.etherscan.io/tx/0xf8e1a2cf77eef3033f8e5ecefe6216df8e323f8a5a67efe6e80fda1cca5fcaf7) - failed due to hitting hardcap in previous transaction
6. [call changeMilestone() from the owner's address](https://ropsten.etherscan.io/tx/0x319b4235d704b8a176cfa66a791601cb7c03f6d0730e769688c2afc3c0a1bf57) - the start of the 2nd stage is set to Jan 28 2021 19:30:00 GMT+0300, max investment limit decreased to 4 Eth
7. [send 3 Eth from non-whitelisted address](https://ropsten.etherscan.io/tx/0xf8e1a2cf77eef3033f8e5ecefe6216df8e323f8a5a67efe6e80fda1cca5fcaf7) - failed because the address must be whitelisted first
8. [send 3 Eth from the investor's address](https://ropsten.etherscan.io/tx/0xf8e1a2cf77eef3033f8e5ecefe6216df8e323f8a5a67efe6e80fda1cca5fcaf7) - failed due to overlapping stage time intervals
9. [call changeMilestone() from the owner's address](https://ropsten.etherscan.io/tx/0x4dd72b8485adef3f53680906934f93b3307b538944af37d030d7f008f0b5a872) - fix overlapping stage time intervals
10. [send 4.5 Eth from the investor's address](https://ropsten.etherscan.io/tx/0x1c770cad4f5068cc0241f7567d4416db2b7a8ad44457d2d519a89eeaaa83d3b1) - 42000 10SET transferred (5% bonus), 4 Eth transferred to Eth wallet, 0.5 Eth returned to the investor
#### TenSetToken
1. [Transfer 1 10SET](https://ropsten.etherscan.io/tx/0xe0f8384adcf7a0befcb859b2da8e5147120eacdbeff7a8edfe356081aa6c8186) - 0.98 10SET transferred, 0.01 10SET burned, 0.01 10SET distributed via RFI, 85,863 gas used
2. [call burn() from the investor's address](https://ropsten.etherscan.io/tx/0xa06cdff52673a33de118cfba67c67487e77bd97c8c62f18309a02b2b9ebdab4c) - 50,955 gas used

![10SET Token](logo.jpg "10SET Token")

# 10Set Token smart contract

* _Standart_        : [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md)
* _[Name](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#name)            : 10Set Token
* _[Ticker](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#symbol)_          : 10SET
* _[Decimals](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md#decimals)_        : 18
* _Emission_        : Single, 210 000 000 tokens
* _Fiat dependency_ : No
* _Token offers_    : 2
* _Tokens lock_     : No

## Smart-contracts description

10SET Token smart-contract

### Contracts:
1. _TenSETToken_ - Token contract
2. _DistributionWallet_ - Distribution wallet
3. _PrivateSalePL_ 
4. _PrivateSaleGL_ 
5. _FreezeWallet_ - Freezing period is 30 months. Every 3 months, 10% of frozen tokens is unfrozen and released to the Team’s wallet.
6. _Configurator_

### Contract features

#### RFI mechanism
1. 1% fee each transaction distributed proportionally to all token holder
2. Ability to block some addresses from receiving staking bonus (exchange liquidity pools)

#### Token burning mechanism
1. 1% fee each transaction will burn
2. Burning process stops when the total number of tokens reaches 1% (2,100,000)

#### PolkaStarter launching
1. Token should be ready to launch on Polkastarter for the Private Sale GL on 7 March.
2. Whatever is needed to be programmed in Smart Contract now, needs to be there, so there are no issues when we decide to launch on Polkastarter.

### How to manage contract
To start working with contract you should follow next steps:
1. Compile it in Remix with enamble optimization flag and compiler 0.6.2
2. Deploy bytecode with MyEtherWallet. Gas 5100000 (actually 5073514).
3. Call 'deploy' function on addres from (3). Gas 4000000 (actually 3979551). 

### Wallets with ERC20 support
1. MyEtherWallet - https://www.myetherwallet.com/
2. Parity 
3. Mist/Ethereum wallet

EXODUS not support ERC20, but have way to export key into MyEtherWallet - http://support.exodus.io/article/128-how-do-i-receive-unsupported-erc20-tokens

## Main network configuration 

### Token distibution
1. Company Reserve + marketing (15%): 31,500,000 
2. Liquid Reserve (5%)              : 10,500,000
3. Team (10%)                       : 21,500,000
5. Private sale PL 5.234%           : 11,000,000
6. Private sale GL 25%              : 52,500,000

### Sale stages

#### Private sale PL
* Minimum purchase volume           : 0.1 ETH
* Maximum purchase volume           : 40ETH
* Price                             : 1 ETH = 10.000 10SET
* Bonus                             : 10%
* HardCap                           : 11,000,000 10SET
* Start date                        : 31/01/2021 (7pm GMT+1 time)
* End date                          : 07/02/2021 (7pm GMT+1 time)

#### Private sale GL
* Minimum purchase volume           : 0.1 ETH
* Maximum purchase volume           : 100 ETH
* Price                             : 1 ETH = 10.000 10SET
* Bonus                             : 5%
* HardCap                           : 52,500,000 10SET
* Start date                        : 07/03/2021 (7pm GMT+1 time)
* End date                          : 14/03/2021 (7pm GMT+1 time)

### Links 
1. _TenSETToken_ contract         :
2. _DistributionWallet_ contract  :
3. _PrivateSalePL_ contract       :
4. _PrivateSaleGL_ contract       :
5. _FreezeWallet_ contract        :
6. _Configurator_ contract        :
7. ETH wallet address             :
8. Company reverse wallet address :
9. Liquid Reserve wallet address  :
10. Teams wallet                  :
11. Contracts admin address       :

### Addresses 
1. _TenSETToken_ contract         :
2. _DistributionWallet_ contract  :
3. _PrivateSalePL_ contract       :
4. _PrivateSaleGL_ contract       :
5. _FreezeWallet_ contract        :
6. _Configurator_ contract        :
7. ETH wallet address             :
8. Company reverse wallet address :
9. Liquid Reserve wallet address  :
10. Teams wallet                  :
11. Contracts admin address       :

### Transactions

## Test network configuration (Ropsten)

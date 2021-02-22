## Ropsten Test Logs
### TenSetToken Replacement test
1. [Configurator.deploy](https://ropsten.etherscan.io/tx/0x445f77102bb5763a30739197e9872969da09bd16576683bb21f8f6d4b693d52a) 
2. [CommonSale.changeMilestone](https://ropsten.etherscan.io/tx/0xcad8085bce12791a925b04400696871c0455f5a55e650d7b91fa8dbbfc09b92c) 
3. [CommonSale.addToWhiteList](https://ropsten.etherscan.io/tx/0x8b1bf535bc80a7771c888ed85f19226504c3d1b8f4c6f47ec2cda76d719a38dd)
4. [CommonSale.sendTransaction](https://ropsten.etherscan.io/tx/0xa20c3470f90b2702df112744cf25ae9919a96929a80d3e454c692259ad91c10a)
5. [TokenReplacementConfigurator.deploy](https://ropsten.etherscan.io/tx/0xdeeadfb15635730cf459d5e15d350b95ef358637958ce63b0f3ac9e0d4f566d2)
6. [CommonSale.setToken](https://ropsten.etherscan.io/tx/0xe2835cc0fa804d26093cc90e34bf4df50f57b844f321c5519b95e80e4af90c60)
7. [TokenDistributor.distribute](https://ropsten.etherscan.io/tx/0x4c0fbf797b6f504616644c8991a7b6db38af80b00a877a6240c79e799e097bf6)
8. [TokenDistributor.distribute](https://ropsten.etherscan.io/tx/0x41b43e7187b84ad91df1aae79ea371e22f0336b380b62cfa2b2a872d3f557984)
9. [CommonSale.transferOwnership](https://ropsten.etherscan.io/tx/0x420ea3acb18d53fa5f4c1f08c17b727657fcded45774ab0f4990801803740a7f)
10. [CommonSale.addToWhiteList](https://ropsten.etherscan.io/tx/0xcdc92d4099a4ded7e68fa245a41a80a830960b0cd87764109f1086823b165482)
11. [CommonSale.sendTransaction](https://ropsten.etherscan.io/tx/0xe0c5b453f502177651b0c5e67f266f97ba04ba97076dfd1c682dc63e7e8491bc)

### TenSetToken RFI and Burn mechanics test
1. [TenSetToken.deploy](https://ropsten.etherscan.io/tx/0x31d79293c57ff06d90a43ff3aa975738715e1bb8f2a06d62548dfffbbc161bf7)
    > Total supply: `600 10SET`  
    > Distribution:
    > * `100 10SET` to [account1](https://ropsten.etherscan.io/token/0x227fe84472e0d1832c4d68a7c461d76e784a361b?a=0xf62158b03edbdb92a12c64e4d8873195ac71af6a)  
    > * `200 10SET` to [account2](https://ropsten.etherscan.io/token/0x227fe84472e0d1832c4d68a7c461d76e784a361b?a=0x55dd7a6353fc004b4f6da9855f9403b35f4530b1)  
    > * `300 10SET` to [account3](https://ropsten.etherscan.io/token/0x227fe84472e0d1832c4d68a7c461d76e784a361b?a=0x48d37e33df3df67bcfd99e2827d2f0c0af7076ef)  
    >  
    > No fees applied
2. [TensetToken.transfer](https://ropsten.etherscan.io/tx/0xf82f4cc35341501bf54a2c6ffdf2b385390a84c1a74b2bc601c81342ef5b1e2a)
    > #### Description:
    > Sending `50 10SET` from **account1** to **account2**  
    > #### Expected behaviour:
    > `49 10SET` transferred from **account1** to **account2**  
    > `0.5 10SET` (1%) **burned**  
    > `0.5 10SET` (1%) splitted among holders via **RFI**
    > #### Resulting behaviour:
    > TenSetToken.totalSupply: `599.5 10SET`  
    > TenSetToken.totalFees: `0.5 10SET`
    >
    > Resulting distribution: `599.499999999999999999 10SET` in **total**
    > * `50.041736227045075125 10SET` on **account1**
    > * `249.207846410684474123 10SET` on **account2**
    > * `300.250417362270450751 10SET` on **account3**
    >
    > Tokens distributed via **RFI**: `0.499999999999999999 10SET` in **total**
    > * `0.041736227045075125 10SET` to **account1**
    > * `0.207846410684474123 10SET` to **account2**
    > * `0.250417362270450751 10SET` to **account3**

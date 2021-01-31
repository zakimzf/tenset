# User's Manual

> Attention! Some screenshots may contain addresses other than those actually used on the main network.  
> Please, use the addresses provided in the body of this document or in the README file.

### Table of contents

* [Which wallets you can use to buy tokens](#which-wallets-you-can-use-to-buy-tokens)
* [Creating a wallet](#creating-a-wallet)
* [Accessing your wallet](#accessing-your-wallet)
* [Buying ethereum](#buying-ethereum)
* [Buying tokens](#buying-tokens)
* [Managin tokens](#managing-tokens)

## Which wallets you can use to buy tokens
Tokens can be bought from wallets that support the standard ERC20.
The most common wallets are:
* MyEtherWallet
* Ethereum Wallet / Mist
* Parity

Do not buy tokens directly from stock exchanges or exchangers!

## Creating a wallet
To participate in the sale you will need an ethereum wallet supporting ERC20.
If you do not already have one, we recommend using [MyEtherWallet](https://www.myetherwallet.com).

1. Go to [myetherwallet.com](https://www.myetherwallet.com). Click `Create New Wallet` button.
    <details><summary>Click to see screenshot</summary>

    ![creating_wallet_01](images/creating_wallet_01.png)

    </details><br>

2. Select the way you want to access your wallet. Using MEW wallet app is a recommended method.
However, we will select `By Keystore File` as it does not require any additional software.
Сreate a password that you will use to access your wallet.
    <details><summary>Click to see screenshot</summary>

    ![creating_wallet_02](images/creating_wallet_02.png)

    </details><br>

3. Download your Keystore file & save this file to a USB drive.  
    <details><summary>Click to see screenshot</summary>

    ![creating_wallet_03](images/creating_wallet_03.png)

    </details><br>
  
## Accessing your wallet

1. Click `Access My Wallet` button at [myetherwallet.com](https://www.myetherwallet.com).

2. Select `Software`.
    <details><summary>Click to see screenshot</summary>

    ![accessing_wallet_01](images/accessing_wallet_01.png)

    </details><br>

6. Select `Keystore file` and click `Continue`. System window will appear. Select the `Keystore file` downloaded in the [previous](#creating-a-wallet) section.
    <details><summary>Click to see screenshot</summary>

    ![accessing_wallet_02](images/accessing_wallet_02.png)

    </details><br>

7. Enter your password
    <details><summary>Click to see screenshot</summary>

    ![accessing_wallet_03](images/accessing_wallet_03.png)

    </details><br>

## Buying ethereum
To participate in the sale you will need an Ether (ETH).
You can purchase ETH using Visa or MasterCard bank cards through such services as:
* [Changelly.com](https://changelly.com)
* [Cex.io](https://cex.io)
* [Coinbase.com](https://www.coinbase.com)

During the purchase you will need the wallet address created in the previous section.
All services have different commissions and different rates.
Make sure the exchange rate suits you.

## Buying tokens
In order to buy tokens you need to send at least 0.1 ether to the current crowdsale contract address: [0x93314827393CC16F1b0f1cf4172F1CFC79897B28](https://etherscan.io/address/0x93314827393cc16f1b0f1cf4172f1cfc79897b28#readContract)

Before sending, make sure that:
1. You send at least 0.1 ETH (depending upon the configuration of the sales contract, this value may differ. See `minInvestedLimit` of the corresponding sales stage [here](https://etherscan.io/address/0x93314827393cc16f1b0f1cf4172f1cfc79897b28#readContract)).
2. The amount of `gas` is greater than 250 000.
3. `Gas price` — at least 30 Gwei. Transactions with less gas price will take longer. Gas price may change over time. See detailed information about gas price [here](https://etherscan.io/gastracker).

If you are using MyEtherWallet, you need to do the following:
1. Go to [myetherwallet.com](https://www.myetherwallet.com)

2. Click `Send Transaction`. Select `amount` to send and sale contract [address](https://etherscan.io/address/0x93314827393cc16f1b0f1cf4172f1cfc79897b28#readContract). You can leave the `gas price` as is or specify your own.
    <details><summary>Click to see screenshot</summary>

    ![buying_tokens_01](images/buying_tokens_01.png)

    </details><br>

3. In the `Advanced` section set `Gas Limit` to 250 000. Click `Send Transaction`.
    <details><summary>Click to see screenshot</summary>

    ![buying_tokens_02](images/buying_tokens_02.png)

    </details><br>

4. In the window that opens check again the `amount` to send, `address`, `gas limit` and `gas price`. Click `Confirm and send`.
    <details><summary>Click to see screenshot</summary>

    ![buying_tokens_03](images/buying_tokens_03.png)

    </details><br>

5. Click `Check Status on Etherscan.io`, to see transaction details
    <details><summary>Click to see screenshot</summary>

    ![buying_tokens_04](images/buying_tokens_04.png)

    </details><br>

## Managing tokens
To add tokens to your wallet, you need the following information:
* Token Contract Address - **[0x7353c5f127895c2d7ba5d801fd8d81ff5760ff9f](https://etherscan.io/token/0x7353c5f127895c2d7ba5d801fd8d81ff5760ff9f)**
* Token Symbol — **10SET**
* Decimals — **18**

If you are using MyEtherWallet, you need to do the following:
1. Go to [myetherwallet.com](https://www.myetherwallet.com)
2. Sign in as described in [Accessing your wallet](#accessing-your-wallet) section.
3. In the right column find the `Tokens` section. Click `+ Custom Tokens` button.
    <details><summary>Click to see screenshot</summary>

    ![managing_tokens_01](images/managing_tokens_01.png)

    </details><br>
  
3. Enter **0x7353c5f127895c2d7ba5d801fd8d81ff5760ff9f** in the `Token Contract Address` field, **10SET** in `Token Symbol` and **18** in `Decimals`. Click `Save`.
    <details><summary>Click to see screenshot</summary>

    ![managing_tokens_01](images/managing_tokens_02.png)

    </details><br>
  
4. Congratulations! Now 10SET is displayed in the token list.
    <details><summary>Click to see screenshot</summary>

    ![managing_tokens_01](images/managing_tokens_03.png)

    </details><br>

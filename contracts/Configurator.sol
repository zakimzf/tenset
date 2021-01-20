pragma solidity ^0.6.2;

import "./CommonSale.sol";
import "./TenSetToken.sol";
import "./FreezeTokenWallet.sol";
import "./RetrieveTokensFeature.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract Configurator is RetrieveTokensFeature {
    using SafeMath for uint256;
    using Address for address;

    uint256 private constant MAX = ~uint256(0);

    TenSetToken public token;

    FreezeTokenWallet public freezeWallet;

    CommonSale public commonSale;

    address public targetOwner = address(0x0);

    address[] public addresses;

    uint256[] public amounts;

    constructor () public {
        // create instances
        freezeWallet = new FreezeTokenWallet();
        commonSale = new CommonSale();

        commonSale.setToken(address(token));
        freezeWallet.setToken(address(token));

       
        uint256 totalInit                 =  210000000 * 1 ether;

        uint256 walletAmountTeams         =  21000000 * 1 ether;
        uint256 walletAmunttCompanyReserv =  21000000 * 1 ether + 10500000 * 1 ether;
        uint256 walletAmountLiquidReserv  =  10500000 * 1 ether;
        uint256 walletAmountSale          =  totalInit.sub(walletAmountTeams.add(walletAmunttCompanyReserv).add(walletAmountLiquidReserv)).mul(100).div(98); 


        addresses.push(address(freezeWallet));
        amounts.push(walletAmountTeams);

        addresses.push(address(commonSale));
        amounts.push(walletAmountSale);

        // TOD0: get walletAmunttCompanyReserv address
        addresses.push(address(0x0));
        amounts.push(walletAmunttCompanyReserv);

        // TOD0: get walletAmuntCompanyReserv address
        addresses.push(address(0x0));
        amounts.push(walletAmountLiquidReserv);

        token = new TenSetToken(addresses, amounts);

        uint256 stage1Price =  40 * 1 ether;
        uint256 stage2Price = 100 * 1 ether;
        uint256 stage3Price = 0;

        uint256 stage1Tokens = 11 * 10 ** 6 * 1 ether;
        uint256 stage2Tokens = 525 * 10 ** 5 * 1 ether;
        uint256 stage3Tokens = 80 * 10 ** 6 * 1 ether;

        uint256 stageSumTokens = stage1Tokens.add(stage2Tokens).add(stage3Tokens);

        commonSale = new CommonSale();
        commonSale.setCommonPurchaseLimit(stage1Price.add(stage2Price));
        commonSale.addMilestone(1,   2, 10, 1 * 10 ** 17, stage1Price, 0, 0, stage1Tokens);
        commonSale.setMilestoneWithWhitelist(0);
        commonSale.addMilestone(3,   4,  5, 1 * 10 ** 17, stage2Price, 0, 0, stage2Tokens);
        commonSale.setMilestoneWithWhitelist(1);
        commonSale.addMilestone(5, MAX,  0,            0, stage3Price, 0, 0, stage3Tokens);

        token.transfer(address(commonSale), stageSumTokens);

        token.transferOwnership(targetOwner);
        freezeWallet.start();
        freezeWallet.transferOwnership(targetOwner);
        commonSale.transferOwnership(targetOwner);
    }

}


pragma solidity ^0.6.2;

import "./CommonSale.sol";
import "./TenSetToken.sol";
import "./RetrieveTokensFeature.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Configurator is RetrieveTokensFeature {
    using SafeMath for uint256;
    using Address for address;

    uint256 private constant MAX = ~uint256(0);

    TenSetToken public token;

    //  FreezeWallet public freezeWallet;

    CommonSale public commonSale;

    address public targetOwner = address(0x0);

    constructor () public {
        // create token contract
        token = new TenSetToken();

        // create token wallet
        // freezeWallet = new FreezeWallet();
        // freezeWallet.setStart(..);
        // tokens.transfer(freezeWallet, amount);

        uint256 stage1Tokens = 11 * 10 ** 6 * 1 ether;
        uint256 stage2Tokens = 525 * 10 ** 5 * 1 ether;
        uint256 stage3Tokens = 80 * 10 ** 6 * 1 ether;

        uint256 stageSumTokens = stage1Tokens.add(stage2Tokens).add(stage3Tokens);

        commonSale = new CommonSale();
        commonSale.addMilestone(1, 2, 10, 1 * 10 ** 17, 40 * 1 ether, 0, 0, stage1Tokens);
        commonSale.addMilestone(3, 4, 5, 1 * 10 ** 17, 100 * 1 ether, 0, 0, stage2Tokens);
        commonSale.addMilestone(5, MAX, 0, 0, MAX, 0, 0, stage3Tokens);

        token.transfer(address(commonSale), stageSumTokens);

        token.transferOwnership(targetOwner);
        //freezeWallet.transferOwnership(targetOwner);
        commonSale.transferOwnership(targetOwner);
    }

}


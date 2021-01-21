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

    constructor () public {
        // create instances
        freezeWallet = new FreezeTokenWallet();
        commonSale = new CommonSale();

        uint256 COMPANY_RESERVE_AMOUNT    = 31500000 * 1 ether;
        uint256 TEAM_AMOUNT               = 21500000 * 1 ether;
        uint256 SALE_AMOUNT               = (143500000 * 1 ether).mul(100).div(98);

        address OWNER_ADDRESS             = address(0x0);
        address COMPANY_RESERVE_ADDRESS   = address(0x0);
        address LIQUIDITY_WALLET_ADDRESS  = address(0x0);
        address ETH_WALLET_ADDRESS        = address(0x0);

        address[] memory addresses;
        uint256[] memory amounts;

        addresses.push(address(freezeWallet));
        amounts.push(TEAM_AMOUNT);
        addresses.push(address(commonSale));
        amounts.push(SALE_AMOUNT);
        addresses.push(COMPANY_RESERVE_ADDRESS);
        amounts.push(COMPANY_RESERVE_AMOUNT);
        addresses.push(LIQUIDITY_WALLET_ADDRESS);
        amounts.push(0); // will receive the remaining tokens

        token = new TenSetToken(addresses, amounts);

        commonSale.setToken(address(token));
        freezeWallet.setToken(address(token));

        uint256 PRICE                   = 10000;            // 1 ETH = 10000 10SET
        
        uint256 STAGE1_START_DATE       = 1612072800;       // Jan 31 2021 07:00:00 GMT+0100
        uint256 STAGE1_END_DATE         = 1612677600;       // Feb 07 2021 07:00:00 GMT+0100
        uint256 STAGE1_BONUS            = 10;
        uint256 STAGE1_MIN_INVESTMENT   = 1 * 10 ** 17;     // 0.1 ETH
        uint256 STAGE1_MAX_INVESTMENT   = 40 * 1 ether;     // 40 ETH
        uint256 STAGE1_TOKEN_HARDCAP    = 11000000 * 1 ether;

        uint256 STAGE2_START_DATE       = 1612677600;       // Feb 07 2021 07:00:00 GMT+0100
        uint256 STAGE2_END_DATE         = 1613282400;       // Feb 14 2021 07:00:00 GMT+0100 
        uint256 STAGE2_BONUS            = 5;
        uint256 STAGE2_MIN_INVESTMENT   = 0.1 * 1 ether;    // 0.1 ETH
        uint256 STAGE2_MAX_INVESTMENT   = 100 * 1 ether;    // 100 ETH
        uint256 STAGE2_TOKEN_HARDCAP    = 52500000 * 1 ether;

        uint256 STAGE3_START_DATE       = 1613282400;       // Feb 14 2021 07:00:00 GMT+0100 
        uint256 STAGE3_END_DATE         = 253374588000;     // Feb 14 9999 07:00:00 GMT+0100 
        uint256 STAGE3_BONUS            = 0;
        uint256 STAGE3_MIN_INVESTMENT   = 0;                // 0 ETH
        uint256 STAGE3_MAX_INVESTMENT   = MAX;
        uint256 STAGE3_TOKEN_HARDCAP    = 80000000 * 1 ether;

        commonSale = new CommonSale();
        commonSale.setPrice(PRICE);
        commonSale.setWallet(ETH_WALLET_ADDRESS);
        commonSale.addMilestone(STAGE1_START_DATE, STAGE1_END_DATE, STAGE1_BONUS, STAGE1_MIN_INVESTMENT, STAGE1_MAX_INVESTMENT, 0, 0, STAGE1_TOKEN_HARDCAP);
        commonSale.setMilestoneWithWhitelist(0);
        commonSale.addMilestone(STAGE2_START_DATE, STAGE2_END_DATE, STAGE2_BONUS, STAGE2_MIN_INVESTMENT, STAGE2_MAX_INVESTMENT, 0, 0, STAGE2_TOKEN_HARDCAP);
        commonSale.setMilestoneWithWhitelist(1);
        commonSale.addMilestone(STAGE3_START_DATE, STAGE3_END_DATE, STAGE3_BONUS, STAGE3_MIN_INVESTMENT, STAGE3_MAX_INVESTMENT, 0, 0, STAGE3_TOKEN_HARDCAP);

        freezeWallet.start();
        
        token.transferOwnership(OWNER_ADDRESS);
        freezeWallet.transferOwnership(OWNER_ADDRESS);
        commonSale.transferOwnership(OWNER_ADDRESS);
    }

}


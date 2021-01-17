pragma solidity ^0.6.2;


interface IERC20Cutted {

    function balanceOf(address who) external view returns (uint256);

    // Some old tokens implemented without retrun parameter (It happanes before ERC20 chnaged as standart)
    function transfer(address to, uint256 value) external;

}

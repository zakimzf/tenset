pragma solidity ^0.6.2;

import "./IERC20Cutted.sol";
import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract RetrieveTokensFeature is Context, Ownable {

    function retrieveTokens(address to, address anotherToken) public onlyOwner() {
        IERC20Cutted alienToken = IERC20Cutted(anotherToken);
        alienToken.transfer(to, alienToken.balanceOf(address(this)));
    }

    function retriveETH(address payable to) public onlyOwner() {
        to.transfer(address(this).balance);
    }

}


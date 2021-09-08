pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../util/IERC20Cutted.sol";


contract RetrieveTokensFeature is Context, Ownable {

    function retrieveTokens(address to, address anotherToken) virtual public onlyOwner() {
        IERC20Cutted alienToken = IERC20Cutted(anotherToken);
        alienToken.transfer(to, alienToken.balanceOf(address(this)));
    }

    function retriveETH(address payable to) virtual public onlyOwner() {
        to.transfer(address(this).balance);
    }

}


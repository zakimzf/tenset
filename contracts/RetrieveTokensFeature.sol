pragma solidity ^0.6.2;

import "IERC20Cutted.sol";
import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RetrieveTokensFeature is Context, Ownable {

  function retrieveTokens(address to, address anotherToken) public onlyOwner {
    IERC20Cutted alienToken = IERC20Cutted(anotherToken);
    alienToken.transfer(to, alienToken.balanceOf(this));
  }

  function retriveETH(address to) public onlyOwner {
    to.transfer(this.value);
  }

}


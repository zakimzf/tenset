pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RetrieveTokensFeature is Context, Ownable {

  function retrieveTokens(address to, address anotherToken) public onlyOwner {
    ERC20Cutted alienToken = ERC20Cutted(anotherToken);
    alienToken.transfer(to, alienToken.balanceOf(this));
  }

}


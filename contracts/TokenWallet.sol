pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenWallet is Context, Ownable {
    using SafeMath for uint256;
    using Address for address;

  ERC20Cutted public token;

  map (address => boolean) allowed;

  public retrieveAll(address target) onlyOwner() {
     token.transfer(target, token.balanceOf(this));
  }

  public transfer(address to, uint256 amount) {
     sender = msgSender();
     require(allowed[sender]);
     token.transfer(to, amount);
  }

  public allowAddress(address target) {
    allowed[address] = true;
  }

  public disallowAddress(address target) {
    allowed[address] = false;
  }

}


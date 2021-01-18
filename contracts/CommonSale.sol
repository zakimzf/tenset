pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommonSale is Context, Ownable {
    using SafeMath for uint256;
    using Address for address;

  uint256 public price;

  uint256 public start;

  uint256 public end;

  uint256 public minInvestedLimit;

  uint256 public maxInvestedLimit;

  uint256 public hardcapInTokens;

  uint256 public tokensSold;

  uint256 public invested;

  function setHardcap(uint newHardcap) public onlyOwner {
    hardcapInTokens = newHardcap;
  }

  function setStart(uint newStart) public onlyOwner {
    start = newStart;
  }

  function setEnd(uint newEnd) public onlyOwner {
    end = newEnd;
  }

  function setMinInvestedLimit(uint newMinInvestedLimit) public onlyOwner {
    minInvestedLimit = newMinInvestedLimit;
  }

  function setMaxInvestedLimit(uint newMaxInvestedLimit) public onlyOwner {
    maxInvestedLimit = newMaxInvestedLimit;
  }

  function setPrice(uint newPrice) public onlyOwner {
    price = newPrice;
  }

  function setTokenDistributorWallet(address newTokenDsitributorWallet) public onlyOwner {
    tokenWallet = TokenDistributorWallet(newTokenDsitributorWallet);
  }

  function updateInvested(uint value) internal {
    invested = invested.add(value);
  }

  function fallback() internal returns(uint) {
		// check hardcap
    require(value >= minInvestedLimit && value <= maxInvestedLimit);
    require(now >= start && now < end);
    wallet.transfer(msg.value);
    invested = invested.add(value);
    uint tokens = calculateTokens(_invested); // TODO:
    tokenWallet.transfer(_sender(), tokens);
    return tokens;
  }

  function () public payable {
    fallback();
  }

}


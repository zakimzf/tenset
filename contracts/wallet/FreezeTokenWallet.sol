pragma solidity ^0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../util/IERC20Cutted.sol";
import "../util/RetrieveTokensFeature.sol";

contract FreezeTokenWallet is RetrieveTokensFeature {

  using SafeMath for uint256;

  IERC20Cutted public token;
  bool public started;
  uint256 public startDate;
  uint256 public startBalance;
  uint256 public duration;
  uint256 public interval;
  uint256 public retrievedTokens;

  modifier notStarted() {
    require(!started);
    _;
  }

  function setStartDate(uint newStartDate) public onlyOwner notStarted {
    startDate = newStartDate;
  }

  function setDuration(uint newDuration) public onlyOwner notStarted {
    duration = newDuration * 1 days;
  }

  function setInterval(uint newInterval) public onlyOwner notStarted {
    interval = newInterval * 1 days;
  }

  function setToken(address newToken) public onlyOwner notStarted {
    token = IERC20Cutted(newToken);
  }

  function start() public onlyOwner notStarted {
    startBalance = token.balanceOf(address(this));
    started = true;
  }

  function retrieveWalletTokens(address to) public onlyOwner {
    require(started && now >= startDate);
    if (now >= startDate + duration) {
      token.transfer(to, token.balanceOf(address(this)));
    } else {
      uint parts = duration.div(interval);
      uint tokensByPart = startBalance.div(parts);
      uint timeSinceStart = now.sub(startDate);
      uint pastParts = timeSinceStart.div(interval);
      uint tokensToRetrieveSinceStart = pastParts.mul(tokensByPart);
      uint tokensToRetrieve = tokensToRetrieveSinceStart.sub(retrievedTokens);
      require(tokensToRetrieve > 0, "No tokens available for retrieving at this moment.");
      retrievedTokens = retrievedTokens.add(tokensToRetrieve);
      token.transfer(to, tokensToRetrieve);
    }
  }

  function retrieveTokens(address to, address anotherToken) override public onlyOwner {
    require(address(token) != anotherToken, "You should only use this method to withdraw extraneous tokens.");
    super.retrieveTokens(to, anotherToken);
  }

}

pragma solidity ^0.6.2;

import "./RetrieveTokensFeature.sol";
import "./IERC20Cutted.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract FreezeTokenWallet is RetrieveTokensFeature {

  using SafeMath for uint256;

  IERC20Cutted public token;

  bool public started;

  uint256 public startLockPeriod = 0 days;

  uint256 public period = 30 * 30 * 1 days;

  uint256 public duration = 90 days;

  uint256 public startUnlock;

  uint256 public retrievedTokens;

  uint256 public startBalance;

  modifier notStarted() {
    require(!started);
    _;
  }

  function setPeriod(uint newPeriod) public onlyOwner notStarted {
    period = newPeriod * 1 days;
  }

  function setDuration(uint newDuration) public onlyOwner notStarted {
    duration = newDuration * 1 days;
  }

  function setStartLockPeriod(uint newStartLockPeriod) public onlyOwner notStarted {
    startLockPeriod = newStartLockPeriod * 1 days;
  }

  function setToken(address newToken) public onlyOwner notStarted {
    token = IERC20Cutted(newToken);
  }

  function start(uint startDate) public onlyOwner notStarted {
    startUnlock = startDate + startLockPeriod;
    retrievedTokens = 0;
    startBalance = token.balanceOf(address(this));
    started = true;
  }

  function retrieveWalletTokens(address to) public onlyOwner {
    require(started && now >= startUnlock);
    if (now >= startUnlock + period) {
      token.transfer(to, token.balanceOf(address(this)));
    } else {
      uint parts = period.div(duration);
      uint tokensByPart = startBalance.div(parts);
      uint timeSinceStart = now.sub(startUnlock);
      uint pastParts = timeSinceStart.div(duration);
      uint tokensToRetrieveSinceStart = pastParts.mul(tokensByPart);
      uint tokensToRetrieve = tokensToRetrieveSinceStart.sub(retrievedTokens);
      if(tokensToRetrieve > 0) {
        retrievedTokens = retrievedTokens.add(tokensToRetrieve);
        token.transfer(to, tokensToRetrieve);
      }
    }
  }

  function retrieveTokens(address to, address anotherToken) override public onlyOwner() {
    require(address(token) != anotherToken, "");
    super.retrieveTokens(to, anotherToken);
  }

}

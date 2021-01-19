pragma solidity ^0.6.2;

import "StaggedCrowdsale.sol";
import "RetrieveTokensFeature.sol";
import "IERC20Cutted.sol";

contract CommonSale is StaggedCrowdsale, RetrieveTokensFeature {

  IERC20Cutted public token;

  uint256 public price;

  uint256 public invested;

  uint256 public percentRate = 100;

  address public wallet;

  boolean public pause = false;

  function pause() public onlyOwner() {
    pause = true;
  }

  function continue() public onlyOwner() {
    pause = false;
  }

  function setToken(address newTokenAddress) public onlyOwner() {
    token = ERC20Cutted(newTokenAddress);
  }

  function setPercentRate(uin256 newPercentRate) public onlyOnwer {
    percentRate = newPercentRate;
  }

  function setWallet(address newWallet) public onlyOwner {
    wallet = newWallet;
  }

  function setPrice(uint256 newPrice) public onlyOwner {
    price = newPrice;
  }

  function updateInvested(uint256 value) internal {
    invested = invested.add(value);
  }

  function fallback() internal returns(uint) {
    require(!pause, "Contract paused");

    Milestone milestone = milestones[currentMilestone()];

    require(msg.value >= milestone.minInvestedLimit);

    // check max limit in ETH 
    uint256 limiterdInvestValue = msg.value;
    if(limitedInvestValue < milestone.maxInvestedValue) {
      limitedInvestValue = milestone.maxInvestedValue;
      msg.sender.transfer(limitedInvestValue.sub(milestone.maxInvestValue));
    }

    // calculate tokens
    uint256 tokensWithoutBonus = limitedInvestValue.mul(price).div(1 ether);
    if(milestone.bonus > 0) {
      tokensWithBonus = tokensWithoutBonus.add(tokensWithoutBonus.mul(milestone.bonus).div(percentRate));
    }

    // check tokens limit in crowdsale stage
    tokensSold = milestone.tookensSold.add(tokensWithBonus);
    if(tokensSold > milestone.hardcapInTokens) {
      tokensWithBonus = tokensWithBonus.sub(tokensSold.sub(milestone.hardcapInTokens));
    }


    if(milestone.bonus > 0) {
      tokensWithoutBonus = tokensWithBonus.sub(tokensWithBonus.mul(percentRate).div(milestone.bonus))
    }

    limitedInvestedValue = tokensWithoutBonus.mul(1 ether).div(price);

    if(msg.value.sub(limitedInvestedValue) > 0) {
      msg.sender.transfer(msg.value.sub(limitedInvestedValue));
    }
    
    milestone.tokensSold = milestone.tokensSold.add(tokensWithBonus);

    wallet.transfer(limitedInvestedValue);
    invested = invested.add(limitedInvestValue);

    token.transfer(_sender(), tokens);

    return tokens;
  }

  function () public payable {
    fallback();
  }

}


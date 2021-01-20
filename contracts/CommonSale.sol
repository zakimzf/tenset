pragma solidity ^0.6.2;

import "./RetrieveTokensFeature.sol";
import "./StagedCrowdsale.sol";
import "./IERC20Cutted.sol";


contract CommonSale is StagedCrowdsale, RetrieveTokensFeature {

    IERC20Cutted public token;

    uint256 public price;

    uint256 public invested;

    uint256 public percentRate = 100;

    address payable public wallet;

    bool public isPause = false;

    uint256 public commonPurchaseLimit;

    mapping(address => bool) public whitelist;

    mapping(address => uint256) public whitelistBalances;

    mapping(uint256 => bool) public whitelistedMilestones;

    function setMilestoneWithWhitelist(uint256 index) public onlyOwner {
       whitelistedMilestones[index] = true;
    }

    function unsetMilestoneWithWhitelist(uint256 index) public onlyOwner {
       whitelistedMilestones[index] = false;
    }

    function setCommonPurchaseLimit(uint256 newCommonPurchaseLimit) public onlyOwner {
        commonPurchaseLimit = newCommonPurchaseLimit;
    }

    function addToWhiteList(address target) public onlyOwner {
      require(!whitelist[target], "Already in whitelist");
      whitelist[target] = true;
      whitelistBalances[target] = commonPurchaseLimit;
    }

    function pause() public onlyOwner {
        isPause = true;
    }

    function unpause() public onlyOwner {
        isPause = false;
    }

    function setToken(address newTokenAddress) public onlyOwner() {
        token = IERC20Cutted(newTokenAddress);
    }

    function setPercentRate(uint256 newPercentRate) public onlyOwner() {
        percentRate = newPercentRate;
    }

    function setWallet(address payable newWallet) public onlyOwner() {
        wallet = newWallet;
    }

    function setPrice(uint256 newPrice) public onlyOwner() {
        price = newPrice;
    }

    function updateInvested(uint256 value) internal {
        invested = invested.add(value);
    }

    function internalFallback() internal returns (uint) {
        require(!isPause, "Contract paused");

        uint256 milestoneIndex = currentMilestone();

        Milestone memory milestone = milestones[milestoneIndex];
        uint256 limitedInvestValue = msg.value;
        uint256 change = 0;
        if(whitelistedMilestones[milestoneIndex]) {
          require(whitelist[_msgSender()], "Address should be in whitelist!");
          require(whitelistBalances[_msgSender()] > 0, "Whitelist balance exceeded!");
          if(limitedInvestValue > whitelistBalances[_msgSender()]) {
            change = limitedInvestValue.sub(whitelistBalances[_msgSender()]);
            limitedInvestValue = whitelistBalances[_msgSender()];
          }    
        }

        require(msg.value >= milestone.minInvestedLimit);

        // check max limit in ETH 
        if (limitedInvestValue > milestone.maxInvestedLimit) {
            change = change.add(limitedInvestValue.sub(milestone.maxInvestedLimit));
            limitedInvestValue = milestone.maxInvestedLimit;
        }

        // calculate tokens
        uint256 tokensWithoutBonus = limitedInvestValue.mul(price).div(1 ether);
        uint256 tokensWithBonus = tokensWithoutBonus;
        if (milestone.bonus > 0) {
            tokensWithBonus = tokensWithoutBonus.add(tokensWithoutBonus.mul(milestone.bonus).div(percentRate));
        }

        // check tokens limit in crowdsale stage
        uint256 tokensSold = milestone.tokensSold.add(tokensWithBonus);
        if (tokensSold > milestone.hardcapInTokens) {
            tokensWithBonus = tokensWithBonus.sub(tokensSold.sub(milestone.hardcapInTokens));
        }


        if (milestone.bonus > 0) {
            tokensWithoutBonus = tokensWithBonus.sub(tokensWithBonus.mul(percentRate).div(milestone.bonus));
        }

        uint256 tokenBasedLimitedInvestValue = tokensWithoutBonus.mul(1 ether).div(price);
        change = change.add(limitedInvestValue.sub(tokenBasedLimitedInvestValue));

        milestone.tokensSold = milestone.tokensSold.add(tokensWithBonus);

        wallet.transfer(tokenBasedLimitedInvestValue);
        invested = invested.add(tokenBasedLimitedInvestValue);

        token.transfer(_msgSender(), tokensWithBonus);
        if (change > 0) {
            _msgSender().transfer(change);
        }

        if(whitelistedMilestones[milestoneIndex]) {
          whitelistBalances[_msgSender()] = whitelistBalances[_msgSender()].sub(tokenBasedLimitedInvestValue);
        }

        return tokensWithBonus;
    }

    receive() external payable {
        internalFallback();
    }

}


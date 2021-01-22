pragma solidity ^0.6.2;

import "./RetrieveTokensFeature.sol";
import "./StagedCrowdsale.sol";
import "./IERC20Cutted.sol";


contract CommonSale is StagedCrowdsale, RetrieveTokensFeature {

    IERC20Cutted public token;
    uint256 public price; // amount of tokens per 1 ETH
    uint256 public invested;
    uint256 public percentRate = 100;
    address payable public wallet;
    bool public isPause = false;
    mapping(address => bool) public whitelist;

    mapping(uint256 => mapping(address => uint256)) public whitelistBalances;

    mapping(uint256 => bool) public whitelistedMilestones;

    function setMilestoneWithWhitelist(uint256 index) public onlyOwner {
        whitelistedMilestones[index] = true;
    }

    function unsetMilestoneWithWhitelist(uint256 index) public onlyOwner {
        whitelistedMilestones[index] = false;
    }

    function addToWhiteList(address target) public onlyOwner {
        require(!whitelist[target], "Already in whitelist");
        whitelist[target] = true;
        for (uint i = 0; i < milestones.length; i++) {
            whitelistBalances[i][target] = milestones[i].maxInvestedLimit;
        }
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
        Milestone storage milestone = milestones[milestoneIndex];
        uint256 limitedInvestValue = msg.value;

        // limit the minimum amount for one transaction (ETH) 
        require(limitedInvestValue >= milestone.minInvestedLimit, "The amount is too small");

        // limit the maximum amount that one user can spend during the current milestone (ETH) 
        if (whitelistedMilestones[milestoneIndex]) {
            require(whitelist[_msgSender()], "The address must be whitelisted!");
            require(whitelistBalances[milestoneIndex][_msgSender()] > 0, "Whitelist balance exceeded!");
            if (limitedInvestValue > whitelistBalances[milestoneIndex][_msgSender()]) {
                limitedInvestValue = whitelistBalances[milestoneIndex][_msgSender()];
            }
        }

        // apply a bonus if any (10SET)
        uint256 tokensWithoutBonus = limitedInvestValue.mul(price).div(1 ether);
        uint256 tokensWithBonus = tokensWithoutBonus;
        if (milestone.bonus > 0) {
            tokensWithBonus = tokensWithoutBonus.add(tokensWithoutBonus.mul(milestone.bonus).div(percentRate));
        }

        // limit the number of tokens that user can buy according to the hardcap of the current milestone (10SET)
        if (milestone.tokensSold.add(tokensWithBonus) > milestone.hardcapInTokens) {
            tokensWithBonus = milestone.hardcapInTokens.sub(milestone.tokensSold);
            if (milestone.bonus > 0) {
                tokensWithoutBonus = tokensWithBonus.mul(percentRate).div(percentRate + milestone.bonus);
            }
        }
        
        // calculate the resulting amount of ETH that user will spend and calculate the change if any
        uint256 tokenBasedLimitedInvestValue = tokensWithoutBonus.mul(1 ether).div(price);
        uint256 change = msg.value - tokenBasedLimitedInvestValue;

        // update stats
        invested = invested.add(tokenBasedLimitedInvestValue);
        milestone.tokensSold = milestone.tokensSold.add(tokensWithBonus);
        if (whitelistedMilestones[milestoneIndex]) {
            whitelistBalances[milestoneIndex][_msgSender()] = whitelistBalances[milestoneIndex][_msgSender()].sub(tokenBasedLimitedInvestValue);
        }
        
        wallet.transfer(tokenBasedLimitedInvestValue);
        
        // we multiply the amount to send by 100 / 98 to compensate the buyer 2% fee charged on each transaction
        token.transfer(_msgSender(), tokensWithBonus.mul(100).div(98));
        
        if (change > 0) {
            _msgSender().transfer(change);
        }

        return tokensWithBonus;
    }

    receive() external payable {
        internalFallback();
    }

}


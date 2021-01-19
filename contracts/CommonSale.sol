pragma solidity ^0.6.2;

import "./RetrieveTokensFeature.sol";
import "./StaggedCrowdsale.sol";
import "./IERC20Cutted.sol";

contract CommonSale is StaggedCrowdsale, RetrieveTokensFeature {

    IERC20Cutted public token;

    uint256 public price;

    uint256 public invested;

    uint256 public percentRate = 100;

    address payable public wallet;

    bool public isPause = false;

    function pause() public onlyOwner {
        isPause = true;
    }

    function unpause() public onlyOwner {
        isPause = false;
    }

    function setToken(address newTokenAddress) public onlyOwner {
        token = IERC20Cutted(newTokenAddress);
    }

    function setPercentRate(uint256 newPercentRate) public onlyOwner {
        percentRate = newPercentRate;
    }

    function setWallet(address payable newWallet) public onlyOwner {
        wallet = newWallet;
    }

    function setPrice(uint256 newPrice) public onlyOwner {
        price = newPrice;
    }

    function updateInvested(uint256 value) internal {
        invested = invested.add(value);
    }

    function internalFallback() internal returns (uint) {
        require(!isPause, "Contract paused");

        uint256 milestoneIndex = currentMilestone();
        Milestone memory milestone = milestones[milestoneIndex];

        require(msg.value >= milestone.minInvestedLimit);

        // check max limit in ETH 
        uint256 limitedInvestValue = msg.value;
        if (limitedInvestValue < milestone.maxInvestedLimit) {
            limitedInvestValue = milestone.maxInvestedLimit;
            _msgSender().transfer(limitedInvestValue.sub(milestone.maxInvestedLimit));
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

        limitedInvestValue = tokensWithoutBonus.mul(1 ether).div(price);

        if (msg.value.sub(limitedInvestValue) > 0) {
            _msgSender().transfer(msg.value.sub(limitedInvestValue));
        }

        milestone.tokensSold = milestone.tokensSold.add(tokensWithBonus);

        wallet.transfer(limitedInvestValue);
        invested = invested.add(limitedInvestValue);

        token.transfer(_msgSender(), tokensWithBonus);

        return tokensWithBonus;
    }

    receive() external payable {
        internalFallback();
    }

}


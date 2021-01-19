pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommonSale is Context, Ownable {
    using SafeMath for uint256;
    using Address for address;

  uint256 private constant MAX = ~uint256(0);

  TenSetToken public token;

  FreezeWallet public freezeWallet;
 
  CommonSale public commonSale;

  address public targetOwner = TODO;

  // constructor
  public init() {
    // create token contract
    token = new TenSetToken();

    // create token wallet
    // freezeWallet = new FreezeWallet();
    // freezeWallet.setStart(..);
    // tokens.transfer(freezeWallet, amount);

    uint256 stage1Tokens =   11 * 10**6 * 10**18;
    uint256 stage2Tokens =  525 * 10**5 * 10**18;
    uint256 stage3Tokens =   80 * 10**6 * 10**18;

    uint256 stageSumTokens = stage1Tokens + stage2Tokens + stage3Tokens;

    commonSale = new CommonSale();
    commonSale.addMilstone(1,   2, 10, 1 * 10**17,  40 * ether, 0, 0,  stage1Tokens);
    commonSale.addMilstone(3,   4,  5, 1 * 10**17, 100 * ether, 0, 0,  stage2Tokens);
    commonSale.addMilstone(5, MAX,  0,          0,         MAX, 0, 0,  stage3Tokens);
     
    token.transfer(stageSumTokens);

    token.transferOwnership(targetOwner);
    freezeWallet.transferOwnership(targetOwner);
    commonSale.transferOwnership(targetOwner);
  }

}


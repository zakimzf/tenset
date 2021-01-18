pragma solidity ^0.6.2;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommonSale is Context, Ownable {
    using SafeMath for uint256;
    using Address for address;

  TokenWallet public tokenWallet;

  TenSetToken public token;

  FreezeWallet public freezeWallet;
 
  CommonSale public priavateSalePL;

  CommonSale public priavateSaleGL;

  address public targetOwner = TODO;

  public init() {
    // create token contract
    token = new TenSetToken();

    // create token wallet
    tokenWallet = new TokenWallet();

    // create token wallet
    // freezeWallet = new FreezeWallet();
    // freezeWallet.setStart(..);

    // TODO: distribute tokens
    // to te
    
    privateSalePL = new CommonSale();
    privateSalePL.setStart(...);
    privateSalePL.setEnd(...);
    privateSalePL.setBonus(...);
    privateSalePL.setHardacap(...);
    privateSalePL.setPrice(...);
    privateSalePL.setTokenWallet(address(tokenWallet));

    privateSaleGP = new CommonSale();
    privateSaleGP.setStart(...);
    privateSaleGP.setEnd(...);
    privateSaleGP.setBonus(...);
    privateSaleGP.setHardacap(...);
    privateSaleGP.setPrice(...);
    privateSaleGP.setTokenWallet(address(tokenWallet));


    tokenWallet.allowAddress(address(privateSalePL));
    tokenWallet.allowAddress(address(privateSaleGL));


    token.transferOwnership(targetOwner);
    tokenWallet.transferOwnership(targetOwner);
    freezeWallet.transferOwnership(targetOwner);
    privateSalePL.transferOwnership(targetOwner);
    privateSaleGL.transferOwnership(targetOwner);
  }

}


pragma solidity ^0.6.2;

interface IOldCOVToken {

  function lock(address addr, uint periodInDays) external;

}

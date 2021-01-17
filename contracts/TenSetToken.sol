pragma solidity ^0.6.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IERC20Cutted.sol";
import "./ERC20.sol";
import "./ITransferContarctCallback.sol";


contract TenSetToken is ERC20, AccessControl {

    uint256 public constant MAX_INT = uint256(-1);

    bytes32 public constant ROLE_ADMIN = 0x00;
    bytes32 public constant ROLE_MINTER = bytes32(uint256(1));
    bytes32 public constant ROLE_BURNER = bytes32(uint256(2));
    bytes32 public constant ROLE_TRANSFER = bytes32(uint256(3));
    bytes32 public constant ROLE_ALIEN_TOKEN_SENDER = bytes32(uint256(4));

    bytes32 public constant LOCK_BURN = 0x00;
    bytes32 public constant LOCK_TRANSFER = bytes32(uint256(1));
    bytes32 public constant LOCK_MINT = bytes32(uint256(2));
    bytes32 public constant LOCK_ADDR_TIME_LOCK = bytes32(uint256(3));

    mapping(bytes32 => bool) public tempFuncLocks;
    mapping(bytes32 => bool) public finalFuncLocks;

    mapping(address => uint256) public locks;

    address public registeredCallback = address(0x0);

    constructor () public ERC20("10Set Token", "10SET") {
        _setRoleAdmin(ROLE_ADMIN, ROLE_ADMIN);
        _setRoleAdmin(ROLE_MINTER, ROLE_ADMIN);
        _setRoleAdmin(ROLE_BURNER, ROLE_ADMIN);
        _setRoleAdmin(ROLE_TRANSFER, ROLE_ADMIN);
        _setRoleAdmin(ROLE_ALIEN_TOKEN_SENDER, ROLE_ADMIN);

        _setupRole(ROLE_ADMIN, _msgSender());
        _setupRole(ROLE_MINTER, _msgSender());
        _setupRole(ROLE_BURNER, _msgSender());
        _setupRole(ROLE_TRANSFER, _msgSender());
        _setupRole(ROLE_ALIEN_TOKEN_SENDER, _msgSender());

        _setupRole(ROLE_ADMIN, address(this));
        _setupRole(ROLE_MINTER, address(this));
        _setupRole(ROLE_BURNER, address(this));
        _setupRole(ROLE_TRANSFER, address(this));
        _setupRole(ROLE_ALIEN_TOKEN_SENDER, address(this));
    }

    modifier onlyRole(bytes32 role) {
        require(hasRole(role, _msgSender()), "Sender requires permission");
        _;
    }

    modifier notFinalFuncLocked(bytes32 lock) {
        require(!finalFuncLocks[lock], "Locked");
        _;
    }

    function burn(uint256 amount) public virtual {
        _burn(_msgSender(), amount);
    }

    function burnFrom(address account, uint256 amount) public virtual {
        uint256 decreasedAllowance = allowance(account, _msgSender()).sub(amount, "ERC20: burn amount exceeds allowance");
        _approve(account, _msgSender(), decreasedAllowance);
        _burn(account, amount);
    }

    function setTempFuncLock(bytes32 lock, bool status) public onlyRole(ROLE_ADMIN) {
        tempFuncLocks[lock] = status;
    }


    function finalFuncLock(bytes32 lock) public onlyRole(ROLE_ADMIN) {
        finalFuncLocks[lock] = true;
    }

    function adminMint(address account, uint256 amount) public onlyRole(ROLE_MINTER) notFinalFuncLocked(LOCK_MINT) {
        _mint(account, amount);
    }

    function adminBurn(address account, uint256 amount) public onlyRole(ROLE_BURNER) notFinalFuncLocked(LOCK_BURN) {
        _burn(account, amount);
    }

    function adminTimelockTransfer(address account, uint256 periodInDays) public onlyRole(ROLE_ADMIN) notFinalFuncLocked(LOCK_ADDR_TIME_LOCK) {
        locks[account] = now + periodInDays * 1 days;
    }

    function retrieveTokens(address to, address anotherToken) public onlyRole(ROLE_ALIEN_TOKEN_SENDER) {
        IERC20Cutted alienToken = IERC20Cutted(anotherToken);
        alienToken.transfer(to, alienToken.balanceOf(address(this)));
    }

    function distributeMint(address[] memory receivers, uint[] memory balances) public onlyRole(ROLE_MINTER) notFinalFuncLocked(LOCK_MINT) {
        for (uint i = 0; i < receivers.length; i++) {
            _totalSupply = _totalSupply.add(balances[i]);
            _balances[receivers[i]] = _balances[receivers[i]].add(balances[i]);
            emit Transfer(address(0), receivers[i], balances[i]);
        }
    }

    function registerCallback(address callback) public onlyRole(ROLE_ADMIN) {
        registeredCallback = callback;
    }

    function deregisterCallback() public onlyRole(ROLE_ADMIN) {
        registeredCallback = address(0x0);
    }

    function _burn(address account, uint256 amount) internal virtual override {
        require(!tempFuncLocks[LOCK_BURN] || hasRole(ROLE_BURNER, _msgSender()), "Token burn locked");
        super._burn(account, amount);
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual override {
        require((!tempFuncLocks[LOCK_TRANSFER] && locks[sender] < now) || hasRole(ROLE_TRANSFER, _msgSender()), "Token transfer locked");
        super._transfer(sender, recipient, amount);
        if (registeredCallback != address(0x0)) {
            ITransferContarctCallback targetCallback = ITransferContarctCallback(registeredCallback);
            targetCallback.tokenFallback(sender, recipient, amount);
        }
    }

}

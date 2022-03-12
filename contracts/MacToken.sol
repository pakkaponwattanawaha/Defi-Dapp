pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MacToken is ERC20 {
    constructor() public ERC20("Mac Token", "MAC") {
        _mint(msg.sender, 1_000_000_000_000_000_000_000_000);
    }
}

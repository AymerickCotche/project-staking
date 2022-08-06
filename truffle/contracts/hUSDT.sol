// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract hUSDT is ERC20 {
    constructor(uint256 initialSupply) ERC20("hUSDT", "hUSDT") {
        _mint(msg.sender, initialSupply);
    }
}
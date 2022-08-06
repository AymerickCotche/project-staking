// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AlyraToken is ERC20,Ownable {

    address contractOwner; //define the contract owner

    mapping(address=>bool) hasClaim;

    constructor() ERC20("AYA Coin", "AYA") {}

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }

    function addContractOwner(address _contractOwner) external onlyOwner{
      contractOwner = _contractOwner;
    }

    function ApproveToken(address tokenAddress, uint256 amount) public {
        ERC20(tokenAddress).approve((msg.sender), amount);
    }

    function mint(address recipient, uint256 amount) external {
        require(msg.sender == contractOwner, "mint not allowed !");
        _mint(recipient, amount * 10**uint256(decimals()));
    }

    function claimFreeTokens() external {
      require(hasClaim[msg.sender] == false, "this address already claim free tokens");
      hasClaim[msg.sender] = true;
      _mint(msg.sender, 100000 * 10**uint256(decimals()));
    }
}

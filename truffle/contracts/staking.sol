// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./AlyraToken.sol";
import "./PriceConsumer.sol";

contract Staking is Ownable  {       
    
  struct Stake {
      uint256 amount;
      uint256 time; 
      bool exist;
      bool toClaim;
  }
    
  uint256 constant FACTOR = 1e6;
  uint256 constant DAY = 86400;
  uint256 constant MOUNTH = 2592000;

  mapping(address => mapping(uint => mapping(address => Stake))) userStake;
  mapping(address => mapping(address=>uint)) usersReward;

  ERC20 public Token;
  AlyraToken AYA;
  PriceConsumer private priceConsumer = new PriceConsumer();

  uint256 percentage1=22;
  uint256 percentage2=50;
  uint256 percentage3=3110400000;

  event tokenStaked(address userAddress, uint256 amount, uint256 option, uint256 time);
  event rewardClaimed(address userAddress, uint256 amount, uint256 option);
  event tokenWithdraw(address userAddress, uint256 amount, uint256 option);


  constructor(AlyraToken _aya){
    AYA = _aya ;
  }

  function set_percentage1(uint256 _percentage) external onlyOwner{
        percentage1 = _percentage;      
  }

  function set_percentage2(uint256 _percentage) external onlyOwner{
        percentage2 = _percentage;      
  }

  function stake(uint256 _amountToken, address _token, uint256 _option ) external {

    address user = msg.sender;
    Token = ERC20(_token); 
    Token.transferFrom(msg.sender, address(this), _amountToken);

    require(userStake[user][_option][_token].exist == false, "You have already stake and lock this token");
    require (_amountToken > 0, "Amount has to be > to 0");
    require (_option <= 3, "should be 0 or 1");


    userStake[user][_option][_token]=Stake(_amountToken, block.timestamp, true, true);

    emit tokenStaked(msg.sender, _amountToken, _option, block.timestamp);

  }

  function withdrawTokens(address _token, uint _option) public {
    
    uint256 _time = block.timestamp;
    address user = msg.sender;
    uint amountToWithdraw;

    require(userStake[user][_option][_token].exist == true, "You don't have this token staked");
    
    if(_option == 2){

      require(userStake[user][_option][_token].time+5 < _time,"5 seconds not passed");

    }

    if(_option == 1){

      require(userStake[user][_option][_token].time+(3*MOUNTH) < _time,"3 mounths not passed");

    }

    if(_option == 0){

      require(userStake[user][_option][_token].time+DAY < _time,"day not passed");

    }

    amountToWithdraw = userStake[user][_option][_token].amount;

    delete userStake[user][_option][_token].amount;
    delete userStake[user][_option][_token].exist;
    delete userStake[user][_option][_token].time;

    IERC20(_token).transfer(msg.sender, amountToWithdraw);

    event tokenWithdraw(user, amountToWithdraw, _option);

  }

  function claimRewards(uint _option, address _token) public {

    address _user = msg.sender;
    uint256 _time = block.timestamp;
    uint256 _reward;
    uint256 _stakedTime;
    uint256 rateStaked;
    
    require(userStake[_user][_option][_token].toClaim, "You don't have stake this token");

    if(_option == 2) {
      require(userStake[_user][_option][_token].time+5 < _time,"5 seconds not passed");

      _stakedTime = 5;
    }

    if(_option == 1) {
      require(userStake[_user][_option][_token].time+(3*MOUNTH)<_time,"3 mounths not passed");

      _stakedTime = 3*MOUNTH;
    }

    if(_option == 0){
      require(userStake[_user][_option][_token].time+DAY<_time,"day not passed");

      _stakedTime = DAY;
    }

    rateStaked = (_stakedTime*percentage3/100)/(360*24*60*60);
    _reward = userStake[_user][_option][_token].amount*rateStaked;
    userStake[_user][_option][_token].toClaim = false;
          
    AYA.mint(_user, _reward);

    event rewardClaimed(_user, _reward, _option);

  }

  function getTokenPrice(address tokenAddress) public view returns (int256) {
      try priceConsumer.getLatestPrice(tokenAddress) returns (
          int256 price
      ) {
          return price;
      } catch {
          return 0;
      }
  }


}

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "./AlyraToken.sol";
import "./PriceConsumer.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";




contract Staking is Ownable  {

   struct Amount {
        uint256 amount;
        address tokenAddr;
       
    }
     struct Stake {
        uint256 amount;
        address tokenAddr;
        uint256 option; // 1 ou 0 si 0 l,argent est bloker pour une journneé si 1 pour 3 mois  
        uint256 time;    
    }

    uint256 constant FACTOR = 1e6;
    uint256 constant DAY = 86400;
    uint256 constant MOUNTH = 2592000;
    mapping(address => Amount[]) usersReward;
    mapping(address => Stake[]) userStake;
    AlyraToken private _AYAInstance = new AlyraToken(address(this));//the reward token
    PriceConsumer private priceConsumer = new PriceConsumer();
    uint256 percentage1=10;
    uint256 percentage2=30;
    ///changer les % reward
    function set_percentage1(uint256 _percentage) external onlyOwner{
         percentage1 = _percentage;      
    }
    function set_percentage2(uint256 _percentage) external onlyOwner{
         percentage2 = _percentage;      
    }

   function stake(uint256 _amountToken,address token,uint256 _option ) 
    external  {
        //Transfer amount to smartcontract
        IERC20(token).transferFrom(msg.sender, address(this), _amountToken);

        require ( _amountToken >= 0," Amount 0");
        require ( _option <= 2," should be 1 or 0");

        address user=msg.sender;
        uint256 i=0;
        while ((i<userStake[user].length)&&(token!=userStake[user][i].tokenAddr))
        {
            i++;
        }
        if (token!=userStake[user][i].tokenAddr){
            Stake memory _stake = Stake(_amountToken,token,_option, block.timestamp);
            userStake[user].push(_stake);
            Amount memory _Amount= Amount(0,token);
            usersReward[user].push(_Amount);

        }
        else 
        userStake[user][i].amount += _amountToken;

     

        
    }   
   function reward(address user ,address token ) 
    public returns (uint256){
        
        uint256 _reward;

        uint256 i=0;
        while ((i<userStake[user].length)&&(token!=userStake[user][i].tokenAddr)){
            i++;
        }  
       
        uint256 _option= userStake[user][i].option;
        uint256 _time =block.timestamp;
        uint256 rateStaked;
        if(_option==0){ //reward is 10% of stacked amount if 1 DAY
      
      
            rateStaked=_time-userStake[user][i].time*percentage1*1e18/360/24/60/60; // 1e8 parce que c un entier ;  

            _reward=userStake[user][i].amount*rateStaked/1e18;

        }


        else 
        {  
            //reward is 30% of stacked amount if 3 MOUNTH
         
            rateStaked=_time-userStake[user][i].time*percentage2*1e18/360/24/60/60; // 1e8 parce que c un entier ;  
            _reward=userStake[user][i].amount*rateStaked/1e18;             
        }
            usersReward[user][i].amount=_reward;
        return _reward;
    }     
    function withdrawTokens(address tokenAddress, uint256 amount) public {
       uint256 i=0;
       uint256 _option;
       uint256 _time =block.timestamp;
        address user=msg.sender;

         while ((i<userStake[user].length)&&(tokenAddress!=userStake[user][i].tokenAddr)){
            i++;
        } 
        require(amount > 0, "You cannot withdraw 0 token !");
        require(i<userStake[user].length, "You dont have this token staked !");
        require(amount<=userStake[user][i].amount, "You dont have this amount !");
        _option=userStake[user][i].option;
        if(_option==1){
            require(userStake[user][i].time+(3*MOUNTH)<_time,"3mounth not passed");
        }
        if(_option==0){
            require(userStake[user][i].time+DAY<_time,"day not passed");
        }
        userStake[user][i].amount-=amount;
        IERC20(tokenAddress).transfer(msg.sender, amount);

    }

    function ClaimRewards() public {
        address user=msg.sender;
       
        uint256 amountClaimed=0;//compute if rewrds available now
        for (uint256 j = 0; j <usersReward[user].length ; j++){
        amountClaimed+=reward(msg.sender,usersReward[user][j].tokenAddr);

        }
        require(amountClaimed>0 ,"No Reward to claim !");
        for (uint256 j = 0; j <usersReward[user].length ; j++){
        usersReward[user][j].amount=0;

        }        
       
       // MINT      
       _AYAInstance.mint(msg.sender,amountClaimed);


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
    function getAYATokenAddress() public view returns (address) {
        return address(_AYAInstance);
    }

}
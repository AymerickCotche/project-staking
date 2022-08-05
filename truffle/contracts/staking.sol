// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "./AlyraToken.sol";
import "./PriceConsumer.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";




contract Staking is Ownable  {

  


       
    
     struct Stake {
        uint256 amount;
        uint256 option; // 1 ou 0 si 0 l,argent est bloker pour une journneé si 1 pour 3 mois  
        uint256 time; 
        uint exist;   
    }
    ERC20 public  Token;
    uint256 constant FACTOR = 1e6;
    uint256 constant DAY = 86400;
    uint256 constant MOUNTH = 2592000;
    mapping(address => mapping(address=>uint)) usersReward;
    mapping(address => mapping(address=>Stake)) userStake;
    mapping(address=>uint256)nbTokenUser;
    mapping(address=>address[])TokenUser;
    AlyraToken public AYA ;
    PriceConsumer private priceConsumer = new PriceConsumer();
    uint256 percentage1=10;
    uint256 percentage2=30;
    ///changer les % reward
    constructor(address alyraaddress){
      AYA= AlyraToken(alyraaddress) ;
    }
    function set_percentage1(uint256 _percentage) external onlyOwner{
         percentage1 = _percentage;      
    }
    function set_percentage2(uint256 _percentage) external onlyOwner{
         percentage2 = _percentage;      
    }

    function ApproveToken(address tokenAddress, uint256 amount) public {
        ERC20(tokenAddress).approve((msg.sender), amount);
    }

   function stake(uint256 _amountToken,address token,uint256 _option ) 
    external  {
        //Transfer amount to smartcontract
       Token = ERC20(token); 
       Token.transferFrom(msg.sender, address(this), _amountToken);

        require ( _amountToken >= 0," Amount 0");
        require ( _option <= 2," should be 1 or 0");
        address user=msg.sender;

       
        if(userStake[user][token].exist==0) 
            { userStake[user][token]=Stake(_amountToken,_option, block.timestamp,1);
             nbTokenUser[user]++;
             TokenUser[user].push(token);
            }
           
            

          
         else 
         userStake[user][token].amount += _amountToken;


     

        
    }   
   function reward(address user ,address token ) 
    public returns (uint256){
        
        uint256 _reward;


        uint256 _option= userStake[user][token].option;
        uint256 _time =block.timestamp;
        uint256 rateStaked;
        if(_option==0){ //reward is 10% of stacked amount if 1 DAY
      
      
            rateStaked =_time-userStake[user][token].time*percentage1*1e18/360/24/60/60; // 1e8 parce que c un entier ;  

            _reward = userStake[user][token].amount*rateStaked/1e18;

        }


        else 
        {  
            //reward is 30% of stacked amount if 3 MOUNTH
         
            rateStaked=_time-userStake[user][token].time*percentage2*1e18/360/24/60/60; // 1e8 parce que c un entier ;  
            _reward=userStake[user][token].amount*rateStaked/1e18;             
        }
            usersReward[user][token]=_reward;
        return _reward;
    }     
    function withdrawTokens(address token, uint256 amount) public {
      
       uint256 _option;
       uint256 _time =block.timestamp;
        address user=msg.sender;

 
        require(amount > 0, "You cannot withdraw 0 token !");
        require(userStake[user][token].exist==1, "You dont have this token staked !");
        require(amount<=userStake[user][token].amount, "You dont have this amount !");
        _option=userStake[user][token].option;
        if(_option==1){
            require(userStake[user][token].time+(3*MOUNTH)<_time,"3mounth not passed");
        }
        if(_option==0){
            require(userStake[user][token].time+DAY<_time,"day not passed");
        }
        userStake[user][token].amount-=amount;
        IERC20(token).transfer(msg.sender, amount);

    }

    function ClaimRewards() public {
        
       require(nbTokenUser[msg.sender]>0 ,"No Reward to claim !");
        uint256 amountClaimed=0;//compute if rewrds available now
        
        address _token;
        uint256 _reward;
        for (uint256 j = 0; j <nbTokenUser[msg.sender] ; j++){
            _token=TokenUser[msg.sender][j];
            _reward=reward(msg.sender,_token);
            amountClaimed+=usersReward[msg.sender][_token];
            usersReward[msg.sender][_token]=0;

        }
        
       
       // MINT      
       AYA.mint(msg.sender,amountClaimed);


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

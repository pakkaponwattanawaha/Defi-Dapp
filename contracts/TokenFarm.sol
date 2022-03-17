//StakeToken
//unStakeToken
//issue Tokens
//  rewarding staked token with mactoken => 1:1 => 1DAI = 1MAC
//  what if they stake 50ETH : 50DAI => convert ETH to DAI then give 1MAC per 1DAI -> use price feed!!!!

// addAllowedTokens
//getEthValue

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; // IERC20 interface
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    //mapping of token_address -> staker_address -> amount_staked
    mapping(address => mapping(address => uint256)) public stakingBalance; // we cant loop throught mapping!!!!!
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;
    address[] public stakers;

    address[] public allowedTokens;
    IERC20 public macToken;

    constructor(address _macTokenAddress) public {
        macToken = IERC20(_macTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function stakeTokens(uint256 _amount, address _token) public {
        //what token can they stake?
        require(tokenIsAllowed(_token), "Token is not allowed to stake");
        // how much can they stake?
        require(_amount > 0, "Amount must be more than 0");

        // to transfer token that's not in our wallet(this FarmContract) => use transferFrom
        // wrap token in IERC20; => get ABI of IERC20 interface and can call transferFrom
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token);

        //add amount to their current balance
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount;

        if (uniqueTokensStaked[msg.sender] == 1) {
            // this stake call is their first stake?
            stakers.push(msg.sender);
        }
    }

    function unstakeTokens(uint256 _amount, address _token) public {
        uint256 balance = stakingBalance[_token][msg.sender];

        //what token can they unstake?
        require(tokenIsAllowed(_token), "Token is not allowed to stake");

        // how much can they unstake?
        require(balance - _amount >= 0, "Insufficient balance to unstake ");

        // how much can we unstake
        require(balance > 0, "Amount must be more than 0");
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] -
            _amount;
        IERC20(_token).transfer(msg.sender, _amount);
        if (balance == 0) {
            for (uint256 idx = 0; idx < stakers.length; idx++) {
                if (stakers[idx] == msg.sender) {
                    stakers[idx] = stakers[stakers.length - 1];
                    stakers.pop();
                }
            }
        }
    }

    function issueTokens() public onlyOwner {
        for (uint256 idx = 0; idx < stakers.length; idx++) {
            address recipient = stakers[idx];
            // send them token reward based on amount staked
            // calculate amount staked in DAI currency
            // transfer them MAC token as reward!
            uint256 userTotalValue = getUserTotalValue(recipient);

            macToken.transfer(recipient, userTotalValue);
        }
    }

    function transferToken(uint256 amount, address recipient) public {
        require(
            macToken.balanceOf(address(this)) >= amount,
            "Insufficient Mac Token"
        );

        macToken.transfer(recipient, amount);
    }

    /////// Utility functions

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(
            uniqueTokensStaked[_user] > 0,
            "Address has no token staked!!!"
        );
        for (uint256 idx = 0; idx < allowedTokens.length; idx++) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(_user, allowedTokens[idx]);
        }
        return totalValue;
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        // return in DAI currency
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        } else {
            //get price * stakingBalance[_token][_user]
            (uint256 price, uint256 decimals) = getTokenValue(_token);
            // 10 ETH -> ETH/USD ==3,000
            // 10*3000 = 30,000
            // but our stakingBalance will be concat by 18 0s => divide by 10** decimals

            return ((stakingBalance[_token][_user] * price) / (10**decimals));
        }
    }

    function getTokenValue(address _token)
        public
        view
        returns (uint256, uint256)
    {
        //=> chainlink pricefeed
        //mapping token to pricefeed!!!!!
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(
            priceFeedAddress
        );
        (, int256 price, , , ) = priceFeed.latestRoundData();
        uint256 decimals = priceFeed.decimals();
        return (uint256(price), decimals);
    }

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = uniqueTokensStaked[_user] + 1;
        }
    }

    function tokenIsAllowed(address _token) public returns (bool) {
        for (uint256 idx = 0; idx < allowedTokens.length; idx++) {
            if (allowedTokens[idx] == _token) {
                return true;
            }
        }
        return false;
    }
}

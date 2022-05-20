// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interface/ILiquidityPoolHyphen.sol";
import "../BaseImpl.sol";
import "hardhat/console.sol";

contract HyphenProvider is BaseImpl, Ownable, ReentrancyGuard {
	using SafeERC20 for IERC20;

	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
	
	// Hyphen Liquidty Pool Address
	ILiquidityPool hyphenLiquidityPool;
	
	error AmountNotZero();

	constructor(address _hyphen) {
		hyphenLiquidityPool = ILiquidityPool(_hyphen);
	}

	function transferNative(address _from, address _receiver, uint256 toChainId, address tokenAddress, uint _amount) external payable nonReentrant override {
		if(tokenAddress == NATIVE_TOKEN_ADDRESS) {
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			require(msg.value == _amount, "WagPay: Please send amount same to msg.value");
			hyphenLiquidityPool.depositNative{value: _amount}(_receiver, toChainId);
		} else {
			require(msg.value == 0, "WagPay: msg.value should be zero");
			require(_amount > 0, "WagPay: Please send amount greater than 0");

			IERC20(tokenAddress).safeTransferFrom(_from, address(this), _amount);
			IERC20(tokenAddress).safeIncreaseAllowance(address(hyphenLiquidityPool), _amount);

			hyphenLiquidityPool.depositErc20(tokenAddress, _receiver, _amount, toChainId);
		}
		emit FundsTransferred(_receiver, toChainId, _amount, tokenAddress);
	}
}
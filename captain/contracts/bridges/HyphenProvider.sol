// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interface/ILiquidityPoolHyphen.sol";

contract HyphenProvider is ReentrancyGuard {
	using SafeERC20 for IERC20;
	
	// Hyphen Liquidty Pool Address
	ILiquidityPool hyphenLiquidityPool;

	event NativeFundsTransferred(address receiver, uint256 toChainId);
	event ERC20FundsTransferred(address receiver, uint256 toChainId, uint256 value, address tokenAddress);

	constructor(address _hyphen) {
		hyphenLiquidityPool = ILiquidityPool(_hyphen);
	}

	function transferNative(uint amount, address receiver, uint256 toChainId, string calldata tag) external payable nonReentrant {
			require(msg.value == amount, "Wagpay: Please send amount greater than 0");
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			hyphenLiquidityPool.depositNative{value: amount}(receiver, toChainId, tag);

			emit NativeFundsTransferred(receiver, toChainId);
	}


	function transferERC20(uint256 toChainId,
        address tokenAddress,
        address receiver,
        uint256 amount,
        string calldata tag ) external {

			require(amount > 0, "WagPay: Please send amount greater than 0");

			IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
			IERC20(tokenAddress).safeIncreaseAllowance(address(hyphenLiquidityPool), amount);

			hyphenLiquidityPool.depositErc20(toChainId, tokenAddress, receiver, amount, tag);
		
			emit ERC20FundsTransferred(receiver, toChainId, amount, tokenAddress);
		}
}
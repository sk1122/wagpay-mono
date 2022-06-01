// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IHyphen.sol";
import "../../interface/IBridge.sol";

contract HyphenProvider is ReentrancyGuard, IBridge{
	using SafeERC20 for IERC20;
	
	// Hyphen Liquidty Pool Address
	ILiquidityPool hyphenLiquidityPool;

	constructor(address _hyphen) {
		hyphenLiquidityPool = ILiquidityPool(_hyphen);
	}

    function transferNative(uint amount, 
        address receiver, 
        uint64 toChainId, 
        bytes memory //extraData
		) external payable nonReentrant {
			require(msg.value == amount, "Wagpay: Please send amount greater than 0");
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			hyphenLiquidityPool.depositNative{value: amount}(receiver, toChainId, "WagPay");

			emit NativeFundsTransferred(receiver, toChainId, amount);
	}


	function transferERC20(uint64 toChainId,
        address tokenAddress,
        address receiver,
        uint256 amount,
        bytes memory //extraData
		) external nonReentrant {

			require(amount > 0, "WagPay: Please send amount greater than 0");

			IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
			IERC20(tokenAddress).safeIncreaseAllowance(address(hyphenLiquidityPool), amount);

			hyphenLiquidityPool.depositErc20(toChainId, tokenAddress, receiver, amount, "WagPay");
		
			emit ERC20FundsTransferred(receiver, toChainId, amount, tokenAddress);
	}
}
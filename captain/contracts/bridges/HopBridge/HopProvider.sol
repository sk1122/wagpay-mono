// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IHop.sol";
import "../../interface/IBridge.sol";

contract HopProvider is IBridge, Ownable, ReentrancyGuard {
	using SafeERC20 for IERC20;
	L2AMMSwapHop private hopBridge;

	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

	constructor(address _hopBridge) {
		hopBridge = L2AMMSwapHop(_hopBridge);
	}
	
	function transferNative(uint amount, 
        address receiver, 
        uint64 toChainId, 
        bytes memory //extraData
		) external payable nonReentrant {
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			require(msg.value == amount, "WagPay: Please send amount same to msg.value");
			hopBridge.swapAndSend{value: amount}(toChainId, receiver, amount, 28578266354135306662, 0, 0, 0, 0);
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
			IERC20(tokenAddress).safeIncreaseAllowance(address(hopBridge), amount);

			hopBridge.swapAndSend(toChainId, receiver, amount, 28578266354135306662, 0, 0, 0, 0);

			emit ERC20FundsTransferred(receiver, toChainId, amount, tokenAddress);
	}
}
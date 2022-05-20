// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../../interface/L2AMMSwapHop.sol";
import "../../BaseImpl.sol";

contract HopProvider is BaseImpl, Ownable, ReentrancyGuard {
	using SafeERC20 for IERC20;
	L2AMMSwapHop private hopBridge;

	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

	constructor(address _hopBridge) {
		hopBridge = L2AMMSwapHop(_hopBridge);
	}
	
	function transferNative(address _from, address _receiver, uint256 toChainId, address tokenAddress, uint _amount) external payable nonReentrant override {
		if(tokenAddress == NATIVE_TOKEN_ADDRESS) {
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			require(msg.value == _amount, "WagPay: Please send amount same to msg.value");
			hopBridge.swapAndSend{value: _amount}(toChainId, _receiver, _amount, 28578266354135306662, 0, 0, 0, 0);
		} else {
			require(msg.value == 0, "WagPay: msg.value should be zero");
			require(_amount > 0, "WagPay: Please send amount greater than 0");

			IERC20(tokenAddress).safeTransferFrom(_from, address(this), _amount);
			IERC20(tokenAddress).safeIncreaseAllowance(address(hopBridge), _amount);

			hopBridge.swapAndSend(toChainId, _receiver, _amount, 28578266354135306662, 0, 0, 0, 0);
		}
		emit FundsTransferred(_receiver, toChainId, _amount, tokenAddress);
	}
}
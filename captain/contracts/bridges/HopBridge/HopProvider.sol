// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IHop.sol";
import "../../interface/IBridge.sol";

contract HopProvider is IBridge, Ownable, ReentrancyGuard {
	using SafeERC20 for IERC20;

	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
	
	function transferNative(uint amount, 
        address receiver, 
        uint64 toChainId, 
        bytes memory extraData
		) external payable nonReentrant {
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			require(msg.value == amount, "WagPay: Please send amount same to msg.value");
			(address bridgeAddress) = abi.decode(extraData, (address));
			IHop(bridgeAddress).swapAndSend{value: amount}(toChainId, receiver, amount, 28578266354135306662, 0, 0, 0, 0);
			emit NativeFundsTransferred(receiver, toChainId, amount);
	}

	function transferERC20(
		uint64 toChainId,
        address tokenAddress,
        address receiver,
        uint256 amount,
        bytes memory extraData
		) external nonReentrant {

			require(amount > 0, "WagPay: Please send amount greater than 0");
			(address bridgeAddress) = abi.decode(extraData, (address));
			IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
			IERC20(tokenAddress).safeIncreaseAllowance(address(bridgeAddress), amount);

			IHop(bridgeAddress).swapAndSend(toChainId, receiver, amount, 28578266354135306662, 0, 0, 0, 0);

			emit ERC20FundsTransferred(receiver, toChainId, amount, tokenAddress);
	}

	function rescueFunds(address tokenAddr, uint amount) external onlyOwner {
        if (tokenAddr == NATIVE_TOKEN_ADDRESS) {
            uint balance = address(this).balance;
            payable(msg.sender).transfer(balance);
        } else {
            IERC20(tokenAddr).transferFrom(address(this), msg.sender, amount);
        }
    }
}
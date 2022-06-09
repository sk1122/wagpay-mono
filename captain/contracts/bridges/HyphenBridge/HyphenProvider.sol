// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IHyphen.sol";
import "../../interface/IBridge.sol";

contract HyphenProvider is ReentrancyGuard, IBridge, Ownable{
	using SafeERC20 for IERC20;
	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
	
	// Hyphen Liquidty Pool Address
	ILiquidityPool public hyphenLiquidityPool;

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

	function transferERC20(
		uint64 toChainId,
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

	function changePool(address newPool) external onlyOwner {
		hyphenLiquidityPool = ILiquidityPool(newPool);
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
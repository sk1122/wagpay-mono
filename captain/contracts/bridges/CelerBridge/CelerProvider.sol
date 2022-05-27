pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ICeler.sol";

contract CelerProvider is ReentrancyGuard{
    using SafeERC20 for IERC20;

    ICeler public immutable celerRouter;

    event NativeFundsTransferred(address receiver, uint256 toChainId);
	event ERC20FundsTransferred(address receiver, uint256 toChainId, uint256 value, address tokenAddress);

    constructor(address _celerRouter) {
        celerRouter = ICeler(_celerRouter);
    }

	function transferNative(uint amount, address receiver, uint64 toChainId, uint64 nonce, uint32 maxSlippage) external payable nonReentrant {
			require(msg.value == amount, "Wagpay: Please send amount greater than 0");
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			celerRouter.sendNative{value: amount}(receiver, amount, toChainId, nonce, maxSlippage);

			emit NativeFundsTransferred(receiver, toChainId);
	}


	function transferERC20(uint64 toChainId,
        address tokenAddress,
        address receiver,
        uint256 amount,
        uint64 nonce,
        uint32 maxSlippage ) external nonReentrant {

			require(amount > 0, "WagPay: Please send amount greater than 0");

			IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), amount);
			IERC20(tokenAddress).safeIncreaseAllowance(address(celerRouter), amount);

			celerRouter.send(receiver, tokenAddress, amount, toChainId, nonce, maxSlippage);
		
			emit ERC20FundsTransferred(receiver, toChainId, amount, tokenAddress);
	}
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPolygon.sol";
import "../../interface/IBridge.sol";

contract PolygonProvider is ReentrancyGuard, IBridge, Ownable{
	using SafeERC20 for IERC20;
	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
	
	IPolygon public PolygonPOS;
    address public erc20Predicate;

	constructor(address _PolygonPOS,
        address _erc20Predicate) {
		PolygonPOS = IPolygon(_PolygonPOS);
        erc20Predicate = _erc20Predicate;
	}

    function transferNative(uint amount, 
        address receiver, 
        uint64 toChainId,
        bytes memory //extraData
		) external payable nonReentrant {
			require(msg.value == amount, "Wagpay: Please send amount greater than 0");
			require(msg.value != 0, "WagPay: Please send amount greater than 0");
			PolygonPOS.depositEtherFor{value: amount}(receiver);

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
			IERC20(tokenAddress).safeIncreaseAllowance(erc20Predicate, amount);

			PolygonPOS.depositFor(receiver, tokenAddress,abi.encode(amount));
		
			emit ERC20FundsTransferred(receiver, toChainId, amount, tokenAddress);
	}

	function changePool(address newPool) external onlyOwner {
		PolygonPOS = IPolygon(newPool);
	}

    function changeERC20Predicate(address _erc20Predicate) external onlyOwner {
		erc20Predicate = _erc20Predicate;
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
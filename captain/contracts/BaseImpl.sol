// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface BaseImpl {
	event FundsTransferred(address receiver, uint256 toChainId, uint256 value, address tokenAddress);

	function transferNative(address _from, address _receiver, uint256 toChainId, address tokenAddress, uint _amount) external payable;
}
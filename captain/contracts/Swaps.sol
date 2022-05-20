// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract Swaps {

    ISwapRouter public immutable swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    uint24 public constant poolFee = 3000;

    function swapExactInputSingle(address _tokenIn, address _tokenOut, uint256 amountIn) external returns (uint256 amountOut) {

        TransferHelper.safeTransferFrom(_tokenIn, msg.sender, address(this), amountIn);

        TransferHelper.safeApprove(_tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(address _tokenIn, address _tokenOut, uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {

        TransferHelper.safeTransferFrom(_tokenIn, msg.sender, address(this), amountInMaximum);

        TransferHelper.safeApprove(_tokenIn, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            TransferHelper.safeApprove(_tokenIn, address(swapRouter), 0);
            TransferHelper.safeTransfer(_tokenIn, msg.sender, amountInMaximum - amountIn);
        }
    }
}
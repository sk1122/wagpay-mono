// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

contract Swaps {

    IUniswapRouter public constant swapRouter = IUniswapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    address private constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;

    uint24 public constant poolFee = 3000;

    function swapExactInputERC20(address _tokenIn, address _tokenOut, uint256 amountIn) external returns (uint256 amountOut) {

        TransferHelper.safeTransferFrom(_tokenIn, msg.sender, address(this), amountIn);

        TransferHelper.safeApprove(_tokenIn, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp + 120,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputERC20(address _tokenIn, address _tokenOut, uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn) {

        TransferHelper.safeTransferFrom(_tokenIn, msg.sender, address(this), amountInMaximum);

        TransferHelper.safeApprove(_tokenIn, address(swapRouter), amountInMaximum);

        ISwapRouter.ExactOutputSingleParams memory params =
            ISwapRouter.ExactOutputSingleParams({
                tokenIn: _tokenIn,
                tokenOut: _tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp + 120,
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

    function swapExactEthToERC20(address _tokenOut) external payable {
        require(msg.value > 0, "Must pass non 0 ETH amount");

        uint256 deadline = block.timestamp + 120;
        address tokenIn = WMATIC;
        address tokenOut = _tokenOut;
        uint24 fee = 3000;
        address recipient = msg.sender;
        uint256 amountIn = msg.value;
        uint256 amountOutMinimum = 1;
        uint160 sqrtPriceLimitX96 = 0;
        
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams(
            tokenIn,
            tokenOut,
            fee,
            recipient,
            deadline,
            amountIn,
            amountOutMinimum,
            sqrtPriceLimitX96
        );
        
        swapRouter.exactInputSingle{ value: msg.value }(params);
        swapRouter.refundETH();
        
        // refund leftover ETH to user
        (bool success,) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

    function swapEthToExactERC20(address _tokenOut,uint256 tokenOutAmount) external payable {
        require(tokenOutAmount > 0, "Must pass non 0 DAI amount");
        require(msg.value > 0, "Must pass non 0 ETH amount");
        
        uint256 deadline = block.timestamp + 120;
        address tokenIn = WMATIC;
        address tokenOut = _tokenOut;
        uint24 fee = 3000;
        address recipient = msg.sender;
        uint256 amountOut = tokenOutAmount;
        uint256 amountInMaximum = msg.value;
        uint160 sqrtPriceLimitX96 = 0;

        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter.ExactOutputSingleParams(
            tokenIn,
            tokenOut,
            fee,
            recipient,
            deadline,
            amountOut,
            amountInMaximum,
            sqrtPriceLimitX96
        );

        swapRouter.exactOutputSingle{ value: msg.value }(params);
        swapRouter.refundETH();

        // refund leftover ETH to user
        (bool success,) = msg.sender.call{ value: address(this).balance }("");
        require(success, "refund failed");
    }

}
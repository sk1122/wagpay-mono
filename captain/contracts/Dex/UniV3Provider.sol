// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';
import '../interface/IDex.sol';

interface IUniswapRouter is ISwapRouter {
    function refundETH() external payable;
}

contract Swaps is IDex{

    IUniswapRouter public constant swapRouter = IUniswapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564);
    address private constant WMATIC = 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270;

    uint24 public constant poolFee = 3000;

    function swapERC20(address _tokenIn, address _tokenOut, uint amountIn, bytes memory //extraData
        ) external returns (uint amountOut) {

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

            emit ERC20FundsSwapped(amountIn, _tokenIn, _tokenOut, amountOut);
    }

    function swapNative(address _tokenOut, bytes memory //extraData
        ) external payable returns (uint amountOut){
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
            
            amountOut = swapRouter.exactInputSingle{ value: msg.value }(params);
            swapRouter.refundETH();
            
            // refund leftover ETH to user
            (bool success,) = msg.sender.call{ value: address(this).balance }("");
            require(success, "refund failed");

            emit NativeFundsSwapped(_tokenOut, amountIn, amountOut);
    }

}
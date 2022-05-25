// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


interface params {

    struct DexData {
        address dex;
        uint amountToGet;
        uint fees;
        uint chainId;
        address fromToken;
        address toToken;
    }

    struct RouteData {
        address receiver;
        address bridge;
        uint toChain;
        address fromToken;
        uint amount;
        bool dexRequired;
        DexData dex;
    }

}

interface IDex is params{

   function swapExactInputERC20(address _tokenIn, address _tokenOut, uint256 amountIn) external;

   function swapExactOutputERC20(address _tokenIn, address _tokenOut, uint256 amountOut, uint256 amountInMaximum) external;

   function swapExactEthToERC20(address _tokenOut) external payable;

   function swapEthToExactERC20(address _tokenOut,uint256 tokenOutAmount) external payable;

}

interface IBridge {
    function transferNative(uint amount, address receiver, uint256 toChainId, string calldata tag) external payable;
    function transferERC20(uint256 toChainId,
        address tokenAddress,
        address receiver,
        uint256 amount,
        string calldata tag ) external;

}

contract WagpayBridge is params{
	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    function transfer(RouteData memory _route) external payable {

        IDex idex = IDex(_route.dex.dex);
        IBridge bridge = IBridge(_route.bridge);

        if(_route.dexRequired) {
            
            // Dex
            if(_route.dex.fromToken == NATIVE_TOKEN_ADDRESS) {
                idex.swapExactEthToERC20{value: _route.amount}(_route.dex.toToken);
            } else {
                IERC20(_route.dex.fromToken).approve(_route.dex.dex, _route.amount);
                idex.swapExactInputERC20(_route.dex.fromToken, _route.dex.toToken, _route.dex.amountToGet);
            }

            // Bridge
            if(_route.fromToken == NATIVE_TOKEN_ADDRESS) {
                bridge.transferNative{value: _route.dex.amountToGet}(_route.dex.amountToGet, _route.receiver, _route.toChain, "WagPay");
            } else {
                IERC20(_route.fromToken).approve(_route.bridge, _route.dex.amountToGet);
                bridge.transferERC20(_route.toChain, _route.fromToken, _route.receiver, _route.dex.amountToGet, "WagPay");
            }
        } else {
            // Bridge
            if(_route.fromToken == NATIVE_TOKEN_ADDRESS) {
                bridge.transferNative{value: _route.amount}(_route.amount, _route.receiver, _route.toChain, "WagPay");
            } else {
                IERC20(_route.fromToken).approve(_route.bridge, _route.amount);
                bridge.transferERC20(_route.toChain, _route.fromToken, _route.receiver, _route.amount, "WagPay");
            }
        }
    }
}

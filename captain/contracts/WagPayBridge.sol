// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interface/IBridge.sol";
import "./interface/IDex.sol";

contract WagPayBridge {
	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    struct DexData {
        address dex;
        uint amountIn;
        uint fees;
        uint64 chainId;
        address fromToken;
        address toToken;
        bytes extraData;
    }

    struct RouteData {
        address receiver;
        address bridge;
        uint64 toChain;
        address fromToken;
        uint amount;
        bytes extraData;
        bool dexRequired;
        DexData dex;
    }

    function transfer(RouteData memory route) external payable {

        IDex idex = IDex(route.dex.dex);
        IBridge bridge = IBridge(route.bridge);

        if(route.dexRequired) {
            
            // Dex
            if(route.dex.fromToken == NATIVE_TOKEN_ADDRESS) {
                idex.swapNative{value: route.amount}(route.dex.toToken, route.dex.extraData);
            } else {
                IERC20(route.dex.fromToken).approve(route.dex.dex, route.amount);
                idex.swapERC20(route.dex.fromToken, route.dex.toToken, route.dex.amountIn,  route.dex.extraData);
            }

            // Bridge
            if(route.fromToken == NATIVE_TOKEN_ADDRESS) {
                bridge.transferNative{value: route.dex.amountIn}(route.dex.amountIn, route.receiver, route.toChain, "WagPay");
            } else {
                IERC20(route.fromToken).approve(route.bridge, route.dex.amountIn);
                bridge.transferERC20(route.toChain, route.fromToken, route.receiver, route.dex.amountIn, "WagPay");
            }
        } else {
            // Bridge
            if(route.fromToken == NATIVE_TOKEN_ADDRESS) {
                bridge.transferNative{value: route.amount}(route.amount, route.receiver, route.toChain, "WagPay");
            } else {
                IERC20(route.fromToken).approve(route.bridge, route.amount);
                bridge.transferERC20(route.toChain, route.fromToken, route.receiver, route.amount, "WagPay");
            }
        }
    }
}

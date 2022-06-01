// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interface/IBridge.sol";
import "./interface/IDex.sol";

contract WagPayBridge is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _bridgeIds;
	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    mapping(uint => address) bridges;

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
        uint bridgeId;
        uint64 toChain;
        address fromToken;
        uint amount;
        bytes extraData;
        bool dexRequired;
        DexData dex;
    }

    function transfer(RouteData memory route) external payable {

        require(bridges[route.bridgeId] != address(0), "WagPay: Bridge doesn't exist");        

        IDex idex = IDex(route.dex.dex);
        IBridge bridge = IBridge(bridges[route.bridgeId]);

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
                bridge.transferNative{value: route.dex.amountIn}(route.dex.amountIn, route.receiver, route.toChain, route.extraData);
            } else {
                IERC20(route.fromToken).approve(bridges[route.bridgeId], route.dex.amountIn);
                bridge.transferERC20(route.toChain, route.fromToken, route.receiver, route.dex.amountIn, route.extraData);
            }

        } else {
            // Bridge
            if(route.fromToken == NATIVE_TOKEN_ADDRESS) {
                bridge.transferNative{value: route.amount}(route.amount, route.receiver, route.toChain, route.extraData);
            } else {
                IERC20(route.fromToken).approve(bridges[route.bridgeId], route.amount);
                bridge.transferERC20(route.toChain, route.fromToken, route.receiver, route.amount, route.extraData);
            }
        }
    }

    function addBridge(address newBridge) external onlyOwner returns (uint) {
        require(newBridge != address(0), "WagPay: Cannot be a address(0)");
        _bridgeIds.increment();
        uint bridgeId = _bridgeIds.current();
        bridges[bridgeId] = newBridge;
        return bridgeId;
    }

    function removeBridge(uint bridgeId) external onlyOwner {
        require(bridges[bridgeId] != address(0), "WagPay: Bridge doesn't exist");
        bridges[bridgeId] = address(0);
    }

    function getBridge(uint _bridgeId) external view returns (address) {
        return bridges[_bridgeId];
    }
}

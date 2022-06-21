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
    Counters.Counter private _dexIds;
	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);

    mapping(uint => address) bridges;

    mapping(uint => address) dexes;

    struct DexData {
        uint dexId;
        uint amountIn;
        uint amountOut;
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

        IDex idex = IDex(dexes[route.dex.dexId]);
        IBridge bridge = IBridge(bridges[route.bridgeId]);

        if(route.dexRequired) {
            // Dex
            if(route.dex.fromToken == NATIVE_TOKEN_ADDRESS) {
                idex.swapNative{value: route.amount}(route.dex.toToken, route.dex.extraData);
            } else {
                IERC20(route.fromToken).transferFrom(msg.sender, address(this), route.amount);
                IERC20(route.dex.fromToken).approve(dexes[route.dex.dexId], route.amount);
                idex.swapERC20(route.dex.fromToken, route.dex.toToken, route.dex.amountIn,  route.dex.extraData);
            }

            // Bridge
            if(route.dex.toToken == NATIVE_TOKEN_ADDRESS) {
                bridge.transferNative{value: route.dex.amountIn}(route.dex.amountIn, route.receiver, route.toChain, route.extraData);
            } else {
                IERC20(route.dex.toToken).approve(bridges[route.bridgeId], route.dex.amountOut);
                bridge.transferERC20(route.toChain, route.dex.toToken, route.receiver, route.dex.amountOut, route.extraData);
            }

        } else {
            // Bridge
            if(route.fromToken == NATIVE_TOKEN_ADDRESS) {
                bridge.transferNative{value: route.amount}(route.amount, route.receiver, route.toChain, route.extraData);
            } else {
                IERC20(route.fromToken).transferFrom(msg.sender, address(this), route.amount);
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

    function addDex(address newDex) external onlyOwner returns (uint) {
        require(newDex != address(0), "WagPay: Cannot be a address(0)");
        _dexIds.increment();
        uint dexId = _dexIds.current();
        dexes[dexId] = newDex;
        return dexId;
    }

    function removeDex(uint dexId) external onlyOwner {
        require(dexes[dexId] != address(0), "WagPay: Dex doesn't exist");
        dexes[dexId] = address(0);
    }

    function getDex(uint dexId) external view returns (address) {
        return dexes[dexId];
    }

    function rescueFunds(address tokenAddr, uint amount) external onlyOwner {
        if (tokenAddr == NATIVE_TOKEN_ADDRESS) {
            payable(msg.sender).transfer(amount);
        } else {
            IERC20(tokenAddr).transferFrom(address(this), msg.sender, amount);
        }
    }
}

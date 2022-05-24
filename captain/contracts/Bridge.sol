// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

// THIS FILE DOESN'T WORK AT THE MOMENT, WIP

interface IDex {
    function transfer(DexData calldata dex) external;
}

interface IBridge {
    function transferNative(uint amount, address receiver, uint256 toChainId, string calldata tag) external payable;
    function transferERC20(uint256 toChainId,
        address tokenAddress,
        address receiver,
        uint256 amount,
        string calldata tag ) external;

}

contract WagpayBridge {
	address private constant NATIVE_TOKEN_ADDRESS = address(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    
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

    function transfer(RouteData calldata _route) external payable {
        if(_route.dexRequired) {
            IDex dex = IDex(_route.dex.dex);
            IBridge bridge = IBridge(_route.bridge);
            
            // Dex
            if(_route.dex.fromToken == NATIVE_TOKEN_ADDRESS) {
                dex.transfer{value: _route.amount}(_route.dex);
            } else {
                IERC20(_route.dex.fromToken).approve(_route.dex.dex, _route.amount);
                dex.transferERC20(_route.dex);
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

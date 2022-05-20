// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

contract WagpayBridge {
    uint256 immutable chainId = 80001;

    

    modifier checkSourceAndToChainId() {

        _;
    }

    constructor() {}

    function transferNative(uint256 value, address _to, uint256 toChainId) public {
        
    }

    function transferERC20(uint256 value, address _to, uint256 toChainId, address tokenAddress) public {

    }
}

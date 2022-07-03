// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IAggregationExecutor {
    function callBytes(bytes calldata data) external payable;
}
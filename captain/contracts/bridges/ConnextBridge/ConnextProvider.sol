// // SPDX-License-Identifier: AGPL-3.0-only
// pragma solidity ^0.8.14;

// import {IConnextHandler} from "nxtp/core/connext/interfaces/IConnextHandler.sol";
// import {CallParams, XCallArgs} from "nxtp/core/connext/libraries/LibConnextStorage.sol";
// import {ERC20} from "@solmate/tokens/ERC20.sol";

// contract ConnextProvider {
//   event TransferInitiated(address asset, address from, address to);

//   IConnextHandler public immutable connext;

//   constructor(IConnextHandler _connext) {
//     connext = _connext;
//   }

//   function transfer(
//     address to,
//     address asset,
//     uint32 originDomain,
//     uint32 destinationDomain,
//     uint256 amount
//   ) external {
//     ERC20 token = ERC20(asset);

//     token.transferFrom(msg.sender, address(this), amount);

//     token.approve(address(connext), amount);

//     CallParams memory callParams = CallParams({
//       to: to,
//       callData: "", 
//       originDomain: originDomain,
//       destinationDomain: destinationDomain,
//       recovery: to, 
//       callback: address(0), 
//       callbackFee: 0, 
//       forceSlow: false, 
//       receiveLocal: false 
//     });

//     XCallArgs memory xcallArgs = XCallArgs({
//       params: callParams,
//       transactingAssetId: asset,
//       amount: amount,
//       relayerFee: 0 
//     });

//     connext.xcall(xcallArgs);

//     emit TransferInitiated(asset, msg.sender, to);
//   }

//   	function changePool(address newPool) external onlyOwner {
// 		connext = IConnext(newPool);
// 	}

// 	function rescueFunds(address tokenAddr, uint amount) external onlyOwner {
//         if (tokenAddr == NATIVE_TOKEN_ADDRESS) {
//             uint balance = address(this).balance;
//             payable(msg.sender).transfer(balance);
//         } else {
//             IERC20(tokenAddr).transferFrom(address(this), msg.sender, amount);
//         }
//     }
// }
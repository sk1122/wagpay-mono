// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract Providers is Ownable {
	address[] whitelist_addresses;
	uint provider_count;

	struct Provider {
		address[] provider_whitelist;
		string name;
		string provider_sign;
		bool approved;
	}

	mapping(uint => Provider) providers;
	mapping(uint => Provider) pending_providers;
	mapping(uint => address[]) pending_providers_vote;

	modifier only_whitelisted_address {
		bool found = false;
		
		for(uint i = 0; i < whitelist_addresses.length;) {
			if(whitelist_addresses[i] == msg.sender) {
				found = true;
				break;
			}
			
			unchecked {
				i++;
			}
		}

		if(!found) {
			revert("F: not allowed ser")
		}

		_;
	}

	event NewProvider(uint provider_id, Provider provider);
	event ApproveProvider(uint provider_id, address approver);
	event DeleteProvider(uint provider_id, Provider provider);
	event UpdateProvider(uint provider_id, Provider provider);

	constructor(address[] calldata _whitelist_addresses) {
		provider_count = 0;
		whitelist_addresses = _whitelist_addresses;
	}

	function add_provider(Provider memory provider) public only_whitelisted_address {
		pending_providers[provider_count] = provider;
		pending_providers_vote[provider_count].push(msg.sender);
		provider_count++;

		emit NewProvider(provider_count - 1, provider);
		emit ApproveProvider(provider_id, msg.sender);
	}

	function approve_provider(uint provider_id) public only_whitelisted_address {
		pending_providers_vote[provider_id].push(msg.sender);
		
		emit ApproveProvider(provider_id, msg.sender);
	}
}

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract NPCI {
    struct Provider {
        uint id;
        string name;
        address[] whitelisted_contract;
    }

    struct ProviderProposal {
        address proposer;
        string name;
        string[] links;
        string description;
        address[] votes;
    }

    Provider[] providers;
    ProviderProposal[] provider_proposals;
    uint required_votes;

    function addProvider(string calldata _name, string[] calldata _links, string calldata _description, address _proposer) external {
        address[] memory a;
        ProviderProposal memory proposal = ProviderProposal(proposer, _name, _links, _description, a);
        provider_proposals.push(proposal);
    }

    function approveProvider(uint proposalId) external {
        require(provider_proposals[proposalId].votes.length > required_votes, "NO ENTRY");
        
        address[] memory a;
        Provider memory provider = Provider(providers.length, provider_proposals[proposalId].name, a);
        providers.push(provider);

        NFT.mint(proposer);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IMyToken {
    function getPastVotes(address, uint256) external view returns (uint256);
}

contract TokenizedBallot {
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    IMyToken public tokenContract;
    Proposal[] public proposals;
    uint256 public targetBlockNumber;
    mapping(address => uint256) public spentVotingPower;

    constructor(
        bytes32[] memory _proposalNames,
        address _tokenContract,
        uint256 _targetBlockNumber
    ) {
        tokenContract = IMyToken(_tokenContract);
        targetBlockNumber = _targetBlockNumber;
        // Validate if targetBlockNumber is in the past
        for (uint i = 0; i < _proposalNames.length; i++) {
            proposals.push(Proposal({name: _proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        uint256 senderVotingPower = getVotingPower(msg.sender);
        //does voter have the voting power to vote the amount they want to vote
        require(
            senderVotingPower >= amount,
            "Toeknized Ballot: Insufficient voting power."
        );

        //check validity of proposal index
        require(proposal < proposals.length, "Invalid proposal index");

        //increase the spent and proposal votes by amount
        spentVotingPower[msg.sender] += amount;
        proposals[proposal].voteCount += amount;
    }

    function getVotingPower(
        address voter
    ) public view returns (uint256 votingPower_) {
        votingPower_ =
            tokenContract.getPastVotes(voter, targetBlockNumber) -
            spentVotingPower[voter];
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}

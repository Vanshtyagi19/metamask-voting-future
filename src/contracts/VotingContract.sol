
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VotingContract {
    // State variables
    mapping(address => bool) public hasVoted;
    mapping(uint256 => uint256) public votesCount;
    address public owner;

    // Events
    event VoteCast(address indexed voter, uint256 candidateId);
    event VoteReset(address indexed voter);

    constructor() {
        owner = msg.sender;
        // Initialize with some initial votes for demonstration
        votesCount[1] = 14;
        votesCount[2] = 12;
        votesCount[3] = 9;
        votesCount[4] = 7;
    }

    // Cast a vote
    function castVote(uint256 candidateId) external {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateId >= 1 && candidateId <= 4, "Invalid candidate ID");

        hasVoted[msg.sender] = true;
        votesCount[candidateId]++;

        emit VoteCast(msg.sender, candidateId);
    }

    // Check if an address has voted
    function checkVoted(address voter) external view returns (bool) {
        return hasVoted[voter];
    }

    // Get votes for a specific candidate
    function getVotes(uint256 candidateId) external view returns (uint256) {
        return votesCount[candidateId];
    }

    // Reset vote for testing purposes (this would be removed in production)
    function resetVote(address voter) external {
        require(msg.sender == owner, "Only owner can reset votes");
        hasVoted[voter] = false;
        emit VoteReset(voter);
    }

    // Get all results at once
    function getAllResults() external view returns (uint256[4] memory) {
        return [votesCount[1], votesCount[2], votesCount[3], votesCount[4]];
    }
}

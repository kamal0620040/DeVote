// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Voting {
    address admin;
    uint256 nextElectionId;

    constructor(){
        admin = msg.sender;
    }

    struct Election{
        string uri;
        address owner;
        uint256 endTime;
        uint256[] votes; // [1,2] => 1 vote for 1st option and 2 votes for 2nd
        mapping(address => bool) members;
        mapping (address => bool) requestedMembers;
        mapping(address => bool) voted;
        uint256 options;
    }

    mapping(uint256 => Election) elections;

    event ElectionCreated(
        address indexed owner,
        uint256 indexed electionId,
        uint256 indexed createdAt,
        uint256 endTime
    );
    event Voted(
        address indexed voter,
        uint256 indexed voteId,
        uint256 indexed option,
        uint256 createdAt
    );

    modifier isMemberOfElection(uint256 electionId){
        require(elections[electionId].members[msg.sender],'not member of election');
        _;
    }

    modifier hasSendRequstToBecomeMember(uint256 electionId){
        require(elections[electionId].requestedMembers[msg.sender],'didnot send request to become memeber');
        _;
    }

    modifier onlyAdmin() {
        require(admin == msg.sender, "you are not admin");
        _;
    }

    modifier canVote(uint256 electionId, uint256 option) {
        require(electionId < nextElectionId, "election does not exist");
        require(option < elections[electionId].options, "invalid option");
        require(!elections[electionId].voted[msg.sender], "you have already voted");
        require(block.timestamp <= elections[electionId].endTime, "vote has ended");
        _;
    }

    function isAdmin() public view returns (bool) {
        return (msg.sender == admin);
    }

    function getAdmin() public view returns (address) {
        return (admin);
    }

    function createElection(
        string memory uri,
        uint256 endTime,
        uint options
    ) external onlyAdmin {
        require(options >= 2, 'Election should at least have two participants');
        require(endTime > block.timestamp, "end time can't be in past");
        uint256 electionId = nextElectionId;

        elections[electionId].uri = uri;
        elections[electionId].owner = msg.sender;
        elections[electionId].endTime = endTime;
        elections[electionId].options = options;
        elections[electionId].votes = new uint256[](options);
        emit ElectionCreated(msg.sender, electionId, block.timestamp, endTime);
        nextElectionId++;
    }

    function vote(
        uint256 electionId,
        uint256 option
    ) external isMemberOfElection(electionId) canVote(electionId, option) {
        elections[electionId].votes[option] = elections[electionId].votes[option] + 1;
        elections[electionId].voted[msg.sender] = true;
        emit Voted(msg.sender, electionId, option, block.timestamp);
    }

    function getVote(
        uint256 electionId
    ) public view returns (string memory, address, uint256[] memory, uint256) {
        return (
            elections[electionId].uri,
            elections[electionId].owner,
            elections[electionId].votes,
            elections[electionId].endTime
        );
    }

}
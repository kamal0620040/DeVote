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
        address[] members;
        address[] requestedMembers;
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
        uint256 indexed electionId,
        uint256 indexed option,
        uint256 createdAt
    );

    modifier isMemberOfElection(uint256 electionId){
        require(isMember(electionId, msg.sender), 'Not a member of the election');
        _;
    }

    modifier hasSendRequstToBecomeMember(uint256 electionId){
        require(hasRequestedMembership(electionId), 'Did not send a request to become a member');
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

    function isMember(uint256 electionId, address member) public view returns (bool) {
        Election storage election = elections[electionId];

        for (uint256 i = 0; i < election.members.length; i++) {
            if (election.members[i] == member) {
                return true;
            }
        }

        return false;
    }

    function checkIsReqSenderMember(uint electionId) public view returns(bool) {
        return isMember(electionId, msg.sender);
    }

    function hasRequestedMembership(uint256 electionId) public view returns (bool) {
        Election storage election = elections[electionId];

        for (uint256 i = 0; i < election.requestedMembers.length; i++) {
            if (election.requestedMembers[i] == msg.sender) {
                return true;
            }
        }

        return false;
    }

    function acceptRequestToBecomeMember(uint256 electionId, address member) external onlyAdmin {
        Election storage election = elections[electionId];
        // delete the member form requested array
        for (uint256 i = 0; i < election.requestedMembers.length; i++) {
            if(election.requestedMembers[i] == member){
                // election.requestedMembers[i];
                if(election.requestedMembers.length > 1){
                    election.requestedMembers[i] = election.requestedMembers[election.requestedMembers.length - 1];
                    election.requestedMembers.pop();
                }else{
                    election.requestedMembers.pop();
                }
            }
        }
        // add the member to the election member array
        election.members.push(member);
    }
    
    function getCurrentPK() public view returns (address) {
        return msg.sender;
    }

    function sendRequestToBecomeMember(uint256 electionId) external {
        require(electionId < nextElectionId, "Election does not exist");
        require(!isMember(electionId, msg.sender), "Already a member");
        require(!hasRequestedMembership(electionId), "Request already sent");

        elections[electionId].requestedMembers.push(msg.sender);
    }

    function getRequestedMembers(uint256 electionId) public view onlyAdmin returns (address[] memory) {
        return elections[electionId].requestedMembers;
    }


    function getAllElections() public view returns (
        string[] memory,
        address[] memory,
        uint256[] memory,
        uint256[] memory
    ) {
        string[] memory uris = new string[](nextElectionId);
        address[] memory owners = new address[](nextElectionId);
        uint256[] memory endTimes = new uint256[](nextElectionId);
        uint256[] memory electionIds = new uint256[](nextElectionId);

        for (uint256 i = 0; i < nextElectionId; i++) {
            Election storage election = elections[i];
            uris[i] = election.uri;
            owners[i] = election.owner;
            endTimes[i] = election.endTime;
            electionIds[i] = i;
        }

        return (uris, owners, endTimes, electionIds);
    }

}
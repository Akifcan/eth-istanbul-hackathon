// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BuyItem {
    struct PurchaseInfo {
        uint256 productId;
        string productSlug;
        uint256 amount;
        uint256 timestamp;
    }

    uint256 public endDate;
    uint256 public participantCount;
    uint256 public maxParticipantCount;
    uint256 public productId;
    string public productSlug;

    mapping(address => PurchaseInfo[]) public purchases;
    mapping(address => uint256) public deposits;
    mapping(address => bool) public hasParticipated;

    constructor(uint256 _endDate, uint256 _maxParticipantCount, uint256 _productId, string memory _productSlug) {
        require(_endDate > block.timestamp, "End date must be in the future");
        require(_maxParticipantCount > 0, "Max participant count must be greater than 0");
        endDate = _endDate;
        maxParticipantCount = _maxParticipantCount;
        productId = _productId;
        productSlug = _productSlug;
        participantCount = 0;
    }

    function purchase(uint256 amount) external payable {
        require(msg.value == amount, "Sent ETH must equal amount");
        require(participantCount < maxParticipantCount, "Maximum participant limit reached");

        if (!hasParticipated[msg.sender]) {
            hasParticipated[msg.sender] = true;
            participantCount++;
        }

        purchases[msg.sender].push(PurchaseInfo({
            productId: productId,
            productSlug: productSlug,
            amount: amount,
            timestamp: block.timestamp
        }));

        deposits[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getParticipantInfo() external view returns (uint256 currentParticipants, uint256 maxParticipants, uint256 contractEndDate, uint256 contractProductId, string memory contractProductSlug) {
        return (participantCount, maxParticipantCount, endDate, productId, productSlug);
    }

    function withdraw() external {
        require(block.timestamp <= endDate, "Withdrawals are closed after endDate");

        uint256 balance = deposits[msg.sender];
        require(balance > 0, "No balance to withdraw");

        deposits[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
}
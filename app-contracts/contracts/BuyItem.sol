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

    mapping(address => PurchaseInfo[]) public purchases;
    mapping(address => uint256) public deposits;

    constructor(uint256 _endDate) {
        require(_endDate > block.timestamp, "End date must be in the future");
        endDate = _endDate;
    }

    function purchase(uint256 productId, string calldata productSlug, uint256 amount) external payable {
        require(msg.value == amount, "Sent ETH must equal amount");

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

    function withdraw() external {
        require(block.timestamp <= endDate, "Withdrawals are closed after endDate");

        uint256 balance = deposits[msg.sender];
        require(balance > 0, "No balance to withdraw");

        deposits[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
}
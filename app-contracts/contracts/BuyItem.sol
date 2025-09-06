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
    uint256 public normalPrice;
    uint256 public discountedPrice;

    mapping(address => PurchaseInfo[]) public purchases;
    mapping(address => uint256) public deposits;
    mapping(address => bool) public hasParticipated;

    constructor(uint256 _endDate, uint256 _maxParticipantCount, uint256 _productId, string memory _productSlug, uint256 _normalPrice, uint256 _discountedPrice) {
        require(_endDate > block.timestamp, "End date must be in the future");
        require(_maxParticipantCount > 0, "Max participant count must be greater than 0");
        require(_normalPrice > 0, "Normal price must be greater than 0");
        require(_discountedPrice > 0, "Discounted price must be greater than 0");
        require(_discountedPrice <= _normalPrice, "Discounted price must be less than or equal to normal price");
        
        endDate = _endDate;
        maxParticipantCount = _maxParticipantCount;
        productId = _productId;
        productSlug = _productSlug;
        normalPrice = _normalPrice;
        discountedPrice = _discountedPrice;
        participantCount = 0;
    }

    function purchase() external payable {
        require(msg.value == discountedPrice, "Sent ETH must equal discounted price");
        require(participantCount < maxParticipantCount, "Maximum participant limit reached");

        if (!hasParticipated[msg.sender]) {
            hasParticipated[msg.sender] = true;
            participantCount++;
        }

        purchases[msg.sender].push(PurchaseInfo({
            productId: productId,
            productSlug: productSlug,
            amount: discountedPrice,
            timestamp: block.timestamp
        }));

        deposits[msg.sender] += msg.value;
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getParticipantInfo() external view returns (uint256 currentParticipants, uint256 maxParticipants, uint256 contractEndDate, uint256 contractProductId, string memory contractProductSlug, string memory normalPriceETH, string memory discountedPriceETH) {
        string memory normalPriceStr = weiToEthString(normalPrice);
        string memory discountedPriceStr = weiToEthString(discountedPrice);
        
        return (participantCount, maxParticipantCount, endDate, productId, productSlug, normalPriceStr, discountedPriceStr);
    }
    
    function weiToEthString(uint256 weiAmount) internal pure returns (string memory) {
        uint256 ethWhole = weiAmount / 1 ether;
        uint256 ethDecimals = weiAmount % 1 ether;
        
        uint256 decimals3 = ethDecimals / 1e15; 
        
        return string(abi.encodePacked(uintToString(ethWhole), ".", padDecimals(decimals3), " ETH"));
    }
    
    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function padDecimals(uint256 decimals) internal pure returns (string memory) {
        if (decimals < 10) {
            return string(abi.encodePacked("00", uintToString(decimals)));
        } else if (decimals < 100) {
            return string(abi.encodePacked("0", uintToString(decimals)));
        } else {
            return uintToString(decimals);
        }
    }

    function withdraw() external {
        require(block.timestamp <= endDate, "Withdrawals are closed after endDate");

        uint256 balance = deposits[msg.sender];
        require(balance > 0, "No balance to withdraw");

        deposits[msg.sender] = 0;
        payable(msg.sender).transfer(balance);
    }
}
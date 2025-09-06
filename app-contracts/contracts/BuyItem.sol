// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BuyItem {
    struct PurchaseInfo {
        uint256 amount;
        uint256 timestamp;
        string fullName;
        string userAddress;
        string phoneNumber;
    }

    struct Offer {
        uint256 price;
        string productName;
        string productLink;
        address walletAddress;
    }

    uint256 public endDate;
    uint256 public participantCount;
    uint256 public maxParticipantCount;
    uint256 public price;
    bool public isFinalized;
    uint256 public finalPrice;
    address public owner;
    string public title;
    string public description;

    Offer[] public offers;
    address[] public participants;

    mapping(address => PurchaseInfo[]) public purchases;
    mapping(address => uint256) public deposits;
    mapping(address => bool) public hasParticipated;

    constructor(uint256 _maxParticipantCount, uint256 _price, string memory _title, string memory _description, string memory _creatorName, string memory _creatorAddress, string memory _creatorPhone) payable {
        require(_maxParticipantCount > 0, "Max participant count must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        require(msg.value == _price, "Must send exact price amount");
        
        endDate = block.timestamp + 7 days; // 1 week from now
        maxParticipantCount = _maxParticipantCount;
        price = _price;
        title = _title;
        description = _description;
        participantCount = 1; // Contract creator is first participant
        isFinalized = false;
        owner = 0xEb4Df82103eC493614c15F96cCD2be93c69cF099; // Fixed owner address
        
        // Add contract creator as first participant
        hasParticipated[msg.sender] = true;
        participants.push(msg.sender);
        
        // Add creator's purchase info
        purchases[msg.sender].push(PurchaseInfo({
            amount: price,
            timestamp: block.timestamp,
            fullName: _creatorName,
            userAddress: _creatorAddress,
            phoneNumber: _creatorPhone
        }));
        
        deposits[msg.sender] += msg.value;
    }

    function submitOffer(uint256 _price, string memory _productName, string memory _productLink) external {
        offers.push(Offer({
            price: _price,
            productName: _productName,
            productLink: _productLink,
            walletAddress: msg.sender
        }));
    }

    function purchase(string memory _fullName, string memory _userAddress, string memory _phoneNumber) external payable {
        require(msg.value == price, "Sent ETH must equal price");
        require(participantCount < maxParticipantCount, "Maximum participant limit reached");
        require(!isFinalized, "Purchase period has ended");

        if (!hasParticipated[msg.sender]) {
            hasParticipated[msg.sender] = true;
            participantCount++;
            participants.push(msg.sender);
        }

        purchases[msg.sender].push(PurchaseInfo({
            amount: price,
            timestamp: block.timestamp,
            fullName: _fullName,
            userAddress: _userAddress,
            phoneNumber: _phoneNumber
        }));

        deposits[msg.sender] += msg.value;
    }

    function finalize() external {
        require(msg.sender == owner, "Only owner can finalize");
        require(!isFinalized, "Already finalized");
        require(offers.length > 0, "No offers available");
        require(participantCount > 0, "No participants");

        uint256 lowestPrice = offers[0].price;
        address winnerSeller = offers[0].walletAddress;
        for (uint256 i = 1; i < offers.length; i++) {
            if (offers[i].price < lowestPrice) {
                lowestPrice = offers[i].price;
                winnerSeller = offers[i].walletAddress;
            }
        }

        finalPrice = lowestPrice;
        isFinalized = true;

        // Calculate total sale amount (final price * participants)
        uint256 totalSaleAmount = finalPrice * participantCount;
        
        // Calculate commission (10% to owner)
        uint256 commission = (totalSaleAmount * 10) / 100;
        uint256 sellerAmount = totalSaleAmount - commission;

        // Calculate savings per participant
        uint256 totalSavings = (price - finalPrice) * participantCount;
        uint256 savingsPerParticipant = totalSavings / participantCount;

        // Distribute savings to participants
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            if (savingsPerParticipant > 0) {
                payable(participant).transfer(savingsPerParticipant);
            }
        }
        
        payable(owner).transfer(commission);
        payable(winnerSeller).transfer(sellerAmount);
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getOffers() external view returns (Offer[] memory) {
        return offers;
    }

    function getOffersCount() external view returns (uint256) {
        return offers.length;
    }

    function getAllPurchases() external view returns (PurchaseInfo[] memory) {
        // Calculate total number of purchases
        uint256 totalPurchases = 0;
        for (uint256 i = 0; i < participants.length; i++) {
            totalPurchases += purchases[participants[i]].length;
        }

        // Create array to hold all purchases
        PurchaseInfo[] memory allPurchases = new PurchaseInfo[](totalPurchases);
        uint256 index = 0;

        // Collect all purchases from all participants
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            PurchaseInfo[] memory participantPurchases = purchases[participant];
            
            for (uint256 j = 0; j < participantPurchases.length; j++) {
                allPurchases[index] = participantPurchases[j];
                index++;
            }
        }

        return allPurchases;
    }


    function getParticipantInfo() external view returns (uint256 currentParticipants, uint256 maxParticipants, uint256 contractEndDate, string memory priceETH, string memory contractTitle, string memory contractDescription) {
        string memory priceStr = weiToEthString(price);
        
        return (participantCount, maxParticipantCount, endDate, priceStr, title, description);
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
        require(!isFinalized, "Cannot withdraw after finalization");
        require(hasParticipated[msg.sender], "You are not a participant");

        uint256 balance = deposits[msg.sender];
        require(balance > 0, "No balance to withdraw");

        // Remove participant from hasParticipated mapping
        hasParticipated[msg.sender] = false;
        
        // Decrease participant count
        participantCount--;
        
        // Remove from participants array
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == msg.sender) {
                participants[i] = participants[participants.length - 1];
                participants.pop();
                break;
            }
        }
        
        // Clear all purchases for this participant
        delete purchases[msg.sender];
        
        // Clear deposits
        deposits[msg.sender] = 0;
        
        // Transfer money back
        payable(msg.sender).transfer(balance);
    }
}
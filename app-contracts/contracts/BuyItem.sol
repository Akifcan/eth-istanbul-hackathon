// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BuyItem {

    struct Offer {
        uint256 price;
        string productName;
        string productLink;
        address walletAddress;
    }

    uint256 public endDate;
    // participantCount removed - will be calculated from participants.length
    uint256 public maxParticipantCount;
    uint256 public price;
    bool public isFinalized;
    uint256 public finalPrice;
    address public owner;
    string public title;
    string public description;
    address public senderCompany;

    Offer[] public offers;
    address[] public participants;

    mapping(address => uint256) public deposits;
    mapping(address => bool) public hasParticipated;

    constructor(uint256 _maxParticipantCount, uint256 _price, string memory _title, string memory _description) payable {
        require(_maxParticipantCount > 0, "Max participant count must be greater than 0");
        require(_price > 0, "Price must be greater than 0");
        require(msg.value == _price, "Must send exact price amount");
        
        endDate = block.timestamp + 7 days; // 1 week from now
        maxParticipantCount = _maxParticipantCount;
        price = _price;
        title = _title;
        description = _description;
        // participantCount removed - using participants.length instead
        isFinalized = false;
        owner = 0xEb4Df82103eC493614c15F96cCD2be93c69cF099; // Fixed owner address
        senderCompany = address(0); // Initially null
        
        // Add contract creator as first participant
        hasParticipated[msg.sender] = true;
        participants.push(msg.sender);
        
        deposits[msg.sender] += msg.value;
    }

    function submitOffer(uint256 _price, string memory _productName, string memory _productLink) external payable {
        require(msg.value == price, "Must send exact campaign price to submit offer");
        require(participants.length < maxParticipantCount, "Maximum participant limit reached");
        require(!isFinalized, "Offer submission period has ended");
        require(block.timestamp <= endDate, "Campaign has expired");

        // Add offer to offers array
        offers.push(Offer({
            price: _price,
            productName: _productName,
            productLink: _productLink,
            walletAddress: msg.sender
        }));

        // Add sender as participant if not already participated
        if (!hasParticipated[msg.sender]) {
            hasParticipated[msg.sender] = true;
            participants.push(msg.sender);
        }

        // Record deposit
        deposits[msg.sender] += msg.value;
    }

    function purchase() external payable {
        require(msg.value == price, "Must send exact campaign price");
        require(participants.length < maxParticipantCount, "Maximum participant limit reached");
        require(!isFinalized, "Campaign has ended");
        require(block.timestamp <= endDate, "Campaign has expired");
        require(!hasParticipated[msg.sender], "You have already participated");

        // Add sender as participant
        hasParticipated[msg.sender] = true;
        participants.push(msg.sender);

        // Record deposit
        deposits[msg.sender] += msg.value;
    }

    function finalize() external {
        require(msg.sender == owner, "Only owner can finalize");
        require(!isFinalized, "Already finalized");
        require(offers.length > 0, "No offers available");
        require(participants.length > 0, "No participants");
        // require(participantCount == maxParticipantCount, "Participant count must reach maximum");

        uint256 lowestPrice = offers[0].price;
        address winnerSeller = offers[0].walletAddress;
        for (uint256 i = 1; i < offers.length; i++) {
            if (offers[i].price < lowestPrice) {
                lowestPrice = offers[i].price;
                winnerSeller = offers[i].walletAddress;
            }
        }

        finalPrice = lowestPrice;
        senderCompany = winnerSeller; // Set winner company
        isFinalized = true;

        // Calculate total sale amount (final price * participants)
        uint256 totalSaleAmount = finalPrice * participants.length;
        
        // Calculate commission (10% to owner)
        uint256 commission = (totalSaleAmount * 10) / 100;
        uint256 sellerAmount = totalSaleAmount - commission;

        // Calculate savings per participant
        uint256 totalSavings = (price - finalPrice) * participants.length;
        uint256 savingsPerParticipant = totalSavings / participants.length;

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



    function getParticipantInfo() external view returns (uint256 currentParticipants, uint256 maxParticipants, uint256 contractEndDate, string memory priceETH, string memory contractTitle, string memory contractDescription, address contractSenderCompany, bool contractIsFinalized) {
        string memory priceStr = weiToEthString(price);
        
        return (participants.length, maxParticipantCount, endDate, priceStr, title, description, senderCompany, isFinalized);
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
        
        // Remove from participants array
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == msg.sender) {
                participants[i] = participants[participants.length - 1];
                participants.pop();
                break;
            }
        }
        
        
        // Clear deposits
        deposits[msg.sender] = 0;
        
        // Transfer money back
        payable(msg.sender).transfer(balance);
    }
}
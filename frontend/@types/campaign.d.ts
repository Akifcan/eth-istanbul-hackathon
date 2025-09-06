interface CampaignProps {
    id: number
    transaction: string
    createdWallet: string
    createdAt: string
}

interface ContractInfo {
    currentParticipants: bigint;
    maxParticipants: bigint;
    contractEndDate: string;
    priceETH: string;
    contractTitle: string;
    contractDescription: string;
    senderCompany: string;
    isFinalized: boolean;
}

interface CampaignCardProps {
    campaign: {
        id: number;
        transaction: string;
        createdWallet: string;
        createdAt: string;
        contractTitle: string;
        contractDescription: string;
    };
}

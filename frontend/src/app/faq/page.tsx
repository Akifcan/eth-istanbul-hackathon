'use client';
import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        question: "What is Sway?",
        answer: "Sway is a Web3-based platform that enables users to purchase products at lower prices through bulk buying. You can make secure and transparent transactions using blockchain technology."
    },
    {
        question: "How does it work?",
        answer: "1. A user creates a bulk purchase contract for a product\n2. Other users join by depositing ETH\n3. Sellers submit their best price offers\n4. The lowest offer wins\n5. The price difference is refunded to participants"
    },
    {
        question: "Can I use it without a MetaMask wallet?",
        answer: "No, since Sway is a blockchain-based platform, you need MetaMask or a compatible Web3 wallet to perform secure transactions."
    },
    {
        question: "Can I get my money back?",
        answer: "Yes, you can withdraw your money using the withdraw function before the contract is finalized. After finalization, the transaction is completed and refunds are not possible."
    },
    {
        question: "What is the commission rate?",
        answer: "The platform takes a 10% commission. The remaining 90% goes to the winning seller. Participants save money from the price difference."
    },
    {
        question: "Is there a minimum participant requirement?",
        answer: "The minimum participant count is set by the contract creator for each contract. Usually, it requires 2 or more people."
    },
    {
        question: "How long do contracts last?",
        answer: "Contracts remain active for 7 days. During this period, participation occurs and offers are collected."
    },
    {
        question: "How can I submit an offer as a seller?",
        answer: "You can submit offers by viewing active contracts and entering the product name, price, and product link. The seller with the lowest offer wins."
    },
    {
        question: "Which blockchain network does it run on?",
        answer: "We currently operate on the Ethereum Sepolia testnet. Migration to mainnet and other networks is planned for the future."
    },
    {
        question: "Are my transactions secure?",
        answer: "Yes, all transactions are executed through smart contracts on the blockchain. This ensures transparent, secure, and immutable transactions."
    }
];

export default function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-center mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-gray-400 text-center mb-12">
                        Everything you need to know about Sway
                    </p>

                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg border border-gray-700">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-750 transition-colors duration-200"
                                >
                                    <h3 className="font-semibold text-lg">
                                        {faq.question}
                                    </h3>
                                    <svg
                                        className={`w-5 h-5 transform transition-transform duration-200 ${
                                            openIndex === index ? 'rotate-180' : ''
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-4">
                                        <div className="pt-2 border-t border-gray-700">
                                            <p className="text-gray-300 whitespace-pre-line">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
'use client';
import { useState, useEffect } from 'react';

const steps = [
    {
        id: 1,
        title: "Create Contract",
        description: "A user creates a bulk purchase contract for a desired product with minimum participant count and price.",
        icon: "📝",
        color: "blue"
    },
    {
        id: 2,
        title: "Join Campaign",
        description: "Other users discover the contract and join by depositing ETH. Each participant provides their details.",
        icon: "👥",
        color: "green"
    },
    {
        id: 3,
        title: "Sellers Bid",
        description: "Sellers view active contracts and submit competitive offers with product links and pricing.",
        icon: "💰",
        color: "yellow"
    },
    {
        id: 4,
        title: "Smart Selection",
        description: "The smart contract automatically selects the lowest offer when the campaign is finalized.",
        icon: "🤖",
        color: "purple"
    },
    {
        id: 5,
        title: "Save & Receive",
        description: "Participants receive their savings as refunds, and the winning seller gets paid automatically.",
        icon: "🎉",
        color: "pink"
    }
];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setActiveStep(prev => prev === 5 ? 1 : prev + 1);
        }, 3000);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
            {/* Hero Section */}
            <div className="relative pt-20 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className={`text-6xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        How <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AllyBuy</span> Works
                    </h1>
                    <p className={`text-xl text-gray-400 max-w-3xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        Experience the power of collective buying through blockchain technology. 
                        Save money, ensure transparency, and join a community of smart shoppers.
                    </p>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
            </div>

            {/* Interactive Steps Section */}
            <div className="container mx-auto px-4 pb-20">
                {/* Timeline Navigation */}
                <div className="flex justify-center mb-16">
                    <div className="flex items-center space-x-4 bg-gray-800/50 backdrop-blur-sm rounded-full p-2">
                        {steps.map((step) => (
                            <button
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                                    activeStep === step.id 
                                        ? 'bg-blue-600 scale-110 shadow-lg shadow-blue-600/30' 
                                        : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            >
                                {step.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Active Step Display */}
                <div className="max-w-6xl mx-auto">
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={`transition-all duration-700 ${
                                activeStep === step.id 
                                    ? 'opacity-100 translate-x-0' 
                                    : 'opacity-0 translate-x-10 absolute'
                            }`}
                        >
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                {/* Content */}
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`text-6xl p-4 rounded-2xl bg-gradient-to-br from-${step.color}-500/20 to-${step.color}-600/20 border border-${step.color}-500/30`}>
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-bold">{step.title}</h2>
                                            <div className={`text-sm font-semibold text-${step.color}-400 uppercase tracking-wider`}>
                                                Step {step.id} of 5
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xl text-gray-300 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Visual */}
                                <div className="relative">
                                    <div className="aspect-square max-w-md mx-auto relative">
                                        {/* Animated Circle */}
                                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-${step.color}-500/20 to-${step.color}-600/20 border-2 border-${step.color}-500/50 animate-spin-slow`}></div>
                                        
                                        {/* Center Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className={`text-8xl p-8 rounded-full bg-gray-800/80 backdrop-blur-sm border border-${step.color}-500/30 animate-pulse`}>
                                                {step.icon}
                                            </div>
                                        </div>

                                        {/* Orbiting Elements */}
                                        <div className="absolute inset-0">
                                            <div className={`absolute top-4 left-1/2 w-4 h-4 bg-${step.color}-500 rounded-full animate-bounce`}></div>
                                            <div className={`absolute bottom-4 right-1/4 w-3 h-3 bg-${step.color}-400 rounded-full animate-bounce delay-300`}></div>
                                            <div className={`absolute top-1/3 left-4 w-2 h-2 bg-${step.color}-300 rounded-full animate-bounce delay-700`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-800/30 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Why Choose <span className="text-blue-400">AllyBuy</span>?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "🔒",
                                title: "Blockchain Secure",
                                description: "All transactions are secured by smart contracts on the blockchain"
                            },
                            {
                                icon: "💸",
                                title: "Guaranteed Savings",
                                description: "Bulk buying power means lower prices for everyone"
                            },
                            {
                                icon: "🌍",
                                title: "Global Community",
                                description: "Join buyers from around the world for better deals"
                            }
                        ].map((benefit, index) => (
                            <div
                                key={index}
                                className="text-center p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:transform hover:scale-105"
                            >
                                <div className="text-6xl mb-4">{benefit.icon}</div>
                                <h3 className="text-2xl font-bold mb-4">{benefit.title}</h3>
                                <p className="text-gray-400">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Start Saving?
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join thousands of smart shoppers who are already saving money through collective buying power.
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-600/30">
                        Get Started Now
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
}
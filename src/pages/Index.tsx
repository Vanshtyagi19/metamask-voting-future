
import React from 'react';
import Header from '@/components/Header';
import VotingSection from '@/components/VotingSection';
import ResultsSection from '@/components/ResultsSection';
import { BlockchainProvider } from '@/contexts/BlockchainContext';

const Index = () => {
  return (
    <BlockchainProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        
        <main className="flex-1">
          <VotingSection />
          <div className="border-t border-gray-200 my-8"></div>
          <ResultsSection />
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">BlockVote</h2>
            <p className="mb-4">A secure and transparent voting platform powered by blockchain technology</p>
            <p className="text-gray-400 text-sm">
              This is a demonstration project. In a production environment, a real smart contract 
              would be deployed to the Ethereum blockchain.
            </p>
          </div>
        </footer>
      </div>
    </BlockchainProvider>
  );
};

export default Index;


import React from 'react';
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/contexts/BlockchainContext';
import { Loader2 } from 'lucide-react';

const Header = () => {
  const { account, isConnected, isLoading, connectWallet, disconnectWallet } = useBlockchain();

  return (
    <header className="bg-gradient-to-r from-vote-blue to-vote-dark-blue p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-white font-bold text-2xl">BlockVote</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {isConnected && account && (
            <div className="bg-white/10 rounded-md px-4 py-2 text-white text-sm">
              <span className="font-medium mr-1">Connected:</span>
              <span>{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span>
            </div>
          )}
          
          <Button 
            onClick={isConnected ? disconnectWallet : connectWallet}
            variant={isConnected ? "outline" : "default"}
            disabled={isLoading}
            className={isConnected ? 
              "bg-white text-vote-dark-blue hover:bg-gray-100" : 
              "bg-white text-vote-dark-blue hover:bg-gray-100"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              "Disconnect"
            ) : (
              "Connect MetaMask"
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

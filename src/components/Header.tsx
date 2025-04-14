
import React from 'react';
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/contexts/BlockchainContext';
import { Loader2, Wallet, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const { account, isConnected, isLoading, connectWallet, disconnectWallet } = useBlockchain();

  return (
    <header className="bg-white border-b border-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-blue-600 font-bold text-xl">TrustVote</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-1">
            <Link 
              to="/" 
              className="flex items-center px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100"
            >
              <span>Home</span>
            </Link>
            <Link 
              to="/elections" 
              className="flex items-center px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100"
            >
              <span>Elections</span>
            </Link>
            <Link 
              to="/results" 
              className="flex items-center px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100"
            >
              <span>Results</span>
            </Link>
          </nav>
          
          <div className="relative">
            {isConnected && account ? (
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-700">Connected</span>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={disconnectWallet}
                  className="text-sm border-gray-300"
                >
                  Disconnect Wallet
                </Button>
              </div>
            ) : (
              <Button 
                onClick={connectWallet}
                disabled={isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

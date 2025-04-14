
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

// Define types for our context
export interface BlockchainContextType {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  chainId: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  hasVoted: boolean;
  setHasVoted: (voted: boolean) => void;
}

// Create the context with default values
const BlockchainContext = createContext<BlockchainContextType>({
  account: null,
  isConnected: false,
  isLoading: false,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  hasVoted: false,
  setHasVoted: () => {},
});

// Custom hook to use the blockchain context
export const useBlockchain = () => useContext(BlockchainContext);

interface BlockchainProviderProps {
  children: ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(false);

  // Check if MetaMask is available
  const isMetaMaskAvailable = (): boolean => {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  };

  // Connect to MetaMask
  const connectWallet = async (): Promise<void> => {
    if (!isMetaMaskAvailable()) {
      toast.error("MetaMask is not installed. Please install it to use this feature.");
      return;
    }

    setIsLoading(true);
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      // Check if we're on a testnet
      if (chainId !== '0x5' && chainId !== '0xaa36a7') { // Goerli or Sepolia
        try {
          // Try to switch to Sepolia testnet
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
          });
          toast.success("Switched to Sepolia Testnet");
        } catch (switchError: any) {
          // If the chain hasn't been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Testnet',
                    nativeCurrency: {
                      name: 'Sepolia ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://sepolia.infura.io/v3/'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io/'],
                  },
                ],
              });
            } catch (addError) {
              toast.error("Failed to add Sepolia network to MetaMask");
            }
          }
          toast.error("Please switch to Sepolia or Goerli testnet to use this application.");
        }
      }

      // Update state with the first account
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setChainId(await window.ethereum.request({ method: 'eth_chainId' }));
        toast.success("Connected to MetaMask!");
      }
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      toast.error("Failed to connect to MetaMask. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect from MetaMask
  const disconnectWallet = (): void => {
    setAccount(null);
    setIsConnected(false);
    setChainId(null);
    setHasVoted(false);
    toast.info("Disconnected from MetaMask");
  };

  // Check if previously connected to MetaMask on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (isMetaMaskAvailable()) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            setChainId(await window.ethereum.request({ method: 'eth_chainId' }));
            console.log("Reconnected to MetaMask");
          }
        } catch (error) {
          console.error("Error checking MetaMask connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (isMetaMaskAvailable()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnectWallet();
        } else if (accounts[0] !== account) {
          // Account changed
          setAccount(accounts[0]);
          setIsConnected(true);
          toast.info("Account changed");
        }
      };

      const handleChainChanged = (chainId: string) => {
        setChainId(chainId);
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  return (
    <BlockchainContext.Provider
      value={{
        account,
        isConnected,
        isLoading,
        chainId,
        connectWallet,
        disconnectWallet,
        hasVoted,
        setHasVoted,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

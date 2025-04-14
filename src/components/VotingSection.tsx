
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/contexts/BlockchainContext';
import CandidateCard from './CandidateCard';
import { castVote, checkTransactionStatus, getVotingResults, hasAccountVoted } from '@/utils/blockchain';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle, Lock, RefreshCw, Vote, ArrowRight } from 'lucide-react';

// Candidate data (would come from a blockchain contract in a real implementation)
const candidates = [
  {
    id: 1,
    name: "Jane Smith",
    party: "Progressive Party",
    description: "Focused on education reform and environmental protection. Has served as a city council member for 8 years.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Michael Johnson",
    party: "Liberty Alliance",
    description: "Advocates for small government and fiscal responsibility. Previously served as state treasurer.",
    imageUrl: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Sarah Williams",
    party: "United Future",
    description: "Campaigning on healthcare accessibility and economic development. Has a background in public health.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    name: "Robert Chen",
    party: "Citizens Coalition",
    description: "Platform includes infrastructure investment and technology innovation. Former tech executive.",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

type TransactionStatus = 'idle' | 'pending' | 'confirming' | 'confirmed' | 'failed';

const VotingSection: React.FC = () => {
  const { account, isConnected, hasVoted, setHasVoted, disconnectWallet } = useBlockchain();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [votingResults, setVotingResults] = useState<{[key: number]: number}>({});
  
  useEffect(() => {
    // Check if the account has already voted when the account changes
    const checkIfVoted = async () => {
      if (account) {
        try {
          const voted = hasAccountVoted(account);
          setHasVoted(voted);
        } catch (error) {
          console.error("Error checking vote status:", error);
        }
      }
    };
    
    checkIfVoted();
  }, [account, setHasVoted]);
  
  const handleSelectCandidate = (id: number) => {
    if (transactionStatus === 'idle' && !hasVoted) {
      setSelectedCandidate(id);
    }
  };
  
  const handleCastVote = async () => {
    if (!isConnected || !account || selectedCandidate === null) {
      toast.error("Please connect your wallet and select a candidate first");
      return;
    }
    
    if (hasVoted) {
      toast.error("You have already voted with this wallet address");
      return;
    }
    
    try {
      setTransactionStatus('pending');
      toast.info("Please confirm the transaction in MetaMask...");
      
      // Simulate interaction with blockchain
      const { success, transactionHash } = await castVote(selectedCandidate, account);
      
      if (success) {
        setTransactionHash(transactionHash);
        setTransactionStatus('confirming');
        toast.info("Vote submitted! Waiting for confirmation...");
        
        // Check transaction status
        const { confirmed } = await checkTransactionStatus(transactionHash);
        
        if (confirmed) {
          setTransactionStatus('confirmed');
          
          // Update vote count for the selected candidate
          const currentResults = await getVotingResults();
          
          // Store the updated results
          localStorage.setItem('votingResults', JSON.stringify(currentResults));
          setVotingResults(currentResults);
          
          setHasVoted(true);
          toast.success("Your vote has been confirmed on the blockchain!");
        }
      }
    } catch (error: any) {
      console.error("Error casting vote:", error);
      setTransactionStatus('failed');
      
      if (error.message === "Transaction rejected by user.") {
        toast.error("You rejected the transaction in MetaMask.");
      } else if (error.message === "This wallet address has already voted.") {
        toast.error("This wallet has already voted. Please use a different wallet.");
        setHasVoted(true);
      } else {
        toast.error("Failed to cast your vote. Please try again.");
      }
    }
  };
  
  const handleDisconnectAndReset = () => {
    disconnectWallet();
    setTransactionStatus('idle');
    setTransactionHash(null);
    setSelectedCandidate(null);
  };
  
  const getStatusMessage = () => {
    switch (transactionStatus) {
      case 'pending':
        return (
          <div className="flex items-center text-blue-600">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Waiting for MetaMask confirmation...</span>
          </div>
        );
      case 'confirming':
        return (
          <div className="flex items-center text-blue-600">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Waiting for blockchain confirmation...</span>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex items-center text-green-600">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            <span>Vote confirmed on the blockchain!</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-red-600">
            <AlertCircle className="mr-2 h-5 w-5" />
            <span>Transaction failed. Please try again.</span>
          </div>
        );
      default:
        return null;
    }
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <Vote className="h-16 w-16 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Connect to Vote</h2>
          <p className="text-gray-600 mb-6">
            Please connect your MetaMask wallet to participate in the election. 
            Your wallet address will be used to verify your identity and ensure one vote per person.
          </p>
          <div className="flex justify-center">
            <Button 
              onClick={() => window.scrollTo(0, 0)} 
              className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded flex items-center"
            >
              Connect Wallet Above
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Cast Your Vote</h2>
        <p className="text-gray-600">
          Select a candidate and confirm your vote using your connected wallet
        </p>
        {hasVoted && (
          <div className="mt-4 flex justify-center">
            <Button 
              onClick={handleDisconnectAndReset}
              variant="outline"
              className="flex items-center text-blue-600 border-blue-600"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Disconnect wallet to vote again
            </Button>
          </div>
        )}
      </div>
      
      {hasVoted ? (
        <div className="max-w-md mx-auto text-center bg-green-50 p-6 rounded-lg shadow">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Vote Successfully Cast!</h3>
          <p className="text-gray-600 mb-4">
            Your vote has been recorded on the blockchain and added to the results.
            To vote again, please disconnect your wallet and reconnect.
          </p>
          {transactionHash && (
            <div className="text-sm bg-white p-3 rounded border text-left">
              <p className="font-semibold mb-1">Transaction Hash:</p>
              <p className="text-gray-500 break-all">{transactionHash}</p>
            </div>
          )}
          <div className="mt-6">
            <Button
              onClick={() => window.location.href = '/results'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              View Updated Results
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {candidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                {...candidate}
                onVote={handleSelectCandidate}
                isSelected={selectedCandidate === candidate.id}
                disabled={transactionStatus !== 'idle' && transactionStatus !== 'failed'}
                hasVoted={hasVoted}
              />
            ))}
          </div>
          
          <div className="max-w-md mx-auto text-center">
            {getStatusMessage()}
            
            <Button
              onClick={handleCastVote}
              disabled={selectedCandidate === null || transactionStatus === 'pending' || transactionStatus === 'confirming' || hasVoted}
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-8 py-2 text-lg"
            >
              {transactionStatus === 'pending' || transactionStatus === 'confirming' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Vote"
              )}
            </Button>
            
            {transactionStatus !== 'idle' && transactionHash && (
              <div className="mt-4 text-sm text-gray-500">
                <p>Transaction Hash:</p>
                <p className="font-mono bg-gray-100 p-2 rounded truncate">
                  {transactionHash}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VotingSection;

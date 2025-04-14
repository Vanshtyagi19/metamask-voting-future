
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useBlockchain } from '@/contexts/BlockchainContext';
import CandidateCard from './CandidateCard';
import { castVote, checkTransactionStatus } from '@/utils/blockchain';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

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
  const { account, isConnected, hasVoted, setHasVoted } = useBlockchain();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  
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
    
    try {
      setTransactionStatus('pending');
      toast.info("Sending your vote to the blockchain...");
      
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
          setHasVoted(true);
          toast.success("Your vote has been confirmed on the blockchain!");
        }
      }
    } catch (error) {
      console.error("Error casting vote:", error);
      setTransactionStatus('failed');
      toast.error("Failed to cast your vote. Please try again.");
    }
  };
  
  const getStatusMessage = () => {
    switch (transactionStatus) {
      case 'pending':
        return (
          <div className="flex items-center text-vote-blue">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Sending transaction...</span>
          </div>
        );
      case 'confirming':
        return (
          <div className="flex items-center text-vote-blue">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>Waiting for confirmation...</span>
          </div>
        );
      case 'confirmed':
        return (
          <div className="flex items-center text-vote-green">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            <span>Vote confirmed on the blockchain!</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center text-vote-red">
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
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Connect to Vote</h2>
        <p className="text-gray-600 mb-4">Please connect your MetaMask wallet to participate in the election.</p>
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
      </div>
      
      {hasVoted ? (
        <div className="max-w-md mx-auto text-center bg-green-50 p-6 rounded-lg shadow">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Vote Successfully Cast!</h3>
          <p className="text-gray-600 mb-4">
            Your vote has been recorded on the blockchain and cannot be changed.
          </p>
          {transactionHash && (
            <div className="text-sm bg-white p-3 rounded border text-left">
              <p className="font-semibold mb-1">Transaction Hash:</p>
              <p className="text-gray-500 break-all">{transactionHash}</p>
            </div>
          )}
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
              className="mt-4 bg-vote-blue hover:bg-vote-dark-blue px-8 py-2 text-lg"
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

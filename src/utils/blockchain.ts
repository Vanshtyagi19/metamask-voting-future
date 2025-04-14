
// This file contains utility functions for interacting with the blockchain

// For development purposes, initialize local storage with some votes if it doesn't exist
const initializeVotingResults = () => {
  if (!localStorage.getItem('votingResults')) {
    const initialResults = {
      1: 14,
      2: 12,
      3: 9,
      4: 7
    };
    localStorage.setItem('votingResults', JSON.stringify(initialResults));
  }
};

// Initialize on load
initializeVotingResults();

// Simulating a blockchain transaction for the frontend
// In a real implementation, this would interact with an actual smart contract
export const castVote = async (candidateId: number, account: string): Promise<{ success: boolean; transactionHash: string }> => {
  console.log(`Casting vote for candidate ID ${candidateId} from account ${account}`);
  
  // Check if this account has already voted
  const votedAccounts = JSON.parse(localStorage.getItem('votedAccounts') || '[]');
  if (votedAccounts.includes(account)) {
    throw new Error("This wallet address has already voted.");
  }
  
  // Simulate blockchain transaction time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate transaction hash
  const transactionHash = "0x" + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)).join('');
  
  // For demo purposes, we'll simulate a 95% success rate
  const success = Math.random() < 0.95;
  
  if (!success) {
    throw new Error("Transaction failed. Please try again.");
  }
  
  // Update results in local storage (simulating blockchain state)
  const results = JSON.parse(localStorage.getItem('votingResults') || '{}');
  results[candidateId] = (results[candidateId] || 0) + 1;
  localStorage.setItem('votingResults', JSON.stringify(results));
  
  return { 
    success: true, 
    transactionHash 
  };
};

// Function to check if a transaction is confirmed
export const checkTransactionStatus = async (transactionHash: string): Promise<{ confirmed: boolean; blockNumber?: number }> => {
  console.log(`Checking status of transaction ${transactionHash}`);
  
  // Simulate blockchain confirmation time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Simulate block number
  const blockNumber = Math.floor(Math.random() * 1000000) + 10000000;
  
  return {
    confirmed: true,
    blockNumber
  };
};

// Get current results (simulated)
export const getVotingResults = async (): Promise<{ [key: number]: number }> => {
  // Simulate API call to get results from blockchain
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get results from local storage (simulating blockchain state)
  const results = JSON.parse(localStorage.getItem('votingResults') || '{}');
  
  return results;
};


// This file contains utility functions for interacting with the blockchain
// In a production environment, these functions would interact with the actual smart contract
// defined in VotingContract.sol using the configuration from contract-config.ts

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
  
  // Initialize voted accounts if it doesn't exist
  if (!localStorage.getItem('votedAccounts')) {
    localStorage.setItem('votedAccounts', JSON.stringify([]));
  }
};

// Initialize on load
initializeVotingResults();

// Function to check if an account has voted
export const hasAccountVoted = (account: string): boolean => {
  if (!account) return false;
  const votedAccounts = JSON.parse(localStorage.getItem('votedAccounts') || '[]');
  return votedAccounts.includes(account);
};

// Function to remove an account from voted list (for testing/demo purposes)
export const resetAccountVote = (account: string): void => {
  if (!account) return;
  const votedAccounts = JSON.parse(localStorage.getItem('votedAccounts') || '[]');
  const updatedVotedAccounts = votedAccounts.filter((addr: string) => addr !== account);
  localStorage.setItem('votedAccounts', JSON.stringify(updatedVotedAccounts));
};

// Simulating a blockchain transaction for the frontend
// In production, this would call contract.castVote(candidateId)
export const castVote = async (candidateId: number, account: string): Promise<{ success: boolean; transactionHash: string }> => {
  console.log(`Casting vote for candidate ID ${candidateId} from account ${account}`);
  
  // Check if this account has already voted
  const votedAccounts = JSON.parse(localStorage.getItem('votedAccounts') || '[]');
  if (votedAccounts.includes(account)) {
    throw new Error("This wallet address has already voted.");
  }
  
  // Simulate MetaMask confirmation dialog
  // In a real implementation, this would be handled by the actual MetaMask extension
  const userConfirmed = await simulateMetaMaskConfirmation();
  if (!userConfirmed) {
    throw new Error("Transaction rejected by user.");
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
  
  // Add account to voted accounts
  votedAccounts.push(account);
  localStorage.setItem('votedAccounts', JSON.stringify(votedAccounts));
  
  return { 
    success: true, 
    transactionHash 
  };
};

// Simulate MetaMask confirmation dialog
const simulateMetaMaskConfirmation = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Create modal elements
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    
    const modal = document.createElement('div');
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px';
    modal.style.borderRadius = '10px';
    modal.style.width = '400px';
    modal.style.maxWidth = '90%';
    modal.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.marginBottom = '20px';
    
    const logo = document.createElement('div');
    logo.style.width = '30px';
    logo.style.height = '30px';
    logo.style.borderRadius = '50%';
    logo.style.backgroundColor = '#f6851b';
    logo.style.marginRight = '10px';
    
    const title = document.createElement('h3');
    title.textContent = 'MetaMask';
    title.style.margin = '0';
    title.style.fontWeight = 'bold';
    
    const content = document.createElement('div');
    content.innerHTML = `
      <p style="margin-bottom: 20px;">TrustVote would like to cast your vote to the blockchain.</p>
      <p style="font-weight: bold; margin-bottom: 5px;">Estimated gas fee:</p>
      <p style="margin-top: 0; margin-bottom: 20px;">0.0012 ETH</p>
    `;
    
    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.justifyContent = 'space-between';
    buttons.style.marginTop = '20px';
    
    const rejectButton = document.createElement('button');
    rejectButton.textContent = 'Reject';
    rejectButton.style.padding = '10px 20px';
    rejectButton.style.border = '1px solid #ccc';
    rejectButton.style.borderRadius = '5px';
    rejectButton.style.backgroundColor = 'white';
    rejectButton.style.cursor = 'pointer';
    
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.style.padding = '10px 20px';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '5px';
    confirmButton.style.backgroundColor = '#037dd6';
    confirmButton.style.color = 'white';
    confirmButton.style.cursor = 'pointer';
    
    // Assemble the modal
    header.appendChild(logo);
    header.appendChild(title);
    buttons.appendChild(rejectButton);
    buttons.appendChild(confirmButton);
    
    modal.appendChild(header);
    modal.appendChild(content);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    
    // Add to document
    document.body.appendChild(overlay);
    
    // Handle button clicks
    rejectButton.onclick = () => {
      document.body.removeChild(overlay);
      resolve(false);
    };
    
    confirmButton.onclick = () => {
      document.body.removeChild(overlay);
      resolve(true);
    };
  });
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
// In production, this would call contract.getAllResults()
export const getVotingResults = async (): Promise<{ [key: number]: number }> => {
  // Simulate API call to get results from blockchain
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get results from local storage (simulating blockchain state)
  const results = JSON.parse(localStorage.getItem('votingResults') || '{}');
  
  return results;
};

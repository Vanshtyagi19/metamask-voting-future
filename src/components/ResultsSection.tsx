
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from '@/components/ui/chart'; // Import Cell from our chart component
import { getVotingResults } from '@/utils/blockchain';
import { Loader2 } from 'lucide-react';

const candidateNames: Record<number, string> = {
  1: "Jane Smith",
  2: "Michael Johnson",
  3: "Sarah Williams",
  4: "Robert Chen"
};

const candidateColors: Record<number, string> = {
  1: "#3b82f6", // blue
  2: "#10b981", // green
  3: "#8b5cf6", // purple
  4: "#f59e0b", // amber
};

interface ResultsData {
  id: number;
  name: string;
  votes: number;
  color: string;
}

const ResultsSection: React.FC = () => {
  const [results, setResults] = useState<ResultsData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const resultsData = await getVotingResults();
        
        const formattedResults = Object.entries(resultsData).map(([id, votes]) => ({
          id: parseInt(id),
          name: candidateNames[parseInt(id)] || `Candidate ${id}`,
          votes,
          color: candidateColors[parseInt(id)] || "#64748b"
        }));
        
        // Sort by votes (highest first)
        formattedResults.sort((a, b) => b.votes - a.votes);
        
        setResults(formattedResults);
        setTotalVotes(formattedResults.reduce((sum, item) => sum + item.votes, 0));
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
    
    // Polling for updates every 30 seconds
    const interval = setInterval(fetchResults, 30000);
    return () => clearInterval(interval);
  }, []);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 shadow-md rounded border">
          <p className="font-bold">{data.name}</p>
          <p className="text-gray-700">{`Votes: ${data.votes}`}</p>
          <p className="text-gray-600">{`${((data.votes / totalVotes) * 100).toFixed(1)}% of total`}</p>
        </div>
      );
    }
    return null;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-vote-blue mr-2" />
        <span className="text-lg">Loading results...</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Election Results</h2>
        <p className="text-gray-600">
          Live results from the blockchain - Total votes: {totalVotes}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="h-80 w-full bg-white rounded-lg shadow p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={results}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="votes" 
                  name="Votes"
                  radius={[4, 4, 0, 0]}
                >
                  {results.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Current Standings</h3>
          <div className="space-y-6">
            {results.map((candidate, index) => (
              <div key={candidate.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: candidate.color }}
                    />
                    <span className="font-medium">{candidate.name}</span>
                  </div>
                  <span className="text-gray-700">{candidate.votes} votes</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full"
                    style={{
                      width: `${(candidate.votes / totalVotes) * 100}%`,
                      backgroundColor: candidate.color
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {((candidate.votes / totalVotes) * 100).toFixed(1)}% of total votes
                </p>
                {index < results.length - 1 && <hr className="my-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;


import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink } from 'lucide-react';

interface CandidateCardProps {
  id: number;
  name: string;
  party: string;
  description: string;
  imageUrl: string;
  onVote: (id: number) => void;
  isSelected: boolean;
  disabled: boolean;
  hasVoted: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  id,
  name,
  party,
  description,
  imageUrl,
  onVote,
  isSelected,
  disabled,
  hasVoted,
}) => {
  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
      isSelected ? 'ring-2 ring-vote-blue shadow-lg' : ''
    }`}>
      <div className="h-40 bg-gray-200 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription className="text-sm">{party}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onVote(id)}
          disabled={disabled || hasVoted}
          className={`w-full ${
            isSelected 
              ? 'bg-vote-blue hover:bg-vote-dark-blue' 
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {hasVoted ? (
            <span className="flex items-center">
              <Check size={16} className="mr-2" /> Voted
            </span>
          ) : isSelected ? (
            "Selected"
          ) : (
            "Select"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CandidateCard;

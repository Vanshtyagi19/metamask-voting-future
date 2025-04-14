
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Shield, LineChart, Lock } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Secure, Transparent Elections on the Blockchain
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-10">
            Cast your vote with confidence using cutting-edge blockchain technology that ensures
            security, transparency, and immutability for every election.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              asChild
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <Link to="/elections">View Elections</Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-white text-white hover:bg-blue-700"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Blockchain Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Blockchain Voting?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Security</h3>
              <p className="text-gray-600">
                Blockchain's cryptographic security ensures votes cannot be tampered with.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparency</h3>
              <p className="text-gray-600">
                All votes are recorded on a public ledger for full transparency and auditability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LineChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trust</h3>
              <p className="text-gray-600">
                No central authority controls the votes, ensuring true democratic representation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, CreditCard } from 'lucide-react';

interface HomeProps {
  isConnected: boolean;
}

const Home: React.FC<HomeProps> = ({ isConnected }) => {
  return (
    <div className="text-center">
      <div className="bg-blue-100 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">
          Welcome to InsureDApp
        </h1>
        <p className="text-blue-600 text-xl mb-8">
          Decentralized Health Insurance Platform
        </p>

        {!isConnected ? (
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-blue-700 mb-4">
              Please connect your wallet to access full platform features
            </p>
            <p className="text-blue-500 italic mb-6">
              Wallet connection required for policies and claims
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <Link 
              to="/policies" 
              className="bg-blue-200 p-6 rounded-lg hover:bg-blue-300 transition-colors"
            >
              <FileText className="mx-auto mb-4 text-blue-700" size={48} />
              <h2 className="text-xl font-semibold text-blue-800">Manage Policies</h2>
            </Link>
            <Link 
              to="/claims" 
              className="bg-blue-200 p-6 rounded-lg hover:bg-blue-300 transition-colors"
            >
              <CreditCard className="mx-auto mb-4 text-blue-700" size={48} />
              <h2 className="text-xl font-semibold text-blue-800">File Claims</h2>
            </Link>
            <div 
              className="bg-blue-200 p-6 rounded-lg"
            >
              <Shield className="mx-auto mb-4 text-blue-700" size={48} />
              <h2 className="text-xl font-semibold text-blue-800">Secure Coverage</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
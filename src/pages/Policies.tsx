import React, { useEffect } from 'react';
import { PolicyList } from '../components/PolicyList';
import { PurchasePolicy } from '../components/PurchasePolicy';
import { ethers } from 'ethers';

interface PoliciesProps {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
}

const Policies: React.FC<PoliciesProps> = ({ provider, signer }) => {
  useEffect(() => {
    // Simulate page load completion
    setTimeout(() => {
    }, 1000);
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 bg-blue-50 min-h-screen">
      <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4 text-center sm:text-left">
          Purchase a Policy
        </h1>
        <PurchasePolicy provider={provider!} signer={signer!} />
      </div>
      <div className="bg-blue-100 p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 text-center sm:text-left">
          Your Policies
        </h2>
        <PolicyList provider={provider!} signer={signer!} />
      </div>
    </div>
  );
};

export default Policies;

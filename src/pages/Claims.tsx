import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getContract } from '../lib/contract';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/components/ui/card';
import { Toaster, toast } from 'react-hot-toast';

interface ClaimsProps {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
}

interface Claim {
  id: number;
  policyId: number;
  claimAmount: number;
  submissionDate: number;
  status: number;
  medicalDocuments: string;
}

const Claims: React.FC<ClaimsProps> = ({ provider, signer }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatClaimStatus = (status: number) => {
    const statuses = ['Pending', 'Approved', 'Rejected'];
    return statuses[status] || 'Unknown';
  };

  useEffect(() => {
    const fetchUserClaims = async () => {
      if (!provider || !signer) return;

      setIsLoading(true);

      try {
        const address = await signer.getAddress();
        setUserAddress(address);

        const contract = getContract(provider, signer);

        const claimIds = await contract.getUserClaims(address);
        const claimDetails = await Promise.all(
          claimIds.map(async (claimId: number) => {
            const claim = await contract.getClaimDetails(claimId);
            return {
              ...claim,
              id: Number(claimId),
              policyId: claim.policyId,
              claimAmount: ethers.formatUnits(claim.claimAmount, 18),
              submissionDate: new Date(Number(claim.submissionDate) * 1000),
              status: claim.status
            };
          })
        );

        setClaims(claimDetails);
      } catch (error) {
        console.error('Error fetching claims:', error);
        toast.error('Failed to load claims');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserClaims();
  }, [provider, signer]);

  if (!provider || !signer) {
    return (
      <div className="bg-blue-50 p-8 rounded-lg">
        <p className="text-blue-600">Please connect your wallet to view claims.</p>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-8 rounded-lg">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-blue-800 mb-6">
        Insurance Claims
      </h1>
      {isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-blue-600">Loading claims...</p>
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-blue-600">No claims found. Submit a new claim using your existing policies.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id} className="w-full">
              <CardHeader>
                <CardTitle>ClaimId: {Number(claim.id)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Policy ID</p>
                    <p className="font-semibold">{Number(claim.policyId)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Claim Amount</p>
                    <p className="font-semibold">{(claim.claimAmount)} ETH</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Submission Date and Time</p>
                    <p className="font-semibold">
                      {(claim.submissionDate).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`font-semibold ${
                      Number(claim.status) === 1 ? 'text-green-600' : 
                      Number(claim.status) === 2 ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {formatClaimStatus(claim.status)}
                    </p>
                  </div>
                </div>
                {claim.medicalDocuments && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Medical Documents</p>
                    <p className="text-blue-600 truncate">{claim.medicalDocuments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Claims;
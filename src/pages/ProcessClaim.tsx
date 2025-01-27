import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { getContract } from '../lib/contract';

interface ClaimProcessingProps {
  provider: ethers.Provider;
  signer: ethers.Signer;
}

interface Claim {
  id: bigint;
  policyId: bigint;
  claimAmount: bigint;
  submissionDate: bigint;
  status: bigint;
  medicalDocuments: string;
}

export const ProcessClaim: React.FC<ClaimProcessingProps> = ({ provider, signer }) => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const fetchClaims = async () => {
    try {
      const contract = getContract(provider, signer);

      const ownerAddress = await contract.owner();
      const userAddress = await signer.getAddress();
      setIsOwner(userAddress.toLowerCase() === ownerAddress.toLowerCase());

      if (userAddress.toLowerCase() === ownerAddress.toLowerCase()) {
        const totalClaims = await contract.claimCounter();
        const claimList: Claim[] = [];

        for (let i = 0; i < Number(totalClaims); i++) {
          const claim = await contract.claims(i);

          if (claim[4] === 0n) {
            claimList.push({
              id: claim[0],
              policyId: claim[1],
              claimAmount: claim[2],
              submissionDate: claim[3],
              status: claim[4],
              medicalDocuments: claim[5],
            });
          }
        }
        setClaims(claimList);
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error('Failed to load claims.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAction = async (claimId: bigint, action: 'approve' | 'reject') => {
    try {
      setProcessing(true);
      const contract = getContract(provider, signer);

      if (action === 'approve') {
        await contract.processClaim(claimId, true);
      } else {
        await contract.processClaim(claimId, false);
      }

      setLoading(true);
      // toast.loading('Refreshing claims...');
      await fetchClaims();
      toast.success(`Claim ${action === 'approve' ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      console.error('Error processing claim:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      toast.error(`Failed to ${action} claim.`);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (provider && signer) {
      // const loadToast = toast.loading('Loading claims...');
      fetchClaims().finally(() => {
        // toast.dismiss(loadToast);
      });
    }
  }, [provider, signer]);

  if (loading) {
    return (
      <div className="w-full p-6 bg-blue-50 shadow-lg rounded-lg max-w-6xl mx-auto">
        <div className="text-center text-blue-700 text-lg">
          Loading claims...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-blue-50 shadow-lg rounded-lg max-w-6xl mx-auto">
      <h2 className="text-3xl text-blue-900 font-semibold mb-6 text-center">Process Claims</h2>

      {isOwner ? (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse bg-white shadow-sm rounded-lg">
              <thead className="bg-blue-200 text-blue-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Claim ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Policy ID</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Claim Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Submission Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Medical Documents</th>
                  <th className="px-4 py-3 text-left font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.length > 0 ? (
                  claims.map((claim) => (
                    <tr
                      key={claim.id.toString()}
                      className="odd:bg-blue-50 even:bg-white hover:bg-blue-100"
                    >
                      <td className="px-4 py-3 text-sm text-blue-900">{claim.id.toString()}</td>
                      <td className="px-4 py-3 text-sm text-blue-900">{claim.policyId.toString()}</td>
                      <td className="px-4 py-3 text-sm text-blue-900">
                        {ethers.formatEther(claim.claimAmount)} ETH
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-900">
                        {new Date(Number(claim.submissionDate) * 1000).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-900">
                        <a 
                          href={claim.medicalDocuments} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 underline hover:text-blue-700"
                        >
                          {claim.medicalDocuments}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-blue-900 flex flex-row gap-4">
                        <button
                          onClick={() => handleClaimAction(claim.id, 'approve')}
                          disabled={processing}
                          className="px-3 py-1 mr-2 text-white bg-green-500 hover:bg-green-600 rounded-lg disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleClaimAction(claim.id, 'reject')}
                          disabled={processing}
                          className="px-3 py-1 text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-6 text-center text-sm text-blue-600 italic"
                    >
                      No claims to process.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center text-blue-700 text-lg">
          You must be the contract owner to process claims.
        </div>
      )}
    </div>
  );
};

export default ProcessClaim;
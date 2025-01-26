import { useState, useEffect, useCallback } from 'react';
import { FileText, Upload } from 'lucide-react';
import { ethers } from 'ethers';
import { getContract } from '../lib/contract';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { pinata } from '@/utils/config';

interface Policy {
  id: number;
  coverageAmount: string;
  premium: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

interface Claim {
  id: number;
  policyId: number;
  claimAmount: string;
  submissionDate: Date;
  status: string;
  medicalDocuments: string;
}

interface PolicyListProps {
  provider: ethers.Provider;
  signer: ethers.Signer;
}

export function PolicyList({ provider, signer }: PolicyListProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<number | null>(null);
  const [claimAmount, setClaimAmount] = useState('');
  const [documents, setDocuments] = useState<File | null>(null);
  const [uploadedDocumentUrl, setUploadedDocumentUrl] = useState('');

  const PINATA_JWT = import.meta.env.VITE_JWT;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setDocuments(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB file size limit
  });

  const uploadToPinata = async () => {
    if (!documents) {
      toast.error('No file selected');
      return '';
    }
  
    const formData = new FormData();
    formData.append('file', documents);
  
    // try {
    //   const response = await axios.post('https://uploads.pinata.cloud/v3/files', formData, {
    //     headers: {
    //       Authorization: `Bearer ${PINATA_JWT}`,
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
  
    //   // Use the CID from the response data
    //   const ipfsHash = response.data.cid; // Changed from IpfsHash to cid
    //   console.log("Ipfs hash is ",ipfsHash)
    //   const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    //   console.log("ipfs url is ",ipfsUrl)
    //   setUploadedDocumentUrl(ipfsUrl);
    //   toast.success('File uploaded successfully');
    //   return ipfsUrl;
    // } catch (error) {
    //   console.error('Upload error:', error);
    //   toast.error('File upload failed');
    //   return '';
    // }
    try{
      const upload=await pinata.upload.file(documents)
      console.log(upload)
      const ipfsUrl=await pinata.gateways.convert(upload.IpfsHash)
      console.log(ipfsUrl);
      setUploadedDocumentUrl(ipfsUrl);
      toast.success('File uploaded successfully');
      return ipfsUrl;
    }catch(error){
      console.log(error)
      toast.error('File upload failed');
      return '';
    }
  };

  const fetchUserPolicies = async () => {
    const contract = getContract(provider, signer);

    try {
      const userAddress = await signer.getAddress();
      const fetchedPolicies = await contract.getUserPolicies(userAddress);

      const formattedPolicies: Policy[] = fetchedPolicies.map((policy: any) => ({
        id: Number(policy.id),
        coverageAmount: ethers.formatUnits(policy.coverageAmount, 18),
        premium: ethers.formatUnits(policy.premium, 18),
        startDate: new Date(Number(policy.startDate) * 1000),
        endDate: new Date(Number(policy.endDate) * 1000),
        isActive: policy.isActive,
      }));

      setPolicies(formattedPolicies);
    } catch (error) {
      console.error('Error fetching user policies:', error);
    }
  };

  const fetchUserClaims = async () => {
    const contract = getContract(provider, signer);

    try {
      const userAddress = await signer.getAddress();
      const claimIds = await contract.getUserClaims(userAddress);

      const claimDetails = await Promise.all(
        claimIds.map(async (claimId: number) => {
          const claim = await contract.getClaimDetails(claimId);

          return {
            id: claim.id,
            policyId: claim.policyId,
            claimAmount: ethers.formatUnits(claim.claimAmount, 18),
            submissionDate: new Date(Number(claim.submissionDate) * 1000),
            status: Number(claim.status) === 0 ? 'Pending' : Number(claim.status) === 1 ? 'Approved' : 'Rejected',
            medicalDocuments: claim.medicalDocuments,
          };
        })
      );

      setClaims(claimDetails);
    } catch (error) {
      console.error('Error fetching user claims:', error);
    }
  };

  useEffect(() => {
    if (signer && provider) {
      fetchUserPolicies();
      fetchUserClaims();
    }
  }, [signer, provider]);

  const handleSubmitClaim = async (policyId: number) => {
    const policy = policies.find((policy) => policy.id === policyId);

    if (!policy) {
      toast.error('Policy not found');
      return;
    }

    if (!claimAmount || !documents) {
      toast.error('Please fill in all claim details');
      return;
    }

    if (Number(claimAmount) > Number(policy.coverageAmount)) {
      toast.error('Claim amount exceeds coverage amount');
      return;
    }

    try {
      const documentUrl = await uploadToPinata();
      if (!documentUrl) {
        toast.error('Document upload failed');
        return;
      }

      const contract = getContract(provider, signer);
      const tx = await contract.submitClaim(policyId, ethers.parseUnits(claimAmount, 18), documentUrl);
      await tx.wait();

      setClaimAmount('');
      setDocuments(null);
      setSelectedPolicy(null);

      // Refresh claims
      await fetchUserClaims();

      toast.success('Claim submitted successfully');
    } catch (error) {
      toast.error('Failed to submit claim');
      console.error(error);
    }
  };

  const hasClaimSubmitted = (policyId: number) => {
    return claims.some((claim) => Number(claim.policyId) === policyId);
  };

  const hasApprovedClaim = (policyId: number) => {
    return claims.some((claim) => 
      Number(claim.policyId) === policyId && claim.status === 'Approved'
    );
  };

  const hasRejectedClaim = (policyId: number) => {
    return claims.some((claim) => 
      Number(claim.policyId) === policyId && claim.status === 'Rejected'
    );
  };
  const getLatestClaimStatus = (policyId: number) => {
    const policyClaims = claims.filter((claim) => Number(claim.policyId) === policyId);
    
    if (policyClaims.length === 0) return null;
    
    // Sort claims by submission date and get the latest
    const latestClaim = policyClaims.reduce((latest, current) => 
      current.submissionDate > latest.submissionDate ? current : latest
    );

    return latestClaim.status;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Your Policies</h2>
        </div>

        <div className="space-y-4">
          {policies.length === 0 ? (
            <p className="text-gray-500">No policies found. Purchase one to get started!</p>
          ) : (
            policies.map((policy) => {
              const latestClaimStatus = getLatestClaimStatus(policy.id);
              
              return (
                <div key={policy.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Policy #{policy.id}</h3>
                      <p className="text-sm text-gray-600">Coverage: {policy.coverageAmount} USDC</p>
                      <p className="text-sm text-gray-600">Premium: {policy.premium} ETH</p>
                      <p className="text-sm text-gray-600">Start Date: {policy.startDate.toLocaleDateString()}</p>
                      <p className="text-sm text-gray-600">End Date: {policy.endDate.toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          policy.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {policy.isActive ? 'Active' : 'Expired'}
                      </span>
                      {policy.isActive && (
                        <>
                          {!latestClaimStatus ? (
                            <button
                              onClick={() => setSelectedPolicy(policy.id)}
                              className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700"
                            >
                              Submit Claim
                            </button>
                          ) : latestClaimStatus === 'Rejected' ? (
                            <button
                              onClick={() => setSelectedPolicy(policy.id)}
                              className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-full hover:bg-yellow-700"
                            >
                              Resubmit Claim
                            </button>
                          ) : latestClaimStatus === 'Approved' ? (
                            <p className="text-xs text-gray-600">Claim Submitted</p>
                          ) : (
                            <p className="text-xs text-gray-600">Claim Pending</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {selectedPolicy === policy.id && (
                    <div className="mt-4 border-t pt-4">
                      <h4 className="font-medium mb-2">
                        {latestClaimStatus === 'Rejected' ? 'Resubmit Claim' : 'Submit New Claim'}
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-gray-600">Claim Amount (USDC)</label>
                          <input
                            type="number"
                            value={claimAmount}
                            onChange={(e) => setClaimAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Medical Documents</label>
                          <div
                            {...getRootProps()}
                            className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${
                              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                          >
                            <input {...getInputProps()} />
                            <div className="flex justify-center mb-2">
                              <Upload className="w-8 h-8 text-gray-500" />
                            </div>
                            {documents ? (
                              <p className="text-sm text-gray-700">{documents.name}</p>
                            ) : (
                              <p className="text-sm text-gray-500">Drag and drop a file, or click to select</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleSubmitClaim(policy.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                          {latestClaimStatus === 'Rejected' ? 'Resubmit Claim' : 'Submit Claim'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
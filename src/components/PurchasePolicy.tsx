import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { ethers } from 'ethers';
import { getContract } from '../lib/contract';

interface PurchasePolicyProps {
  provider: ethers.Provider;
  signer?: ethers.Signer;
}

interface Policy {
  id: number;
  coverageAmount: string;
  premium: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

export function PurchasePolicy({ provider, signer }: PurchasePolicyProps) {
  const [coverage, setCoverage] = useState('10000');
  const [premium, setPremium] = useState<string>('0');
  const [minCoverage, setMinCoverage] = useState<string>('0');
  const [maxCoverage, setMaxCoverage] = useState<string>('0');
  const [userPolicies, setUserPolicies] = useState<Policy[]>([]);

  const fetchUserPolicies = async () => {
    if (!signer) return [];
    const contract = getContract(provider, signer);
    
    try {
      const userAddress = await signer.getAddress();
      const policies = await contract.getUserPolicies(userAddress);
      console.log("Policies are ",policies)
      const formattedPolicies: Policy[] = policies.map((policy: any) => ({
        id: policy.id,
        coverageAmount: ethers.formatUnits(policy.coverageAmount, 18),
        premium: ethers.formatUnits(policy.premium, 18),
        startDate: new Date(Number(policy.startDate) * 1000),
        endDate: new Date(Number(policy.endDate) * 1000),
        isActive: policy.isActive
      }));
      
      return formattedPolicies;
    } catch (error) {
      console.error('Error fetching user policies:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchContractLimits = async () => {
      if (!signer) return;
      const contract = getContract(provider, signer);
      try {
        const min = await contract.MIN_COVERAGE();
        const max = await contract.MAX_COVERAGE();
        setMinCoverage(ethers.formatUnits(min, 18));
        setMaxCoverage(ethers.formatUnits(max, 18));
      } catch (error) {
        console.error('Error fetching coverage limits:', error);
      }
    };

    const loadUserPolicies = async () => {
      if (signer) {
        const policies = await fetchUserPolicies();
        setUserPolicies(policies);
      }
    };

    fetchContractLimits();
    loadUserPolicies();
  }, [signer, provider]);

  const calculatePremium = async (coverageAmount: string) => {
    if (!signer) return;
    
    const coverageNum = parseFloat(coverageAmount);
    const premiumRate = 0.00010; 
    const calculatedPremium = (coverageNum * premiumRate).toString();
    
    setPremium(calculatedPremium);
  };

  useEffect(() => {
    calculatePremium(coverage);
  }, [coverage]);

  const handlePurchase = async () => {
    if (!signer) return;
    const contract = getContract(provider, signer);
    try {
      const tx = await contract.purchasePolicy(ethers.parseUnits(coverage, 18), {
        value: ethers.parseEther(premium)
      });
      await tx.wait();
      
      const updatedPolicies = await fetchUserPolicies();
      console.log("UpdatePolicies are",updatedPolicies);
      setUserPolicies(updatedPolicies);
    } catch (error) {
      console.error('Error purchasing policy:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Purchase Health Insurance</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Coverage Amount (USDC) 
            <span className="text-xs text-gray-500 ml-2">
              (Min: {minCoverage}, Max: {maxCoverage})
            </span>
          </label>
          <input
            type="number"
            min={minCoverage}
            max={maxCoverage}
            value={coverage}
            onChange={(e) => setCoverage(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Premium (ETH)</label>
          <input
            type="text"
            value={premium}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
          />
        </div>

        <button
          onClick={handlePurchase}
          disabled={!signer}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          Purchase Policy
        </button>
      </div>
    </div>
  );
}
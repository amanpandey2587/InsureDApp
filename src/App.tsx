import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';

function App() {
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    try {
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setAddress(address);
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <Layout
        provider={provider}
        signer={signer}
        address={address}
        onConnect={connectWallet}
      />
    </>
  );
}

export default App;
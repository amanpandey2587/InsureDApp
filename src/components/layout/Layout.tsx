import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Home from '../../pages/Home';
import About from '../../pages/About';
import Contact from '../../pages/Contact';
import Policies from '../../pages/Policies';
import Claims from '../../pages/Claims';
import Dashboard from '../../pages/Dashboard';
import ProcessClaim from '../../pages/ProcessClaim'; // New import
import Footer from './Footer';
import { ethers } from 'ethers';

interface LayoutProps {
  provider: ethers.Provider;
  signer: ethers.Signer ;
  address: string | null;
  onConnect: () => void;
}

const ProtectedRoute: React.FC<{
  isConnected: boolean;
  children: React.ReactNode;
}> = ({ isConnected, children }) => {
  // If not connected, redirect to home page
  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Layout: React.FC<LayoutProps> = ({
  provider,
  signer,
  address,
  onConnect
}) => {
  // Check if signer is available to determine connection status
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (signer) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, [signer]); // Dependency array ensures it updates when signer changes

  const isOwner=(address:string):boolean=>{
    if(address===import.meta.env.VITE_OWNER_ADDRESS){
      return true;
    }
    else{
      return false;
    }
  }
  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <Navbar
          isConnected={isConnected}
          address={address}
          onConnect={onConnect}
          isOwner={isOwner(address || "")}
        />

        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home isConnected={isConnected} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/policies"
              element={
                <ProtectedRoute isConnected={isConnected}>
                  <Policies
                    provider={provider}
                    signer={signer}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/claims"
              element={
                <ProtectedRoute isConnected={isConnected}>
                  <Claims
                    provider={provider}
                    signer={signer}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/process-claims"
              element={
                <ProtectedRoute isConnected={isConnected}>
                  <ProcessClaim
                    provider={provider}
                    signer={signer}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isConnected={isConnected}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
};

export default Layout;

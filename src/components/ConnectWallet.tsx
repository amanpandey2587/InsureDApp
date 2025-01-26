import React from 'react';
import { Wallet } from 'lucide-react';

interface ConnectWalletProps {
  isConnected: boolean;
  address: string | null;
  onConnect: () => void;
}

export function ConnectWallet({ isConnected, address, onConnect }: ConnectWalletProps) {
  return (
    <div className="fixed top-4 right-4">
      {isConnected ? (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center gap-2">
          <Wallet className="w-4 h-4" />
          <span className="text-sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </button>
      )}
    </div>
  );
}
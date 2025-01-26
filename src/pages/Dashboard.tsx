import React from 'react';
import { FileText, Shield, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-50 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">
          Dashboard
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <FileText className="text-blue-700 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-blue-800">
              Active Policies
            </h2>
            <p className="text-blue-600">0 Policies</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <Shield className="text-blue-700 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-blue-800">
              Total Coverage
            </h2>
            <p className="text-blue-600">$0</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <TrendingUp className="text-blue-700 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-blue-800">
              Claims History
            </h2>
            <p className="text-blue-600">0 Claims</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
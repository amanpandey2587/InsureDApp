import React from 'react';
import { ShieldCheck, Globe, Lock } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck className="text-blue-700" size={48} />,
      title: 'Secure Coverage',
      description: 'Blockchain-powered insurance with transparent, immutable records.'
    },
    {
      icon: <Globe className="text-blue-700" size={48} />,
      title: 'Decentralized',
      description: 'No intermediaries, direct peer-to-peer insurance ecosystem.'
    },
    {
      icon: <Lock className="text-blue-700" size={48} />,
      title: 'Privacy Protected',
      description: 'Advanced cryptographic techniques ensure data confidentiality.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-50 p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-blue-800 text-center mb-6">
          About InsureDApp
        </h1>
        <p className="text-blue-600 text-center text-xl mb-8">
          Revolutionizing Health Insurance Through Blockchain Technology
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm text-center"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h2 className="text-xl font-semibold text-blue-800 mb-3">
                {feature.title}
              </h2>
              <p className="text-blue-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
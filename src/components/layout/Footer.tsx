import React from 'react';
import { Link } from 'react-router-dom';
import { Shield} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <Shield color="white" size={32} />
            <span className="ml-2 text-xl font-bold">InsureDApp</span>
          </div>
          <p className="text-blue-200">
            Decentralized Health Insurance Platform
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <nav className="space-y-2">
            <Link to="/" className="block hover:text-blue-300">Home</Link>
            <Link to="/about" className="block hover:text-blue-300">About</Link>
            <Link to="/policies" className="block hover:text-blue-300">Policies</Link>
            <Link to="/claims" className="block hover:text-blue-300">Claims</Link>
          </nav>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Legal</h3>
          <nav className="space-y-2">
            <a href="#" className="block hover:text-blue-300">Privacy Policy</a>
            <a href="#" className="block hover:text-blue-300">Terms of Service</a>
            <a href="#" className="block hover:text-blue-300">Disclaimer</a>
          </nav>
        </div>

        <div>
          
        </div>
      </div>
      <div className="text-center mt-8 pt-4 border-t border-blue-700">
        <p className="text-blue-300">
          © {new Date().getFullYear()} InsureDApp. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
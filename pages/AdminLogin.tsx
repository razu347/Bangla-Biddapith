
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate verification with sheet password
    setTimeout(() => {
      setIsLoading(false);
      if (password === 'admin123') { // Simple mock
        onLogin();
        navigate('/admin/dashboard');
      } else {
        setError('Incorrect Administrative Password');
      }
    }, 1500);
  };

  return (
    <Layout title="Admin Control Panel">
      {isLoading && <Loader />}
      
      <div className="px-6 pt-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-orange-500 text-white rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200">
              <ShieldAlert size={40} className="-rotate-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Admin Login</h2>
            <p className="text-gray-400 text-sm mt-2">Restricted Area - Authorized Personnel Only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full pl-12 pr-4 py-5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold italic">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-black active:scale-[0.98] transition-all"
            >
              Verify & Enter
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;

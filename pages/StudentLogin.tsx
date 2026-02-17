
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hash, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { MOCK_STUDENTS } from '../services/mockData';
import { Student } from '../types';

interface StudentLoginProps {
  onLogin: (student: Student) => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin }) => {
  const [roll, setRoll] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const student = MOCK_STUDENTS.find(s => s.roll === roll && s.class === studentClass);
      setIsLoading(false);
      if (student) {
        onLogin(student);
        navigate('/student/dashboard');
      } else {
        setError('Invalid Roll or Class. Please try again.');
      }
    }, 1500);
  };

  return (
    <Layout title="Student Login">
      {isLoading && <Loader />}
      
      <div className="px-6 pt-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-orange-50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-500 text-sm mt-1">Please enter your details to view your progress</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Student Roll</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="number" 
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  placeholder="Enter your roll number"
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Class</label>
              <select 
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                required
              >
                <option value="">Choose Class</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-medium animate-bounce">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-orange-600 active:scale-[0.98] transition-all"
            >
              Access Dashboard
              <ArrowRight size={20} />
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StudentLogin;

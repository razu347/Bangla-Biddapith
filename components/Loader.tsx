
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-orange-600 font-medium animate-pulse">Loading...</p>
    </div>
  );
};

export default Loader;

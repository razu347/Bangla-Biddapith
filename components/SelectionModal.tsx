
import React from 'react';
import { X, CheckCircle2, Circle } from 'lucide-react';

interface SelectionModalProps {
  isOpen: boolean;
  title: string;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ 
  isOpen, 
  title, 
  options, 
  selectedOption, 
  onSelect, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
      <div className="bg-[#1e252b] w-full max-w-sm rounded-[40px] overflow-hidden flex flex-col max-h-[80vh] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1e252b] sticky top-0 z-10">
          <h3 className="text-white text-lg font-black uppercase tracking-widest">-- {title} --</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                onClose();
              }}
              className="w-full px-6 py-5 flex justify-between items-center border-b border-white/5 last:border-none active:bg-white/5 transition-colors group"
            >
              <span className={`text-base font-bold transition-colors ${selectedOption === option ? 'text-[#23d4ca]' : 'text-gray-300 group-hover:text-white'}`}>
                {option}
              </span>
              <div className="flex items-center justify-center">
                {selectedOption === option ? (
                  <div className="w-6 h-6 rounded-full border-2 border-[#23d4ca] flex items-center justify-center bg-[#23d4ca] shadow-[0_0_15px_rgba(35,212,202,0.3)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1e252b]" />
                  </div>
                ) : (
                  <Circle className="text-gray-600" size={24} strokeWidth={1.5} />
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-6 bg-[#1e252b]/50 border-t border-white/5">
           <button onClick={onClose} className="w-full py-4 bg-white/5 text-gray-400 rounded-2xl font-black uppercase text-xs tracking-widest active:bg-white/10 transition-all">
             CLOSE
           </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;

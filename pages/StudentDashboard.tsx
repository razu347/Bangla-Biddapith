
import React, { useState } from 'react';
import { Award, Download, Info, X, User, Calendar, GraduationCap, AlertCircle, PhoneCall, Mail, MapPin, Clock, Smartphone } from 'lucide-react';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { Student } from '../types';
import { MOCK_RESULTS } from '../services/mockData';

interface StudentDashboardProps {
  student: Student;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ student }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const results = MOCK_RESULTS.filter(r => r.studentId === student.id);

  const total = results.reduce((acc, curr) => ({
    mcq: acc.mcq + curr.mcq,
    cq: acc.cq + curr.cq,
    total: acc.total + (curr.mcq + curr.cq),
  }), { mcq: 0, cq: 0, total: 0 });

  const handleDownloadPDF = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.print();
    }, 1000);
  };

  return (
    <Layout title="Student Dashboard">
      {isLoading && <Loader />}
      
      <div className="flex flex-col gap-6 px-4 py-6 max-w-4xl mx-auto mb-20">
        {/* Main Profile Summary */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[40px] p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-white text-orange-500 flex items-center justify-center text-3xl font-black shadow-lg">
              {student.name[0]}
            </div>
            <div>
              <h2 className="text-2xl font-black leading-tight">{student.name}</h2>
              <p className="text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">{student.school}</p>
              <div className="flex gap-2 mt-3">
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Class {student.class}</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Roll {student.roll}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-50 text-green-500 rounded-2xl"><Calendar size={24}/></div>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attendance Status</p>
                <p className="text-lg font-black text-gray-800">95% (Excellent)</p>
             </div>
          </div>
          <Award className="text-orange-500" size={32} />
        </div>

        {/* Result Table Section */}
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
           <div className="px-6 py-5 border-b border-gray-50 bg-gray-50/50">
              <h3 className="font-black text-gray-800 uppercase tracking-tighter flex items-center gap-2">
                <GraduationCap className="text-orange-500" size={20}/> Result Card
              </h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full">
                 <thead>
                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                       <th className="px-6 py-4 text-left">Exam Name</th>
                       <th className="px-4 py-4 text-center">MCQ</th>
                       <th className="px-4 py-4 text-center">CQ</th>
                       <th className="px-6 py-4 text-right">Total</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {results.map((r, i) => (
                      <tr key={i} className="text-sm font-bold text-gray-700">
                         <td className="px-6 py-4">{r.examName}</td>
                         <td className="px-4 py-4 text-center text-gray-400">{r.mcq}</td>
                         <td className="px-4 py-4 text-center text-gray-400">{r.cq}</td>
                         <td className="px-6 py-4 text-right font-black text-orange-500">{r.mcq + r.cq}</td>
                      </tr>
                    ))}
                    {/* TOTAL ROW as requested */}
                    <tr className="bg-orange-500 text-white font-black uppercase text-xs">
                       <td className="px-6 py-4">Grand Total</td>
                       <td className="px-4 py-4 text-center">{total.mcq}</td>
                       <td className="px-4 py-4 text-center">{total.cq}</td>
                       <td className="px-6 py-4 text-right text-lg">{total.total}</td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>

        {/* Quick Buttons */}
        <div className="grid grid-cols-2 gap-4">
           <button 
             onClick={handleDownloadPDF}
             className="bg-gray-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
           >
              <Download size={18}/> PDF Result
           </button>
           <button 
             onClick={() => setShowInfo(true)}
             className="bg-white border-2 border-gray-100 text-gray-400 py-5 rounded-3xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 active:bg-gray-50 transition-all"
           >
              <Info size={18}/> Student Info
           </button>
        </div>
      </div>

      {/* Student Info Popup */}
      {showInfo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-10 animate-in zoom-in-95 duration-300 relative">
              <button onClick={() => setShowInfo(false)} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-orange-500 transition-colors">
                <X size={24}/>
              </button>
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mb-4">
                  <User size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight">Personal Details</h3>
              </div>
              
              <div className="space-y-5">
                 <DetailItem icon={<User size={16}/>} label="Full Name" value={student.name} />
                 <DetailItem icon={<Info size={16}/>} label="Roll & ID" value={`Roll ${student.roll} (${student.id})`} />
                 <DetailItem icon={<GraduationCap size={16}/>} label="Class" value={`Class ${student.class}`} />
                 <DetailItem icon={<MapPin size={16}/>} label="School" value={student.school} />
                 <DetailItem icon={<Clock size={16}/>} label="Batch Time" value={student.batchTime} />
                 <DetailItem icon={<Smartphone size={16}/>} label="Mobile" value={student.mobile} />
                 <div className="pt-4 border-t border-dashed border-gray-100 mt-2 flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Tuition Dues</p>
                       <p className={`text-3xl font-black ${student.due > 0 ? 'text-red-500' : 'text-green-500'}`}>৳ {student.due}</p>
                    </div>
                    {student.due > 0 && <AlertCircle className="text-red-500" size={32} />}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Hidden Print Content */}
      <div className="hidden print:block fixed inset-0 bg-white p-12 z-[9999]">
         <div className="text-center mb-10 pb-8 border-b-4 border-gray-900">
            <h1 className="text-4xl font-black uppercase mb-1">Bangla Biddapith</h1>
            <h2 className="text-xl font-bold text-gray-600">Student Progress Report Card</h2>
            <p className="text-xs font-medium text-gray-400 mt-1">Academic Session 2024</p>
         </div>
         <div className="grid grid-cols-2 gap-6 mb-8 text-sm">
            <div><span className="font-bold text-gray-400 mr-2">NAME:</span> <span className="font-black">{student.name.toUpperCase()}</span></div>
            <div><span className="font-bold text-gray-400 mr-2">CLASS:</span> <span className="font-black">{student.class}</span></div>
            <div><span className="font-bold text-gray-400 mr-2">ROLL:</span> <span className="font-black">{student.roll}</span></div>
            <div><span className="font-bold text-gray-400 mr-2">ID:</span> <span className="font-black">{student.id}</span></div>
            <div className="col-span-2"><span className="font-bold text-gray-400 mr-2">SCHOOL:</span> <span className="font-black">{student.school}</span></div>
         </div>
         <table className="w-full border-collapse border-4 border-gray-900 mb-10">
            <thead>
               <tr className="bg-gray-100 text-[10px] font-black uppercase">
                  <th className="border-4 border-gray-900 p-3">Subject Name</th>
                  <th className="border-4 border-gray-900 p-3">MCQ</th>
                  <th className="border-4 border-gray-900 p-3">CQ</th>
                  <th className="border-4 border-gray-900 p-3">Total</th>
               </tr>
            </thead>
            <tbody className="text-center font-bold">
               {results.map((r, i) => (
                  <tr key={i}>
                     <td className="border-2 border-gray-900 p-3 text-left">{r.examName}</td>
                     <td className="border-2 border-gray-900 p-3">{r.mcq}</td>
                     <td className="border-2 border-gray-900 p-3">{r.cq}</td>
                     <td className="border-2 border-gray-900 p-3">{r.mcq + r.cq}</td>
                  </tr>
               ))}
               <tr className="bg-gray-900 text-white font-black text-lg">
                  <td className="border-4 border-gray-900 p-4 text-left uppercase text-xs">Final Totals</td>
                  <td className="border-4 border-gray-900 p-4">{total.mcq}</td>
                  <td className="border-4 border-gray-900 p-4">{total.cq}</td>
                  <td className="border-4 border-gray-900 p-4 text-orange-400">{total.total}</td>
               </tr>
            </tbody>
         </table>
         <div className="flex justify-between items-end mt-20 px-4">
            <div className="w-56 border-t-2 border-gray-900 pt-3 text-center font-black uppercase text-[10px]">Director Signature</div>
            <div className="w-56 border-t-2 border-gray-900 pt-3 text-center font-black uppercase text-[10px]">Guardian Signature</div>
         </div>
      </div>
    </Layout>
  );
};

const StatBox = ({ label, value, icon }: any) => (
  <div className="bg-white/10 p-5 rounded-3xl border border-white/10 backdrop-blur-md">
    <div className="flex items-center gap-2 mb-1">
      <div className="text-orange-200">{icon}</div>
      <p className="text-[9px] font-black uppercase text-orange-200 tracking-widest">{label}</p>
    </div>
    <p className="text-2xl font-black">{value}</p>
  </div>
);

const DetailItem = ({ icon, label, value }: any) => (
  <div className="flex items-start gap-4">
     <div className="mt-1 text-orange-500">{icon}</div>
     <div>
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-gray-700">{value}</p>
     </div>
  </div>
);

export default StudentDashboard;

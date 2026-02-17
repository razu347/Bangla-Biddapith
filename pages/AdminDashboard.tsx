import React, { useState, useMemo } from 'react';
import { 
  Wallet, GraduationCap, CalendarCheck, Search, Printer, Edit, Trash2, 
  Check, X, Calendar as CalendarIcon, UserPlus, Home as HomeIcon,
  ChevronDown, Smartphone, PhoneCall, MessageCircle, MessageSquare, 
  UserCheck, UserX, AlertCircle, Save, History, CheckCheck, Download,
  FileSpreadsheet, Users, TrendingUp, DollarSign, Receipt, Briefcase, Plus,
  CreditCard, Info, Star
} from 'lucide-react';
import * as XLSX from 'xlsx';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import SuccessModal from '../components/SuccessModal';
import SelectionModal from '../components/SelectionModal';
import { MOCK_STUDENTS, MOCK_ATTENDANCE, MOCK_STAFF, MOCK_EXPENSES, MOCK_STAFF_PAYMENTS } from '../services/mockData';
import { Student, AttendanceRecord, Staff, CoachingExpense, StaffPayment } from '../types';
import { BATCH_TIMES } from '../constants';

type AdminTab = 'overview' | 'payment' | 'result' | 'attendance' | 'staff';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [expenses, setExpenses] = useState<CoachingExpense[]>(MOCK_EXPENSES);
  const [staffPayments, setStaffPayments] = useState<StaffPayment[]>(MOCK_STAFF_PAYMENTS);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterBatch, setFilterBatch] = useState('');
  const [dueOnly, setDueOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [isBatchSelectorOpen, setIsBatchSelectorOpen] = useState(false);
  const [selectorContext, setSelectorContext] = useState<'filter' | 'form'>('filter');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showStaffHistoryPopup, setShowStaffHistoryPopup] = useState<Staff | null>(null);
  const [showStaffPaymentModal, setShowStaffPaymentModal] = useState<Staff | null>(null);
  
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const [showCommentPopup, setShowCommentPopup] = useState<{id: string, name: string} | null>(null);
  const [showHistoryPopup, setShowHistoryPopup] = useState<Student | null>(null);
  const [commentText, setCommentText] = useState('');
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [printModal, setPrintModal] = useState(false);
  const [printHeadings, setPrintHeadings] = useState({ h1: 'Bangla Biddapith', h2: 'Student List', h3: 'Academic Session 2024' });
  const [successMsg, setSuccessMsg] = useState('');

  const [globalExamName, setGlobalExamName] = useState('');
  const [tempResults, setTempResults] = useState<Record<string, { mcq: string, cq: string }>>({});

  const [formData, setFormData] = useState({
    name: '', roll: '', class: '', school: '', batchTime: '', mobile: '', payment: '0', due: '0'
  });

  const [staffFormData, setStaffFormData] = useState({
    name: '', role: '', salary: '', mobile: '', status: 'unpaid' as 'paid' | 'unpaid'
  });

  const [expenseFormData, setExpenseFormData] = useState({
    category: '', amount: '', note: ''
  });

  const [staffPayData, setStaffPayData] = useState({
    amount: '', type: 'salary' as 'salary' | 'extra', note: ''
  });

  const handleTabChange = (tab: AdminTab) => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsLoading(false);
    }, 400);
  };

  const financials = useMemo(() => {
    const studentIncome = students.reduce((sum, s) => sum + s.payment, 0);
    const totalDue = students.reduce((sum, s) => sum + s.due, 0);
    const staffPaymentsTotal = staffPayments.reduce((sum, p) => sum + p.amount, 0);
    const operationalExpenses = expenses.reduce((sum, ex) => sum + ex.amount, 0);
    const totalOut = staffPaymentsTotal + operationalExpenses;
    
    return {
      income: studentIncome,
      due: totalDue,
      out: totalOut,
      net: studentIncome - totalOut
    };
  }, [students, staffPayments, expenses]);

  const stats = useMemo(() => ({
    totalStudents: students.filter(s => s.status === 'active').length,
    totalTaka: financials.income,
    totalDue: financials.due,
  }), [students, financials]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           s.id.toLowerCase().includes(search.toLowerCase()) ||
                           s.roll.includes(search);
      const matchesClass = filterClass === '' || s.class === filterClass;
      const matchesBatch = filterBatch === '' || s.batchTime === filterBatch;
      const matchesDue = dueOnly ? s.due > 0 : true;
      return matchesSearch && matchesClass && matchesBatch && matchesDue && s.status === 'active';
    });
  }, [students, search, filterClass, filterBatch, dueOnly]);

  const handleUpdatePayment = (id: string, amount: string) => {
    const val = parseInt(amount) || 0;
    if (val <= 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setStudents(prev => prev.map(s => s.id === id ? { 
        ...s, 
        payment: s.payment + val, 
        due: Math.max(0, s.due - val) 
      } : s));
      setIsLoading(false);
      setSuccessMsg(`৳${val} payment recorded successfully!`);
    }, 600);
  };

  const toggleAttendance = (id: string) => {
    setAttendance(prev => ({
      ...prev,
      [id]: {
        studentId: id,
        date: selectedDate,
        status: prev[id]?.status === 'Present' ? 'Absent' : 'Present',
        comment: prev[id]?.comment
      }
    }));
  };

  const handleStaffPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showStaffPaymentModal || !staffPayData.amount) return;
    setIsLoading(true);
    setTimeout(() => {
      const newPay: StaffPayment = {
        id: `SP${Date.now()}`,
        staffId: showStaffPaymentModal.id,
        amount: parseInt(staffPayData.amount) || 0,
        date: new Date().toISOString().split('T')[0],
        type: staffPayData.type,
        note: staffPayData.note
      };
      setStaffPayments(prev => [...prev, newPay]);
      setIsLoading(false);
      setShowStaffPaymentModal(null);
      setSuccessMsg(`${staffPayData.type === 'salary' ? 'Salary' : 'Extra payment'} recorded!`);
    }, 800);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFormData.name || !staffFormData.salary) return;
    setIsLoading(true);
    setTimeout(() => {
      const sData: Staff = {
        id: editingStaff ? editingStaff.id : `ST${Math.floor(100 + Math.random() * 900)}`,
        name: staffFormData.name,
        role: staffFormData.role,
        salary: parseInt(staffFormData.salary) || 0,
        mobile: staffFormData.mobile,
        status: 'unpaid'
      };
      if (editingStaff) setStaff(prev => prev.map(s => s.id === editingStaff.id ? sData : s));
      else setStaff(prev => [...prev, sData]);
      setIsLoading(false);
      setShowStaffModal(false);
      setSuccessMsg("Staff information saved!");
    }, 800);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.class || !formData.roll) return;
    setIsLoading(true);
    setTimeout(() => {
      const studentData: Student = {
        id: editingStudent ? editingStudent.id : `S${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name, roll: formData.roll, class: formData.class,
        school: formData.school, batchTime: formData.batchTime, mobile: formData.mobile,
        payment: parseInt(formData.payment) || 0, due: parseInt(formData.due) || 0,
        status: 'active'
      };
      if (editingStudent) setStudents(prev => prev.map(s => s.id === editingStudent.id ? studentData : s));
      else setStudents(prev => [...prev, studentData]);
      setIsLoading(false);
      setShowAddModal(false);
      setSuccessMsg("Student database updated!");
    }, 800);
  };

  const handleExportExcel = () => {
    const exportData = filteredStudents.map(s => ({
      "ID": s.id, "Name": s.name, "Roll": s.roll, "Class": s.class, 
      "Batch": s.batchTime, "Mobile": s.mobile, "Paid": s.payment, "Due": s.due
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `Students_${selectedDate}.xlsx`);
    setSuccessMsg("Excel Exported!");
  };

  const handleExportStaffExcel = () => {
    const exportData = staff.map(s => ({
      "Staff ID": s.id, "Name": s.name, "Role": s.role, "Salary": s.salary, "Mobile": s.mobile
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff");
    XLSX.writeFile(workbook, `Staff_List.xlsx`);
    setSuccessMsg("Staff Exported!");
  };

  const staffHistory = useMemo(() => {
    if (!showStaffHistoryPopup) return [];
    return staffPayments.filter(p => p.staffId === showStaffHistoryPopup.id);
  }, [showStaffHistoryPopup, staffPayments]);

  const currentHistory = useMemo(() => {
    if (!showHistoryPopup) return [];
    const historic = MOCK_ATTENDANCE.filter(r => r.studentId === showHistoryPopup.id);
    const current = attendance[showHistoryPopup.id] ? [attendance[showHistoryPopup.id]] : [];
    return [...historic, ...current].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [showHistoryPopup, attendance]);

  return (
    <Layout title="Admin Hub">
      {isLoading && <Loader />}
      <SuccessModal isOpen={!!successMsg} message={successMsg} onClose={() => setSuccessMsg('')} />
      
      <SelectionModal 
        isOpen={isBatchSelectorOpen} 
        title="Batch Selection" 
        options={BATCH_TIMES} 
        selectedOption={selectorContext === 'filter' ? filterBatch : formData.batchTime}
        onSelect={(val) => selectorContext === 'filter' ? setFilterBatch(val) : setFormData({ ...formData, batchTime: val })}
        onClose={() => setIsBatchSelectorOpen(false)}
      />

      {/* Global Stat Bar */}
      <div className="px-4 md:px-10 py-4 bg-white border-b border-gray-100 grid grid-cols-3 gap-2 sticky top-16 md:top-20 z-30 shadow-sm">
        <StatItem label="TOTAL STUDENTS" value={stats.totalStudents} color="bg-orange-50 text-orange-600" />
        <StatItem label="TOTAL INCOME" value={`৳${financials.income}`} color="bg-green-50 text-green-600" />
        <StatItem label="PENDING DUE" value={`৳${financials.due}`} color="bg-red-50 text-red-600" />
      </div>

      {/* Top Search & Filter Panel (Only for Student Tabs) */}
      {activeTab !== 'overview' && activeTab !== 'staff' && (
        <div className="px-4 md:px-10 py-5 bg-gray-50 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" placeholder="Search ID, Roll or Name..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-sm outline-none font-bold text-sm border border-transparent focus:border-orange-500 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={handleExportExcel} className="bg-green-500 text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-transform"><FileSpreadsheet size={22}/></button>
              <button onClick={() => setPrintModal(true)} className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-transform"><Printer size={22}/></button>
              <button onClick={() => { setEditingStudent(null); setShowAddModal(true); }} className="bg-orange-500 text-white px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-transform"><UserPlus size={18}/> NEW STUDENT</button>
            </div>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="bg-white h-12 px-4 rounded-xl font-black text-[10px] uppercase shadow-sm outline-none">
                <option value="">ALL CLASSES</option>
                {['7','8','9','10'].map(c => <option key={c} value={c}>CLASS {c}</option>)}
            </select>
            <button onClick={() => { setSelectorContext('filter'); setIsBatchSelectorOpen(true); }} className="bg-white h-12 px-4 rounded-xl font-black text-[10px] uppercase shadow-sm whitespace-nowrap">{filterBatch || 'ALL BATCHES'}</button>
            <div onClick={() => setDueOnly(!dueOnly)} className={`h-12 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm ${dueOnly ? 'bg-orange-500 text-white' : 'bg-white text-gray-400'}`}>
                <span className="text-[10px] font-black uppercase">DUE ONLY</span>
            </div>
            {activeTab === 'attendance' && (
              <div className="h-12 bg-white px-4 rounded-xl flex items-center gap-2 shadow-sm">
                <CalendarIcon size={14} className="text-orange-500"/>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-[10px] font-black outline-none" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="px-4 md:px-10 pb-44 pt-4">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mb-4"><TrendingUp size={32}/></div>
                   <h3 className="text-3xl font-black text-gray-800">৳{financials.income}</h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Student Income</p>
                </div>
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                   <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-4"><Receipt size={32}/></div>
                   <h3 className="text-3xl font-black text-gray-800">৳{financials.out}</h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Expenses & Salaries</p>
                </div>
             </div>
             <div className="bg-gray-900 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/20"><DollarSign size={32} /></div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Operational Balance</p>
                      <h3 className="text-3xl font-black">৳{financials.net}</h3>
                   </div>
                </div>
                <button onClick={() => window.print()} className="bg-orange-500 hover:bg-orange-600 px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl active:scale-95">Generate PDF Summary</button>
             </div>
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === 'payment' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
             {filteredStudents.map(student => (
                <div key={student.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-black text-xl group-hover:bg-orange-500 group-hover:text-white transition-all">{student.roll}</div>
                         <div>
                            <h4 className="text-base font-black text-gray-800 leading-none uppercase">{student.name}</h4>
                            <p className="text-[9px] text-gray-400 font-bold uppercase mt-1.5">ID: {student.id} • {student.school}</p>
                         </div>
                      </div>
                      <div className="flex gap-1">
                         <button onClick={() => openEditModal(student)} className="p-2 text-gray-300 hover:text-orange-500 transition-all"><Edit size={18}/></button>
                         <button className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-gray-50 space-y-4">
                      <div className="flex justify-between items-end">
                         <div><p className="text-[8px] font-black text-gray-400 uppercase">PAID</p><p className="text-2xl font-black text-green-600 tracking-tighter">৳{student.payment}</p></div>
                         <div className="text-right"><p className="text-[8px] font-black text-gray-400 uppercase">DUE</p><p className="text-2xl font-black text-red-500 tracking-tighter">৳{student.due}</p></div>
                      </div>
                      <div className="flex gap-2">
                         <input id={`p-${student.id}`} type="number" placeholder="৳ Amount" className="flex-1 bg-gray-50 py-4 px-5 rounded-2xl outline-none font-black text-sm" />
                         <button onClick={() => { const i = document.getElementById(`p-${student.id}`) as HTMLInputElement; handleUpdatePayment(student.id, i.value); i.value=''; }} className="bg-gray-900 text-white px-6 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">PAY</button>
                      </div>
                      <div className="flex gap-2">
                         <a href={`tel:${student.mobile}`} className="flex-1 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[9px]"><PhoneCall size={16}/> CALL</a>
                         <a href={`sms:${student.mobile}?body=Bangla Biddapith: Hello ${student.name}, payment ৳${student.payment} recorded. Remaining due: ৳${student.due}.`} className="flex-1 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center gap-2 font-black uppercase text-[9px]"><MessageCircle size={16}/> SMS DUE</a>
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}

        {/* RESULT TAB */}
        {activeTab === 'result' && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="bg-orange-500 p-8 rounded-[40px] text-white flex flex-col md:flex-row items-center gap-6 shadow-xl">
                <div className="flex-1 text-center md:text-left">
                   <h3 className="text-2xl font-black uppercase tracking-tight">Bulk Result Entry</h3>
                   <p className="text-[10px] font-black opacity-80 uppercase tracking-widest">Apply mark updates for selected batch</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                   <input placeholder="Exam Title (Monthly-1)" value={globalExamName} onChange={(e) => setGlobalExamName(e.target.value)} className="w-full sm:w-64 px-6 py-4 rounded-2xl bg-white text-gray-800 font-bold outline-none shadow-inner" />
                   <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={() => setSuccessMsg("Bulk Results Updated!")} className="flex-1 sm:flex-none bg-gray-900 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">SAVE ALL</button>
                      <button onClick={() => setSuccessMsg("SMS notifications sent!")} className="flex-1 sm:flex-none bg-white text-orange-600 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">SMS ALL</button>
                   </div>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredStudents.map(student => (
                  <div key={student.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-4">
                           <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-black">{student.roll}</div>
                           <div><h4 className="text-base font-black text-gray-800 uppercase">{student.name}</h4><p className="text-[9px] text-gray-400 font-bold uppercase">ID: {student.id}</p></div>
                        </div>
                        <button className="p-2 text-orange-500 bg-orange-50 rounded-lg" onClick={() => setShowHistoryPopup(student)}><Info size={18}/></button>
                     </div>
                     <div className="grid grid-cols-3 gap-3">
                        <MarkInput label="MCQ" />
                        <MarkInput label="CQ" />
                        <div className="bg-orange-500 rounded-2xl flex flex-col items-center justify-center text-white shadow-inner">
                           <span className="text-[8px] font-black opacity-60">TOTAL</span>
                           <span className="text-xl font-black">00</span>
                        </div>
                     </div>
                     <div className="flex gap-2 mt-4">
                        <button onClick={() => setSuccessMsg(`Saved for ${student.name}`)} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">UPDATE</button>
                        <button 
                          onClick={() => {
                            const exam = globalExamName || 'Result';
                            const body = `Result: ${student.name} (Roll ${student.roll}). Exam: ${exam}. Check dashboard for full marks.`;
                            window.open(`sms:${student.mobile}?body=${encodeURIComponent(body)}`);
                          }}
                          className="px-6 bg-blue-500 text-white rounded-2xl shadow-lg active:scale-95 transition-all"><Smartphone size={20}/></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest">
                      <tr>
                        <th className="px-6 py-5 w-16 text-center">ROLL</th>
                        <th className="px-2 py-5">STUDENT INFO</th>
                        <th className="px-4 py-5 text-center">STATUS</th>
                        <th className="px-6 py-5 text-right">ACTION</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      {filteredStudents.map(student => {
                        const isPresent = attendance[student.id]?.status === 'Present';
                        const comment = attendance[student.id]?.comment;
                        return (
                          <tr key={student.id} className={isPresent ? 'bg-green-50/20' : 'bg-white'}>
                             <td className="px-6 py-5 text-center"><button onClick={() => setShowHistoryPopup(student)} className="w-9 h-9 rounded-full bg-white border border-gray-100 font-black text-gray-400 text-sm shadow-sm">{student.roll}</button></td>
                             <td className="px-2 py-5 font-black text-xs uppercase text-gray-700">
                                {student.name}
                                {comment && <div className="mt-1 text-[8px] italic text-orange-500 flex items-center gap-1"><MessageSquare size={8}/> {comment}</div>}
                             </td>
                             <td className="px-4 py-5 text-center">
                                <button 
                                  onClick={() => toggleAttendance(student.id)} 
                                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto transition-all ${isPresent ? 'bg-green-500 border-green-200 text-white shadow-lg' : 'bg-gray-50 border-gray-100 text-gray-300'}`}
                                >
                                  {isPresent ? <Check size={18} strokeWidth={4}/> : <X size={16}/>}
                                </button>
                             </td>
                             <td className="px-6 py-5 text-right">
                                <div className="flex justify-end gap-1.5">
                                   <button onClick={() => setShowCommentPopup({id: student.id, name: student.name})} className="w-8 h-8 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shadow-sm"><MessageSquare size={14}/></button>
                                   <a href={`tel:${student.mobile}`} className="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shadow-sm"><PhoneCall size={14}/></a>
                                   <a href={`sms:${student.mobile}?body=Hello, ${student.name} is ${isPresent ? 'PRESENT' : 'ABSENT'} today.`} className="w-8 h-8 bg-green-50 text-green-500 rounded-lg flex items-center justify-center shadow-sm"><MessageCircle size={14}/></a>
                                </div>
                             </td>
                          </tr>
                        );
                      })}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {/* STAFF TAB */}
        {activeTab === 'staff' && (
          <div className="space-y-6 animate-in fade-in duration-500 pb-20">
             <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">Staff Management</h3>
                <div className="flex gap-2">
                   <button onClick={handleExportStaffExcel} className="bg-green-500 text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all"><FileSpreadsheet size={22}/></button>
                   <button onClick={() => { setEditingStaff(null); setStaffFormData({ name: '', role: '', salary: '', mobile: '', status: 'unpaid' }); setShowStaffModal(true); }} className="bg-gray-900 text-white px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all">
                      <Plus size={16}/> ADD STAFF
                   </button>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.map(member => (
                   <div key={member.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 group">
                      <div className="flex justify-between items-start mb-6">
                         <div className="flex gap-4 cursor-pointer" onClick={() => setShowStaffHistoryPopup(member)}>
                            <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-black group-hover:bg-orange-500 group-hover:text-white transition-all"><Users size={28}/></div>
                            <div><h4 className="text-base font-black text-gray-800 uppercase">{member.name}</h4><p className="text-[9px] text-gray-400 font-bold uppercase mt-1.5">{member.role}</p></div>
                         </div>
                         <div className="flex gap-1">
                            <button onClick={() => openEditStaffModal(member)} className="p-2 text-gray-300 hover:text-orange-500 transition-all"><Edit size={18}/></button>
                            <button onClick={() => handleDeleteStaff(member.id)} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={18}/></button>
                         </div>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                         <div><p className="text-[8px] font-black text-gray-400 uppercase">Monthly Salary</p><p className="text-xl font-black text-gray-800">৳{member.salary}</p></div>
                         <div className="flex gap-2">
                            <a href={`tel:${member.mobile}`} className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-sm"><PhoneCall size={18}/></a>
                            <button onClick={() => { setShowStaffPaymentModal(member); setStaffPayData({...staffPayData, amount: member.salary.toString()}) }} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-orange-100 active:scale-95 transition-all">PAY BILL</button>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                   <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Extra Expenses</h3>
                   <button onClick={() => setShowExpenseModal(true)} className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all">+ New Bill</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                         <tr><th className="px-8 py-4">CATEGORY</th><th className="px-4 py-4">DATE</th><th className="px-4 py-4 text-right">AMOUNT</th><th className="px-8 py-4 text-right">NOTE</th></tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {expenses.map(ex => (
                            <tr key={ex.id} className="text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                               <td className="px-8 py-5 flex items-center gap-3"><div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><Receipt size={14}/></div>{ex.category}</td>
                               <td className="px-4 py-5">{ex.date}</td>
                               <td className="px-4 py-5 text-right font-black text-gray-800">৳{ex.amount}</td>
                               <td className="px-8 py-5 text-right text-[10px] text-gray-400 italic">"{ex.note || '---'}"</td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* ADMIN BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-6 left-6 right-6 h-20 bg-white/95 backdrop-blur-xl border border-gray-100 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.15)] z-[60] flex justify-around items-center px-4 md:max-w-lg md:mx-auto">
         <AdminTabBtn active={activeTab === 'overview'} icon={<HomeIcon size={20}/>} label="Home" onClick={() => handleTabChange('overview')} />
         <AdminTabBtn active={activeTab === 'payment'} icon={<Wallet size={20}/>} label="Pay" onClick={() => handleTabChange('payment')} />
         <AdminTabBtn active={activeTab === 'result'} icon={<GraduationCap size={20}/>} label="Result" onClick={() => handleTabChange('result')} />
         <AdminTabBtn active={activeTab === 'attendance'} icon={<CalendarCheck size={20}/>} label="Attnd" onClick={() => handleTabChange('attendance')} />
         <AdminTabBtn active={activeTab === 'staff'} icon={<Briefcase size={20}/>} label="Stuff" onClick={() => handleTabChange('staff')} />
      </nav>

      {/* DYNAMIC MODALS & POPUPS */}
      
      {/* Student Enrollment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200] flex items-center justify-center p-6 overflow-y-auto animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-[40px] p-8 md:p-12 animate-in zoom-in-95 duration-500 shadow-2xl overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-3xl font-black text-gray-800 tracking-tighter uppercase">{editingStudent ? 'Update Profile' : 'Student Enrollment'}</h3>
                 <button onClick={() => setShowAddModal(false)} className="p-3 text-gray-300 hover:text-red-500"><X size={24}/></button>
              </div>
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-5" onSubmit={handleEnrollSubmit}>
                 <ModalInput label="FULL NAME" value={formData.name} onChange={(e:any) => setFormData({...formData, name: e.target.value})} className="sm:col-span-2" />
                 <ModalInput label="ROLL NUMBER" value={formData.roll} onChange={(e:any) => setFormData({...formData, roll: e.target.value})} />
                 <ModalInput label="CLASS" value={formData.class} onChange={(e:any) => setFormData({...formData, class: e.target.value})} />
                 <ModalInput label="MOBILE" value={formData.mobile} onChange={(e:any) => setFormData({...formData, mobile: e.target.value})} />
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-gray-400 uppercase ml-2">BATCH TIME</label>
                    <button type="button" onClick={() => { setSelectorContext('form'); setIsBatchSelectorOpen(true); }} className="w-full h-14 bg-gray-50 rounded-2xl px-5 text-sm font-bold flex justify-between items-center">
                       <span className="truncate">{formData.batchTime || 'Select Batch'}</span><ChevronDown size={14}/>
                    </button>
                 </div>
                 <ModalInput label="SCHOOL / COLLEGE" value={formData.school} onChange={(e:any) => setFormData({...formData, school: e.target.value})} className="sm:col-span-2" />
                 <ModalInput label="PAID (৳)" value={formData.payment} onChange={(e:any) => setFormData({...formData, payment: e.target.value})} />
                 <ModalInput label="DUE (৳)" value={formData.due} onChange={(e:any) => setFormData({...formData, due: e.target.value})} />
                 <div className="sm:col-span-2 flex gap-4 pt-8">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 bg-gray-100 text-gray-400 rounded-3xl font-black uppercase text-[10px]">CANCEL</button>
                    <button type="submit" className="flex-[2] py-5 bg-orange-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all">SAVE RECORD</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Staff Payment History Popup */}
      {showStaffHistoryPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-start mb-6">
                 <div><h3 className="text-2xl font-black text-gray-800">Payment History</h3><p className="text-[10px] text-gray-400 font-bold uppercase">{showStaffHistoryPopup.name}</p></div>
                 <button onClick={() => setShowStaffHistoryPopup(null)} className="p-2 text-gray-300 hover:text-red-500"><X size={24}/></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                 {staffHistory.length > 0 ? staffHistory.map(p => (
                    <div key={p.id} className="p-4 rounded-2xl border bg-gray-50 flex justify-between items-center">
                       <div><p className="text-xs font-black text-gray-800">{new Date(p.date).toLocaleDateString()}</p><p className="text-[9px] font-bold uppercase text-gray-400">{p.type === 'salary' ? 'Basic Salary' : 'Extra / Bonus'}</p></div>
                       <p className={`font-black ${p.type === 'extra' ? 'text-blue-500' : 'text-green-600'}`}>৳{p.amount}</p>
                    </div>
                 )) : <div className="text-center py-10 opacity-40">No payment records.</div>}
              </div>
           </div>
        </div>
      )}

      {/* Staff Pay Bill Modal */}
      {showStaffPaymentModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-gray-800 mb-8 uppercase">Staff Payout</h3>
              <form onSubmit={handleStaffPaymentSubmit} className="space-y-4">
                 <div className="flex bg-gray-100 p-1 rounded-2xl mb-4">
                    <button type="button" onClick={() => setStaffPayData({...staffPayData, type: 'salary'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${staffPayData.type === 'salary' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400'}`}>Salary</button>
                    <button type="button" onClick={() => setStaffPayData({...staffPayData, type: 'extra'})} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${staffPayData.type === 'extra' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400'}`}>Extra Tk</button>
                 </div>
                 <ModalInput label="AMOUNT (৳)" type="number" value={staffPayData.amount} onChange={(e: any) => setStaffPayData({...staffPayData, amount: e.target.value})} />
                 <ModalInput label="NOTE / REMARKS" value={staffPayData.note} onChange={(e: any) => setStaffPayData({...staffPayData, note: e.target.value})} />
                 <div className="flex gap-3 mt-10">
                    <button type="button" onClick={() => setShowStaffPaymentModal(null)} className="flex-1 py-5 bg-gray-100 text-gray-400 font-black text-[10px] uppercase rounded-3xl">CANCEL</button>
                    <button type="submit" className="flex-[2] py-5 bg-gray-900 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">CONFIRM PAY</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Attendance Comment Modal */}
      {showCommentPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[300] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-gray-800 mb-1">Add Remark</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-8">{showCommentPopup.name}</p>
              <textarea 
                autoFocus value={commentText} onChange={(e) => setCommentText(e.target.value)} 
                placeholder="Type behavioral notes, reason for absence, etc..." 
                className="w-full h-32 p-5 bg-gray-50 border-none rounded-2xl mb-8 outline-none focus:ring-4 focus:ring-orange-100 font-medium text-sm transition-all" 
              />
              <button onClick={() => { setAttendance({...attendance, [showCommentPopup.id]: {...attendance[showCommentPopup.id], comment: commentText}}); setShowCommentPopup(null); setCommentText(''); }} className="w-full py-5 bg-orange-500 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">SAVE REMARK</button>
           </div>
        </div>
      )}

      {/* Print Config Modal */}
      {printModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-black text-gray-800 text-center mb-8 uppercase">PDF List Config</h3>
              <div className="space-y-4 mb-10">
                 <ModalInput label="Line 1" value={printHeadings.h1} onChange={e => setPrintHeadings({...printHeadings, h1: (e.target as HTMLInputElement).value})} />
                 <ModalInput label="Line 2" value={printHeadings.h2} onChange={e => setPrintHeadings({...printHeadings, h2: (e.target as HTMLInputElement).value})} />
                 <ModalInput label="Line 3" value={printHeadings.h3} onChange={e => setPrintHeadings({...printHeadings, h3: (e.target as HTMLInputElement).value})} />
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setPrintModal(false)} className="flex-1 py-4 text-gray-400 font-black text-[10px] uppercase">BACK</button>
                 <button onClick={() => { window.print(); setPrintModal(false); }} className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">PRINT NOW</button>
              </div>
           </div>
        </div>
      )}
    </Layout>
  );
};

const StatItem = ({ label, value, color }: any) => (
  <div className={`p-4 rounded-[20px] ${color} shadow-sm flex flex-col items-center justify-center transition-all active:scale-95`}>
     <span className="text-[7px] font-black uppercase tracking-widest opacity-60 mb-0.5">{label}</span>
     <span className="text-sm font-black tracking-tighter">{value}</span>
  </div>
);

const AdminTabBtn = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-orange-500' : 'text-gray-300'}`}>
     <div className={`p-3 rounded-2xl transition-all duration-500 ${active ? 'bg-orange-50 shadow-inner' : ''}`}>
       {React.cloneElement(icon as React.ReactElement<any>, { size: active ? 24 : 20, strokeWidth: active ? 3 : 2 })}
     </div>
     <span className={`text-[9px] font-black uppercase tracking-tighter transition-all ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
  </button>
);

const ModalInput = ({ label, className = "", ...props }: any) => (
  <div className={`space-y-1 ${className}`}>
     <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">{label}</label>
     <input className="w-full h-14 bg-gray-50 border-none rounded-2xl px-6 text-sm font-bold focus:ring-4 focus:ring-orange-100 outline-none transition-all" {...props} />
  </div>
);

const MarkInput = ({ label }: { label: string }) => (
  <div className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center border border-transparent focus-within:border-orange-200 transition-colors shadow-inner">
    <span className="text-[8px] font-black uppercase text-gray-400 mb-1">{label}</span>
    <input type="number" placeholder="00" className="w-full bg-transparent text-center text-lg font-black outline-none" />
  </div>
);

export default AdminDashboard;
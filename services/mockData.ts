
import { Student, ExamResult, AttendanceRecord, Staff, CoachingExpense, StaffPayment } from '../types';

export const MOCK_STUDENTS: Student[] = [
  { id: 'S001', name: 'Rahim Ahmed', roll: '1', class: '9', school: 'Govt. High School', batchTime: 'Sat (4:15 PM)', mobile: '01712345678', payment: 5000, due: 1000, status: 'active' },
  { id: 'S002', name: 'Sumaiya Akter', roll: '2', class: '10', school: 'Model College', batchTime: 'Sun (5:20 PM)', mobile: '01812345678', payment: 4500, due: 1500, status: 'active' },
  { id: 'S003', name: 'Tanvir Hasan', roll: '3', class: '8', school: 'Cantonment School', batchTime: 'Sat (7:15 AM)', mobile: '01912345678', payment: 3000, due: 0, status: 'active' },
];

export const MOCK_STAFF: Staff[] = [
  { id: 'ST01', name: 'Abdur Rob', role: 'Security/Maintenance', salary: 8000, status: 'paid', mobile: '01700000001' },
  { id: 'ST02', name: 'Maria Begum', role: 'Assistant Teacher', salary: 15000, status: 'unpaid', mobile: '01700000002' },
];

export const MOCK_STAFF_PAYMENTS: StaffPayment[] = [
  { id: 'SP01', staffId: 'ST01', amount: 8000, date: '2024-01-01', type: 'salary', note: 'January Salary' },
  { id: 'SP02', staffId: 'ST01', amount: 500, date: '2024-01-15', type: 'extra', note: 'Bonus' },
  { id: 'SP03', staffId: 'ST02', amount: 15000, date: '2023-12-30', type: 'salary', note: 'December Salary' },
];

export const MOCK_EXPENSES: CoachingExpense[] = [
  { id: 'EX01', category: 'Rent', amount: 20000, date: '2023-10-01', note: 'October Rent' },
  { id: 'EX02', category: 'Electricity', amount: 3500, date: '2023-10-15', note: 'Monthly Bill' },
  { id: 'EX03', category: 'Handouts', amount: 1200, date: '2023-10-20', note: 'Exam papers' },
];

export const MOCK_RESULTS: ExamResult[] = [
  { id: 'R001', studentId: 'S001', examName: 'Bangla', mcq: 25, cq: 45 },
  { id: 'R002', studentId: 'S001', examName: 'English', mcq: 20, cq: 50 },
  { id: 'R003', studentId: 'S001', examName: 'Mathematics', mcq: 28, cq: 60 },
  { id: 'R004', studentId: 'S001', examName: 'Physics', mcq: 22, cq: 48 },
  { id: 'R005', studentId: 'S001', examName: 'Chemistry', mcq: 24, cq: 44 },
  { id: 'R006', studentId: 'S001', examName: 'ICT', mcq: 30, cq: 65 },
  
  { id: 'R007', studentId: 'S002', examName: 'Bangla', mcq: 22, cq: 40 },
  { id: 'R008', studentId: 'S002', examName: 'English', mcq: 25, cq: 55 },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { studentId: 'S001', date: '2023-10-01', status: 'Present' },
  { studentId: 'S001', date: '2023-10-02', status: 'Absent', comment: 'Family Emergency' },
];

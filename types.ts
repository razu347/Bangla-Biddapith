
export interface Student {
  id: string;
  name: string;
  roll: string;
  class: string;
  school: string;
  batchTime: string;
  mobile: string;
  payment: number;
  due: number;
  status: 'active' | 'cancelled';
}

export interface ExamResult {
  id: string;
  studentId: string;
  examName: string;
  mcq: number;
  cq: number;
}

export interface AttendanceRecord {
  studentId: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent';
  comment?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  salary: number;
  mobile: string;
  status: 'paid' | 'unpaid';
}

export interface StaffPayment {
  id: string;
  staffId: string;
  amount: number;
  date: string;
  type: 'salary' | 'extra';
  note?: string;
}

export interface CoachingExpense {
  id: string;
  category: string;
  amount: number;
  date: string;
  note: string;
}

export interface AdminStats {
  totalStudents: number;
  totalTaka: number;
  totalDue: number;
}

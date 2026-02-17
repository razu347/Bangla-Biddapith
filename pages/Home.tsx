
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, ShieldCheck, Phone, MessageSquare, ArrowRight, 
  Star, Heart, Clock, DollarSign, MapPin, CheckCircle2, User, 
  BookOpen, Globe, Cpu, Languages, MessageCircle
} from 'lucide-react';
import Layout from '../components/Layout';
import { CONTACT_LINKS } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Bangla Biddapith" showBack={false}>
      <div className="flex flex-col md:max-w-4xl md:mx-auto">
        {/* Hero Section */}
        <div className="flex flex-col items-center pt-12 pb-8 px-4 text-center">
          <div className="w-36 h-36 rounded-full border-4 border-orange-500 p-2 mb-8 shadow-[0_20px_50px_rgba(249,115,22,0.3)] overflow-hidden bg-white animate-in zoom-in-50 duration-700">
            <img 
              src="https://picsum.sh/seed/bblogo/400" 
              alt="Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <h1 className="text-5xl font-black text-gray-800 mb-2 tracking-tighter leading-none">
            Bangla <span className="text-orange-500">Biddapith</span>
          </h1>
          <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
             Pathway to Excellence
          </p>
        </div>

        {/* Scrolling Newsletter */}
        <div className="bg-orange-500 text-white py-3 overflow-hidden whitespace-nowrap mb-8 shadow-xl">
          <div className="scroll-text inline-block font-black uppercase text-[10px] tracking-widest px-8">
            ✨ Admission Open for 2026! ✨ Sat Batch starts Jan 3rd ✨ Sun Batch starts Jan 4th ✨ Quality Education for Classes 7-10 ✨ Director Russell Ahmed: 01750-991043 ✨
          </div>
        </div>

        {/* Portal Access Buttons */}
        <div className="px-6 grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <button 
            onClick={() => navigate('/student/login')}
            className="w-full bg-white border-2 border-orange-100 text-gray-800 py-6 px-8 rounded-[32px] flex items-center justify-between shadow-lg active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-50 p-4 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                <GraduationCap size={32} />
              </div>
              <div className="text-left">
                <span className="text-xl font-black block leading-none uppercase">Student</span>
                <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest mt-1 block">Results & Attendance</span>
              </div>
            </div>
            <ArrowRight size={24} className="text-orange-500" />
          </button>

          <button 
            onClick={() => navigate('/admin/login')}
            className="w-full bg-gray-900 text-white py-6 px-8 rounded-[32px] flex items-center justify-between shadow-lg active:scale-[0.98] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-4 rounded-2xl group-hover:bg-orange-500 transition-all">
                <ShieldCheck size={32} />
              </div>
              <div className="text-left">
                <span className="text-xl font-black block leading-none uppercase">Admin</span>
                <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest mt-1 block">Management Panel</span>
              </div>
            </div>
            <ArrowRight size={24} className="text-white/20 group-hover:text-orange-500 transition-all" />
          </button>
        </div>

        {/* Coaching Information from Images */}
        <div className="px-6 space-y-12 pb-24">
          
          {/* Schedule Section */}
          <section>
            <SectionTitle icon={<Clock />} title="Batch Schedules" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ScheduleCard 
                cls="Class 10" 
                fee="৳7,000 / ৳6,000"
                batches={[
                  "Sat/Mon/Wed/Fri: 4:15-5:15 PM & 5:20-6:20 PM",
                  "Sun/Tue/Thu/Fri: 9:30-10:30 AM & 4:15-5:15 PM"
                ]}
              />
              <ScheduleCard 
                cls="Class 9" 
                fee="৳7,000 / ৳6,000"
                batches={[
                  "Sat/Mon/Wed/Fri: 8:30-9:30 AM & 3:10-4:10 PM",
                  "Sun/Tue/Thu/Fri: 5:20-6:20 PM & 7:30-8:30 PM"
                ]}
              />
              <ScheduleCard 
                cls="Class 8" 
                fee="৳6,000"
                batches={[
                  "Sat/Mon/Wed/Fri: 7:15-8:15 AM & 9:30-10:30 AM",
                  "Sun/Tue/Thu/Fri: 6:30-7:30 PM"
                ]}
              />
              <ScheduleCard 
                cls="Class 7" 
                fee="৳5,500"
                batches={[
                  "Sat/Mon/Wed/Fri: 6:30-7:30 PM",
                  "Sun/Tue/Thu/Fri: 8:30-9:30 AM"
                ]}
              />
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-orange-50">
            <SectionTitle icon={<Star className="fill-orange-500 text-orange-500" />} title="Course Features" />
            <ul className="space-y-4">
              <FeatureItem text="Monthly routine provided at the start of each month." />
              <FeatureItem text="Comprehensive chapter-wise teaching and regular exams." />
              <FeatureItem text="3 classes per week + Friday special solve classes." />
              <FeatureItem text="Subject-based lecture sheets and suggestions provided." />
            </ul>
          </section>

          {/* Subjects Section */}
          <section>
            <SectionTitle icon={<BookOpen />} title="Subjects Covered" />
            <div className="flex flex-wrap gap-2">
              <SubjectBadge icon={<Languages size={14}/>} label="Bangla 1st & 2nd" />
              <SubjectBadge icon={<Globe size={14}/>} label="BGS" />
              <SubjectBadge icon={<Cpu size={14}/>} label="ICT" />
              <SubjectBadge icon={<Star size={14}/>} label="Religion Studies" />
            </div>
            <div className="mt-8 bg-orange-50 p-6 rounded-[32px] border border-orange-100">
               <h4 className="text-xs font-black uppercase text-orange-600 mb-3 tracking-widest">Other Programs</h4>
               <p className="text-sm font-bold text-gray-700">• HSC Bangla (1st & 2nd Paper)</p>
               <p className="text-sm font-bold text-gray-700 mt-1">• University Bangla Admission Coaching</p>
            </div>
          </section>

          {/* Director & Contact */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-900 text-white p-8 rounded-[40px] shadow-xl">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-500 rounded-2xl"><User size={24} /></div>
                  <h4 className="text-lg font-black uppercase tracking-tight">Our Director</h4>
               </div>
               <p className="text-xl font-black text-orange-400">Russell Ahmed</p>
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Expert Mentor & Educator</p>
               <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-[10px] font-black text-gray-500 uppercase">Director Phone</p>
                  <a href="tel:01750991043" className="text-lg font-black text-white hover:text-orange-500 transition-colors tracking-tight">01750-991043</a>
               </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-orange-50">
               <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-orange-500 text-white rounded-2xl"><MapPin size={24} /></div>
                  <h4 className="text-lg font-black uppercase tracking-tight text-gray-800">Location</h4>
               </div>
               <p className="text-sm font-bold text-gray-600 leading-snug">
                  West of Nazmul Haque School, behind Medico Coaching, Kadirganj, Rajshahi.
               </p>
               <div className="mt-6 pt-6 border-t border-gray-50">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Office Phone</p>
                  <p className="text-lg font-black text-gray-800 tracking-tight">01516-566751</p>
               </div>
            </div>
          </section>

          {/* Social Icons Section */}
          <section className="pt-8">
            <SectionTitle icon={<MessageCircle />} title="Connect With Us" />
            <div className="grid grid-cols-5 gap-3">
              {CONTACT_LINKS.map((link, idx) => (
                <a 
                  key={idx} 
                  href={link.url} 
                  className="bg-white aspect-square rounded-2xl flex items-center justify-center text-orange-500 shadow-md border border-gray-100 hover:bg-orange-500 hover:text-white transition-all active:scale-90"
                  title={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

const SectionTitle = ({ icon, title }: any) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="text-orange-500">{icon}</div>
    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">{title}</h3>
  </div>
);

const ScheduleCard = ({ cls, batches, fee }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
       <h4 className="text-lg font-black text-orange-600 uppercase tracking-tight">{cls}</h4>
       <div className="bg-orange-50 px-3 py-1 rounded-full text-[9px] font-black text-orange-500">FEES FROM {fee.split(' / ')[0]}</div>
    </div>
    <div className="space-y-3">
       {batches.map((b: string, i: number) => (
         <div key={i} className="flex gap-3 items-start">
            <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-orange-300"></div>
            <p className="text-[11px] font-bold text-gray-600 leading-tight">{b}</p>
         </div>
       ))}
    </div>
  </div>
);

const FeatureItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-4">
    <div className="mt-1 text-orange-500"><CheckCircle2 size={20} /></div>
    <p className="text-sm font-bold text-gray-700 leading-tight">{text}</p>
  </li>
);

const SubjectBadge = ({ icon, label }: any) => (
  <div className="bg-gray-100 px-4 py-3 rounded-2xl flex items-center gap-3 text-gray-600 font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-orange-50 hover:text-orange-600 transition-all cursor-default">
     {icon}
     {label}
  </div>
);

export default Home;

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, Home, User, Settings, Facebook, Phone, 
  MessageCircle, LayoutDashboard, ShieldCheck, LogOut 
} from 'lucide-react';
import { CONTACT_LINKS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, showBack = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isAdminPath = location.pathname.includes('/admin');
  const isStudentPath = location.pathname.includes('/student');
  const isDashboard = location.pathname.includes('dashboard');

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen z-[60]">
        <div className="p-8 flex flex-col items-center border-b border-gray-50">
          <div className="w-20 h-20 rounded-full border-4 border-orange-500 p-1 mb-4 shadow-lg overflow-hidden bg-white">
             <img src="https://picsum.photos/seed/coaching/200" alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h1 className="text-xl font-black text-gray-800 text-center leading-tight">Bangla Biddapith</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavItem 
            active={isHome} 
            icon={<Home size={20}/>} 
            label="Home" 
            onClick={() => navigate('/')} 
          />
          {isStudentPath && (
            <NavItem 
              active={location.pathname === '/student/dashboard'} 
              icon={<LayoutDashboard size={20}/>} 
              label="Student Hub" 
              onClick={() => navigate('/student/dashboard')} 
            />
          )}
          {isAdminPath && (
            <NavItem 
              active={location.pathname === '/admin/dashboard'} 
              icon={<ShieldCheck size={20}/>} 
              label="Admin Hub" 
              onClick={() => navigate('/admin/dashboard')} 
            />
          )}
        </nav>

        <div className="p-4 border-t border-gray-50">
          {!isAdminPath && !isStudentPath && (
            <>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 px-4">Support & Contact</p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {CONTACT_LINKS.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.url} 
                    className="p-3 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-orange-500 transition-colors"
                    title={link.label}
                  >
                    {link.icon}
                  </a>
                ))}
              </div>
            </>
          )}
          {(isAdminPath || isStudentPath) && (
            <button 
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-4 text-gray-400 hover:text-red-500 transition-colors font-bold text-sm"
            >
              <LogOut size={20}/> Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden bg-orange-500 text-white shadow-lg sticky top-0 z-[70]">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBack && !isHome && (
                <button 
                  onClick={handleBack} 
                  className="p-2 -ml-2 rounded-full active:bg-orange-600 transition-all active:scale-90"
                  aria-label="Back to Home"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <h1 className="font-black uppercase tracking-tight text-lg">
                {title || 'Bangla Biddapith'}
              </h1>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/30 overflow-hidden">
               <img src="https://picsum.photos/seed/coaching/100" alt="Logo" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1">
          {children}
        </main>

        {/* Mobile Footer (Hidden on Admin and Student Dashboards) */}
        {!isAdminPath && !isStudentPath && !isHome && (
          <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 h-20 flex justify-around items-center px-6 z-[60] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
             {CONTACT_LINKS.map((link, idx) => (
               <a 
                 key={idx} 
                 href={link.url} 
                 className="flex flex-col items-center gap-1 text-gray-400 active:text-orange-500 transition-all active:scale-95"
               >
                  {link.icon}
                  <span className="text-[10px] font-black uppercase tracking-tighter">{link.label}</span>
               </a>
             ))}
             <button 
               onClick={() => navigate('/')}
               className="flex flex-col items-center gap-1 text-gray-400 active:text-orange-500 transition-all active:scale-95"
             >
                <Home size={24} />
                <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
             </button>
          </footer>
        )}
      </div>
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
      active 
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' 
        : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Layout;
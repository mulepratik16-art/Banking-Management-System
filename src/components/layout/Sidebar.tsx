import React from 'react';
import {
  ArrowDownCircle,
  ArrowLeftRight,
  ArrowUpCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  HelpCircle,
  History,
  Home,
  LayoutDashboard,
  LogOut,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  UserCheck,
  Wallet,
  X,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { NavPage } from '../../types/banking';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activePage,
    setActivePage,
    logout,
    totalBalance,
    currency,
    accounts,
    profile,
    resetDemoData,
    theme,
    toggleTheme,
  } = useBanking();

  const menuItems: { id: NavPage; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'landing', label: 'Bank Landing Page', icon: Home },
    { id: 'accounts', label: 'Account Management', icon: Wallet },
    { id: 'deposit', label: 'Deposit Money', icon: ArrowDownCircle },
    { id: 'withdraw', label: 'Withdraw Money', icon: ArrowUpCircle },
    { id: 'transfer', label: 'Transfer Funds', icon: ArrowLeftRight },
    { id: 'transactions', label: 'Transaction History', icon: History },
    { id: 'profile', label: 'Customer Profile', icon: UserCheck },
    { id: 'help', label: 'Help & Project Viva', icon: HelpCircle },
  ];

  const handleNavigate = (page: NavPage) => {
    setActivePage(page);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0A2540] text-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 no-print ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        {/* Brand & Mobile Close */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-400 font-bold border border-sky-400/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-base text-white tracking-tight">Apex Banking</h1>
                <p className="text-[11px] text-sky-300">Management System</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Balance Snapshot */}
          <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Combined Balance</span>
              <span className="font-mono text-white text-xs">{accounts.length} Accounts</span>
            </div>
            <div className="mt-1 font-mono text-xl font-bold text-white tabular-nums">
              {currency}{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="mt-1 text-[11px] text-sky-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Simulated Campus KYC Verified</span>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-sky-300/60 uppercase">
            Navigation Menu
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all text-left cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-sky-500 text-white font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-300'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Academic Project Credits & Controls */}
        <div className="p-4 border-t border-white/10 bg-black/20 space-y-3">
          <div className="text-xs text-slate-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
            <div className="flex items-center gap-1.5 text-sky-300 font-medium">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>First Year Engg. Project</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 leading-snug">
              Student: {profile.fullName}
            </p>
            <p className="text-[11px] text-slate-400 font-mono">
              Roll No: {profile.rollNo}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer min-h-[40px] flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-300" />}
            </button>
            <button
              onClick={resetDemoData}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer min-h-[40px]"
              title="Reset all demo account balances and transactions"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-300" />
              <span>Reset State</span>
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center justify-center p-2 text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer min-h-[40px] min-w-[40px]"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

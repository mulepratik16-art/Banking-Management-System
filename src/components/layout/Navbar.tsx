import React from 'react';
import {
  Building2,
  DollarSign,
  GraduationCap,
  IndianRupee,
  LogOut,
  Menu,
  Moon,
  RotateCcw,
  Sun,
  User,
  X,
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { NavPage } from '../../types/banking';

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    isLoggedIn,
    logout,
    activePage,
    setActivePage,
    profile,
    currency,
    setCurrency,
    resetDemoData,
    theme,
    toggleTheme,
  } = useBanking();

  const navLinks: { label: string; page: NavPage }[] = [
    { label: 'Landing', page: 'landing' },
    { label: 'Dashboard', page: 'dashboard' },
    { label: 'Accounts', page: 'accounts' },
    { label: 'Deposit', page: 'deposit' },
    { label: 'Withdraw', page: 'withdraw' },
    { label: 'Transfer', page: 'transfer' },
    { label: 'Transactions', page: 'transactions' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 no-print">
      {/* Top Academic Notification Banner */}
      <div className="bg-[#0A2540] text-sky-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full text-center sm:text-left justify-center sm:justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="font-medium">
              First Year Engineering Project: <span className="text-white font-semibold">Banking Management System</span>
            </span>
            <span className="hidden md:inline text-sky-300/80">· Simulated Local Database · No Real Money</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs">
            <span className="text-sky-300/90">{profile.rollNo}</span>
            <span className="text-slate-500">|</span>
            <button
              onClick={resetDemoData}
              className="inline-flex items-center gap-1 text-sky-300 hover:text-white transition-colors cursor-pointer"
              title="Reset all demo account balances and transactions to default presentation state"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6 md:gap-8">
        {/* Zone 1: Single text element Brand & Mobile Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          {isLoggedIn && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <button
            onClick={() => setActivePage(isLoggedIn ? 'dashboard' : 'landing')}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0A2540] flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-5 h-5 text-sky-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0A2540] dark:text-white whitespace-nowrap shrink-0">
              Apex Bank
            </span>
          </button>
        </div>

        {/* Zone 2: Clean single-line text links */}
        {isLoggedIn ? (
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-xs xl:text-sm font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => setActivePage(link.page)}
                className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                  activePage === link.page
                    ? 'text-[#0A2540] dark:text-sky-400 font-semibold border-b-2 border-[#0A2540] dark:border-sky-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => setActivePage('help')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-1 cursor-pointer ${
                activePage === 'help'
                  ? 'text-[#0A2540] dark:text-sky-400 font-semibold border-b-2 border-[#0A2540] dark:border-sky-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Docs & Viva
            </button>
          </nav>
        ) : (
          <div className="hidden sm:block text-xs text-slate-500 dark:text-slate-400">
            University Evaluation Portal · Computer Engineering Department
          </div>
        )}

        {/* Zone 3: 1 Primary action & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setCurrency('$')}
              className={`p-1 sm:p-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                currency === '$'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Display currency in US Dollars"
            >
              <DollarSign className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrency('₹')}
              className={`p-1 sm:p-1.5 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                currency === '₹'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Display currency in Indian Rupees"
            >
              <IndianRupee className="w-3.5 h-3.5" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setActivePage('profile')}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors cursor-pointer"
                title="View customer profile"
              >
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="hidden sm:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-900 dark:text-white whitespace-nowrap">{profile.fullName}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">Student Demo</div>
                </div>
              </button>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/80 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title="End demo session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActivePage('dashboard')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#0A2540] dark:bg-sky-600 rounded-lg hover:bg-[#0F2F57] dark:hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Launch Portal
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

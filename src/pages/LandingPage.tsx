import React from 'react';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  Download,
  GraduationCap,
  KeyRound,
  Lock,
  Moon,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Sun,
  UserCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const LandingPage: React.FC = () => {
  const {
    login,
    setActivePage,
    setShowAuthModal,
    totalBalance,
    currency,
    accounts,
    theme,
    toggleTheme,
    notify,
  } = useBanking();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notify(`Copied ${label} to clipboard.`);
  };

  const sampleAccounts = [
    {
      role: 'Student Customer',
      name: 'Aarav Patel',
      rollNo: 'FY-CSE-2026-44',
      email: 'aarav.patel@engg-univ.edu',
      password: 'StudentDemo2026!',
      desc: 'Full access to 3 linked student accounts, debit card freeze controls, live deposits, withdrawals, and peer transfers.',
      highlight: true,
    },
    {
      role: 'Faculty / Viva Evaluator',
      name: 'Dr. S. K. Raman',
      rollNo: 'FACULTY-AUDIT-01',
      email: 'evaluator@apexbank.edu',
      password: 'FacultyReview2026!',
      desc: 'Evaluator preview with pre-seeded transaction ledger, analytics charts, and audit statement download.',
      highlight: false,
    },
    {
      role: 'Guest Reviewer',
      name: 'Guest Peer Evaluator',
      rollNo: 'GUEST-2026',
      email: 'guest.demo@apexbank.edu',
      password: 'GuestDemo2026!',
      desc: 'Quick exploratory login with interactive forms and instant balance updates.',
      highlight: false,
    },
  ];

  const features = [
    {
      icon: Wallet,
      title: 'Multi-Account Portfolio',
      desc: 'Simulated Premier Savings (3.75%), Everyday Campus Checking, and Term Fixed Deposits with live balance tracking.',
    },
    {
      icon: ArrowRight,
      title: 'Instant Transfers & Payees',
      desc: 'Transfer funds between self accounts or to saved beneficiaries with 2-step confirmation and UTR tracking.',
    },
    {
      icon: CreditCard,
      title: 'Virtual Campus Debit Card',
      desc: 'Interactive debit card with instant card freeze/unfreeze toggles, CVV reveal, and POS purchase simulation.',
    },
    {
      icon: Receipt,
      title: 'Auditable Ledger & CSV Export',
      desc: 'Search, filter by date range, inspect printable receipt slips, and download official statements as CSV files.',
    },
    {
      icon: ShieldCheck,
      title: 'Overdraft & Minimum Balance Protection',
      desc: 'Enforces minimum balance constraints ($100 for Savings, $50 for Checking) to prevent invalid negative withdrawals.',
    },
    {
      icon: GraduationCap,
      title: 'Academic Viva & Local Run Docs',
      desc: 'Complete engineering documentation, technical specifications, ER architecture overview, and local setup guide.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col justify-between">
      {/* Top Academic Sub-banner */}
      <div className="bg-[#0A2540] text-sky-100 text-xs px-4 py-2 border-b border-sky-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-white">First Year Engineering Project</span>
            <span className="text-sky-300">· Computer Science & Engineering</span>
          </div>
          <div className="flex items-center gap-3 text-sky-300/90 text-[11px]">
            <span>Simulated Banking Management System</span>
            <span>·</span>
            <span>Academic Demonstration (No Real Funds)</span>
          </div>
        </div>
      </div>

      {/* Landing Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#0A2540] flex items-center justify-center text-white shadow-xs">
              <Building2 className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#0A2540] dark:text-white whitespace-nowrap">
                Apex Bank
              </span>
            </div>
          </div>

          {/* Quick Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              System Features
            </a>
            <a href="#credentials" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Sample Credentials
            </a>
            <a href="#architecture" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Academic Docs
            </a>
          </nav>

          {/* Actions: Theme Toggle & Get Started CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={() => setActivePage('login')}
              className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
            >
              Sign In
            </button>

            <button
              onClick={async () => {
                const res = await login('Aarav Patel');
                if (res?.success) {
                  setActivePage('dashboard');
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              Get Started →
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 px-3 py-1 rounded-md">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Next-Gen Engineering College Project · FY B.Tech CSE</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                Modern Banking Management System
              </h1>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                An interactive, responsive banking platform built for First Year Engineering academic presentation. Experience real-time ledger balance updates, instant simulated deposits and withdrawals, peer transfers, debit card freeze controls, and auditable financial statements.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={async () => {
                    const res = await login('Aarav Patel');
                    if (res?.success) {
                      setActivePage('dashboard');
                    }
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <span>Launch Live Banking Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#credentials"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl transition-all cursor-pointer"
                >
                  <KeyRound className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>View Sample Credentials</span>
                </a>
              </div>

              {/* Academic Highlights */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> React 19 + TypeScript
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tailwind CSS + Dark Mode
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Local State Persistence
                </span>
              </div>
            </div>

            {/* Hero Right Visual: Live Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 relative">
                {/* Simulated Bank Card Preview */}
                <div className="rounded-xl bg-gradient-to-br from-[#0A2540] via-[#0F2F57] to-[#1E3A8A] text-white p-5 shadow-md relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider text-sky-200">APEX CAMPUS DEBIT</span>
                    <span className="text-xs font-bold text-sky-400 tracking-widest">VISA</span>
                  </div>

                  <div className="mt-5 w-8 h-6 rounded-xs bg-amber-300/90 border border-amber-400"></div>

                  <div className="mt-4 font-mono text-base tracking-widest text-white">
                    •••• •••• •••• 9081
                  </div>

                  <div className="mt-3 flex items-end justify-between text-xs">
                    <div>
                      <div className="text-[9px] text-sky-200/80 uppercase">Student Name</div>
                      <div className="font-semibold text-white">AARAV PATEL</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] text-sky-200/80 uppercase">Simulated Bal</div>
                      <div className="font-mono text-sky-300 font-bold">{currency}{totalBalance.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Summary Strip */}
                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block">Total Portfolio</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                      {currency}{totalBalance.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block">Linked Accounts</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-base">
                      0{accounts.length} Active
                    </span>
                  </div>
                </div>

                {/* Simulated Recent Action Teaser */}
                <div className="mt-4 p-3 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Academic Allowance</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Cash Deposit · Completed</div>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">+{currency}1,500.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Credentials Section (Explicitly requested by user) */}
      <section id="credentials" className="py-14 md:py-20 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-3 py-1 rounded-md mb-2">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Simulated Evaluation Access</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Sample Demo Credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Use these pre-configured demo credentials to sign in and review the system, or click any account to login instantly with 1-click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleAccounts.map((acc, idx) => (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  acc.highlight
                    ? 'border-[#0A2540] dark:border-sky-500 ring-2 ring-sky-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {acc.role}
                    </span>
                    {acc.highlight && (
                      <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                        Default Demo
                      </span>
                    )}
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{acc.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{acc.rollNo}</div>
                  </div>

                  {/* Credentials Box */}
                  <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/70 rounded-lg border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span>Demo Email:</span>
                        <button
                          onClick={() => handleCopy(acc.email, 'Email')}
                          className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          title="Copy email"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-mono text-slate-900 dark:text-white font-medium select-all break-all">
                        {acc.email}
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                        <span>Demo Password:</span>
                        <button
                          onClick={() => handleCopy(acc.password, 'Password')}
                          className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          title="Copy password"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-mono text-slate-900 dark:text-white font-medium select-all">
                        {acc.password}
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {acc.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={async () => {
                      const res = await login(acc.name);
                      if (res?.success) {
                        setActivePage('dashboard');
                      }
                    }}
                    className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      acc.highlight
                        ? 'bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>Login as {acc.role.split(' ')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-14 md:py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Comprehensive Banking Modules
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              Every banking module is fully functional with reactive state updates and strict engineering validation rules.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-[#0A2540]/40 dark:hover:border-sky-500/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950 text-[#0A2540] dark:text-sky-400 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{feat.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Architecture Section */}
      <section id="architecture" className="py-14 md:py-20 bg-slate-100/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0A2540] text-white rounded-2xl p-8 md:p-12 shadow-xl border border-slate-700">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4" />
                <span>Academic Project Specifications</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Designed for First Year Engineering College Viva
              </h2>
              <p className="text-xs md:text-sm text-slate-300 mt-3 leading-relaxed">
                This project demonstrates core computer engineering competencies: component-driven architecture, TypeScript type safety, reactive state machines, DOM print optimizations, and secure client-side persistence.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActivePage('login')}
                  className="px-4 py-2.5 text-xs font-semibold text-[#0A2540] bg-white rounded-lg hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                >
                  Go to Sign-In Portal
                </button>
                <button
                  onClick={async () => {
                    const res = await login('Aarav Patel');
                    if (res?.success) {
                      setActivePage('dashboard');
                    }
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Enter Student Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Disclaimer & Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#0A2540] dark:text-sky-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Banking Management System — Academic Project
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Fictional Demonstration · Simulated Funds & Credentials Only · No Real Financial Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle,
  Copy,
  ExternalLink,
  GraduationCap,
  Info,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  User,
  Wrench,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const LoginPage: React.FC = () => {
  const {
    login,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    authLoading,
    authErrorBanner,
    setAuthErrorBanner,
    setActivePage,
    theme,
    toggleTheme,
    notify,
  } = useBanking();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('aarav.patel@engg-univ.edu');
  const [password, setPassword] = useState('StudentDemo2026!');
  const [confirmPassword, setConfirmPassword] = useState('StudentDemo2026!');
  const [fullName, setFullName] = useState('Aarav Patel');
  const [rollNo, setRollNo] = useState('FY-CSE-2026-44');
  const [initialAccountType, setInitialAccountType] = useState<'Savings' | 'Checking'>('Savings');
  const [validationError, setValidationError] = useState('');
  const [showConsoleHelp, setShowConsoleHelp] = useState(false);

  const samplePresets = [
    {
      title: 'Student Customer',
      name: 'Aarav Patel',
      email: 'aarav.patel@engg-univ.edu',
      password: 'StudentDemo2026!',
      rollNo: 'FY-CSE-2026-44',
      desc: '3 linked accounts (₹26,090), virtual campus debit card & peer transfers',
    },
    {
      title: 'Faculty / Evaluator',
      name: 'Dr. S. K. Raman',
      email: 'evaluator@apexbank.edu',
      password: 'FacultyReview2026!',
      rollNo: 'FACULTY-AUDIT-01',
      desc: 'Evaluator auditing view with immutable ledger entries in Cloud Firestore',
    },
  ];

  const handleFillCredentials = (preset: typeof samplePresets[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setConfirmPassword(preset.password);
    setFullName(preset.name);
    setRollNo(preset.rollNo);
    setValidationError('');
    setAuthErrorBanner(null);
    notify(`Loaded credentials for ${preset.title}.`);
  };

  const handleOneClickLogin = async (presetName: string) => {
    setValidationError('');
    setAuthErrorBanner(null);
    await login(presetName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setAuthErrorBanner(null);

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      setValidationError('Please enter a valid student email address.');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setValidationError('Please enter a valid email format (e.g., student@engg-univ.edu).');
      return;
    }

    if (!password) {
      setValidationError('Please provide your password.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim()) {
        setValidationError('Please provide student full name for registration.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Password and Confirmation Password do not match.');
        return;
      }

      await registerWithEmail(trimmedEmail, password, fullName.trim(), rollNo.trim());
    } else {
      await loginWithEmail(trimmedEmail, password);
    }
  };

  const firebaseConsoleUrl =
    'https://console.firebase.google.com/project/gen-lang-client-0087962045/authentication/providers';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Academic Banner */}
      <div className="bg-[#0A2540] text-sky-100 text-xs px-4 py-2 border-b border-sky-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="font-semibold text-white">First Year Engineering Project</span>
            <span className="text-sky-300">· Computer Science & Engineering</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sky-300/80">Firebase Auth & Cloud Firestore Connected</span>
            <button
              onClick={toggleTheme}
              className="p-1 rounded text-sky-300 hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Back button */}
          <div className="px-6 pt-5 pb-0 flex items-center justify-between">
            <button
              onClick={() => setActivePage('landing')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Landing Page</span>
            </button>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
              ● Firestore Cloud DB
            </span>
          </div>

          {/* Card Header */}
          <div className="p-6 text-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-xl bg-[#0A2540] flex items-center justify-center text-white shadow-md mb-3">
              <Building2 className="w-6 h-6 text-sky-400" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Apex Bank Management Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Engineering College Academic Simulation backed by Firebase Authentication
            </p>

            {/* Google Sign In Button (Supported out-of-the-box) */}
            <div className="mt-5">
              <button
                type="button"
                onClick={loginWithGoogle}
                disabled={authLoading}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {authLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign in with Google Account (Pre-configured)</span>
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">or use Email & Password</span>
                </div>
              </div>
            </div>

            {/* Clearly Explained Sample Credentials Section */}
            <div className="p-4 bg-sky-50/90 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900 text-left">
              <div className="text-xs font-semibold text-sky-950 dark:text-sky-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  Preloaded Demo Accounts
                </span>
                <span className="text-[10px] text-sky-700 dark:text-sky-400 font-normal">Auto-Setup</span>
              </div>

              <div className="mt-3 space-y-2.5">
                {samplePresets.map((preset, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-sky-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{preset.title}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">({preset.name})</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                        {preset.email}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{preset.desc}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleFillCredentials(preset)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                        title="Fill inputs with these credentials"
                      >
                        Auto-Fill
                      </button>
                      <button
                        type="button"
                        disabled={authLoading}
                        onClick={() => handleOneClickLogin(preset.name)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                        title="Sign in or register with this preset"
                      >
                        {authLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                        <span>1-Click Login</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab switch: Sign In vs New Registration */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mt-5">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setValidationError('');
                  setAuthErrorBanner(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setValidationError('');
                  setAuthErrorBanner(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                New Student Registration
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Firebase Auth Error Banner (with admin-restricted diagnosis) */}
            {authErrorBanner && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  authErrorBanner.isAdminRestricted
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  {authErrorBanner.isAdminRestricted ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 font-medium leading-relaxed">
                    {authErrorBanner.message}
                  </div>
                </div>

                {/* Step-by-Step Fix for auth/admin-restricted-operation */}
                {authErrorBanner.isAdminRestricted && (
                  <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800/80 space-y-2 text-[11px]">
                    <div className="font-semibold text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>How to enable Email/Password in Firebase Console (1-Minute Fix):</span>
                    </div>

                    <ol className="list-decimal pl-4 space-y-1 text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
                      <li>
                        Open your project in the{' '}
                        <a
                          href={firebaseConsoleUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-semibold underline text-[#0A2540] dark:text-sky-300 hover:text-sky-700 inline-flex items-center gap-0.5"
                        >
                          Firebase Console Authentication Tab
                          <ExternalLink className="w-3 h-3 inline" />
                        </a>.
                      </li>
                      <li>Under <strong>Sign-in providers</strong>, click on <strong>Email/Password</strong>.</li>
                      <li>Toggle the <strong>Enable</strong> switch to ON and click <strong>Save</strong>.</li>
                    </ol>

                    <div className="p-2 bg-white/70 dark:bg-slate-900/70 rounded-md border border-amber-200 dark:border-amber-900 text-slate-700 dark:text-slate-300 text-[10px]">
                      <strong>Tip:</strong> If you don't want to change Firebase Console settings right now, you can click <strong>"Sign in with Google Account"</strong> above, which is already enabled!
                    </div>
                  </div>
                )}
              </div>
            )}

            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Student Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      disabled={authLoading}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 disabled:opacity-50"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    College Roll / Registration No.
                  </label>
                  <input
                    type="text"
                    disabled={authLoading}
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. FY-CSE-2026-99"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 disabled:opacity-50 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Account Category
                  </label>
                  <select
                    disabled={authLoading}
                    value={initialAccountType}
                    onChange={(e) => setInitialAccountType(e.target.value as 'Savings' | 'Checking')}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 disabled:opacity-50"
                  >
                    <option value="Savings">Student Premier Savings (3.75% APY · Min ₹100)</option>
                    <option value="Checking">Everyday Campus Checking (Min ₹50)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Student Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="email"
                  disabled={authLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@engg-univ.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-mono disabled:opacity-50"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Min 6 characters</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="password"
                  disabled={authLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-mono disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    disabled={authLoading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950 font-mono disabled:opacity-50"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>{mode === 'login' ? 'Authenticating with Firebase...' : 'Registering New Account...'}</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'Sign In (Firebase Authentication)'
                      : 'Create Demo Student Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Academic notice & Security note */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div>For academic viva & seminar evaluation only. Passwords are never stored in Firestore.</div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500">
              User identity verified through genuine Firebase Auth UID.
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        Banking Management System — Academic Project
      </footer>
    </div>
  );
};

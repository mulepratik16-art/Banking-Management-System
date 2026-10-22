import React, { useState } from 'react';
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  Database,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const HelpPage: React.FC = () => {
  const { notify } = useBanking();

  // Support ticket form
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Transaction Query');
  const [ticketMessage, setTicketMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Cloud Firestore manage atomic balance updates?',
      a: 'All balance-modifying operations (deposits, withdrawals, transfers) are executed via Firestore `runTransaction()`. The transaction reads the current account balance from `/users/{uid}/accounts/{accId}`, validates ownership and liquidity, computes the new balance in integer paise, writes the updated balance, registers the immutable transaction in `/users/{uid}/transactions`, and locks the idempotency key atomically.',
    },
    {
      q: 'Why are all currency values stored in integer paise?',
      a: 'In financial software engineering, floating-point math can lead to precision drift (e.g. 0.1 + 0.2 !== 0.3). To eliminate rounding errors, all values in Cloud Firestore are stored as exact 64-bit integer paise (1 Rupee = 100 paise), matching real-world core banking ledger standards.',
    },
    {
      q: 'What are the minimum balance requirements for each account?',
      a: 'The Premier Student Savings Account enforces a minimum balance constraint of ₹100.00 (10,000 paise), the Everyday Campus Checking Account requires ₹50.00 (5,000 paise), and Term Fixed Deposits require ₹1,000.00. The atomic transaction actively rejects any withdrawal or transfer that would violate these minimum reserves.',
    },
    {
      q: 'How does the debit card freeze mechanism work?',
      a: 'In the Dashboard or Account Management page, clicking the "Freeze" toggle updates the `isFrozen` boolean flag on the account document in Cloud Firestore. When an account is frozen, any ATM withdrawal or POS swipe attempt is rejected with a security lock notification.',
    },
    {
      q: 'How do I download a formal CSV account statement?',
      a: 'Navigate to the "Transactions" tab, apply your desired date range or transaction-type filters, and click "Export CSV". The browser synthesizes an RFC-4180 compliant CSV statement with exact UTR reference codes, amounts, and post-transaction balances for offline inspection.',
    },
    {
      q: 'Why does "auth/admin-restricted-operation" happen and how do I enable Email/Password?',
      a: 'Google AI Studio initializes Firebase projects with Google Sign-In enabled by default. If a user attempts to register or sign in with an Email and Password before the provider is turned on, Firebase throws "auth/admin-restricted-operation". To enable it: 1) Go to Firebase Console > Authentication > Sign-in method, 2) Click "Email/Password", 3) Toggle "Enable" and click "Save". Alternatively, Google Sign-In works immediately without any manual configuration.',
    },
    {
      q: 'Can I reset my demo accounts back to the initial state?',
      a: 'Yes! Simply click the "Reset Demo" button in the top navigation bar or sidebar. This re-populates the 3 student accounts with default balances in Cloud Firestore.',
    },
  ];

  const handleCopyCommand = (text: string) => {
    navigator.clipboard.writeText(text);
    notify('Copied command to clipboard.');
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;

    setIsSubmitted(true);
    notify(`Simulated support ticket "${ticketSubject}" logged. Reference #TKT-${Math.floor(1000 + Math.random() * 9000)}.`);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Help, Support & Academic Viva Documentation</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Project architecture guide, instructions for running locally, Firestore data model, and FAQs
        </p>
      </div>

      {/* Local Run Instructions Banner (Crucial for First Year College Evaluators) */}
      <div className="bg-[#0A2540] text-white rounded-xl p-6 shadow-md border border-slate-700">
        <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          <span>Instructions to Run This Project Locally</span>
        </div>
        <h2 className="text-lg font-bold text-white mt-1">
          Student Viva & Local Development Guide
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Follow these standard commands in your local computer terminal (VS Code / Bash / PowerShell) to run and present this Banking Management System:
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-black/30 p-3.5 rounded-lg border border-white/10 font-mono text-xs">
            <div className="text-sky-300 text-[11px] font-sans font-medium mb-1">Step 1: Install Dependencies</div>
            <div className="flex items-center justify-between text-white">
              <span>npm install</span>
              <button
                onClick={() => handleCopyCommand('npm install')}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Copy command"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-black/30 p-3.5 rounded-lg border border-white/10 font-mono text-xs">
            <div className="text-sky-300 text-[11px] font-sans font-medium mb-1">Step 2: Start Dev Server</div>
            <div className="flex items-center justify-between text-white">
              <span>npm run dev</span>
              <button
                onClick={() => handleCopyCommand('npm run dev')}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Copy command"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="bg-black/30 p-3.5 rounded-lg border border-white/10 font-mono text-xs">
            <div className="text-sky-300 text-[11px] font-sans font-medium mb-1">Step 3: Open in Browser</div>
            <div className="flex items-center justify-between text-white">
              <span>http://localhost:3000</span>
              <button
                onClick={() => handleCopyCommand('http://localhost:3000')}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
                title="Copy URL"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Architecture Overview & Support Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Project Architecture & FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Engineering Project Architecture Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
              <Code2 className="w-4 h-4 text-[#0A2540] dark:text-sky-400" />
              <h3 className="text-sm">Engineering Project Technical Specifications</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  Cloud Firestore Integration
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Real-time database synchronizing users, multi-tier accounts, and transactions with Firestore onSnapshot listeners.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  Atomic Transactions & Idempotency
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Deposits, withdrawals, and peer transfers run inside `runTransaction()` with client UUID idempotency keys preventing double-billing.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Zero-Trust Security Rules
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Deployable `firestore.rules` enforcing user UID isolation (`request.auth.uid == userId`), positive integer amounts, and immutable transactions.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  Academic Demonstration Mode
                </span>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Simulated INR (₹) integer paise values. Safe for college presentation viva with zero real bank access or real credential leakage.
                </p>
              </div>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white mb-3">
              <HelpCircle className="w-4 h-4 text-[#0A2540] dark:text-sky-400" />
              <h3 className="text-sm">Frequently Asked Questions (Viva Q&A)</h3>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-semibold text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white cursor-pointer gap-2"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Simulated Helpdesk Ticket & Contact Info */}
        <div className="space-y-6">
          {/* Simulated Ticket Submission Form */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs text-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 font-semibold text-slate-900 dark:text-white mb-3">
              <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <h3 className="text-sm">Simulated Campus Support Desk</h3>
            </div>

            {isSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <div className="font-semibold">Support Ticket Received</div>
                <div className="text-[11px]">Our simulated student helpline representative will attend shortly.</div>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Issue Category</label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Transaction Query">Transaction Query</option>
                    <option value="Debit Card Lock">Debit Card Lock</option>
                    <option value="Beneficiary Addition">Beneficiary Addition</option>
                    <option value="Academic Viva Review">Academic Viva Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Subject</label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Deposit reconciliation"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Message</label>
                  <textarea
                    rows={3}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Simulated Ticket</span>
                </button>
              </form>
            )}
          </div>

          {/* Academic Helpdesk Contact Info */}
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Campus Banking Helpdesk
            </h4>

            <div className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Dept. of Computer Science & Engineering, Tech Campus</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>support.academic@apexbank.edu</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>+91 (020) 2590-4400 (Academic Extension 104)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

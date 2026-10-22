import React, { useState } from 'react';
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  Lock,
  Plus,
  ShieldCheck,
  Unlock,
  Wallet,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { AccountType } from '../types/banking';

export const AccountsPage: React.FC = () => {
  const {
    accounts,
    currency,
    createAccount,
    setActivePage,
    toggleCardFreeze,
    notify,
  } = useBanking();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>('Savings');
  const [accountName, setAccountName] = useState('');
  const [initialDeposit, setInitialDeposit] = useState<number>(500);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    notify(`Copied ${label} (${text}) to clipboard.`);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const res = await createAccount(accountType, accountName, initialDeposit);
      if (!res.success) {
        setFormError(res.error || 'Failed to create account.');
        setIsSubmitting(false);
        return;
      }

      setIsModalOpen(false);
      setAccountName('');
      setInitialDeposit(500);
    } catch (err: any) {
      setFormError(err.message || 'Account opening failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Account Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Overview of student deposit accounts, checking portfolios, and term deposits in Cloud Firestore
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-sky-400" />
          Open New Sub-Account
        </button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between relative overflow-hidden transition-colors duration-200"
          >
            <div>
              {/* Type & Status Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950 text-[#0A2540] dark:text-sky-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-slate-900 dark:text-white">{acc.accountType}</h2>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Firestore Persistent</span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  Active
                </span>
              </div>

              {/* Account Title & Balance */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{acc.accountName}</h3>
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                  {currency}{acc.balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Available Balance ({acc.balancePaise?.toLocaleString() || (acc.balance * 100).toLocaleString()} Paise)
                </div>
              </div>

              {/* Key Specs */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Account Number:</span>
                  <div className="flex items-center gap-1.5 font-mono text-slate-800 dark:text-slate-200 font-medium">
                    <span>{acc.accountNumber}</span>
                    <button
                      onClick={() => handleCopy(acc.accountNumber, 'Account Number')}
                      className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer p-0.5"
                      title="Copy account number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Branch IFSC Code:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">{acc.ifsc}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Annual Interest:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{acc.interestRate}% p.a.</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Min. Required Balance:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{currency}{acc.minBalance.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Opening Date:</span>
                  <span className="text-slate-700 dark:text-slate-300">{acc.openingDate}</span>
                </div>
              </div>

              {/* Card Integration if checking */}
              {acc.cardDetails && (
                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      Linked Campus Debit Card
                    </span>
                    <button
                      onClick={() => toggleCardFreeze(acc.id)}
                      className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                        acc.isFrozen ? 'text-rose-600 dark:text-rose-400 hover:underline' : 'text-slate-600 dark:text-slate-300 hover:underline'
                      }`}
                    >
                      {acc.isFrozen ? (
                        <>
                          <Lock className="w-3 h-3" /> Frozen (Unlock)
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3 h-3" /> Active (Lock)
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    •••• •••• •••• {acc.cardDetails.cardNumber.slice(-4)} · Exp {acc.cardDetails.expiry}
                  </div>
                </div>
              )}
            </div>

            {/* Quick action buttons for this account */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => setActivePage('deposit')}
                className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowDownCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                Deposit
              </button>
              <button
                onClick={() => setActivePage('withdraw')}
                className="py-1.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <ArrowUpCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                Withdraw
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Open New Sub-Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden text-slate-900 dark:text-slate-100">
            <div className="bg-[#0A2540] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <h3 className="font-semibold text-sm">Open Sub-Account in Cloud Firestore</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="p-6 space-y-4">
              {formError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                >
                  <option value="Savings">Savings Account (3.50% p.a.)</option>
                  <option value="Checking">Checking Account (1.00% p.a. + Debit Card)</option>
                  <option value="Fixed Deposit">Fixed Deposit (6.75% p.a. Locked Term)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Account Purpose / Nickname
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Higher Education Savings, Project Fund"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Initial Opening Deposit ({currency})
                </label>
                <input
                  type="number"
                  min="100"
                  step="50"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] font-mono text-slate-900 dark:text-white bg-white dark:bg-slate-950"
                  required
                />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Minimum starting deposit requirement: {currency}100.00 ({initialDeposit * 100} Paise)
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating in Firestore...' : 'Confirm & Open Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

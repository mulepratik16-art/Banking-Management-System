import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowDownCircle,
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  QrCode,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const DepositPage: React.FC = () => {
  const { accounts, depositMoney, currency } = useBanking();

  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [amount, setAmount] = useState<string>('500');
  const [paymentMode, setPaymentMode] = useState<string>('Branch Cash Counter');
  const [memo, setMemo] = useState<string>('Semester Academic Allowance');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const targetAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];
  const numAmount = parseFloat(amount) || 0;
  const currentBal = targetAccount ? targetAccount.balance : 0;
  const projectedBalance = currentBal + numAmount;

  const quickAmounts = [100, 250, 500, 1000, 2500];

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (numAmount <= 0) {
      setErrorMsg('Please specify a positive deposit amount greater than 0.');
      return;
    }

    if (numAmount > 500000) {
      setErrorMsg('Single simulated deposit ceiling for academic demo is 500,000.');
      return;
    }

    if (!targetAccount) {
      setErrorMsg('No active account selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await depositMoney(targetAccount.id, numAmount, paymentMode, memo);
      if (!res.success) {
        setErrorMsg(res.error || 'Deposit failed to process.');
      } else {
        // Reset fields
        setAmount('500');
        setMemo('');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unexpected error processing deposit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Deposit Simulated Funds</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Atomic Firestore transaction credit with automatic ledger persistence & printable receipt slip
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Deposit Form (2 Cols) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handleDeposit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Target Account Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Deposit Destination Account
              </label>
              <select
                value={targetAccount?.id || ''}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountName} ({acc.accountNumber}) — Current: {currency}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount & Quick Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Deposit Amount ({currency})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-mono text-sm font-bold text-slate-500 dark:text-slate-400">
                  {currency}
                </span>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="0.00"
                  className="w-full pl-8 pr-3 py-2 text-sm font-mono font-bold text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 bg-white dark:bg-slate-800"
                  required
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mr-1">Quick Select:</span>
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setAmount(String(q))}
                    className="px-2.5 py-1 text-xs font-mono font-medium rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    +{currency}{q}
                  </button>
                ))}
              </div>
            </div>

            {/* Deposit Channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Simulated Deposit Channel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'Branch Cash Counter', label: 'Cash Counter Teller', icon: Building2 },
                  { id: 'Cheque Clearance', label: 'Campus Cheque Deposit', icon: CreditCard },
                  { id: 'Direct Bank Wire', label: 'Direct Electronic Wire', icon: Wallet },
                  { id: 'Instant UPI / QR Code', label: 'Campus QR / UPI Portal', icon: QrCode },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      paymentMode === item.id
                        ? 'border-[#0A2540] dark:border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-[#0A2540] dark:text-sky-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMode"
                      value={item.id}
                      checked={paymentMode === item.id}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      disabled={isSubmitting}
                      className="sr-only"
                    />
                    <item.icon className="w-4 h-4 shrink-0 text-slate-500 dark:text-slate-400" />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Memo Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deposit Memo / Note (Optional)
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Scholarship installment, project prize"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Committing Atomic Transaction...</span>
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-4 h-4 text-sky-400" />
                  <span>Confirm Simulated Deposit</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Projection Card */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Real-time Balance Impact
            </h2>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Current Account Balance:</span>
              <span className="font-mono text-base font-semibold text-slate-900 dark:text-white tabular-nums">
                {currency}{currentBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Amount to Deposit:</span>
              <span className="font-mono text-base font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +{currency}{numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">Estimated New Balance:</span>
              <span className="font-mono text-xl font-bold text-[#0A2540] dark:text-sky-400 tabular-nums">
                {currency}{projectedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 space-y-1">
              <div>• Atomic Firestore transaction guarantees integer paise balance consistency.</div>
              <div>• Saved permanently in your Cloud Firestore database.</div>
              <div>• Produces an instant printable receipt with official UTR reference.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

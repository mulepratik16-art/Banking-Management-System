import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowUpCircle,
  Building2,
  CreditCard,
  Loader2,
  Lock,
  Receipt,
  ShieldAlert,
  Wallet,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const WithdrawPage: React.FC = () => {
  const { accounts, withdrawMoney, currency } = useBanking();

  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || '');
  const [amount, setAmount] = useState<string>('200');
  const [paymentMode, setPaymentMode] = useState<string>('ATM Cash Dispenser');
  const [memo, setMemo] = useState<string>('Campus Book Purchase & Supplies');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const targetAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];
  const numAmount = parseFloat(amount) || 0;
  const currentBal = targetAccount ? targetAccount.balance : 0;
  const currentMinBal = targetAccount ? targetAccount.minBalance : 0;
  const maxAvailableToWithdraw = Math.max(0, currentBal - currentMinBal);
  const projectedBalance = currentBal - numAmount;
  const isOverdrawn = numAmount > maxAvailableToWithdraw;

  const quickAmounts = [50, 100, 200, 500, 1000];

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (numAmount <= 0) {
      setErrorMsg('Please specify a valid withdrawal amount greater than 0.');
      return;
    }

    if (isOverdrawn) {
      setErrorMsg(
        `Withdrawal exceeds permitted liquidity. Minimum account balance constraint: ${currency}${currentMinBal}. Maximum available to withdraw is ${currency}${maxAvailableToWithdraw.toFixed(2)}.`
      );
      return;
    }

    if (!targetAccount) {
      setErrorMsg('No active account selected.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await withdrawMoney(targetAccount.id, numAmount, paymentMode, memo);
      if (!res.success) {
        setErrorMsg(res.error || 'Withdrawal could not be processed.');
      } else {
        // Reset input
        setAmount('100');
        setMemo('');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unexpected error processing withdrawal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Withdraw Simulated Funds</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Atomic Firestore debit with minimum balance protection & immutable transaction ledger entry
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Withdrawal Form */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handleWithdraw} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Target Account Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Debited Account Source
              </label>
              <select
                value={targetAccount?.id || ''}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountName} ({acc.accountNumber}) — Avail: {currency}{(acc.balance - acc.minBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount & Quick Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Withdrawal Amount ({currency})
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Max: <strong className="text-slate-800 dark:text-slate-200">{currency}{maxAvailableToWithdraw.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                </span>
              </div>

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
                  className={`w-full pl-8 pr-3 py-2 text-sm font-mono font-bold rounded-lg border focus:outline-hidden focus:ring-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ${
                    isOverdrawn
                      ? 'border-rose-400 focus:ring-rose-500'
                      : 'border-slate-300 dark:border-slate-700 focus:ring-[#0A2540] dark:focus:ring-sky-500'
                  }`}
                  required
                />
              </div>

              {/* Overdraft Warning Banner */}
              {isOverdrawn && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Cannot withdraw beyond minimum balance of {currency}{currentMinBal}.
                  </span>
                </div>
              )}

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
                    {currency}{q}
                  </button>
                ))}
              </div>
            </div>

            {/* Withdrawal Channel */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Simulated Withdrawal Channel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'ATM Cash Dispenser', label: 'Campus ATM Terminal', icon: CreditCard },
                  { id: 'Branch Counter Cash', label: 'Teller Counter Debit', icon: Building2 },
                  { id: 'POS Merchant Swipe', label: 'Campus Merchant POS', icon: Wallet },
                  { id: 'Cheque Self-Bearer', label: 'Self-Bearer Cheque', icon: Receipt },
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
                Withdrawal Purpose / Memo (Optional)
              </label>
              <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Lab stationery, examination fee"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isOverdrawn || isSubmitting}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-xs ${
                isOverdrawn || isSubmitting
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-sky-400" />
                  <span>Committing Atomic Debit...</span>
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4 h-4 text-rose-400" />
                  <span>Authorize Simulated Withdrawal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Balance Simulation & Constraints */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Overdraft Guard & Rules
            </h2>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Total Account Balance:</span>
              <span className="font-mono text-base font-semibold text-slate-900 dark:text-white tabular-nums">
                {currency}{currentBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Mandatory Minimum Threshold:</span>
              <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-400 tabular-nums">
                {currency}{currentMinBal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Maximum Allowed to Withdraw:</span>
              <span className="font-mono text-base font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {currency}{maxAvailableToWithdraw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300 font-semibold block">Post-Debit Balance:</span>
              <span
                className={`font-mono text-xl font-bold tabular-nums ${
                  projectedBalance < currentMinBal
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-[#0A2540] dark:text-sky-400'
                }`}
              >
                {currency}{projectedBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 space-y-1">
              <div>• Minimum balance prevents accounts from becoming overdrawn.</div>
              <div>• Atomic transaction prevents race conditions and balance leaks.</div>
              <div>• Generates verifiable debit receipt for student viva demonstration.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

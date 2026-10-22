import React from 'react';
import { CheckCircle2, Download, Printer, ShieldCheck, X } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const ReceiptModal: React.FC = () => {
  const { lastReceipt, setLastReceipt, currency, accounts } = useBanking();

  if (!lastReceipt) return null;

  const relatedAccount = accounts.find((a) => a.id === lastReceipt.accountId);

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(lastReceipt.date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="bg-[#0A2540] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Simulated Transaction Receipt</h3>
              <p className="text-xs text-sky-200 mt-0.5">Apex Banking Management System — Academic Demo</p>
            </div>
          </div>
          <button
            onClick={() => setLastReceipt(null)}
            className="text-slate-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-6 space-y-5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200" id="receipt-print-area">
          <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Transaction Amount</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono tabular-nums mt-1">
              {currency}{lastReceipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                Simulated {lastReceipt.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block">Reference Number</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200 break-all select-all">{lastReceipt.referenceNo}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block">Transaction Date</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{formattedDate}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block">Payment Channel</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{lastReceipt.paymentMode}</span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block">Transaction Type</span>
              <span className="font-medium capitalize text-slate-800 dark:text-slate-200">{lastReceipt.type.replace('_', ' ')}</span>
            </div>

            <div className="col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block">Account Involved</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {relatedAccount ? `${relatedAccount.accountName} (${relatedAccount.accountNumber})` : 'Primary Account'}
              </span>
            </div>

            {lastReceipt.recipientName && (
              <div className="col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block">Recipient / Beneficiary</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {lastReceipt.recipientName} {lastReceipt.toAccount ? `· ${lastReceipt.toAccount}` : ''}
                </span>
              </div>
            )}

            <div className="col-span-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 block">Description / Memo</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{lastReceipt.description}</span>
            </div>

            <div className="col-span-2 bg-sky-50/70 dark:bg-sky-950/40 p-3 rounded-lg border border-sky-100 dark:border-sky-900/60 flex items-center justify-between">
              <span className="text-sky-800 dark:text-sky-300 font-medium">New Account Balance:</span>
              <span className="font-mono font-bold text-sky-900 dark:text-sky-200 text-sm tabular-nums">
                {currency}{lastReceipt.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/80 dark:bg-amber-950/40 rounded-lg border border-amber-200/60 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
            <strong>Academic Note:</strong> This transaction was processed using local state for engineering coursework demonstration. No real financial institutions were contacted.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            Print Receipt
          </button>
          <button
            onClick={() => setLastReceipt(null)}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0A2540] dark:bg-sky-600 rounded-lg hover:bg-[#0F2F57] dark:hover:bg-sky-500 transition-colors cursor-pointer"
          >
            Done & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

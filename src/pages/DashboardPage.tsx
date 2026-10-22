import React, { useState } from 'react';
import {
  ArrowDownCircle,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpCircle,
  ArrowUpRight,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Lock,
  Plus,
  Receipt,
  ShieldCheck,
  TrendingUp,
  Unlock,
  Wallet,
} from 'lucide-react';
import { CashflowChart } from '../components/charts/CashflowChart';
import { useBanking } from '../context/BankingContext';
import { Transaction } from '../types/banking';

export const DashboardPage: React.FC = () => {
  const {
    profile,
    accounts,
    transactions,
    totalBalance,
    totalDeposits,
    totalWithdrawals,
    currency,
    setActivePage,
    toggleCardFreeze,
    setLastReceipt,
  } = useBanking();

  const [showCardNumber, setShowCardNumber] = useState(false);
  const primaryAccount = accounts.find((a) => a.accountType === 'Savings') || accounts[0];
  const checkingAccount = accounts.find((a) => a.accountType === 'Checking') || accounts[1] || accounts[0];
  const card = checkingAccount?.cardDetails || primaryAccount?.cardDetails;

  const recentTransactions = transactions.slice(0, 6);

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
      case 'interest':
      case 'transfer_in':
        return <ArrowDownLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'withdrawal':
      case 'transfer_out':
        return <ArrowUpRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      default:
        return <Receipt className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors duration-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 tracking-wide uppercase">
            <span>Student Customer Portal</span>
            <span>·</span>
            <span>{profile.semester}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">
            Welcome back, {profile.fullName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {profile.projectTitle} · Branch: {profile.branch}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setActivePage('deposit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <ArrowDownCircle className="w-4 h-4 text-sky-400" />
            Deposit Money
          </button>
          <button
            onClick={() => setActivePage('withdraw')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <ArrowUpCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            Withdraw Money
          </button>
          <button
            onClick={() => setActivePage('transfer')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 hover:bg-sky-100/80 dark:hover:bg-sky-900/60 rounded-lg transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
          >
            <ArrowLeftRight className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            Transfer Funds
          </button>
        </div>
      </div>

      {/* 4 Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Combined Balance */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Total Net Balance</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-[#0A2540] dark:text-sky-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {currency}{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Across {accounts.length} linked accounts</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        {/* Total Deposits */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Total Simulated Deposits</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {currency}{totalDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>All lifetime deposits</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">+Inflow</span>
          </div>
        </div>

        {/* Total Withdrawals */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Total Debits & Withdrawals</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {currency}{totalWithdrawals.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Simulated withdrawals</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-600 dark:text-rose-400 font-medium">-Outflow</span>
          </div>
        </div>

        {/* Active Accounts */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-medium">Operational Accounts</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-[#0A2540] dark:text-sky-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            0{accounts.length}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Savings, Checking, FD</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActivePage('accounts')}
              className="text-[#0A2540] dark:text-sky-400 hover:underline font-medium cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Card & Cashflow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Interactive Chart & Accounts overview */}
        <div className="lg:col-span-2 space-y-6">
          <CashflowChart />

          {/* Account Cards Row */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Your Bank Accounts</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Primary balances & instant routing numbers</p>
              </div>
              <button
                onClick={() => setActivePage('accounts')}
                className="text-xs font-semibold text-[#0A2540] dark:text-sky-400 hover:underline cursor-pointer"
              >
                View Details →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-[#0A2540]/30 dark:hover:border-sky-500/30 transition-all cursor-pointer group"
                  onClick={() => setActivePage('accounts')}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{acc.accountType}</span>
                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{acc.accountNumber.slice(-4)}</span>
                  </div>
                  <div className="mt-2 text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {currency}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">{acc.accountName}</div>
                  <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Rate: {acc.interestRate}% p.a.</span>
                    <span className="text-sky-700 dark:text-sky-400 font-medium group-hover:underline">Select</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Virtual Campus Debit Card & Quick Payees */}
        <div className="space-y-6">
          {/* Virtual Card */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Campus Debit Card</h2>
              {card && (
                <button
                  onClick={() => toggleCardFreeze(checkingAccount.id)}
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md font-medium border cursor-pointer transition-colors ${
                    card.isFrozen
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                  }`}
                  title={card.isFrozen ? 'Click to unfreeze card' : 'Click to temporarily lock card'}
                >
                  {card.isFrozen ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Card Frozen</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                      <span>Active</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Realistic Debit Card Skin */}
            <div className="mt-4 relative rounded-2xl bg-gradient-to-br from-[#0A2540] via-[#0F2F57] to-[#1E3A8A] text-white p-5 shadow-md overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-sky-500/10 pointer-events-none blur-xl"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-sky-200 uppercase">Apex Student Debit</span>
                <span className="text-xs font-bold tracking-widest text-sky-400">VISA</span>
              </div>

              {/* EMV Chip */}
              <div className="mt-4 w-9 h-7 rounded-sm bg-gradient-to-tr from-amber-300 to-amber-100 border border-amber-400/60 shadow-xs flex items-center justify-center">
                <div className="w-6 h-4 border border-amber-500/40 rounded-xs"></div>
              </div>

              {/* Card Number */}
              <div className="mt-4 flex items-center justify-between">
                <div className="font-mono text-base tracking-widest text-white select-all">
                  {showCardNumber
                    ? card?.cardNumber || '4532 8901 2345 9081'
                    : `•••• •••• •••• ${checkingAccount?.cardDetails?.cardNumber?.slice(-4) || '9081'}`}
                </div>
                <button
                  type="button"
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="text-sky-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                  title={showCardNumber ? 'Hide card number' : 'Show full card number'}
                >
                  {showCardNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Cardholder & Expiry */}
              <div className="mt-4 flex items-end justify-between text-xs">
                <div>
                  <div className="text-[9px] text-sky-200/80 uppercase tracking-wider">Card Holder</div>
                  <div className="font-semibold text-white tracking-wide uppercase mt-0.5">
                    {card?.cardHolder || profile.fullName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-sky-200/80 uppercase tracking-wider">Expires / CVV</div>
                  <div className="font-mono text-white mt-0.5">
                    {card?.expiry || '09/29'} · {showCardNumber ? card?.cvv || '674' : '•••'}
                  </div>
                </div>
              </div>
            </div>

            {/* Card controls */}
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Linked to: {checkingAccount.accountName}</span>
              <span className="font-mono">{checkingAccount.accountNumber}</span>
            </div>
          </div>

          {/* Quick Transfer Payees */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Quick Payees</h2>
              <button
                onClick={() => setActivePage('transfer')}
                className="text-xs font-semibold text-[#0A2540] dark:text-sky-400 hover:underline cursor-pointer"
              >
                Send Money →
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <button
                onClick={() => setActivePage('transfer')}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold flex items-center justify-center text-xs">
                    RM
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Rohan Mehta</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">APEX-5521-8802 (Campus)</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">Pay</span>
              </button>

              <button
                onClick={() => setActivePage('transfer')}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                    SK
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Sneha Kulkarni</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">HDFC-8831-2940</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">Pay</span>
              </button>

              <button
                onClick={() => setActivePage('transfer')}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-xs">
                    UD
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">University Tuition Desk</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">SBIN-9901-4412</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-sky-700 dark:text-sky-400">Pay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-200">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Recent Transactions</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click any entry to view and print the transaction receipt</p>
          </div>
          <button
            onClick={() => setActivePage('transactions')}
            className="text-xs font-semibold text-[#0A2540] dark:text-sky-400 hover:underline cursor-pointer self-start sm:self-auto"
          >
            Full Transaction History ({transactions.length}) →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="py-3 px-4">Date & Ref</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Balance After</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map((tx) => {
                const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'interest';
                return (
                  <tr
                    key={tx.id}
                    onClick={() => setLastReceipt(tx)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">{tx.referenceNo}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shrink-0">
                          {getTransactionIcon(tx.type)}
                        </div>
                        <div className="max-w-xs truncate font-medium text-slate-800 dark:text-slate-200">
                          {tx.description}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {tx.paymentMode}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-semibold tabular-nums">
                      <span className={isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                        {isCredit ? '+' : '-'}{currency}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                      {currency}{tx.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-400 group-hover:underline">
                        View
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

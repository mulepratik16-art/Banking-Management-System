import React, { useMemo, useState } from 'react';
import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Calendar,
  Download,
  Filter,
  Printer,
  Receipt,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Transaction, TransactionType } from '../types/banking';

export const TransactionsPage: React.FC = () => {
  const { transactions, accounts, currency, setLastReceipt, notify } = useBanking();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'>('date_desc');

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        // Keyword Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = tx.description.toLowerCase().includes(q);
          const matchRef = tx.referenceNo.toLowerCase().includes(q);
          const matchPayee = tx.recipientName?.toLowerCase().includes(q) || false;
          const matchMode = tx.paymentMode.toLowerCase().includes(q);
          if (!matchDesc && !matchRef && !matchPayee && !matchMode) return false;
        }

        // Account filter
        if (selectedAccountId !== 'ALL' && tx.accountId !== selectedAccountId) {
          return false;
        }

        // Transaction Type filter
        if (selectedType !== 'ALL') {
          if (selectedType === 'deposit' && tx.type !== 'deposit' && tx.type !== 'interest') return false;
          if (selectedType === 'withdrawal' && tx.type !== 'withdrawal') return false;
          if (selectedType === 'transfer' && tx.type !== 'transfer_out' && tx.type !== 'transfer_in') return false;
        }

        // Date Range Filters
        if (startDate) {
          const txTime = new Date(tx.date).getTime();
          const startTime = new Date(startDate).setHours(0, 0, 0, 0);
          if (txTime < startTime) return false;
        }

        if (endDate) {
          const txTime = new Date(tx.date).getTime();
          const endTime = new Date(endDate).setHours(23, 59, 59, 999);
          if (txTime > endTime) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date_desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'date_asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'amount_desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount_asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [transactions, searchQuery, selectedAccountId, selectedType, startDate, endDate, sortBy]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Reference ID', 'Date', 'Type', 'Description', 'Channel', 'Amount', 'Balance After', 'Status'];
    const rows = filteredTransactions.map((tx) => [
      `"${tx.referenceNo}"`,
      `"${new Date(tx.date).toLocaleString()}"`,
      `"${tx.type}"`,
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.paymentMode}"`,
      tx.amount.toFixed(2),
      tx.balanceAfter.toFixed(2),
      `"${tx.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApexBank_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify('Statement exported to CSV successfully.');
  };

  const handlePrintStatement = () => {
    window.print();
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedAccountId('ALL');
    setSelectedType('ALL');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedAccountId !== 'ALL' || selectedType !== 'ALL' || startDate || endDate
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Transaction History & Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Search, filter by date and transaction type, and download official simulated CSV statements
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Download CSV file of displayed transactions"
          >
            <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            Export Statement (CSV)
          </button>
          <button
            onClick={handlePrintStatement}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 rounded-lg transition-colors cursor-pointer shadow-2xs"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-sky-400" />
            Print Statement
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-4">
        {/* Row 1: Keyword, Account, and Type */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference ID, payee, description..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Account selector */}
          <div>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
            >
              <option value="ALL">All Linked Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountName}
                </option>
              ))}
            </select>
          </div>

          {/* Type selector */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-950"
            >
              <option value="ALL">All Transaction Types</option>
              <option value="deposit">Deposits & Credits (+)</option>
              <option value="withdrawal">Withdrawals & Debits (-)</option>
              <option value="transfer">Transfers In & Out</option>
            </select>
          </div>
        </div>

        {/* Row 2: Date Range Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>

          {/* Quick Clear Filter */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Sorting & Result Counts Bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div>
            Showing <strong className="text-slate-800 dark:text-white">{filteredTransactions.length}</strong> of {transactions.length} total entries
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
            >
              <option value="date_desc">Date (Newest First)</option>
              <option value="date_asc">Date (Oldest First)</option>
              <option value="amount_desc">Amount (Highest First)</option>
              <option value="amount_asc">Amount (Lowest First)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Reference No.</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Channel Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-right">Balance After</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <Receipt className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No transactions match your search</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try clearing date or filter criteria</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isCredit = tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'interest';
                  const account = accounts.find((a) => a.id === tx.accountId);

                  return (
                    <tr
                      key={tx.id}
                      onClick={() => setLastReceipt(tx)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {new Date(tx.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {new Date(tx.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-600 dark:text-slate-300 select-all">
                        {tx.referenceNo}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 max-w-xs sm:max-w-md truncate">
                          {tx.description}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{account ? account.accountName : 'Primary Account'}</span>
                          {tx.recipientName && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>To: {tx.recipientName}</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        {tx.paymentMode}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-semibold tabular-nums">
                        <span className={isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}>
                          {isCredit ? '+' : '-'}{currency}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-slate-600 dark:text-slate-300 tabular-nums">
                        {currency}{tx.balanceAfter.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setLastReceipt(tx);
                          }}
                          className="px-2 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-400 hover:text-white hover:bg-[#0A2540] dark:hover:bg-sky-600 rounded-md transition-colors cursor-pointer"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  Loader2,
  Plus,
  ShieldCheck,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';
import { Beneficiary } from '../types/banking';

export const TransferPage: React.FC = () => {
  const {
    accounts,
    beneficiaries,
    addBeneficiary,
    transferMoney,
    currency,
  } = useBanking();

  // Mode: between own accounts vs to beneficiary
  const [transferType, setTransferType] = useState<'beneficiary' | 'own_accounts'>('beneficiary');

  // Form states
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [selectedBenId, setSelectedBenId] = useState(beneficiaries[0]?.id || 'custom');
  const [customRecipientName, setCustomRecipientName] = useState('');
  const [customAccountNumber, setCustomAccountNumber] = useState('');
  const [customBankName, setCustomBankName] = useState('State Bank of India');
  const [customIfsc, setCustomIfsc] = useState('SBIN0001234');

  const [toOwnAccountId, setToOwnAccountId] = useState(accounts[1]?.id || accounts[0]?.id || '');
  const [amount, setAmount] = useState('250');
  const [paymentMode, setPaymentMode] = useState('Instant IMPS Transfer');
  const [note, setNote] = useState('Project Hardware Share');

  // Loading & Modals
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isAddBenModalOpen, setIsAddBenModalOpen] = useState(false);

  // Add new beneficiary modal fields
  const [newBenName, setNewBenName] = useState('');
  const [newBenAccount, setNewBenAccount] = useState('');
  const [newBenBank, setNewBenBank] = useState('');
  const [newBenIfsc, setNewBenIfsc] = useState('');
  const [newBenNickname, setNewBenNickname] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const fromAccount = accounts.find((a) => a.id === fromAccountId) || accounts[0];
  const toOwnAccount = accounts.find((a) => a.id === toOwnAccountId);
  const selectedBen = beneficiaries.find((b) => b.id === selectedBenId);

  const numAmount = parseFloat(amount) || 0;
  const currentBal = fromAccount ? fromAccount.balance : 0;
  const currentMinBal = fromAccount ? fromAccount.minBalance : 0;
  const maxAvailable = Math.max(0, currentBal - currentMinBal);
  const isOverdrawn = numAmount > maxAvailable;

  const quickAmounts = [50, 100, 250, 500, 1000];

  const handleOpenReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (numAmount <= 0) {
      setErrorMsg('Please enter a transfer amount greater than 0.');
      return;
    }

    if (isOverdrawn) {
      setErrorMsg(
        `Amount exceeds available balance. Minimum account balance constraint: ${currency}${currentMinBal}.`
      );
      return;
    }

    if (transferType === 'own_accounts') {
      if (fromAccountId === toOwnAccountId) {
        setErrorMsg('Origin and destination accounts must be different.');
        return;
      }
    } else {
      if (selectedBenId === 'custom') {
        if (!customRecipientName.trim() || !customAccountNumber.trim()) {
          setErrorMsg('Please specify custom recipient name and account number.');
          return;
        }
      }
    }

    setIsReviewOpen(true);
  };

  const handleConfirmExecute = async () => {
    let destAccountNo = '';
    let destRecipient = '';

    if (transferType === 'own_accounts' && toOwnAccount) {
      destAccountNo = toOwnAccount.accountNumber;
      destRecipient = toOwnAccount.accountName;
    } else if (selectedBen && selectedBenId !== 'custom') {
      destAccountNo = selectedBen.accountNumber;
      destRecipient = selectedBen.name;
    } else {
      destAccountNo = customAccountNumber;
      destRecipient = customRecipientName;
    }

    setIsSubmitting(true);
    try {
      const res = await transferMoney(
        fromAccount.id,
        destAccountNo,
        destRecipient,
        numAmount,
        paymentMode,
        note
      );

      setIsReviewOpen(false);

      if (!res.success) {
        setErrorMsg(res.error || 'Transfer failed.');
      } else {
        setAmount('100');
        setNote('');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Unexpected error processing transfer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBenName.trim() || !newBenAccount.trim()) {
      return;
    }

    addBeneficiary({
      name: newBenName.trim(),
      accountNumber: newBenAccount.trim(),
      bankName: newBenBank.trim() || 'Apex Bank',
      ifsc: newBenIfsc.trim() || 'APEX0001892',
      nickname: newBenNickname.trim() || newBenName.trim(),
      type: 'External',
    });

    setIsAddBenModalOpen(false);
    setNewBenName('');
    setNewBenAccount('');
    setNewBenBank('');
    setNewBenIfsc('');
    setNewBenNickname('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Transfer Simulated Funds</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Atomic Firestore debit & ledger recording with idempotency guards and instant receipt generation
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => {
            setTransferType('beneficiary');
            setErrorMsg('');
          }}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            transferType === 'beneficiary'
              ? 'border-[#0A2540] dark:border-sky-500 text-[#0A2540] dark:text-sky-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>To Beneficiary / Other Student</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setTransferType('own_accounts');
            setErrorMsg('');
          }}
          className={`py-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            transferType === 'own_accounts'
              ? 'border-[#0A2540] dark:border-sky-500 text-[#0A2540] dark:text-sky-400'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Between Own Fictional Accounts</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Transfer Form (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handleOpenReview} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Source Account */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                From Account (Debited Source)
              </label>
              <select
                value={fromAccount?.id || ''}
                onChange={(e) => setFromAccountId(e.target.value)}
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

            {/* Destination Selection */}
            {transferType === 'own_accounts' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  To Account (Your Linked Accounts)
                </label>
                <select
                  value={toOwnAccountId}
                  onChange={(e) => setToOwnAccountId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {accounts
                    .filter((a) => a.id !== fromAccountId)
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.accountName} ({acc.accountNumber}) — Current: {currency}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Saved Beneficiary or One-Time Payee
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddBenModalOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A2540] dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Beneficiary</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {beneficiaries.map((ben) => (
                    <label
                      key={ben.id}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                        selectedBenId === ben.id
                          ? 'border-[#0A2540] dark:border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-[#0A2540] dark:text-sky-300 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="beneficiary"
                        value={ben.id}
                        checked={selectedBenId === ben.id}
                        onChange={(e) => setSelectedBenId(e.target.value)}
                        className="sr-only"
                      />
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{ben.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{ben.accountNumber}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">{ben.bankName}</div>
                      </div>
                    </label>
                  ))}

                  {/* Custom Payee option */}
                  <label
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      selectedBenId === 'custom'
                        ? 'border-[#0A2540] dark:border-sky-500 bg-sky-50/50 dark:bg-sky-950/40 text-[#0A2540] dark:text-sky-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="beneficiary"
                      value="custom"
                      checked={selectedBenId === 'custom'}
                      onChange={(e) => setSelectedBenId(e.target.value)}
                      className="sr-only"
                    />
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">One-Time Payee</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Manual Account & IFSC</div>
                    </div>
                  </label>
                </div>

                {/* Custom Payee Details Form */}
                {selectedBenId === 'custom' && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-2 mt-2">
                    <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Enter Payee Information</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={customRecipientName}
                        onChange={(e) => setCustomRecipientName(e.target.value)}
                        placeholder="Payee Full Name"
                        className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                      <input
                        type="text"
                        value={customAccountNumber}
                        onChange={(e) => setCustomAccountNumber(e.target.value)}
                        placeholder="Payee Account Number (e.g. 1098442110)"
                        className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        required
                      />
                      <input
                        type="text"
                        value={customBankName}
                        onChange={(e) => setCustomBankName(e.target.value)}
                        placeholder="Bank Name"
                        className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                      <input
                        type="text"
                        value={customIfsc}
                        onChange={(e) => setCustomIfsc(e.target.value)}
                        placeholder="IFSC Code (e.g. SBIN0001234)"
                        className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Amount & Quick Chips */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Transfer Amount ({currency})
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Avail: <strong className="text-slate-800 dark:text-slate-200">{currency}{maxAvailable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
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

            {/* Payment Mode Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Simulated Settlement Channel
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'Instant IMPS Transfer', label: 'Instant IMPS (24x7)' },
                  { id: 'NEFT Batch Transfer', label: 'NEFT Clearance' },
                  { id: 'RTGS High-Value Transfer', label: 'RTGS Real-Time' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      paymentMode === item.id
                        ? 'border-[#0A2540] dark:border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 text-[#0A2540] dark:text-sky-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="transferChannel"
                      value={item.id}
                      checked={paymentMode === item.id}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="sr-only"
                    />
                    <span className="truncate">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Transaction Remark / Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                disabled={isSubmitting}
                placeholder="e.g. Semester project split, cafeteria bill"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0A2540] dark:focus:ring-sky-500 text-slate-900 dark:text-white bg-white dark:bg-slate-800"
              />
            </div>

            {/* Review Button */}
            <button
              type="submit"
              disabled={isOverdrawn || isSubmitting}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 shadow-xs ${
                isOverdrawn || isSubmitting
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                  : 'bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 text-sky-400" />
              <span>Review Simulated Transfer</span>
            </button>
          </form>
        </div>

        {/* Right Column: Beneficiary Quick List & Security Policy */}
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 text-xs space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              Atomic Transfer Protocol
            </h2>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Source:</span>
                <span className="font-medium text-slate-900 dark:text-white text-right">{fromAccount?.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Available:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {currency}{maxAvailable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Transfer Sum:</span>
                <span className="font-mono text-rose-600 dark:text-rose-400 font-semibold">
                  -{currency}{numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-700 dark:text-slate-300 font-semibold">Remaining Bal:</span>
                <span className="font-mono font-bold text-[#0A2540] dark:text-sky-400">
                  {currency}{(currentBal - numAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-200 dark:border-slate-800 space-y-1">
              <div>• Transferred funds are verified inside a single atomic Firestore transaction.</div>
              <div>• Idempotency key generated to prevent duplicate debit on double-clicks.</div>
              <div>• If transferring between self accounts, both account balances update simultaneously.</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Step Confirmation Review Modal */}
      {isReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                Confirm Simulated Transfer
              </h3>
              <button
                onClick={() => !isSubmitting && setIsReviewOpen(false)}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-100 dark:border-sky-900/60 text-center">
              <div className="text-[11px] text-sky-800 dark:text-sky-300 uppercase tracking-wider font-semibold">
                Simulated Amount
              </div>
              <div className="text-2xl font-mono font-extrabold text-[#0A2540] dark:text-sky-400 mt-0.5">
                {currency}{numAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Debit Account:</span>
                <span className="font-medium text-slate-900 dark:text-white">{fromAccount.accountName}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Beneficiary:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {transferType === 'own_accounts'
                    ? toOwnAccount?.accountName
                    : selectedBenId !== 'custom'
                    ? selectedBen?.name
                    : customRecipientName}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-500 dark:text-slate-400">Channel:</span>
                <span className="font-medium text-slate-900 dark:text-white">{paymentMode}</span>
              </div>
              {note && (
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Note:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{note}</span>
                </div>
              )}
            </div>

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setIsReviewOpen(false)}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
              >
                Back / Edit
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmExecute}
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                    <span>Committing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Confirm & Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Beneficiary Modal */}
      {isAddBenModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#0A2540] dark:text-sky-400" />
                Add New Peer Beneficiary
              </h3>
              <button
                onClick={() => setIsAddBenModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBeneficiary} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Beneficiary Full Name
                </label>
                <input
                  type="text"
                  value={newBenName}
                  onChange={(e) => setNewBenName(e.target.value)}
                  placeholder="e.g. Rohit Sharma"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={newBenAccount}
                  onChange={(e) => setNewBenAccount(e.target.value)}
                  placeholder="e.g. 10982345091"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={newBenBank}
                    onChange={(e) => setNewBenBank(e.target.value)}
                    placeholder="e.g. Apex Bank"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={newBenIfsc}
                    onChange={(e) => setNewBenIfsc(e.target.value)}
                    placeholder="e.g. APEX0001892"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={newBenNickname}
                  onChange={(e) => setNewBenNickname(e.target.value)}
                  placeholder="e.g. Roommate, Lab Partner"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBenModalOpen(false)}
                  className="flex-1 py-2 px-3 font-semibold rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 font-semibold rounded-lg bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer shadow-xs"
                >
                  Save Beneficiary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

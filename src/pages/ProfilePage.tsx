import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useBanking } from '../context/BankingContext';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, currentUser, notify } = useBanking();

  // Editable fields
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Security Simulation Form
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        fullName,
        email,
        phone,
        address,
      });
      setIsEditing(false);
      notify('Student profile updated in Cloud Firestore.');
    } catch (err: any) {
      notify(err?.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      notify('Simulated ATM PIN must be exactly 4 digits.', 'error');
      return;
    }
    if (newPin !== confirmPin) {
      notify('New PIN and confirmation PIN do not match.', 'error');
      return;
    }
    notify('Simulated 4-Digit ATM PIN updated successfully.');
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Customer Profile & KYC</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Student identity verification, Firebase Authentication details, and simulated account settings
        </p>
      </div>

      {/* Main Profile Identity Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#0A2540] dark:border-sky-500 shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white border-2 border-white dark:border-slate-900">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{profile.fullName}</h2>
              <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                Simulated KYC {profile.kycStatus}
              </span>
              {currentUser?.isAnonymous && (
                <span className="text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-800">
                  Demo Session (Firebase UID)
                </span>
              )}
            </div>

            <div className="mt-1 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-3">
              <span className="font-mono text-slate-800 dark:text-slate-200 font-medium">ID: {profile.id}</span>
              <span aria-hidden="true">·</span>
              <span>Roll No: {profile.rollNo}</span>
              <span aria-hidden="true">·</span>
              <span>Branch: {profile.branch}</span>
            </div>

            {currentUser && (
              <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 break-all">
                Firebase UID: <span className="text-slate-700 dark:text-slate-300">{currentUser.uid}</span>
              </div>
            )}
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="py-1.5 px-3 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Contact Info'}
            </button>
          </div>
        </div>

        {/* Profile Details Grid */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Customer Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="py-2 px-4 text-xs font-semibold rounded-lg bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                <Mail className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Email Address</span>
              </div>
              <div className="font-medium text-slate-900 dark:text-white truncate">{profile.email}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                <Phone className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Contact Phone</span>
              </div>
              <div className="font-mono font-medium text-slate-900 dark:text-white">{profile.phone}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Campus Hostel / City</span>
              </div>
              <div className="font-medium text-slate-900 dark:text-white truncate">{profile.address}</div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                <Building2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Affiliated Campus</span>
              </div>
              <div className="font-medium text-slate-900 dark:text-white truncate">{profile.college || 'Apex Institute of Technology'}</div>
            </div>
          </div>
        )}
      </div>

      {/* Security & Simulated Credentials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ATM PIN Update */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <KeyRound className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs">Simulated ATM PIN Setup</h3>
          </div>

          <form onSubmit={handleUpdatePin} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Current 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="••••"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center tracking-widest text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">New 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center tracking-widest text-sm"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Confirm PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="••••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-center tracking-widest text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold rounded-lg bg-[#0A2540] hover:bg-[#0F2F57] dark:bg-sky-600 dark:hover:bg-sky-500 text-white cursor-pointer shadow-xs mt-2"
            >
              Update Simulated PIN
            </button>
          </form>
        </div>

        {/* Security Controls & Academic Disclosures */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs">Security Status & Policies</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Two-Factor Authentication</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">Simulated SMS OTP verification</span>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                  twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                    twoFactorEnabled ? 'left-5' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-lg border border-sky-100 dark:border-sky-900/60 text-[11px] text-sky-900 dark:text-sky-300 space-y-1">
              <span className="font-semibold block">Academic Demonstration Safe Guards:</span>
              <p className="leading-relaxed">
                All profile records, email handles, and roll numbers are strictly simulated mock data. No government IDs or real KYC records are stored or transmitted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

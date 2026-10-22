import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateAuthProfile,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  INITIAL_ACCOUNTS,
  INITIAL_BENEFICIARIES,
  INITIAL_CASHFLOW,
  INITIAL_PROFILE,
  INITIAL_TRANSACTIONS,
} from '../data/mockData';
import {
  createNewSubAccount,
  executeAtomicDeposit,
  executeAtomicTransfer,
  executeAtomicWithdrawal,
  initializeUserInFirestore,
  updateCardFreezeState,
} from '../services/bankingFirestore';
import {
  OperationType,
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  testConnection,
} from '../services/firebase';
import {
  AccountType,
  BankAccount,
  Beneficiary,
  CustomerProfile,
  MonthlyCashflow,
  NavPage,
  Transaction,
  rupeesToPaise,
} from '../types/banking';

export interface AuthErrorInfo {
  message: string;
  isAdminRestricted: boolean;
  code?: string;
}

export const DEMO_PRESET_CREDENTIALS: Record<string, { email: string; password: string; name: string; rollNo: string }> = {
  'Aarav Patel': {
    name: 'Aarav Patel',
    email: 'aarav.patel@engg-univ.edu',
    password: 'StudentDemo2026!',
    rollNo: 'FY-CSE-2026-44',
  },
  'Dr. S. K. Raman': {
    name: 'Dr. S. K. Raman',
    email: 'evaluator@apexbank.edu',
    password: 'FacultyReview2026!',
    rollNo: 'FACULTY-AUDIT-01',
  },
  'Guest Peer Evaluator': {
    name: 'Guest Peer Evaluator',
    email: 'guest.demo@apexbank.edu',
    password: 'GuestDemo2026!',
    rollNo: 'GUEST-2026',
  },
};

export function parseFirebaseAuthError(err: any): AuthErrorInfo {
  const code = err?.code || '';
  const rawMsg = err?.message || String(err);

  if (code === 'auth/admin-restricted-operation' || rawMsg.includes('admin-restricted-operation')) {
    return {
      code,
      isAdminRestricted: true,
      message:
        'Firebase Authentication error (auth/admin-restricted-operation): The Email/Password sign-in provider is disabled in your Firebase Console. Please enable it under Authentication > Sign-in method, or sign in with Google.',
    };
  }

  if (code === 'auth/email-already-in-use') {
    return {
      code,
      isAdminRestricted: false,
      message: 'This email is already registered in Firebase Auth. Please sign in instead or use another email.',
    };
  }

  if (
    code === 'auth/user-not-found' ||
    code === 'auth/wrong-password' ||
    code === 'auth/invalid-credential'
  ) {
    return {
      code,
      isAdminRestricted: false,
      message: 'Invalid email or password. Please verify your credentials or register a new account.',
    };
  }

  if (code === 'auth/weak-password') {
    return {
      code,
      isAdminRestricted: false,
      message: 'Password is too weak. Please use at least 6 characters.',
    };
  }

  if (code === 'auth/invalid-email') {
    return {
      code,
      isAdminRestricted: false,
      message: 'Please provide a valid email format (e.g. student@engg-univ.edu).',
    };
  }

  if (code === 'auth/too-many-requests') {
    return {
      code,
      isAdminRestricted: false,
      message: 'Access temporarily disabled due to multiple failed login attempts. Please wait a few moments or sign in with Google.',
    };
  }

  if (code === 'auth/popup-closed-by-user') {
    return {
      code,
      isAdminRestricted: false,
      message: 'Google Sign-In popup was closed before completing authentication.',
    };
  }

  if (code === 'auth/operation-not-allowed') {
    return {
      code,
      isAdminRestricted: true,
      message: 'This authentication provider is not enabled in Firebase Console. Please enable it in the console.',
    };
  }

  return {
    code,
    isAdminRestricted: false,
    message: rawMsg || 'An unexpected authentication error occurred.',
  };
}

interface BankingContextType {
  isLoggedIn: boolean;
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  dataLoading: boolean;
  login: (username?: string) => Promise<{ success: boolean; error?: string; isAdminRestricted?: boolean }>;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string; isAdminRestricted?: boolean }>;
  registerWithEmail: (
    email: string,
    password: string,
    fullName: string,
    rollNo?: string
  ) => Promise<{ success: boolean; error?: string; isAdminRestricted?: boolean }>;
  logout: () => Promise<void>;
  authErrorBanner: AuthErrorInfo | null;
  setAuthErrorBanner: (banner: AuthErrorInfo | null) => void;
  activePage: NavPage;
  setActivePage: (page: NavPage) => void;
  profile: CustomerProfile;
  updateProfile: (updated: Partial<CustomerProfile>) => Promise<void>;
  accounts: BankAccount[];
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  cashflow: MonthlyCashflow[];
  currency: string;
  setCurrency: (c: string) => void;
  totalBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  depositMoney: (
    accountId: string,
    amount: number,
    paymentMode: string,
    note?: string
  ) => Promise<{ success: boolean; error?: string; transaction?: Transaction }>;
  withdrawMoney: (
    accountId: string,
    amount: number,
    paymentMode: string,
    note?: string
  ) => Promise<{ success: boolean; error?: string; transaction?: Transaction }>;
  transferMoney: (
    fromAccountId: string,
    toAccountNo: string,
    recipientName: string,
    amount: number,
    paymentMode: string,
    note?: string
  ) => Promise<{ success: boolean; error?: string; transaction?: Transaction }>;
  createAccount: (
    accountType: AccountType,
    accountName: string,
    initialDeposit: number
  ) => Promise<{ success: boolean; error?: string; account?: BankAccount }>;
  toggleCardFreeze: (accountId: string) => Promise<void>;
  addBeneficiary: (ben: Omit<Beneficiary, 'id'>) => void;
  resetDemoData: () => void;
  lastReceipt: Transaction | null;
  setLastReceipt: (tx: Transaction | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  clearNotification: () => void;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const BankingContext = createContext<BankingContextType | null>(null);

const STORAGE_KEY_PREFIX = 'bms_demo_v2_';

export const BankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [authErrorBanner, setAuthErrorBanner] = useState<AuthErrorInfo | null>(null);
  const [activePage, setActivePage] = useState<NavPage>('landing');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Currency (Indian Rupee by default)
  const [currency, setCurrency] = useState<string>('₹');

  // Customer State
  const [profile, setProfile] = useState<CustomerProfile>(INITIAL_PROFILE);
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [cashflow] = useState<MonthlyCashflow[]>(INITIAL_CASHFLOW);

  const [lastReceipt, setLastReceipt] = useState<Transaction | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Sync theme to DOM
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  const clearNotification = () => setNotification(null);

  // Test connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Firebase Auth State Listener & Firestore Real-time Binding
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (!user) {
        // Revert to demo mock defaults if user logged out
        setProfile(INITIAL_PROFILE);
        setAccounts(INITIAL_ACCOUNTS);
        setTransactions(INITIAL_TRANSACTIONS);
        return;
      }

      setDataLoading(true);

      // Auto-initialize profile & accounts in Firestore if first login
      try {
        await initializeUserInFirestore(
          user.uid,
          user.displayName || user.email?.split('@')[0] || INITIAL_PROFILE.fullName,
          user.email || INITIAL_PROFILE.email
        );
      } catch (e) {
        console.warn('Profile initialization note:', e);
      }

      // Attach Real-time listener for User Profile
      const userDocRef = doc(db, 'users', user.uid);
      const unsubscribeUser = onSnapshot(
        userDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setProfile((prev) => ({
              ...prev,
              id: user.uid,
              fullName: data.fullName || user.displayName || prev.fullName,
              email: data.email || user.email || prev.email,
              phone: data.phone || prev.phone,
              rollNo: data.rollNo || prev.rollNo,
              address: data.address || prev.address,
              kycStatus: data.kycStatus || 'Verified',
              branch: data.branch || prev.branch,
              college: data.college || prev.college,
            }));
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      );

      // Attach Real-time listener for Bank Accounts
      const accountsQuery = query(collection(db, 'accounts'), where('userId', '==', user.uid));
      const unsubscribeAccounts = onSnapshot(
        accountsQuery,
        (snap) => {
          const loadedAccounts: BankAccount[] = snap.docs.map((d) => {
            const data = d.data();
            const balPaise = Number(data.balancePaise) || 0;
            const minBalPaise = Number(data.minBalancePaise) || 0;
            return {
              id: d.id,
              userId: data.userId,
              accountNumber: data.accountNumber,
              accountType: data.accountType,
              accountName: data.accountName,
              balancePaise: balPaise,
              balance: Number((balPaise / 100).toFixed(2)),
              minBalancePaise: minBalPaise,
              minBalance: Number((minBalPaise / 100).toFixed(2)),
              interestRate: Number(data.interestRate) || 3.5,
              ifsc: data.ifsc || 'APEX0001892',
              openingDate: data.openingDate || '2026-01-10',
              currency: '₹',
              isFrozen: Boolean(data.isFrozen),
              cardDetails: {
                cardNumber: data.accountType === 'Checking'
                  ? '5319 4012 9981 7741'
                  : '4532 8901 2345 9081',
                cardHolder: (data.accountName || user.displayName || 'AARAV PATEL').toUpperCase(),
                expiry: '09/29',
                cvv: '674',
                isFrozen: Boolean(data.isFrozen),
              },
            };
          });

          if (loadedAccounts.length > 0) {
            setAccounts(loadedAccounts);
          }
          setDataLoading(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'accounts');
        }
      );

      // Attach Real-time listener for Transactions
      const txQuery = query(collection(db, 'transactions'), where('userId', '==', user.uid));
      const unsubscribeTx = onSnapshot(
        txQuery,
        (snap) => {
          const loadedTxs: Transaction[] = snap.docs
            .map((d) => {
              const data = d.data();
              const amtPaise = Number(data.amountPaise) || 0;
              const balAfterPaise = Number(data.balanceAfterPaise) || 0;
              return {
                id: d.id,
                userId: data.userId,
                date: data.date,
                amountPaise: amtPaise,
                amount: Number((amtPaise / 100).toFixed(2)),
                type: data.type,
                category: data.category || 'Deposit',
                description: data.description,
                referenceNo: data.referenceNo,
                accountId: data.accountId,
                toAccount: data.toAccount,
                recipientName: data.recipientName,
                paymentMode: data.paymentMode || 'Online Clearing',
                status: data.status || 'Completed',
                balanceAfterPaise: balAfterPaise,
                balanceAfter: Number((balAfterPaise / 100).toFixed(2)),
              };
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          if (loadedTxs.length > 0) {
            setTransactions(loadedTxs);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'transactions');
        }
      );

      return () => {
        unsubscribeUser();
        unsubscribeAccounts();
        unsubscribeTx();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  const loginWithGoogle = async () => {
    setAuthLoading(true);
    setAuthErrorBanner(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      await initializeUserInFirestore(
        res.user.uid,
        res.user.displayName || 'Google Customer',
        res.user.email || 'customer@gmail.com'
      );
      setActivePage('dashboard');
      notify(`Signed in via Google as ${res.user.displayName || 'Customer'}.`);
    } catch (err: any) {
      const parsed = parseFirebaseAuthError(err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setAuthErrorBanner(parsed);
      }
      notify(parsed.message, 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; isAdminRestricted?: boolean }> => {
    setAuthLoading(true);
    setAuthErrorBanner(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      await initializeUserInFirestore(
        cred.user.uid,
        cred.user.displayName || email.split('@')[0],
        cred.user.email || email
      );
      setActivePage('dashboard');
      notify(`Signed in as ${cred.user.displayName || email.split('@')[0]}.`);
      return { success: true };
    } catch (err: any) {
      const parsed = parseFirebaseAuthError(err);
      setAuthErrorBanner(parsed);
      notify(parsed.message, 'error');
      return { success: false, error: parsed.message, isAdminRestricted: parsed.isAdminRestricted };
    } finally {
      setAuthLoading(false);
    }
  };

  const registerWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    rollNo?: string
  ): Promise<{ success: boolean; error?: string; isAdminRestricted?: boolean }> => {
    setAuthLoading(true);
    setAuthErrorBanner(null);
    try {
      if (!fullName.trim()) {
        throw new Error('Please provide full student name for registration.');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.');
      }

      // Create Firebase Auth User
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);

      // Set displayName on Firebase Auth User
      try {
        await updateAuthProfile(cred.user, {
          displayName: fullName.trim(),
        });
      } catch (profileErr) {
        console.warn('Could not update displayName:', profileErr);
      }

      // Initialize Firestore document and accounts (NO PASSWORD in Firestore)
      await initializeUserInFirestore(
        cred.user.uid,
        fullName.trim(),
        email.trim(),
        rollNo?.trim()
      );

      setActivePage('dashboard');
      notify(`Registered successfully as ${fullName.trim()}! Welcome to Apex Bank.`);
      return { success: true };
    } catch (err: any) {
      const parsed = parseFirebaseAuthError(err);
      setAuthErrorBanner(parsed);
      notify(parsed.message, 'error');
      return { success: false, error: parsed.message, isAdminRestricted: parsed.isAdminRestricted };
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async (
    username?: string
  ): Promise<{ success: boolean; error?: string; isAdminRestricted?: boolean }> => {
    setAuthLoading(true);
    setAuthErrorBanner(null);

    const preset = username ? DEMO_PRESET_CREDENTIALS[username] : DEMO_PRESET_CREDENTIALS['Aarav Patel'];
    const targetEmail = preset?.email || 'aarav.patel@engg-univ.edu';
    const targetPassword = preset?.password || 'StudentDemo2026!';
    const targetName = preset?.name || username || 'Aarav Patel';
    const targetRoll = preset?.rollNo || 'FY-CSE-2026-44';

    try {
      // 1. Try to sign in with email and password
      try {
        const cred = await signInWithEmailAndPassword(auth, targetEmail, targetPassword);
        await initializeUserInFirestore(cred.user.uid, targetName, targetEmail, targetRoll);
        setActivePage('dashboard');
        notify(`Authenticated as ${targetName}. Firestore session active.`);
        return { success: true };
      } catch (signInErr: any) {
        // If user doesn't exist yet, auto-create it with createUserWithEmailAndPassword
        if (
          signInErr?.code === 'auth/user-not-found' ||
          signInErr?.code === 'auth/invalid-credential'
        ) {
          const cred = await createUserWithEmailAndPassword(auth, targetEmail, targetPassword);
          try {
            await updateAuthProfile(cred.user, { displayName: targetName });
          } catch (e) {
            // ignore
          }
          await initializeUserInFirestore(cred.user.uid, targetName, targetEmail, targetRoll);
          setActivePage('dashboard');
          notify(`Created & logged into demo account: ${targetName}.`);
          return { success: true };
        }
        throw signInErr;
      }
    } catch (err: any) {
      const parsed = parseFirebaseAuthError(err);
      setAuthErrorBanner(parsed);
      notify(parsed.message, 'error');
      // If admin-restricted, redirect to LoginPage so user sees the diagnostic guidance
      setActivePage('login');
      return { success: false, error: parsed.message, isAdminRestricted: parsed.isAdminRestricted };
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthErrorBanner(null);
      setActivePage('landing');
      notify('Signed out successfully from Firebase session.', 'info');
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const totalDeposits = transactions
    .filter((tx) => tx.type === 'deposit' || tx.type === 'transfer_in' || tx.type === 'interest')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalWithdrawals = transactions
    .filter((tx) => tx.type === 'withdrawal' || tx.type === 'transfer_out')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const updateProfile = async (updated: Partial<CustomerProfile>) => {
    if (!auth.currentUser) {
      notify('Authentication required to save profile.', 'error');
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    try {
      await updateDoc(userRef, {
        ...updated,
        updatedAt: new Date().toISOString(),
      });
      setProfile((prev) => ({ ...prev, ...updated }));
      notify('Customer profile updated in Cloud Firestore.');
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
    }
  };

  const depositMoney = async (
    accountId: string,
    amount: number,
    paymentMode: string,
    note?: string
  ): Promise<{ success: boolean; error?: string; transaction?: Transaction }> => {
    if (!auth.currentUser) {
      notify('Authentication required to process deposits.', 'error');
      return { success: false, error: 'Authentication required' };
    }

    const amountPaise = rupeesToPaise(amount);
    if (amountPaise <= 0) {
      return { success: false, error: 'Deposit amount must be positive.' };
    }

    try {
      const tx = await executeAtomicDeposit(accountId, amountPaise, paymentMode, note);
      setLastReceipt(tx);
      notify(`Simulated deposit of ₹${amount.toLocaleString()} processed successfully.`);
      return { success: true, transaction: tx };
    } catch (err: any) {
      const msg = err?.message || 'Deposit transaction failed.';
      notify(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const withdrawMoney = async (
    accountId: string,
    amount: number,
    paymentMode: string,
    note?: string
  ): Promise<{ success: boolean; error?: string; transaction?: Transaction }> => {
    if (!auth.currentUser) {
      notify('Authentication required to process withdrawals.', 'error');
      return { success: false, error: 'Authentication required' };
    }

    const amountPaise = rupeesToPaise(amount);
    if (amountPaise <= 0) {
      return { success: false, error: 'Withdrawal amount must be positive.' };
    }

    try {
      const tx = await executeAtomicWithdrawal(accountId, amountPaise, paymentMode, note);
      setLastReceipt(tx);
      notify(`Simulated withdrawal of ₹${amount.toLocaleString()} debited.`);
      return { success: true, transaction: tx };
    } catch (err: any) {
      const msg = err?.message || 'Withdrawal transaction failed.';
      notify(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const transferMoney = async (
    fromAccountId: string,
    toAccountNo: string,
    recipientName: string,
    amount: number,
    paymentMode: string,
    note?: string
  ): Promise<{ success: boolean; error?: string; transaction?: Transaction }> => {
    if (!auth.currentUser) {
      notify('Authentication required to process transfers.', 'error');
      return { success: false, error: 'Authentication required' };
    }

    const amountPaise = rupeesToPaise(amount);
    if (amountPaise <= 0) {
      return { success: false, error: 'Transfer amount must be positive.' };
    }

    try {
      const tx = await executeAtomicTransfer(
        fromAccountId,
        toAccountNo,
        recipientName,
        amountPaise,
        paymentMode,
        note
      );
      setLastReceipt(tx);
      notify(`Simulated transfer of ₹${amount.toLocaleString()} to ${recipientName} sent.`);
      return { success: true, transaction: tx };
    } catch (err: any) {
      const msg = err?.message || 'Transfer transaction failed.';
      notify(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const createAccount = async (
    accountType: AccountType,
    accountName: string,
    initialDeposit: number
  ): Promise<{ success: boolean; error?: string; account?: BankAccount }> => {
    if (!auth.currentUser) {
      notify('Authentication required to create accounts.', 'error');
      return { success: false, error: 'Authentication required' };
    }

    const initialPaise = rupeesToPaise(initialDeposit);
    try {
      const newAcc = await createNewSubAccount(accountType, accountName, initialPaise);
      notify(`New ${accountType} account "${accountName}" opened.`);
      return { success: true, account: newAcc };
    } catch (err: any) {
      const msg = err?.message || 'Failed to open account.';
      notify(msg, 'error');
      return { success: false, error: msg };
    }
  };

  const toggleCardFreeze = async (accountId: string) => {
    const acc = accounts.find((a) => a.id === accountId);
    if (!acc) return;
    const nextState = !acc.isFrozen;

    try {
      await updateCardFreezeState(accountId, nextState);
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === accountId
            ? {
                ...a,
                isFrozen: nextState,
                cardDetails: a.cardDetails ? { ...a.cardDetails, isFrozen: nextState } : undefined,
              }
            : a
        )
      );
      notify(
        nextState
          ? `Campus Debit Card for ${acc.accountName} is now FROZEN.`
          : `Campus Debit Card for ${acc.accountName} is now ACTIVE.`
      );
    } catch (err: any) {
      notify(err?.message || 'Failed to update debit card freeze status.', 'error');
    }
  };

  const addBeneficiary = (ben: Omit<Beneficiary, 'id'>) => {
    const newBen: Beneficiary = {
      ...ben,
      id: `ben-${Date.now()}`,
    };
    setBeneficiaries((prev) => [...prev, newBen]);
    notify(`Payee "${ben.name}" added to demo recipients.`);
  };

  const resetDemoData = () => {
    setProfile(INITIAL_PROFILE);
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setAuthErrorBanner(null);
    notify('Demo state has been refreshed.');
  };

  return (
    <BankingContext.Provider
      value={{
        isLoggedIn: Boolean(currentUser),
        currentUser,
        authLoading,
        dataLoading,
        login,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        authErrorBanner,
        setAuthErrorBanner,
        activePage,
        setActivePage,
        profile,
        updateProfile,
        accounts,
        transactions,
        beneficiaries,
        cashflow,
        currency,
        setCurrency,
        totalBalance,
        totalDeposits,
        totalWithdrawals,
        depositMoney,
        withdrawMoney,
        transferMoney,
        createAccount,
        toggleCardFreeze,
        addBeneficiary,
        resetDemoData,
        lastReceipt,
        setLastReceipt,
        theme,
        toggleTheme,
        showAuthModal,
        setShowAuthModal,
        notification,
        clearNotification,
        notify,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};

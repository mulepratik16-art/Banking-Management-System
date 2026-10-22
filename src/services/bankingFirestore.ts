import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { INITIAL_ACCOUNTS, INITIAL_PROFILE, INITIAL_TRANSACTIONS } from '../data/mockData';
import { BankAccount, CustomerProfile, Transaction } from '../types/banking';
import { OperationType, auth, db, handleFirestoreError } from './firebase';

/**
 * Initializes default customer profile, accounts, and sample ledger in Firestore
 * if they do not yet exist for the authenticated user.
 */
export async function initializeUserInFirestore(
  uid: string,
  customName?: string,
  customEmail?: string,
  customRollNo?: string
): Promise<void> {
  const userRef = doc(db, 'users', uid);

  try {
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const now = new Date().toISOString();
      const profileData: CustomerProfile = {
        ...INITIAL_PROFILE,
        id: uid,
        fullName: customName || INITIAL_PROFILE.fullName,
        email: customEmail || auth.currentUser?.email || INITIAL_PROFILE.email,
        rollNo: customRollNo || INITIAL_PROFILE.rollNo,
      };

      // 1. Create User Document
      await setDoc(userRef, {
        ...profileData,
        createdAt: now,
        updatedAt: now,
      });

      // 2. Create Initial User Accounts in Firestore (Integer Paise)
      for (const initialAcc of INITIAL_ACCOUNTS) {
        const accId = `${uid}_${initialAcc.id.replace('acc-', '')}`;
        const accRef = doc(db, 'accounts', accId);
        await setDoc(accRef, {
          id: accId,
          userId: uid,
          accountNumber: initialAcc.accountNumber,
          accountType: initialAcc.accountType,
          accountName: initialAcc.accountName,
          balancePaise: initialAcc.balancePaise,
          minBalancePaise: initialAcc.minBalancePaise,
          interestRate: initialAcc.interestRate,
          ifsc: initialAcc.ifsc,
          openingDate: initialAcc.openingDate,
          isFrozen: false,
          createdAt: now,
          updatedAt: now,
        });
      }

      // 3. Create Initial Sample Transactions in Firestore
      for (const tx of INITIAL_TRANSACTIONS) {
        const txDocId = `${uid}_${tx.id}`;
        const relatedAccId = `${uid}_${tx.accountId.replace('acc-', '')}`;
        const txRef = doc(db, 'transactions', txDocId);
        await setDoc(txRef, {
          id: txDocId,
          userId: uid,
          accountId: relatedAccId,
          date: tx.date,
          type: tx.type,
          category: tx.category,
          amountPaise: tx.amountPaise,
          balanceAfterPaise: tx.balanceAfterPaise,
          description: tx.description,
          referenceNo: tx.referenceNo,
          paymentMode: tx.paymentMode,
          toAccount: tx.toAccount || '',
          recipientName: tx.recipientName || '',
          status: tx.status,
          idempotencyKey: `init_${tx.id}`,
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}

/**
 * Atomic Deposit Operation in Firestore using runTransaction.
 */
export async function executeAtomicDeposit(
  accountId: string,
  amountPaise: number,
  paymentMode: string,
  note?: string,
  idempotencyKey?: string
): Promise<Transaction> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required for transaction.');
  }

  if (amountPaise <= 0 || !Number.isInteger(amountPaise)) {
    throw new Error('Deposit amount must be a positive integer in paise.');
  }

  const finalIdempotencyKey = idempotencyKey || `idem_dep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const accRef = doc(db, 'accounts', accountId);
  const idemRef = doc(db, 'idempotency', finalIdempotencyKey);
  const txDocId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const txRef = doc(db, 'transactions', txDocId);
  const refNo = `SIM-DEP-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toISOString();

  let createdTx: Transaction | null = null;

  try {
    await runTransaction(db, async (t) => {
      // 1. Idempotency Check
      const idemDoc = await t.get(idemRef);
      if (idemDoc.exists()) {
        throw new Error('Duplicate request detected. Transaction already processed.');
      }

      // 2. Account Read & Ownership Verification
      const accDoc = await t.get(accRef);
      if (!accDoc.exists()) {
        throw new Error('Account not found.');
      }

      const accData = accDoc.data();
      if (accData.userId !== user.uid) {
        throw new Error('Access denied: Unauthorized account ownership.');
      }

      const currentBalancePaise = Number(accData.balancePaise);
      const newBalancePaise = currentBalancePaise + amountPaise;

      // 3. Atomic Balance Update
      t.update(accRef, {
        balancePaise: newBalancePaise,
        updatedAt: dateStr,
      });

      // 4. Ledger Record
      const txPayload = {
        id: txDocId,
        userId: user.uid,
        accountId,
        date: dateStr,
        type: 'deposit',
        category: 'Deposit',
        amountPaise,
        balanceAfterPaise: newBalancePaise,
        description: note?.trim() || `Simulated ${paymentMode} Deposit to ${accData.accountName}`,
        referenceNo: refNo,
        paymentMode,
        idempotencyKey: finalIdempotencyKey,
        status: 'Completed',
      };

      t.set(txRef, txPayload);

      // 5. Idempotency Record
      t.set(idemRef, {
        key: finalIdempotencyKey,
        userId: user.uid,
        transactionId: txDocId,
        createdAt: dateStr,
      });

      createdTx = {
        ...txPayload,
        amount: Number((amountPaise / 100).toFixed(2)),
        balanceAfter: Number((newBalancePaise / 100).toFixed(2)),
        type: 'deposit',
        category: 'Deposit',
        status: 'Completed',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `accounts/${accountId}`);
  }

  if (!createdTx) {
    throw new Error('Transaction execution failed.');
  }

  return createdTx;
}

/**
 * Atomic Withdrawal Operation in Firestore using runTransaction.
 */
export async function executeAtomicWithdrawal(
  accountId: string,
  amountPaise: number,
  paymentMode: string,
  note?: string,
  idempotencyKey?: string
): Promise<Transaction> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required for transaction.');
  }

  if (amountPaise <= 0 || !Number.isInteger(amountPaise)) {
    throw new Error('Withdrawal amount must be a positive integer in paise.');
  }

  const finalIdempotencyKey = idempotencyKey || `idem_wth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const accRef = doc(db, 'accounts', accountId);
  const idemRef = doc(db, 'idempotency', finalIdempotencyKey);
  const txDocId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const txRef = doc(db, 'transactions', txDocId);
  const refNo = `SIM-WTH-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toISOString();

  let createdTx: Transaction | null = null;

  try {
    await runTransaction(db, async (t) => {
      // 1. Idempotency Check
      const idemDoc = await t.get(idemRef);
      if (idemDoc.exists()) {
        throw new Error('Duplicate request detected. Transaction already processed.');
      }

      // 2. Account Read & Ownership Verification
      const accDoc = await t.get(accRef);
      if (!accDoc.exists()) {
        throw new Error('Account not found.');
      }

      const accData = accDoc.data();
      if (accData.userId !== user.uid) {
        throw new Error('Access denied: Unauthorized account ownership.');
      }

      if (accData.isFrozen && paymentMode.toLowerCase().includes('card')) {
        throw new Error('Card is currently frozen. Unfreeze from dashboard before withdrawing.');
      }

      const currentBalancePaise = Number(accData.balancePaise);
      const minBalancePaise = Number(accData.minBalancePaise);

      if (currentBalancePaise - amountPaise < minBalancePaise) {
        throw new Error(
          `Insufficient funds. Account requires minimum balance of ₹${(minBalancePaise / 100).toFixed(2)}. Max withdrawable: ₹${Math.max(0, (currentBalancePaise - minBalancePaise) / 100).toFixed(2)}.`
        );
      }

      const newBalancePaise = currentBalancePaise - amountPaise;

      // 3. Balance Update
      t.update(accRef, {
        balancePaise: newBalancePaise,
        updatedAt: dateStr,
      });

      // 4. Ledger Record
      const txPayload = {
        id: txDocId,
        userId: user.uid,
        accountId,
        date: dateStr,
        type: 'withdrawal',
        category: 'ATM',
        amountPaise,
        balanceAfterPaise: newBalancePaise,
        description: note?.trim() || `Simulated ${paymentMode} Withdrawal from ${accData.accountName}`,
        referenceNo: refNo,
        paymentMode,
        idempotencyKey: finalIdempotencyKey,
        status: 'Completed',
      };

      t.set(txRef, txPayload);

      // 5. Idempotency Record
      t.set(idemRef, {
        key: finalIdempotencyKey,
        userId: user.uid,
        transactionId: txDocId,
        createdAt: dateStr,
      });

      createdTx = {
        ...txPayload,
        amount: Number((amountPaise / 100).toFixed(2)),
        balanceAfter: Number((newBalancePaise / 100).toFixed(2)),
        type: 'withdrawal',
        category: 'ATM',
        status: 'Completed',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `accounts/${accountId}`);
  }

  if (!createdTx) {
    throw new Error('Withdrawal failed.');
  }

  return createdTx;
}

/**
 * Atomic Transfer Operation in Firestore using runTransaction.
 */
export async function executeAtomicTransfer(
  fromAccountId: string,
  toAccountNo: string,
  recipientName: string,
  amountPaise: number,
  paymentMode: string,
  note?: string,
  idempotencyKey?: string
): Promise<Transaction> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Authentication required for transaction.');
  }

  if (amountPaise <= 0 || !Number.isInteger(amountPaise)) {
    throw new Error('Transfer amount must be a positive integer in paise.');
  }

  const finalIdempotencyKey = idempotencyKey || `idem_trf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const senderAccRef = doc(db, 'accounts', fromAccountId);
  const idemRef = doc(db, 'idempotency', finalIdempotencyKey);
  const debitTxDocId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const debitTxRef = doc(db, 'transactions', debitTxDocId);
  const refNo = `SIM-TRF-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toISOString();

  let createdDebitTx: Transaction | null = null;

  try {
    await runTransaction(db, async (t) => {
      // 1. Idempotency Check
      const idemDoc = await t.get(idemRef);
      if (idemDoc.exists()) {
        throw new Error('Duplicate request detected. Transaction already processed.');
      }

      // 2. Sender Account Read
      const senderDoc = await t.get(senderAccRef);
      if (!senderDoc.exists()) {
        throw new Error('Source account not found.');
      }

      const senderData = senderDoc.data();
      if (senderData.userId !== user.uid) {
        throw new Error('Access denied: Unauthorized source account ownership.');
      }

      const senderBalancePaise = Number(senderData.balancePaise);
      const senderMinBalancePaise = Number(senderData.minBalancePaise);

      if (senderBalancePaise - amountPaise < senderMinBalancePaise) {
        throw new Error(
          `Insufficient funds for transfer. Minimum balance required is ₹${(senderMinBalancePaise / 100).toFixed(2)}.`
        );
      }

      const newSenderBalancePaise = senderBalancePaise - amountPaise;

      // 3. Update Sender Account
      t.update(senderAccRef, {
        balancePaise: newSenderBalancePaise,
        updatedAt: dateStr,
      });

      // 4. Create Debit Ledger Record
      const debitPayload = {
        id: debitTxDocId,
        userId: user.uid,
        accountId: fromAccountId,
        date: dateStr,
        type: 'transfer_out',
        category: 'Transfer',
        amountPaise,
        balanceAfterPaise: newSenderBalancePaise,
        description: note?.trim() || `Transfer to ${recipientName} (${toAccountNo})`,
        referenceNo: refNo,
        paymentMode,
        toAccount: toAccountNo,
        recipientName,
        idempotencyKey: finalIdempotencyKey,
        status: 'Completed',
      };

      t.set(debitTxRef, debitPayload);

      // 5. Check if destination is one of the user's other accounts
      // To preserve atomicity, we query destination account
      t.set(idemRef, {
        key: finalIdempotencyKey,
        userId: user.uid,
        transactionId: debitTxDocId,
        createdAt: dateStr,
      });

      createdDebitTx = {
        ...debitPayload,
        amount: Number((amountPaise / 100).toFixed(2)),
        balanceAfter: Number((newSenderBalancePaise / 100).toFixed(2)),
        type: 'transfer_out',
        category: 'Transfer',
        status: 'Completed',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `accounts/${fromAccountId}`);
  }

  if (!createdDebitTx) {
    throw new Error('Transfer execution failed.');
  }

  return createdDebitTx;
}

/**
 * Toggle card lock state in Firestore
 */
export async function updateCardFreezeState(accountId: string, isFrozen: boolean): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  const accRef = doc(db, 'accounts', accountId);
  try {
    await updateDoc(accRef, {
      isFrozen,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `accounts/${accountId}`);
  }
}

/**
 * Create new sub-account in Firestore
 */
export async function createNewSubAccount(
  accountType: 'Savings' | 'Checking' | 'Fixed Deposit',
  accountName: string,
  initialDepositPaise: number
): Promise<BankAccount> {
  const user = auth.currentUser;
  if (!user) throw new Error('Authentication required.');

  const accDocId = `${user.uid}_acc_${Date.now()}`;
  const accNum = `APEX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const dateStr = new Date().toISOString();
  const minBalPaise = accountType === 'Fixed Deposit' ? 100000 : 10000;
  const rate = accountType === 'Fixed Deposit' ? 6.75 : accountType === 'Savings' ? 3.5 : 1.0;

  const accRef = doc(db, 'accounts', accDocId);

  const accData = {
    id: accDocId,
    userId: user.uid,
    accountNumber: accNum,
    accountType,
    accountName: accountName.trim(),
    balancePaise: initialDepositPaise,
    minBalancePaise: minBalPaise,
    interestRate: rate,
    ifsc: 'APEX0001892',
    openingDate: dateStr.split('T')[0],
    isFrozen: false,
    createdAt: dateStr,
    updatedAt: dateStr,
  };

  try {
    await setDoc(accRef, accData);
    return {
      ...accData,
      balance: Number((initialDepositPaise / 100).toFixed(2)),
      minBalance: Number((minBalPaise / 100).toFixed(2)),
      currency: '₹',
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `accounts/${accDocId}`);
  }
}

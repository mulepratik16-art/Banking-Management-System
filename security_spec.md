# Security Specification & Threat Model — Apex Banking Management System

## 1. System Invariants
1. **Ownership Isolation**: A customer document in `/users/{userId}` can only be accessed or modified by `request.auth.uid == userId`.
2. **Account Integrity**: Bank accounts in `/accounts/{accountId}` belong to a specific `userId`. No user can read or query another user's accounts (`resource.data.userId == request.auth.uid`).
3. **Integer Currency Rule**: All financial values are strictly positive integers in Paise (`amountPaise > 0`). No negative, float, or NaN amounts.
4. **Immutable Ledger**: Transactions in `/transactions/{transactionId}` are strictly append-only (write once, never update or delete) to guarantee financial audit trail consistency.
5. **No Cross-Tenant Read**: Listing queries must strictly filter by `userId == auth.uid`.
6. **Card State Guard**: Users can only modify the `isFrozen` flag on their own account; they cannot modify `userId`, `accountNumber`, or arbitrary metadata directly.

## 2. The "Dirty Dozen" Attack Payloads (Must Return PERMISSION_DENIED)

1. **Payload 01: Cross-User Profile Read**
   - Actor: `auth.uid = "user_attacker"`
   - Target: `GET /users/user_victim`
   - Expected: `PERMISSION_DENIED`

2. **Payload 02: Impersonated Profile Creation**
   - Actor: `auth.uid = "user_attacker"`
   - Operation: `CREATE /users/user_victim` with `{ id: "user_victim", fullName: "Impostor" }`
   - Expected: `PERMISSION_DENIED`

3. **Payload 03: Privilege Escalation on Profile Update**
   - Actor: `auth.uid = "user_student"`
   - Operation: `UPDATE /users/user_student` setting `{ role: "SuperAdmin", kycStatus: "Verified" }`
   - Expected: `PERMISSION_DENIED`

4. **Payload 04: Cross-User Account Scraping (List Query)**
   - Actor: `auth.uid = "user_attacker"`
   - Operation: `LIST /accounts` without `where("userId", "==", "user_attacker")`
   - Expected: `PERMISSION_DENIED`

5. **Payload 05: Direct Balance Injection on Account**
   - Actor: `auth.uid = "user_attacker"`
   - Operation: `UPDATE /accounts/acc_1` setting `{ balancePaise: 99999999999 }`
   - Expected: `PERMISSION_DENIED` (only `isFrozen` allowed via client update)

6. **Payload 06: Negative Transaction Amount Injection**
   - Actor: `auth.uid = "user_attacker"`
   - Operation: `CREATE /transactions/tx_hack` with `{ amountPaise: -500000, type: "deposit" }`
   - Expected: `PERMISSION_DENIED`

7. **Payload 07: Zero Amount Transaction**
   - Actor: `auth.uid = "user_student"`
   - Operation: `CREATE /transactions/tx_zero` with `{ amountPaise: 0 }`
   - Expected: `PERMISSION_DENIED`

8. **Payload 08: Ledger History Mutation (Tampering)**
   - Actor: `auth.uid = "user_student"`
   - Operation: `UPDATE /transactions/tx_1001` setting `{ amountPaise: 100 }`
   - Expected: `PERMISSION_DENIED` (Transactions are immutable)

9. **Payload 09: Ledger Record Deletion (Covering Tracks)**
   - Actor: `auth.uid = "user_student"`
   - Operation: `DELETE /transactions/tx_1001`
   - Expected: `PERMISSION_DENIED`

10. **Payload 10: Forged Transaction Author**
    - Actor: `auth.uid = "user_attacker"`
    - Operation: `CREATE /transactions/tx_forged` with `{ userId: "user_victim", amountPaise: 1000 }`
    - Expected: `PERMISSION_DENIED`

11. **Payload 11: Document ID Poisoning (Junk Characters / Buffer Overflow)**
    - Actor: `auth.uid = "user_attacker"`
    - Operation: `GET /users/$$__INVALID_MALFORMED_SPECIAL_CHARS__!`
    - Expected: `PERMISSION_DENIED` (ID does not match `^[a-zA-Z0-9_\-]+$`)

12. **Payload 12: Unauthenticated Database Probe**
    - Actor: `auth = null` (anonymous unauthenticated probe)
    - Operation: `GET /accounts/acc_savings_1`
    - Expected: `PERMISSION_DENIED` (Default-deny for unauthenticated clients)

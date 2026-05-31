# Two-step Auth: Password + OTP (Email or SMS)

## Flow

**Signup** (`/signup`)
1. Choose identifier type: Email or Mobile number
2. Enter identifier + full name + password (+ confirm)
3. If Email → standard email/password signup. Phone is optional (saved to profile if added later).
4. If Mobile → email is auto-generated internally (`<phone>@phone.genzmedi.local`) so Supabase has a stable identity. Phone number is stored in `profiles.phone`. Password is the user's chosen password.

**Login** (`/`)
- Step 1: Enter identifier (email OR mobile) + password → validated via Supabase password sign-in.
- Step 2: Choose OTP channel (Email / SMS) → 6-digit code sent → verify → land on dashboard.

## Platform constraints to be transparent about

1. **SMS requires Twilio.** Lovable Cloud's Supabase project does not have a built-in SMS provider. I'll connect Twilio via the connector and send SMS OTPs through a TanStack server function (codes stored hashed in a new `otp_codes` table with 5-min expiry + attempt limit). Without Twilio credentials, the SMS option will show as "unavailable" and email OTP still works.
2. **Email OTP body.** The default Lovable auth email currently sends a magic link, not the visible 6-digit code. To put the actual digits in the email I still need the branded email template set up (requires a verified sender domain). Until then, email OTPs will work via the magic link in the email — clicking it logs the user in.
3. **The "password then OTP" pattern is custom 2FA.** Supabase signs the user in on successful password check. I'll keep that session but gate access to `/dashboard` behind a `mfa_verified` flag held in `sessionStorage` until OTP step succeeds. Refreshing the page mid-flow forces re-OTP.

## Implementation

### Database (1 migration)
- `profiles`: add `phone_verified boolean default false`, `email_verified boolean default false`, ensure `phone` has a unique index when not null.
- New `otp_codes` table: `id, user_id, channel ('email'|'sms'), code_hash, expires_at, attempts, consumed_at`. RLS: users can only read/write their own rows; service role full access. Grants set per project conventions.
- Update `handle_new_user` trigger to also copy `phone` from `raw_user_meta_data` when present.

### Server functions (`src/lib/auth.functions.ts`)
- `requestOtp({ channel })` — uses `requireSupabaseAuth`; generates 6-digit code, stores `code_hash` (sha256), sets expiry +5min, sends:
  - email channel → uses Supabase `auth.admin.generateLink` or a Resend-style send via existing infra; for now uses `supabase.auth.signInWithOtp` to email (which still works as a code carrier) OR sends a plain transactional email if infra exists. Fallback: relies on Supabase email OTP.
  - sms channel → POSTs to Twilio gateway with the rendered message.
- `verifyOtp({ channel, code })` — checks hash, expiry, attempts, marks consumed, returns `{ verified: true }`. Client then sets `sessionStorage.mfa_verified = '1'`.

### Frontend
- `src/routes/index.tsx` — rewrite login: identifier+password step → channel chooser → OTP step. Reuses existing OTP input UI.
- `src/routes/signup.tsx` — new page with identifier-type toggle (Email | Mobile), password + confirm.
- `src/routes/_app.tsx` — guard: redirect to `/` if `mfa_verified` flag missing.
- Phone input uses E.164 normalization (libphonenumber-js — small).

### Twilio
- Trigger `standard_connectors--connect` with `twilio`. If the user skips, SMS option is disabled at runtime (button shows "Set up SMS").

## Files touched

```
NEW  supabase/migrations/<ts>_otp_and_phone.sql
NEW  src/lib/auth.functions.ts
NEW  src/lib/otp.server.ts        (Twilio + email send helpers)
NEW  src/routes/signup.tsx
EDIT src/routes/index.tsx         (multi-step login)
EDIT src/routes/_app.tsx          (mfa_verified guard)
EDIT src/lib/auth.ts              (helpers: signUpEmail, signUpPhone, signInPassword, signOut, isMfaVerified)
EDIT src/components/TopNav.tsx    (clear mfa flag on logout)
```

## What I need from you

1. **Confirm to proceed** with the plan above.
2. **Twilio**: I'll trigger the connector picker after you approve. If you don't have a Twilio account yet, you can pick "skip" and the SMS path will be gracefully disabled until added.
3. **Email OTP digits-in-body**: still requires the verified sender domain we discussed earlier. Want me to also kick that off in the same go? (Optional — email login works without it via the magic link.)

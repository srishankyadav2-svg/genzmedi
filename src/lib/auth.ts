import { supabase } from "@/integrations/supabase/client";

const PHONE_EMAIL_DOMAIN = "phone.genzmedi.local";
const MFA_FLAG = "genzmedi_mfa_verified";

export type Identifier =
  | { type: "email"; value: string }
  | { type: "phone"; value: string };

export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  // E.164-ish: prefix with + if not already
  return digits.length >= 8 ? `+${digits}` : "";
}

export function phoneToSyntheticEmail(phoneE164: string) {
  // Strip the leading + so it's a valid local-part
  const local = phoneE164.replace(/^\+/, "");
  return `${local}@${PHONE_EMAIL_DOMAIN}`;
}

export function parseIdentifier(raw: string): Identifier | null {
  const v = raw.trim();
  if (!v) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return { type: "email", value: v.toLowerCase() };
  const phone = normalizePhone(v);
  if (phone) return { type: "phone", value: phone };
  return null;
}

function identifierToAuthEmail(id: Identifier): string {
  return id.type === "email" ? id.value : phoneToSyntheticEmail(id.value);
}

export function identifierToPhoneNumber(id: Identifier): string | null {
  return id.type === "phone" ? id.value : null;
}

// ---------- SIGN UP ----------
export async function signUp(params: {
  identifier: Identifier;
  password: string;
  fullName: string;
}) {
  const email = identifierToAuthEmail(params.identifier);
  const { data, error } = await supabase.auth.signUp({
    email,
    password: params.password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: {
        full_name: params.fullName,
        phone: params.identifier.type === "phone" ? params.identifier.value : "",
        identifier_type: params.identifier.type,
      },
    },
  });
  if (error) throw error;
  return data;
}

// ---------- PASSWORD SIGN IN (step 1) ----------
export async function signInWithPassword(params: {
  identifier: Identifier;
  password: string;
}) {
  const email = identifierToAuthEmail(params.identifier);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: params.password,
  });
  if (error) throw error;
  return data;
}

// ---------- OTP STEP (step 2) ----------
// Strategy: after password verification, sign out, then request a mobile OTP
// for the same account. Verifying the OTP creates the real session.

export async function requestMobileOtp(phoneNumber: string) {
  // Tear down the temporary password session — OTP verification re-creates one.
  await supabase.auth.signOut();
  const { error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
    options: { shouldCreateUser: false },
  });
  if (error) throw error;
}

export async function verifyMobileOtp(phoneNumber: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token,
    type: "sms",
  });
  if (error) throw error;
  return data;
}

// Legacy email OTP functions (kept for backward compatibility, but deprecated)
export async function requestEmailOtp(authEmail: string) {
  // Tear down the temporary password session — OTP verification re-creates one.
  await supabase.auth.signOut();
  const { error } = await supabase.auth.signInWithOtp({
    email: authEmail,
    options: { shouldCreateUser: false },
  });
  if (error) throw error;
}

export async function verifyEmailOtp(authEmail: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: authEmail,
    token,
    type: "email",
  });
  if (error) throw error;
  return data;
}

// ---------- SESSION HELPERS ----------
export async function signOut() {
  await supabase.auth.signOut();
  clearMfaVerified();
}

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

// ---------- MFA gate (step-up) ----------
export function setMfaVerified() {
  try {
    sessionStorage.setItem(MFA_FLAG, "1");
  } catch {
    // ignore
  }
}

export function clearMfaVerified() {
  try {
    sessionStorage.removeItem(MFA_FLAG);
  } catch {
    // ignore
  }
}

export function isMfaVerified(): boolean {
  try {
    return sessionStorage.getItem(MFA_FLAG) === "1";
  } catch {
    return false;
  }
}

export { identifierToAuthEmail };

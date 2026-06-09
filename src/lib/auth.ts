// Simple client-side mock auth for demo. Not for production.
const KEY = "genzmedi_auth";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) === "1";
}
export function login() {
  localStorage.setItem(KEY, "1");
}
export function logout() {
  localStorage.removeItem(KEY);
}

import { setAccountType, setAuthToken } from "@/apis/axios-instance";

const TOKEN_KEY = "hc_payment_auth_token";
const USER_KEY = "hc_payment_auth_user";
const TYPE_KEY = "hc_payment_auth_account_type";
const PENDING_KEY = "hc_payment_redirect_pending";

function isUsable(value: string | null | undefined): value is string {
  return !!value && value !== "null" && value !== "undefined";
}

/** Call right before redirecting to CCAvenue / Touras. */
export function persistPaymentAuthBackup() {
  if (typeof window === "undefined") return;
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const accountType = localStorage.getItem("account_type");
  if (isUsable(token)) {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(PENDING_KEY, "true");
    sessionStorage.setItem(PENDING_KEY, "true");
    setAuthToken(token);
  }
  if (isUsable(user)) {
    localStorage.setItem(USER_KEY, user);
    sessionStorage.setItem(USER_KEY, user);
  }
  if (isUsable(accountType) && (accountType === "customer" || accountType === "vendor")) {
    localStorage.setItem(TYPE_KEY, accountType);
    sessionStorage.setItem(TYPE_KEY, accountType);
    setAccountType(accountType);
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  const value = decodeURIComponent(match.slice(name.length + 1));
  return isUsable(value) ? value : null;
}

/** Re-attach session cookies from localStorage after a gateway return. */
export function restorePaymentAuthCookies(): boolean {
  if (typeof window === "undefined") return false;
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(TOKEN_KEY) ||
    readCookie("token");
  if (!isUsable(token)) return false;

  const user =
    localStorage.getItem("user") ||
    sessionStorage.getItem(USER_KEY) ||
    localStorage.getItem(USER_KEY);
  const accountType =
    localStorage.getItem("account_type") ||
    sessionStorage.getItem(TYPE_KEY) ||
    localStorage.getItem(TYPE_KEY);

  localStorage.setItem("token", token);
  if (isUsable(user)) localStorage.setItem("user", user);
  setAuthToken(token);
  if (accountType === "customer" || accountType === "vendor") {
    setAccountType(accountType);
  }
  return true;
}

export function clearPaymentAuthBackup() {
  if (typeof window === "undefined") return;
  [
    TOKEN_KEY,
    USER_KEY,
    TYPE_KEY,
    PENDING_KEY,
  ].forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}

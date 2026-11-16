import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Auth, User } from "firebase/auth";
import { loadAuth } from "./firebase";

const CACHE_KEY = "oracle-auth-cache-v1";

export type SessionUser = {
  uid: string;
  email: string;
  displayName: string;
};

type AuthValue = {
  user: SessionUser | null;
  /** Firebase has confirmed the session. Cached user can show before this. */
  confirmed: boolean;
  getToken: (force?: boolean) => Promise<string | null>;
  signInEmail: (email: string, password: string) => Promise<void>;
  createAccount: (email: string, password: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

function readCache(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "null") as SessionUser | null;
    return parsed?.uid ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(user: SessionUser | null) {
  try {
    if (!user) localStorage.removeItem(CACHE_KEY);
    else localStorage.setItem(CACHE_KEY, JSON.stringify(user));
  } catch {
    /* storage can be blocked */
  }
}

function toSession(user: User): SessionUser {
  return {
    uid: user.uid,
    email: user.email || "",
    displayName: user.displayName || "",
  };
}

const AUTH_COPY: Record<string, string> = {
  "auth/email-already-in-use": "An account already uses this email. Sign in instead.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/operation-not-allowed": "That sign-in method is not enabled yet.",
  "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
};

export function authMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  return AUTH_COPY[code] || "Couldn't complete sign-in. Please try again.";
}

export function OracleAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const authRef = useRef<Auth | null>(null);
  const liveRef = useRef<User | null>(null);

  useLayoutEffect(() => {
    const cached = readCache();
    if (cached) setUser(cached);
  }, []);

  useLayoutEffect(() => {
    let stop = () => {};
    let cancelled = false;
    loadAuth().then(async (auth) => {
      if (cancelled) return;
      authRef.current = auth;
      const { onAuthStateChanged } = await import("firebase/auth");
      stop = onAuthStateChanged(auth, (next) => {
        liveRef.current = next;
        const session = next ? toSession(next) : null;
        writeCache(session);
        setUser(session);
        setConfirmed(true);
      });
    });
    return () => {
      cancelled = true;
      stop();
    };
  }, []);

  const getToken = useCallback(async (force = false) => {
    const current = liveRef.current;
    if (!current) return null;
    return current.getIdToken(force);
  }, []);

  const signInEmail = useCallback(async (email: string, password: string) => {
    const auth = authRef.current ?? (await loadAuth());
    authRef.current = auth;
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const createAccount = useCallback(async (email: string, password: string) => {
    const auth = authRef.current ?? (await loadAuth());
    authRef.current = auth;
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    await createUserWithEmailAndPassword(auth, email.trim(), password);
  }, []);

  const signInGoogle = useCallback(async () => {
    const auth = authRef.current ?? (await loadAuth());
    authRef.current = auth;
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    await signInWithPopup(auth, new GoogleAuthProvider());
  }, []);

  const signOutUser = useCallback(async () => {
    const auth = authRef.current ?? (await loadAuth());
    const { signOut } = await import("firebase/auth");
    writeCache(null);
    await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({ user, confirmed, getToken, signInEmail, createAccount, signInGoogle, signOutUser }),
    [user, confirmed, getToken, signInEmail, createAccount, signInGoogle, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useOracleAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useOracleAuth must be used inside OracleAuthProvider");
  return value;
}

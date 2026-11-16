import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { authMessage, useOracleAuth } from "@/lib/oracle/auth";
import { startPayment } from "@/lib/oracle/api";
import { ADMIN_EMAIL } from "@/lib/oracle/types";

export function AccountDialog({
  open,
  onClose,
  paid,
  promo,
  premiumUntil,
  usageText,
  courseUsageText,
}: {
  open: boolean;
  onClose: () => void;
  paid: boolean;
  promo: boolean;
  premiumUntil: string;
  usageText: string;
  courseUsageText: string;
}) {
  const auth = useOracleAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const node = dialogRef.current;
    if (!open || !node) return;
    if (!node.open) node.showModal();
    return () => {
      if (node.open) node.close();
    };
  }, [open]);

  if (!open) return null;

  async function run(action: () => Promise<void>, success: string) {
    setBusy(true);
    setStatus("");
    try {
      await action();
      setStatus(success);
      onClose();
    } catch (error) {
      setStatus(authMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function pay() {
    setBusy(true);
    setStatus("Opening secure Paystack checkout…");
    try {
      const token = await auth.getToken();
      if (!token) throw new Error("Sign in to continue to Paystack.");
      const url = await startPayment(token);
      if (!url) throw new Error("Payment couldn't be started.");
      window.location.assign(url);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Payment couldn't be started.");
      setBusy(false);
    }
  }

  const admin = auth.user?.email.toLowerCase() === ADMIN_EMAIL;

  return (
    <dialog ref={dialogRef} className="oracle-account-dialog" aria-labelledby="account-dialog-title">
      <button type="button" className="oracle-register-close" aria-label="Close account dialog" onClick={onClose}>
        <X aria-hidden="true" />
      </button>
      {auth.user ? (
        <div>
          <p className="eyebrow text-clay">Account profile</p>
          <h2 id="account-dialog-title" className="font-display text-2xl font-bold text-ink mt-2">
            Your profile
          </h2>
          <p className="or-account-email">{auth.user.email || "Signed in"}</p>
          <div className="oracle-profile-plan">
            <span>{promo ? "Free through 20 Nov" : paid ? "Premium access" : "Free plan"}</span>
            <span>{premiumUntil}</span>
          </div>
          <p className="oracle-profile-usage">{usageText || "No paid practice recorded yet."}</p>
          {courseUsageText ? <p className="oracle-profile-usage-courses">{courseUsageText}</p> : null}
          {paid ? null : <p className="oracle-profile-usage">This payment helps keep the service running.</p>}
          {paid ? null : (
            <button type="button" className="btn btn-clay w-full py-3 mt-4" disabled={busy} onClick={pay}>
              Get paid access · ₦1,000
            </button>
          )}
          <button
            type="button"
            className="oracle-text-button mt-5"
            onClick={() => auth.signOutUser().then(onClose)}
          >
            Sign out
          </button>
          {admin ? (
            <Link to="/admin" className="oracle-text-button mt-3" onClick={onClose}>
              Admin dashboard
            </Link>
          ) : null}
        </div>
      ) : (
        <div>
          <p className="eyebrow text-clay">Your Exam Oracle account</p>
          <h2 id="account-dialog-title" className="font-display text-2xl font-bold text-ink mt-2">
            Sign in or create an account
          </h2>
          <p className="oracle-account-copy">Sign in to take tests, sync your results, and manage your access.</p>
          <div className="oracle-account-fields">
            <label htmlFor="account-email-input">Email address</label>
            <input
              id="account-email-input"
              className="oracle-select"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="account-password">Password</label>
            <input
              id="account-password"
              className="oracle-select"
              type="password"
              autoComplete="current-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <div className="or-account-actions">
            <button type="button" className="btn btn-ink px-5" disabled={busy} onClick={() => run(() => auth.signInEmail(email, password), "Signed in.")}>
              Sign in
            </button>
            <button type="button" className="btn btn-clay px-5" disabled={busy} onClick={() => run(() => auth.createAccount(email, password), "Account created.")}>
              Create account
            </button>
            <button type="button" className="btn btn-ghost-light px-5" disabled={busy} onClick={() => run(() => auth.signInGoogle(), "Signed in.")}>
              Continue with Google
            </button>
          </div>
        </div>
      )}
      {status ? (
        <p className="or-code-status" role="status">
          {status}
        </p>
      ) : null}
    </dialog>
  );
}

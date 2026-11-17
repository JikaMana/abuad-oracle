import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { ADMIN_EMAIL } from "@/lib/oracle/types";
import { useOracleAuth } from "@/lib/oracle/auth";

export function SiteNav({
  paid,
  promo,
  onAccount,
  onUpgrade,
}: {
  paid: boolean;
  promo: boolean;
  onAccount: () => void;
  onUpgrade: () => void;
}) {
  const { user, confirmed } = useOracleAuth();
  const label = user
    ? user.displayName || user.email || "Profile"
    : confirmed
      ? "Sign in"
      : "Account";
  const hideCommerce = paid && !promo;

  return (
    <header className="nav-shell fixed top-0 left-0 w-full z-[65]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-3">
        <Link to="/" className="site-brand" aria-label="Burhan Tutors home">
          <span>
            BURHAN <b>TUTORS</b>
          </span>
        </Link>
        <nav
          className="flex items-center gap-5 text-[13px] text-white/70"
          aria-label="Main navigation"
        >
          <Link to="/" className="hover:text-white">
            Academy
          </Link>
          <Link to="/leaderboard" className="hover:text-white">
            Leaderboard
          </Link>
          {user?.email.toLowerCase() === ADMIN_EMAIL ? (
            <Link to="/admin" className="hover:text-white">
              Admin
            </Link>
          ) : null}
        </nav>
        {hideCommerce ? null : (
          <button type="button" className="btn btn-clay oracle-nav-upgrade" onClick={onUpgrade}>
            <span className="oracle-nav-upgrade-full">
              {promo ? "Free through 20 Nov" : "Go Premium"}
            </span>
            <span className="oracle-nav-upgrade-short">{promo ? "Free" : "Premium"}</span>
          </button>
        )}
        <button
          type="button"
          className="oracle-account-trigger"
          onClick={onAccount}
          aria-haspopup="dialog"
        >
          <UserRound className="w-4 h-4" aria-hidden="true" />
          <span>{label}</span>
        </button>
      </div>
    </header>
  );
}

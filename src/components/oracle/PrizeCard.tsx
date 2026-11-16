import { Lock } from "lucide-react";
import type { PrizeView } from "@/lib/oracle/types";

export function PrizeCard({ prize, whatsapp }: { prize: PrizeView | null; whatsapp: string }) {
  if (!prize) {
    return (
      <article className="oracle-claim is-locked">
        <p>Prize status is unavailable.</p>
      </article>
    );
  }
  const message = `Exam Oracle prize claim. My code is ${prize.code || ""}.`;
  return (
    <article className={`oracle-claim ${prize.locked ? "is-locked" : "is-open"}`}>
      <p className="eyebrow text-clay">{prize.title}</p>
      {prize.reward ? <h3>{prize.reward}</h3> : null}
      {prize.yours && prize.code ? (
        <>
          <p className="oracle-claim-code">{prize.code}</p>
          <p className="oracle-claim-help">{prize.note || "Message the admin with this code to confirm the prize."}</p>
          <a className="btn btn-clay" target="_blank" rel="noopener" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`}>
            Message admin
          </a>
        </>
      ) : (
        <>
          <div className="oracle-claim-lock">
            <Lock aria-hidden="true" />
            <span>Locked</span>
          </div>
          <p>{prize.note || "This prize is locked."}</p>
        </>
      )}
    </article>
  );
}

import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, CircleCheck, Ellipsis, MoveUpRight, ScanSearch } from "lucide-react";

const COURSES = [
  ["01", "MTH 101", "Mathematics"],
  ["02", "MTH 103", "Mathematics"],
  ["03", "PHY 101", "Physics"],
  ["04", "PHY 103", "Physics"],
  ["05", "STAT", "Statistics"],
  ["06", "CHM 101", "Chemistry"],
  ["07", "BIO 101", "Biology"],
];

export function HomePage() {
  return (
    <div className="abuad-page">
      <a className="abuad-skip" href="#main">
        Skip to content
      </a>
      <header className="abuad-header">
        <div className="abuad-header-inner">
          <Link className="abuad-brand" to="/" aria-label="Burhan Tutors ABUAD page">
            <span>
              BURHAN <b>TUTORS</b>
              <small>ABUAD 100 LEVEL</small>
            </span>
          </Link>
          <nav className="abuad-nav" aria-label="Page navigation">
            <a href="#oracle">Exam Oracle</a>
            <a href="#fees">Offer</a>
            <a href="#courses">Tutorials</a>
          </nav>
          <Link className="btn btn-clay abuad-header-cta" to="/exam-oracle">
            <ArrowUpRight aria-hidden="true" />
            <span>Explore Oracle</span>
          </Link>
        </div>
      </header>
      <main id="main">
        <section className="abuad-hero abuad-oracle-hero">
          <div className="abuad-hero-copy">
            <p className="eyebrow">
              ABUAD 100 LEVEL <span aria-hidden="true">/</span> EXAM PRACTICE
            </p>
            <h1>
              Exam <span>Oracle.</span>
            </h1>
            <p className="abuad-hero-lede">
              Walk into your next exam knowing where you stand. Practise by topic, get instant feedback, and turn weak spots into a clear study plan.
            </p>
            <div className="abuad-hero-actions">
              <Link className="btn btn-clay px-6 py-3.5" to="/exam-oracle">
                <ArrowUpRight aria-hidden="true" />
                Explore Exam Oracle
              </Link>
              <a className="btn btn-ghost-dark px-6 py-3.5" href="#oracle">
                How it helps
                <ArrowDown aria-hidden="true" />
              </a>
            </div>
            <p className="abuad-hero-note">
              <CircleCheck aria-hidden="true" />
              <span>Full access is free through 20 November 2026.</span>
            </p>
            <p className="abuad-hero-note">
              <CircleCheck aria-hidden="true" />
              Topic-based practice <span>·</span> Instant feedback
            </p>
          </div>
          <div className="abuad-hero-visual" aria-label="Sample Exam Oracle learning report">
            <div className="abuad-hero-report">
              <div className="abuad-report-head">
                <span>YOUR STUDY SNAPSHOT</span>
                <ScanSearch aria-hidden="true" />
              </div>
              <p className="abuad-hero-report-course">
                MTH 101 <span>·</span> SAMPLE REPORT
              </p>
              <div className="abuad-report-item">
                <span>Algebra</span>
                <strong>Strong</strong>
                <i style={{ ["--report-score" as string]: "86%" }} />
              </div>
              <div className="abuad-report-item">
                <span>Quadratics</span>
                <strong className="abuad-needs-work">Review</strong>
                <i style={{ ["--report-score" as string]: "48%" }} />
              </div>
              <div className="abuad-report-item">
                <span>Fractions</span>
                <strong>Strong</strong>
                <i style={{ ["--report-score" as string]: "78%" }} />
              </div>
              <div className="abuad-hero-report-foot">
                <span>Next up</span>
                <strong>Review quadratics</strong>
              </div>
            </div>
          </div>
          <a href="#oracle" className="abuad-side-note" aria-label="Scroll to learn about Exam Oracle">
            <span>01</span>
            <ArrowDownRight aria-hidden="true" />
          </a>
        </section>

        <section id="oracle" className="abuad-oracle">
          <div className="abuad-oracle-mark">
            <ScanSearch aria-hidden="true" />
            <span>BURHAN TUTORS / EXAM ORACLE</span>
          </div>
          <div className="abuad-oracle-content">
            <div className="abuad-oracle-copy">
              <p className="eyebrow">A better way to prepare</p>
              <h2>Practise with a purpose.</h2>
              <p>
                Exam Oracle turns practice into useful direction. Choose a course and topics, answer CBT-style questions, then use your results and explanations to decide what to work on next.
              </p>
              <div className="abuad-oracle-actions">
                <Link className="btn btn-clay px-6 py-3.5" to="/exam-oracle">
                  <ArrowUpRight aria-hidden="true" />
                  See Exam Oracle
                </Link>
                <a className="abuad-text-link" href="#fees">
                  View the offer <ArrowDown aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="abuad-oracle-report" aria-label="What you get from each practice session">
              <div className="abuad-report-head">
                <span>FROM PRACTICE TO PROGRESS</span>
                <Ellipsis aria-hidden="true" />
              </div>
              <div className="abuad-oracle-step">
                <b>01</b>
                <span>
                  <strong>Choose your focus</strong>
                  <small>Course and topics that matter to you</small>
                </span>
              </div>
              <div className="abuad-oracle-step">
                <b>02</b>
                <span>
                  <strong>Take a focused test</strong>
                  <small>Build familiarity with CBT-style practice</small>
                </span>
              </div>
              <div className="abuad-oracle-step">
                <b>03</b>
                <span>
                  <strong>Know what to review</strong>
                  <small>See your score and step-by-step explanations</small>
                </span>
              </div>
            </div>
          </div>
          <p className="abuad-oracle-footnote">
            Oracle practice currently covers Mathematics, Physics, Chemistry and Biology. Contact us for details on ABUAD course-specific question coverage.
          </p>
        </section>

        <section id="fees" className="abuad-oracle-offer">
          <div>
            <p className="eyebrow">Current Exam Oracle offer</p>
            <h2>Start practising for less.</h2>
            <p>Get Exam Oracle access at the current offer price.</p>
          </div>
          <div className="abuad-oracle-offer-price">
            <Link className="btn btn-clay" to="/exam-oracle">
              Explore Exam Oracle
              <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section id="courses" className="abuad-courses">
          <div className="abuad-section-top">
            <div>
              <p className="eyebrow text-clay">Also available</p>
              <h2>One-to-one course support.</h2>
            </div>
            <p>Alongside Exam Oracle, choose an individual course or combine several for structured online tutorial support.</p>
          </div>
          <div className="abuad-course-grid">
            {COURSES.map(([index, code, name]) => (
              <article key={code} className={`abuad-course${index === "07" ? " abuad-course-last" : ""}`}>
                <span className="abuad-course-index">{index}</span>
                <div>
                  <h3>{code}</h3>
                  <p>{name}</p>
                </div>
                <MoveUpRight aria-hidden="true" />
              </article>
            ))}
          </div>
          <div className="abuad-course-footer">
            <span>One course at a time, or a plan that covers more.</span>
            <a href="https://wa.me/2348165689362?text=Hello%20Burhan%20Tutors%2C%20I%E2%80%99m%20an%20ABUAD%20100-level%20student." target="_blank" rel="noopener">
              Tell us what you’re taking <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="course-fees" className="abuad-fees">
          <div className="abuad-fees-copy">
            <p className="eyebrow text-clay">Tutorial pricing</p>
            <h2>Need live course support?</h2>
            <p>Tutorial fees are separate from Exam Oracle access. Ask about class schedules and available course bundles.</p>
          </div>
          <div className="abuad-fee-detail">
            <span>ABUAD academic course</span>
            <strong>
              ₦5,000 <small>/ course, monthly</small>
            </strong>
            <div className="abuad-fee-actions">
              <a className="btn btn-ink px-5 py-3" href="#course-fees">
                See plans and details
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href="https://wa.me/2348165689362?text=Hello%20Burhan%20Tutors%2C%20please%20help%20me%20choose%20an%20ABUAD%20100-level%20tutorial%20plan." target="_blank" rel="noopener">
                Ask us on WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="abuad-footer">
        <Link className="abuad-brand" to="/" aria-label="Burhan Tutors ABUAD page">
          <img src="/images/burhan-dark.png" alt="" width={38} height={38} />
          <span>
            BURHAN <b>TUTORS</b>
            <small>ABUAD 100 LEVEL</small>
          </span>
        </Link>
        <p>Focused learning for your first year.</p>
        <div>
          <a href="https://burhantutors.com/">Burhan Tutors</a>
          <Link to="/exam-oracle">Exam Oracle</Link>
          <span>© 2026 Burhan Tutors</span>
        </div>
      </footer>
    </div>
  );
}

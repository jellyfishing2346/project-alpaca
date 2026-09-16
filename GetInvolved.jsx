import React from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter } from "./alpacees-directory-final.jsx";
import "./styles.css";

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ImgBox = ({ className }) => (
  <div className={"hi-img " + (className || "")}><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B7B7C0" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></svg></div>
);
const Person = () => (
  <div className="person"><ImgBox className="person-photo" /><h3>Board Member</h3><p className="person-role">Any pronouns · Role at [company]</p></div>
);

const MENTOR_WAYS = [
  { t: "1-on-1 Mentor", d: "Check in regularly over a 3-month cycle to build a supportive relationship. Help mentees navigate professional anxieties, practice interview skills, and learn how to present their best selves to employers." },
  { t: "Class Facilitator / Workshop Instructor", d: "Lead a one-off virtual or in-person workshop (1–3 hours) focused on technical skills (e.g., portfolio building, AI readiness) or core soft skills (e.g., financial literacy, professional relationships)." },
];
const MENTOR_BENEFITS = [
  { t: "Leadership Development", d: "Refine personal management, cross-cultural coaching, and technical evaluation skillsets." },
  { t: "Curated Network", d: "Connect and collaborate with a close-knit, highly accomplished community of tech professionals." },
  { t: "DEI Impact", d: "Directly drive diversity, equity, and inclusion inside the NYC tech ecosystem." },
];
const VOL_BENEFITS = [
  { t: "Leadership Development", d: "Grow your organizational and event-management experience while supporting a mission you believe in." },
  { t: "Curated Network", d: "Meet mentors, staff, and fellow volunteers across NYC's nonprofit and tech communities." },
  { t: "Create Impact", d: "Directly expand our capacity to serve more under-resourced students each year." },
];
const OPEN_ROLES = [
  { t: "Content Writer", d: "Craft newsletters, blog posts, and program stories that share our impact." },
  { t: "Graphic Designer", d: "Design social graphics, flyers, and event collateral in our brand style." },
  { t: "Grant Writer", d: "Research and draft grant proposals to fund the next cohort." },
  { t: "Fundraising Manager", d: "Help plan and run campaigns that keep the program free for students." },
  { t: "Partnership Manager", d: "Build relationships with companies, schools, and community partners." },
  { t: "Videographer / Photographer", d: "Capture events, demo days, and student stories on camera." },
];
const IMPACT_WAYS = [
  { t: "Hire an Alpacee", d: "Bring motivated, job-ready junior talent into your team through direct introductions." },
  { t: "Host a Cohort for a Day", d: "Open your workspace for a visit, panel, or hands-on session with students." },
  { t: "Sponsor a Program", d: "Fund a cohort, a workshop series, or student stipends and equipment." },
  { t: "Corporate Matching & Grants", d: "Multiply employee giving or provide a foundation grant to expand our reach." },
];

export default function GetInvolved() {
  return (
    <div className="root">
      <Nav />
      <div className="home">
        <section className="hero">
          <div className="hero-l">
            <h1>Be a force for good</h1>
            <p>Bridge the gap between tech industry professionals and under-resourced college students, lending your professional and personal experience to build student confidence, review portfolios, and guide early careers.</p>
          </div>
          <ImgBox className="hero-img" />
        </section>

        {/* Mentors */}
        <section className="hs">
          <h2 className="hs-h">Alpacas (Mentors)</h2>
          <p className="prog-desc">We affectionately call our mentors Alpacas because they champion our mentees (the Alpacees). Industry professionals from tech, product, design, and business strategy step in to build student confidence, review portfolios, and guide early careers.</p>
          <Link className="btn-navy" to="/contact">Apply to be a mentor <Arrow /></Link>

          <h4 className="po-label" style={{ marginTop: 36 }}>Two ways to get involved</h4>
          <div className="prog-grid">
            {MENTOR_WAYS.map((w) => (
              <div key={w.t} className="prog-card"><ImgBox className="prog-img" /><h3>{w.t}</h3><p>{w.d}</p></div>
            ))}
          </div>

          <h4 className="po-label" style={{ marginTop: 36 }}>Benefits</h4>
          <div className="inv-grid">
            {MENTOR_BENEFITS.map((b) => (
              <div key={b.t} className="inv-card"><ImgBox className="inv-img" /><h3>{b.t}</h3><p>{b.d}</p></div>
            ))}
          </div>

          <h4 className="po-label" style={{ marginTop: 36 }}>Meet Our Mentors</h4>
          <div className="people">{[0, 1, 2].map((i) => <Person key={i} />)}</div>
        </section>

        {/* Volunteers */}
        <section className="hs">
          <h2 className="hs-h">Volunteers</h2>
          <p className="prog-desc">Offer your specialties to build our organizational capacity, manage community events, or expand our fundraising reach.</p>
          <Link className="btn-navy" to="/contact">Apply to volunteer <Arrow /></Link>

          <h4 className="po-label" style={{ marginTop: 36 }}>Benefits</h4>
          <div className="inv-grid">
            {VOL_BENEFITS.map((b) => (
              <div key={b.t} className="inv-card"><ImgBox className="inv-img" /><h3>{b.t}</h3><p>{b.d}</p></div>
            ))}
          </div>

          <h4 className="po-label" style={{ marginTop: 36 }}>Open Volunteer Positions</h4>
          <div className="roles">
            {OPEN_ROLES.map((r) => (
              <div key={r.t} className="role"><div><h3>{r.t}</h3><p>{r.d}</p></div><Link className="btn-outline" to="/contact">Apply</Link></div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="hs">
          <h2 className="hs-h">Corporate & Nonprofit Partners</h2>
          <p className="prog-desc">We build tailored, multi-layered alliances with businesses, foundations, and community entities to support early career development.</p>
          <div className="hero-cta">
            <Link className="btn-navy" to="/contact">Become a partner <Arrow /></Link>
            <Link className="btn-outline" to="/donate">Download partner deck</Link>
          </div>

          <h4 className="po-label" style={{ marginTop: 36 }}>Ways to Create Impact</h4>
          <div className="inv-grid">
            {IMPACT_WAYS.map((w) => (
              <div key={w.t} className="inv-card"><ImgBox className="inv-img" /><h3>{w.t}</h3><p>{w.d}</p><Link className="inv-cta" to="/contact">Learn more <Arrow /></Link></div>
            ))}
          </div>
        </section>

        <section className="hs">
          <div className="support">
            <h2>Support Our Work</h2>
            <p>Project Alpaca is completely free for every single student, ensuring tuition or resource gaps never block a student's full potential. Your tax-deductible financial gifts provide direct, practical tools for a student's career journey.</p>
            <Link className="btn-navy" to="/donate">Donate now <Arrow /></Link>
          </div>
        </section>

        <Newsletter />
        <Footer />
      </div>
    </div>
  );
}
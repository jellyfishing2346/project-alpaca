import React from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter } from "./alpacees-directory-final.jsx";
import "./styles.css";

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ImgBox = ({ className }) => (
  <div className={"hi-img " + (className || "")}><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#B7B7C0" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></svg></div>
);
const Person = ({ role }) => (
  <div className="person"><ImgBox className="person-photo" /><h3>Instructor Name</h3><p className="person-role">{role || "Teaching Team"}</p></div>
);

const STEPS = [
  { n: "01", t: "Apply & Onboard", d: "Students apply and are matched into a cohort based on goals and experience." },
  { n: "02", t: "Build Foundations", d: "Assess baseline skills, set career paths, and anchor fundamentals." },
  { n: "03", t: "Grow & Connect", d: "Network with mentors, visit companies, and collaborate on real projects." },
  { n: "04", t: "Launch", d: "Curate portfolios, practice interviews, and transition into full-time roles." },
];
const MODULES = [
  { m: "Oct–Dec", t: "Foundations", d: "Focuses on assessing baseline skills, identifying target career paths, creating individualized action plans, and anchoring fundamentals through professional development and initial collaborative projects." },
  { m: "Jan–Mar", t: "Relationship Building", d: "Immerses students in networking, experiencing corporate onsite visits, expanding field expertise, and practicing active professional collaboration." },
  { m: "Apr–Jun", t: "Mastery", d: "Focuses on advanced portfolio curation, mock interviews, job search strategies, final project presentations, and transitioning smoothly into full-time employment." },
];
const CLASSES = ["Portfolio Building", "AI Readiness", "Technical Interview Prep", "UX Research Foundations", "Financial Literacy", "Professional Communication"];

export default function Flagship() {
  return (
    <div className="root">
      <Nav />
      <div className="home">
        <section className="hero">
          <div className="hero-l">
            <h1>The Flagship Program</h1>
            <p>An intensive, multi-layered incubator and career-prep program for under-resourced NYC college students breaking into tech.</p>
            <Link className="btn-navy" to="/get-involved">Get involved <Arrow /></Link>
          </div>
          <ImgBox className="hero-img" />
        </section>

        <section className="hs">
          <h2 className="hs-h">Program Overview</h2>
          <div className="overview">
            <div>
              <p>Project Alpaca is an intensive, multi-layered incubator and career-prep program designed to empower under-resourced New York City public college students and recent graduates of color who are aspiring to break into the tech industry.</p>
              <p>Operating in a safe yet rigorous hybrid environment, the program delivers holistic social, emotional, and professional development to help participants overcome systemic barriers, build competitive portfolios, and launch successful, lucrative careers.</p>
            </div>
            <ImgBox className="overview-img" />
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">How It Works</h2>
          <div className="flow">
            {STEPS.map((s) => (
              <div key={s.n} className="flow-card"><div className="flow-n">{s.n}</div><h3>{s.t}</h3><p>{s.d}</p></div>
            ))}
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">The Cohort</h2>
          <p className="prog-desc">The flagship curriculum runs over nine months (from October to June) and is chronologically split into three key thematic modules:</p>
          <div className="flow">
            {MODULES.map((m) => (
              <div key={m.t} className="flow-card"><div className="module-m">{m.m}</div><h3>{m.t}</h3><p>{m.d}</p></div>
            ))}
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Sample Classes</h2>
          <div className="inv-grid">
            {CLASSES.map((c) => (
              <div key={c} className="inv-card"><ImgBox className="inv-img" /><h3>{c}</h3><p>A sample of the technical and professional-skills sessions students attend.</p></div>
            ))}
          </div>
        </section>

        <section className="hs">
          <div className="overview">
            <div>
              <h2 className="hs-h" style={{ borderTop: 0 }}>End-of-Year Projects</h2>
              <p className="prog-desc">Mentees participate in at least two collaborative team projects that replicate authentic industry dynamics, complete with design retrospectives and 360-degree reviews. Previous cohorts have executed comprehensive group projects centered on Diversity, Equity, and Inclusion (DEI).</p>
              <Link className="btn-navy" to="/directory">See student projects <Arrow /></Link>
            </div>
            <ImgBox className="overview-img" />
          </div>
        </section>

        <section className="hs">
          <div className="meet-row">
            <div>
              <h2 className="hs-h" style={{ borderTop: 0, margin: 0 }}>Meet the Alpacees</h2>
              <p className="prog-desc" style={{ marginTop: 10 }}>Our graduates are ready to step into junior roles as React engineers, UI designers, and technical product associates. Search and filter student profiles by core skills, cohort years, or university affiliations.</p>
            </div>
            <Link className="btn-navy" to="/directory">Meet our Alpacees <Arrow /></Link>
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Teaching Team</h2>
          <div className="people">{["Lead Instructor", "Instructor", "Instructor"].map((r, i) => <Person key={i} role={r} />)}</div>
        </section>

        <section className="hs">
          <h2 className="hs-h">In partnerships with</h2>
          <div className="partners">{["Company", "School", "Company", "School", "Company", "School"].map((p, i) => <div key={i} className="partner"><ImgBox /><span>{p}</span></div>)}</div>
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
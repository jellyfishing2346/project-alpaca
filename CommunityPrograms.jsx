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

const PROGRAMS = [
  {
    title: "Equitable AI Program",
    desc: "An intensive program designed to guide Alpacees through evaluation models reviewing the structural potential, safety metrics, and ecological risks within the current AI landscape. Running as a hybrid model beginning March 16, 2026, the program delivers eight 2-hour weekday sessions covering hands-on engineering, model optimization, ethical LLM development, and the environmental infrastructure demands (power and water utility loads) of AI platforms.",
    partners: ["Citizens Committee NYC", "Google"],
    outcome: { stat: "$500", label: "Work stipend" },
    ctaTitle: "Interested in joining our next Equitable AI cohort?",
    ctaSub: "Next workshop runs December 2026. Register early to claim a seat.",
    ctaBtn: "Apply for AI Lab",
  },
  {
    title: "Resume Workshop",
    desc: "We hosted a resume workshop at Lehman College.",
    partners: ["Company", "School"],
    outcome: { stat: "100", label: "Students" },
    ctaTitle: "Interested in joining our next resume workshop?",
    ctaSub: "Next workshop runs December 2026. Register early to claim a seat.",
    ctaBtn: "Apply",
  },
];

const Program = ({ p }) => (
  <section className="hs">
    <h2 className="hs-h">{p.title}</h2>
    <p className="prog-desc">{p.desc}</p>
    <div className="po-grid">
      <div>
        <h4 className="po-label">Partners</h4>
        <div className="po-logos">{p.partners.map((x, i) => <div key={i} className="partner"><ImgBox /><span>{x}</span></div>)}</div>
      </div>
      <div>
        <h4 className="po-label">Outcomes</h4>
        <div className="outcome"><b>{p.outcome.stat}</b><span>{p.outcome.label}</span></div>
      </div>
    </div>
    <div className="cta-bar">
      <div><b>{p.ctaTitle}</b><p>{p.ctaSub}</p></div>
      <button className="btn-navy">{p.ctaBtn}</button>
    </div>
    <p className="partner-line">We're looking for industry and nonprofit partners. Interested? <Link to="/contact">Contact us</Link></p>
  </section>
);

export default function CommunityPrograms() {
  return (
    <div className="root">
      <Nav />
      <div className="home">
        <section className="hero">
          <div className="hero-l">
            <h1>Community Programs</h1>
            <p>Throughout the year, Project Alpaca hosts community programs to strengthen New York City and its residents with skills.</p>
            <Link className="btn-navy" to="/get-involved">Become our partner <Arrow /></Link>
          </div>
          <ImgBox className="hero-img" />
        </section>

        {PROGRAMS.map((p, i) => <Program key={i} p={p} />)}

        <section className="hs">
          <h2 className="hs-h">More Programs Coming Soon</h2>
          <div className="coming-soon">
            <div>
              <h3>Partner with Us</h3>
              <p>We are currently drafting curriculum specifications for upcoming one-off modules, including: Decentralized Web Architectures, Technical Writing Labs, and IoT Edge Systems. Want to make our work possible?</p>
            </div>
            <Link className="btn-outline" to="/contact">Contact</Link>
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
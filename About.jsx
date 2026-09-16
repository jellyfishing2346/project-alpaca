import React from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter } from "./alpacees-directory-final.jsx";
import "./styles.css";

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ImgBox = ({ className }) => (
  <div className={"hi-img " + (className || "")}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B7B7C0" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></svg></div>
);

const HISTORY = [
  { year: "2019", title: "Pilot Cohort — Cohort 1", d: "Project Alpaca launches its first cohort, piloting a hands-on model to prepare under-resourced NYC students for tech careers." },
  { year: "2020", title: "Pandemic Pause", d: "The program adapts to a remote-first world, keeping students connected and supported through a challenging year." },
  { year: "2021", title: "Official Nonprofit", d: "Project Alpaca becomes an official 501(c)(3), formalizing its mission and growing its mentor network." },
  { year: "2025", title: "Community Programs", d: "Beyond the flagship cohort, Project Alpaca introduces community workshops open to a wider group of students." },
];

// NOTE: placeholder people from the Figma — replace with the real board + headshots.
const BOARD = [
  { name: "Catherine Man", role: "Co-Founder, Executive Director & CEO" },
  { name: "Claire Igot", role: "Co-Founder, Board Chair" },
  { name: "Donna Meredith", role: "Board Member, Junior Board Lead" },
  { name: "Fred Butterworth", role: "Board Member" },
  { name: "Mac Eucane", role: "Board Member" },
  { name: "Jenea Scherma", role: "Board Member" },
  { name: "Courtney Leggett", role: "Board Member" },
];
const JUNIOR = [
  { name: "Board Member", role: "Junior Board" },
  { name: "Board Member", role: "Junior Board" },
  { name: "Board Member", role: "Junior Board" },
];
const PRESS = [
  { source: "Press outlet", date: "Jul 2026" },
  { source: "Press outlet", date: "May 2026" },
  { source: "Press outlet", date: "Mar 2026" },
  { source: "Press outlet", date: "Jan 2026" },
];

const Person = ({ p }) => (
  <div className="person">
    <ImgBox className="person-photo" />
    <h3>{p.name}</h3>
    <p className="person-role">{p.role}</p>
  </div>
);

export default function About() {
  return (
    <div className="root">
      <Nav />
      <div className="home">
        <section className="hero">
          <div className="hero-l">
            <h1>Building New York City's leaders for tomorrow</h1>
            <p>Project Alpaca is a community-driven nonprofit rooted in New York City, giving under-resourced college students the real-world skills, professional mentorship, and networks they need to break into tech and build an equitable future.</p>
          </div>
          <ImgBox className="hero-img" />
        </section>

        <section className="hs">
          <h2 className="hs-h">Supported by</h2>
          <div className="partners">{["Citizens NYC", "Company", "School", "Company"].map((p, i) => <div key={i} className="partner"><ImgBox /><span>{p}</span></div>)}</div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Our History</h2>
          <div className="hist">
            {HISTORY.map((h) => (
              <div key={h.year} className="hist-card">
                <ImgBox className="hist-img" />
                <div className="hist-year">{h.year}</div>
                <h3>{h.title}</h3>
                <p>{h.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Board of Directors</h2>
          <div className="people">{BOARD.map((p, i) => <Person key={i} p={p} />)}</div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Junior Board</h2>
          <div className="people">{JUNIOR.map((p, i) => <Person key={i} p={p} />)}</div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Press</h2>
          <div className="press">
            {PRESS.map((p, i) => (
              <div key={i} className="press-card">
                <ImgBox className="press-img" />
                <span className="press-meta">{p.source} · {p.date}</span>
                <h3>Press title</h3>
                <a className="inv-cta" href="#">Read <Arrow /></a>
              </div>
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
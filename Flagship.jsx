import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter, Squiggle, useAlpacees, CAT_COLORS } from "./alpacees-directory-final.jsx";
import "./styles.css";

// Programs – Flagship, per the Studio Haven design ("Programs - Flagship" in the Figma export).
// Photos: public/images/flagship/ (full-resolution originals from the design export).

// ---- Content you may want to edit ------------------------------------------------

// Where "Apply to Cohort 6" goes. TODO: replace with the real application link.
const APPLY_URL = "mailto:hello@projectalpaca.org?subject=Applying%20to%20Cohort%206";

const FACTS = [
  { t: "Intimate size", d: "Intimate cohort of 12–20 Alpacees to guarantee customized support." },
  { t: "100% Diverse", d: "60% first-generation college students, 50% immigrants or first-generation Americans, and 60% from families with household incomes under $55k." },
  { t: "CUNY & SUNY", d: "All Alpacees are from public university, and over 60% are from community colleges." },
];

const HOLISTIC = [
  { key: "community", t: "Community", d: "A cohort where students collaborate across schools, years, and majors to mimic real-world cross-functional teams.", pos: "center 50%" },
  { key: "programming", t: "Programming", d: "Weekly project-based learning led by active tech professionals that bridge academic theory learned in school with real-world execution.", pos: "center 28%" },
  { key: "mentorship", t: "Mentorship", d: "1:1 pairing with an industry professional in their field of interest for career mapping, project support, accountability, and access to their network.", pos: "center 55%" },
  { key: "networking", t: "Networking Events", d: "Access to company site visits, tech mixers, and networking events that broaden social capital and career horizons.", pos: "center 50%" },
  { key: "capstone", t: "Capstone Projects", d: "Self-initiated portfolio pieces solving real-world problems they researched and experienced in their own community.", pos: "center 45%" },
];

// Curriculum modules. TODO: the design only writes out Foundations; add the text for
// Relationship and Mastery here when the team provides it.
const MODULES = [
  { t: "Foundations", d: "Focuses on assessing baseline skills, identifying target career paths, creating individualized action plans, and anchoring fundamentals through professional development and initial collaborative projects." },
  { t: "Relationship", d: "" },
  { t: "Mastery", d: "" },
];

const CLASSES = [
  { t: "Building an MVP", d: "Teaches how to scope down ideas to build the simplest functional version of a product that directly solves core user needs.", who: "Course Instructor", names: "Jamie Katz" },
  { t: "Collaboration with Cross-Functional Teams", d: "Offers insights into real-world tech dynamics, emphasizing communication across design, engineering, and product management.", who: "Course Instructors", names: "Chloe Lee, Tobi Oldiran, Ben Lopez, Jason Antao" },
  { t: "Career Planning", d: "Guides students through a structured evaluation process to weigh their personal values against career choices.", who: "Course Instructor", names: "Cydney Kim" },
  { t: "User Research & Validation", d: "Highlights the importance of gathering qualitative feedback and observing real users before jumping into product solutions.", who: "Course Instructor", names: "Marissa Fleming" },
  { t: "Financial Planning", d: "Breaks down practical money management habits, NYC tax realities, and budgeting strategies customized to individual lifestyle needs.", who: "Course Instructor", names: "Silvana Bernhardt" },
];

// "Meet the Alpacees": the design's three students, pulled live from the directory data.
const FEATURED = ["Hannah Chacko", "Cindy Phuong Illas", "Patricia Pack Falcon"];

const INSTRUCTORS = [
  { key: "catherine-man", name: "Catherine Man", role: "Executive Director" },
  { key: "zsoreign-sanchez", name: "Zsoreign Sanchez", role: "Teaching Team" },
  { key: "marissa-fleming", name: "Marissa Fleming", role: "Teaching Team" },
];

const PARTNERS = [
  { key: "goldman-sachs", name: "Goldman Sachs" },
  { key: "american-express", name: "American Express" },
  { key: "google", name: "Google" },
  { key: "justworks", name: "Justworks" },
  { key: "meta", name: "Meta" },
];

// ---- Pieces ----------------------------------------------------------------------

const img = (k) => `/images/flagship/${k}.jpg`;

function Tabs() {
  const tabs = [["overview", "Overview"], ["programs", "Programs"], ["team", "Instructing Team"]];
  const [active, setActive] = useState("overview");
  useEffect(() => {
    // highlight the tab for the section currently on screen
    const els = tabs.map(([id]) => document.getElementById(`fl-${id}`)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id.replace("fl-", "")); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (e, id) => {
    e.preventDefault();
    document.getElementById(`fl-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <nav className="fl-tabs" aria-label="On this page">
      <div className="fl-tabs-in">
        {tabs.map(([id, label]) => (
          <a key={id} href={`#fl-${id}`} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined} onClick={(e) => go(e, id)}>{label}</a>
        ))}
      </div>
    </nav>
  );
}

function Curriculum() {
  const [open, setOpen] = useState(0);
  return (
    <div className="fl-cur">
      <div className="fl-acc">
        {MODULES.map((m, i) => (
          <div key={m.t} className={`fl-acc-item ${open === i ? "open" : ""}`}>
            <button className="fl-acc-head" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="fl-acc-n">{i + 1}</span>
              <span>{m.t}</span>
            </button>
            {open === i && <p className="fl-acc-body">{m.d || "Module details coming soon."}</p>}
          </div>
        ))}
      </div>
      <img className="fl-cur-img" src={img("curriculum")} alt="Two Alpacees working on laptops at a table" loading="lazy" />
    </div>
  );
}

function AlpaceeCard({ p }) {
  const col = CAT_COLORS[p.category] || "#1F1F1F";
  const tags = (p.skills?.length ? p.skills : [p.category]).slice(0, 3);
  return (
    <Link to="/directory" className="fl-pcard">
      {p.photo ? <img src={p.photo} alt="" loading="lazy" /> : <div className="fl-pcard-empty" />}
      <div className="fl-pcard-shade" aria-hidden="true" />
      <div className="fl-pcard-text">
        <h3>{p.name}</h3>
        <p>{p.role ? `${p.role}${p.company ? ` at ${p.company}` : ""}` : "Alpacee at Project Alpaca"}</p>
        <div className="fl-tags">{tags.map((t) => <span key={t} style={{ background: col + "99" }}>{t}</span>)}</div>
      </div>
    </Link>
  );
}

// ---- Page ------------------------------------------------------------------------

export default function Flagship() {
  const people = useAlpacees();
  const featured = FEATURED.map((n) => people.find((p) => p.name === n)).filter(Boolean);
  return (
    <div className="root root-flag">
      <header className="fl-hero">
        <Nav overlay />
        <h1>Flagship Program</h1>
      </header>
      <img className="fl-hero-img" src={img("hero")} alt="A group of Alpacees standing together in front of a lettered wall" />
      <section className="fl-intro">
        <p>Our multi-month program equipping high-potential, under-resourced college students with industry-level skills, mentorship, and portfolio pieces.</p>
        <a className="fl-btn fl-btn-lime" href={APPLY_URL}>Apply to Cohort 6 <Squiggle /></a>
      </section>

      <Tabs />

      <main className="fl-main">
        <section id="fl-overview" className="fl-sec fl-prep">
          <div>
            <h2 className="fl-h1">Intensive Career Prep</h2>
            <p className="fl-lead">Our flagship initiative is an intensive program that delivers social, emotional, and professional development to help our Alpacees overcome systemic barriers, create lasting relationships, build competitive portfolios, and launch successful, lucrative careers.</p>
          </div>
          <img src={img("intensive")} alt="A cohort session in a conference room" />
        </section>

        <section className="fl-facts">
          {FACTS.map((f) => (
            <div key={f.t} className="fl-fact"><h3>{f.t}</h3><p>{f.d}</p></div>
          ))}
        </section>

        <section id="fl-programs" className="fl-sec">
          <h2 className="fl-h2">Holistic Approach</h2>
        </section>
      </main>

      <div className="fl-carousel" role="region" aria-label="Holistic approach" tabIndex={0}>
        <div className="fl-track">
          {HOLISTIC.map((h) => (
            <article key={h.key} className="fl-hcard">
              <img src={img(h.key)} alt="" loading="lazy" style={{ objectPosition: h.pos }} />
              <div className="fl-hcard-text"><h3>{h.t}</h3><p>{h.d}</p></div>
            </article>
          ))}
        </div>
      </div>

      <main className="fl-main">
        <hr className="fl-rule fl-r1" />
        <section className="fl-sec fl-s-cur">
          <h2 className="fl-h1">Curriculum</h2>
          <p className="fl-sub">The flagship curriculum runs over six months (from January to June) and is chronologically split into three key thematic modules.</p>
          <Curriculum />
        </section>

        <section className="fl-sec fl-s-classes">
          <h2 className="fl-h2">Sample classes</h2>
          <div className="fl-classes">
            <img src={img("classes")} alt="A class session with a presentation on screen" loading="lazy" />
            <div className="fl-class-list">
              {CLASSES.map((c) => (
                <div key={c.t} className="fl-class">
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                  <p><b>{c.who}:</b> {c.names}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fl-sec fl-split fl-s-projects">
          <div className="fl-split-text">
            <h2 className="fl-h2">Projects</h2>
            <p>Alpacees participate in at least two collaborative team projects that replicate real-world experience, complete with design retrospectives and 360-degree reviews. Previous cohorts have executed group projects centered on improving New York City and Diversity, Equity, and Inclusion (DEI).</p>
            <Link className="fl-btn fl-btn-line" to="/flagship">See Projects <Squiggle /></Link>
          </div>
          <img className="fl-framed" src={img("projects")} alt="Figma mockup of the NextStep app from a cohort project" loading="lazy" />
        </section>

        <section className="fl-sec fl-s-meet">
          <div className="fl-head-row">
            <h2 className="fl-h2">Meet the Alpacees</h2>
            <Link className="fl-btn fl-btn-line" to="/directory">Meet all <Squiggle /></Link>
          </div>
          <div className="fl-grid3">{featured.map((p) => <AlpaceeCard key={p.id} p={p} />)}</div>
        </section>

        <hr className="fl-rule fl-r2" />
        <section id="fl-team" className="fl-sec fl-s-team">
          <h2 className="fl-h1">Core Instructors</h2>
          <div className="fl-grid3">
            {INSTRUCTORS.map((t) => (
              <div key={t.key} className="fl-pcard fl-pcard-static">
                <img src={img(t.key)} alt="" loading="lazy" />
                <div className="fl-pcard-shade" aria-hidden="true" />
                <div className="fl-pcard-text"><h3>{t.name}</h3><p>{t.role}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="fl-sec fl-split fl-s-alpacas">
          <div className="fl-split-text">
            <h2 className="fl-h2">Alpacas<br />(Mentors)</h2>
            <p>Alpacas are volunteer tech and corporate professionals who champion underrepresented talent. They work as software engineers, product managers, designers, marketers, and business strategists.</p>
            <Link className="fl-btn fl-btn-line" to="/get-involved">Learn more <Squiggle /></Link>
          </div>
          <img src={img("alpacas")} alt="A large group of Alpacas and Alpacees" loading="lazy" />
        </section>

        <hr className="fl-rule fl-r3" />
        <section className="fl-partners">
          <h2>Our Flagship Program is made possible by</h2>
          <div className="fl-logos">
            {PARTNERS.map((p) => <img key={p.key} src={`/images/home/logos/${p.key}.png`} alt={p.name} />)}
          </div>
        </section>
      </main>

      <section className="fl-support">
        <img src={img("support")} alt="Alpacees and staff holding a framed Project Alpaca illustration" loading="lazy" />
        <div className="fl-support-text">
          <div>
            <h2>Support Our Work</h2>
            <p>Project Alpaca is completely free for every single student, ensuring resource gaps never block a student's full potential. Your tax-deductible financial gifts provide direct, practical tools for a student's career journey.</p>
          </div>
          <Link className="fl-btn fl-btn-lime" to="/donate">Donate <Squiggle /></Link>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}

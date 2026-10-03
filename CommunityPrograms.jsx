import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter, Squiggle } from "./alpacees-directory-final.jsx";
import "./styles.css";

// Programs – Community, per the Studio Haven design ("Programs - Community" in the Figma export).
// Same building blocks as the Flagship page (fl-* classes), recolored: Mellow Yellow + Sky.
// Photos and partner logos: public/images/community/.

// ---- Content you may want to edit ------------------------------------------------
// Each program gets a tab, a section (text + photo) and a row of partner organizations.
// NOTE: in the design, "Resume Review" repeats the Equitable AI text, photo and partners as
// placeholder copy. Replace its `paras`, `image` and `partners` when the real content is ready.
const KUDOS = "Kudos to our Alpacees for leading with curiosity, care, and community in mind: Aasim Joseph, Fernando Woolcott, Jericho Faderon, Kayla Greene, Sumaiya Fatema, Ruckshada Khan.";
const PARTNERS_AI = [
  { logo: "atlas", name: "ATLAS High School", d: "Welcome recent immigrant students into the world of AI" },
  { logo: "harlem-childrens-zone", name: "Harlem Children’s Zone", d: "Bring younger learners into the fold with an age-tailored session" },
  { logo: "fedcap", name: "Civic Hall x Fedcap", d: "Support adult learners in their journey toward safe, confident AI use" },
];
const PROGRAMS = [
  {
    id: "equitable-ai", tab: "Equitable AI", title: "Equitable AI", image: "equitable-ai",
    lead: "As part of our Equitable AI Initiative, we trained a group of Alpacees to design and facilitate free, community-based workshops on the AI landscape and how to use it ethically.",
    paras: ["Each session was built around the needs of its learners, because equitable access to AI starts with meeting people where they are.", KUDOS],
    partners: PARTNERS_AI,
  },
  {
    id: "resume-review", tab: "Resume Review", title: "Resume Review", image: "equitable-ai",
    lead: "",
    paras: ["As part of our Equitable AI Initiative, we trained a group of Alpacees to design and facilitate free, community-based workshops on the AI landscape and how to use it ethically.", "Each session was built around the needs of its learners, because equitable access to AI starts with meeting people where they are.", KUDOS],
    partners: PARTNERS_AI,
  },
];

// ---- Page ------------------------------------------------------------------------

const img = (k) => `/images/community/${k}.jpg`;

function Tabs() {
  const [active, setActive] = useState(PROGRAMS[0].id);
  useEffect(() => {
    const els = PROGRAMS.map((p) => document.getElementById(`cm-${p.id}`)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id.replace("cm-", "")); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (e, id) => { e.preventDefault(); document.getElementById(`cm-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <nav className="fl-tabs" aria-label="Programs on this page">
      <div className="fl-tabs-in">
        {PROGRAMS.map((p) => (
          <a key={p.id} href={`#cm-${p.id}`} className={active === p.id ? "on" : ""} aria-current={active === p.id ? "true" : undefined} onClick={(e) => go(e, p.id)}>{p.tab}</a>
        ))}
      </div>
    </nav>
  );
}

export default function CommunityPrograms() {
  return (
    <div className="root root-flag root-comm">
      <header className="fl-hero">
        <Nav overlay />
        <h1>Community Programs</h1>
      </header>
      <img className="fl-hero-img" src={img("hero")} alt="Alpacees and a workshop facilitator smiling in front of a Thank You slide" />
      <section className="fl-intro">
        <p>Throughout the year, Project Alpaca hosts community programs to strengthen New York City and its residents with skills.</p>
        <Link className="fl-btn fl-btn-lime" to="/get-involved">Become Our Partners <Squiggle /></Link>
      </section>

      <Tabs />

      <main className="fl-main">
        {PROGRAMS.map((p, i) => (
          <React.Fragment key={p.id}>
            {i > 0 && <hr className="fl-rule cm-rule" />}
            <section id={`cm-${p.id}`} className={`fl-sec cm-prog ${i === 0 ? "cm-first" : ""}`}>
              <div className="cm-text">
                <h2 className="fl-h1">{p.title}</h2>
                {p.lead && <p className="cm-lead">{p.lead}</p>}
                {p.paras.map((t, j) => <p key={j}>{t}</p>)}
              </div>
              <img src={img(p.image)} alt="" loading={i === 0 ? "eager" : "lazy"} />
            </section>
            <div className="cm-orgs">
              {p.partners.map((o) => (
                <div key={o.name} className="cm-org">
                  <div className="cm-org-logo"><img className={`lg-${o.logo}`} src={`/images/community/partners/${o.logo}.png`} alt={`${o.name} logo`} loading="lazy" /></div>
                  <h3>{o.name}</h3>
                  <p>{o.d}</p>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </main>

      <section className="fl-support cm-band">
        <img src={img("partner")} alt="A workshop session with a presenter at the screen" loading="lazy" />
        <div className="fl-support-text">
          <div>
            <h2>Partner with Us</h2>
            <p>We are currently drafting curriculum specifications for upcoming one-off modules. Want to hire us?</p>
          </div>
          <Link className="fl-btn fl-btn-lime" to="/contact">Contact <Squiggle /></Link>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}

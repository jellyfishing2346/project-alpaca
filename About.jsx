import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter, Squiggle } from "./alpacees-directory-final.jsx";
import "./styles.css";

// About, per the Studio Haven design ("About" in the Figma export).
// Reuses the program-page building blocks (fl-* buttons, person cards, Support band) with ab-* layout.

// ---- Content -----------------------------------------------------------------------
// History timeline. The design writes out 2019 only (six dots, one entry). The later entries
// below come from the site's earlier About page and have NOT been confirmed by the team:
// confirm or replace them (each entry: year, title, text, optional photo).
const HISTORY = [
  { year: "2019", title: "Pilot Cohort", photo: "/images/about/pilot-cohort.jpg",
    d: "Conceived by three friends, sparked by Executive Director Catherine Man's work with low-income students of color in the Bronx who were working long hours to support families while attending community college. Launched a pilot cohort of 7 students, establishing the framework." },
  { year: "2020", title: "Pandemic Pause", photo: "/images/about/pilot-cohort.jpg", unconfirmed: true,
    d: "The program adapts to a remote-first world, keeping students connected and supported through a challenging year." },
  { year: "2021", title: "Official Nonprofit", photo: "/images/about/pilot-cohort.jpg", unconfirmed: true,
    d: "Project Alpaca becomes an official 501(c)(3), formalizing its mission and growing its mentor network." },
  { year: "2025", title: "Community Programs", photo: "/images/about/pilot-cohort.jpg", unconfirmed: true,
    d: "Beyond the flagship cohort, Project Alpaca introduces community workshops open to a wider group of students." },
];

// Board. The design's role lines read "Role at PA" and job lines "Job at Company" (placeholders);
// those are left out until real values are added here.
const BOARD = [
  { name: "Catherine Man", eyebrow: "Co-Founder • Executive Director", job: "", photo: "/images/flagship/catherine-man.jpg" },
  { name: "Claire Igot", eyebrow: "Co-Founder • Board Chair", job: "", photo: "/images/people/claire-igot.jpg" },
  { name: "Donna Meredith", eyebrow: "", job: "", photo: "/images/people/donna-meredith.jpg" },
  { name: "Fred Butterweck", eyebrow: "", job: "", photo: "/images/people/fred-butterweck.jpg" },
  { name: "Mac Exume", eyebrow: "", job: "", photo: "/images/people/mac-exume.jpg" },
  { name: "Jenna Scherma", eyebrow: "", job: "", photo: "/images/people/jenna-scherma.jpg" },
  { name: "Courtney Leggett", eyebrow: "", job: "", photo: "/images/people/courtney-leggett.jpg" },
];
// NOTE: the design repeats the Board here as placeholder; replace with the graduated Alpacees.
const JUNIOR_BOARD = BOARD;

const NEWS = [
  { meta: "2025 • Grant", text: "Project Alpaca received Community Leaders Grant from Citizens Committee for New York City.",
    image: "/images/about/news-citizens-committee.png", url: "https://www.citizensnyc.org" }, // TODO: link the announcement itself
];

// ---- Pieces --------------------------------------------------------------------------
function Timeline() {
  const [i, setI] = useState(0);
  const h = HISTORY[i];
  return (
    <div className="ab-tl">
      <div className="ab-tl-dots" role="tablist" aria-label="Project Alpaca history">
        {HISTORY.map((e, k) => (
          <button key={e.year + e.title} role="tab" aria-selected={k === i} aria-label={`${e.year}: ${e.title}`}
            className={`ab-dot ${k === i ? "on" : ""}`} onClick={() => setI(k)} />
        ))}
      </div>
      <div className="ab-tl-item" role="tabpanel">
        <img src={h.photo} alt="" />
        <div>
          <div className="ab-year">{h.year}</div>
          <h3>{h.title}</h3>
          <p>{h.d}</p>
        </div>
      </div>
    </div>
  );
}

function People({ list }) {
  return (
    <div className="fl-grid3 ab-people">
      {list.map((m) => (
        <div key={m.name} className="fl-pcard fl-pcard-static gi-person">
          <img src={m.photo} alt="" loading="lazy" />
          <div className="fl-pcard-shade" aria-hidden="true" />
          <div className="fl-pcard-text">
            {m.eyebrow && <span className="gi-eyebrow">{m.eyebrow}</span>}
            <h3>{m.name}</h3>
            {m.job && <p>{m.job}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Page --------------------------------------------------------------------------
export default function About() {
  return (
    <div className="root root-flag root-about">
      <div className="ab-wool">
        <header className="ab-hero">
          <Nav overlay dark />
          <div className="ab-eyebrow">About</div>
          <h1>Empower public college students</h1>
          <Link className="fl-btn fl-btn-lime" to="/donate">Donate <Squiggle /></Link>
        </header>

        <div className="fl-main">
          <hr className="ab-rule" />
          <section className="ab-row">
            <img src="/images/about/mission.jpg" alt="Alpacees presenting a project, one holding a laptop and another an alpaca plush" />
            <div>
              <h2 className="ab-h3">Our Mission</h2>
              <p className="ab-lead">Project Alpaca was born out of a simple, urgent realization: talent is everywhere, but opportunity and access are not.</p>
              <p>Navigating the transition from college to a career is daunting, especially for under-resourced New York City public college students and first-generation talent entering an industry that often relies on hidden networks and unwritten rules. We started Project Alpaca to rewrite that script. We wanted to create a safe, rigorous, and collaborative environment to provide the social, emotional, and technical preparation needed to break into tech, realize their personal power, and lead within their communities.</p>
            </div>
          </section>
          <hr className="ab-rule" />
          <section className="ab-row ab-row-rev">
            <div>
              <h2 className="ab-h3">Why "Project Alpaca"?</h2>
              <p className="ab-lead">Alpacas are known for their resilience, warmth, and strong herd mentality.</p>
              <p>In our community, no one navigates the path alone. We replace the cutthroat, competitive culture of tech with an environment built on collaboration, mutual support, and collective growth.</p>
            </div>
            <img src="/images/about/why-alpaca.jpg" alt="A rainbow alpaca plush on a stack of books" />
          </section>
        </div>
      </div>

      <section className="ab-cream ab-history">
        <div className="fl-main">
          <h2 className="ab-h1">Our History</h2>
          <Timeline />
        </div>
      </section>

      <section className="ab-wool ab-team">
        <div className="fl-main">
          <h2 className="ab-h1">Meet the team</h2>
          <h3 className="ab-h2">Board of Directors</h3>
          <People list={BOARD} />
          <hr className="ab-rule ab-rule-team" />
          <h3 className="ab-h2">Junior Board</h3>
          <p className="ab-lead ab-junior-sub">Our Junior Board is made up of graduated Alpacees</p>
          <People list={JUNIOR_BOARD} />
        </div>
      </section>

      <section className="ab-cream ab-news">
        <div className="fl-main ab-news-in">
          <h2 className="ab-h1">News</h2>
          <div className="ab-news-list">
            {NEWS.map((n) => (
              <article key={n.text} className="ab-news-item">
                <img src={n.image} alt="" loading="lazy" />
                <div>
                  <div><div className="ab-news-meta">{n.meta}</div><p>{n.text}</p></div>
                  <a className="fl-btn fl-btn-line" href={n.url} target="_blank" rel="noreferrer">Read <Squiggle /></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fl-support">
        <img src="/images/flagship/support.jpg" alt="Alpacees and staff holding a framed Project Alpaca illustration" loading="lazy" />
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

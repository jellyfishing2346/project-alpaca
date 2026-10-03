import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter, GetInvolved, Squiggle, useAlpacees } from "./alpacees-directory-final.jsx";
import "./styles.css";

// Homepage, per the Studio Haven design (Figma "Web design - Project Alpaca",
// page "Visual Design - Desktop", frame "Home" 669:3841).
//
// Images live in public/images/home/ (see DOCS.md for the full list). Every image
// tries .jpg/.png/.svg and falls back gracefully if the file isn't there yet.

// ---- Content you may want to edit ------------------------------------------------

const STATS = [
  { n: "250+", label: "Students helped", color: "#5B2D53", bg: "#E0FFEC", art: "backpack" },
  { n: "$1,000,000+", label: "Total salary increased", color: "#1E474D", bg: "#FFFDDF", art: "money" },
  { n: "100%", label: "Students of color", color: "#564538", bg: "#E7FCFF", art: "rainbow" },
];

const PARTNERS = [
  { key: "goldman-sachs", name: "Goldman Sachs" },
  { key: "american-express", name: "American Express" },
  { key: "google", name: "Google" },
  { key: "justworks", name: "Justworks" },
  { key: "meta", name: "Meta" },
];

// Events: add real ones here. `date` is YYYY-MM-DD; past events hide automatically.
// `image` is a file in public/images/home/events/ (optional).
const EVENTS = [
  // { date: "2026-11-14", title: "Fall Demo Day", desc: "Cohort 6 presents their capstone projects.", where: "Manhattan", image: "demo-day" },
];

// ---- Helpers ---------------------------------------------------------------------

// An image that tries each extension in turn; renders `fallback` (or nothing) if none exist.
function Img({ base, alt = "", className, fallback = null, exts = ["jpg", "png", "svg"] }) {
  const [i, setI] = useState(0);
  if (i >= exts.length) return fallback;
  return <img className={className} src={`${base}.${exts[i]}`} alt={alt} onError={() => setI((x) => x + 1)} />;
}


const fmtDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const TESTI_BG = ["#E7FCFF", "#FFFDDF", "#FFF4FD", "#E0FFEC", "#FAEFDE"];
// Alpaca icon accent per card color, as in the design (public/images/home/icons/).
const TESTI_ICON = ["sky", "yellow", "pink", "green", "sunrise"];

// ---- Sections --------------------------------------------------------------------

function Hero() {
  return (
    <section className="hm-hero">
      <Img base="/images/home/hero" className="hm-hero-img" exts={["jpg", "png"]} />
      <div className="hm-hero-shade" aria-hidden="true" />
      <Nav overlay />
      <h1 className="hm-hero-h">
        Creating tech leaders<br />
        <span>for New York City</span>
      </h1>
    </section>
  );
}

function Partners() {
  return (
    <section className="hm-partners">
      <h2>Powered by mentors from companies like</h2>
      <div className="hm-logos">
        {PARTNERS.map((p) => (
          <Img key={p.key} base={`/images/home/logos/${p.key}`} alt={p.name} className="hm-logo" exts={["svg", "png"]}
            fallback={<span className="hm-logo-text">{p.name}</span>} />
        ))}
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section className="hm-impact">
      <div className="hm-impact-top">
        <h2 className="hm-impact-h">Unlocking potential</h2>
        <div className="hm-impact-copy">
          <p className="hm-lead">Project Alpaca is a grassroots nonprofit on a mission to bridge the opportunity gap for under-resourced college students in NYC.</p>
          <p>Our growing network of mentees (Alpacees), industry mentors (Alpacas), and partners are actively redefining representation across tech, design, and business. Together, our graduated Alpacees are securing full-time roles at leading companies across NYC and beyond, achieving significant salary growth, and rewriting stories for their families and generations to come.</p>
          <p>Through hands-on industry projects, 1:1 mentorship, and corporate partnerships, we equip emerging talent with the confidence, networks, and real-world skills to thrive. By transforming how young professionals transition from campus to career, we remove systemic barriers and build clear pathways to economic mobility.</p>
          <p>Together, we are building a world where every student, regardless of background, has full agency, access, and opportunity to shape their future.</p>
        </div>
      </div>
      <div className="hm-stats">
        {STATS.map((s) => (
          <div key={s.n} className="hm-stat" style={{ background: s.bg }}>
            <div>
              <div className="hm-stat-n" style={{ color: s.color }}>{s.n}</div>
              <div className="hm-stat-l">{s.label}</div>
            </div>
            <Img base={`/images/home/illustrations/${s.art}`} className="hm-stat-art" exts={["svg", "png"]} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Programs() {
  const cards = [
    { key: "flagship", to: "/flagship", title: "Flagship program", text: "Our multi-month technology & professional development track equipping Alpacees with industry-level skills, mentorship, and portfolio pieces.", bg: "#1E474D", accent: "#FFF767", ink: "#FFFDDF" },
    { key: "community", to: "/community-programs", title: "Community Programs", text: "Bite-sized workshops designed for quick, targeted skills development.", bg: "#564538", accent: "#37E3FC", ink: "#E7FCFF" },
  ];
  return (
    <section className="hm-programs">
      {cards.map((c) => (
        <Link key={c.key} to={c.to} className={`hm-prog hm-prog-${c.key}`} style={{ background: c.bg }}>
          <Img base={`/images/home/${c.key}`} className="hm-prog-img" exts={["jpg", "png"]} fallback={<div className="hm-prog-img hm-img-empty" />} />
          <div className="hm-prog-body">
            <div>
              <h3 style={{ color: c.accent }}>{c.title}</h3>
              <p style={{ color: c.ink }}>{c.text}</p>
            </div>
            <span className="hm-arrow-btn" aria-hidden="true"><Squiggle /></span>
          </div>
        </Link>
      ))}
    </section>
  );
}

function Events() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = EVENTS.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  return (
    <section className="hm-events">
      <div className="hm-events-intro">
        <h2>Events</h2>
        <p>Our events are open to everyone. Whether you’re a student looking to grow, a professional eager to mentor, or a supporter passionate about closing the opportunity gap, we’d love for you to join our community.</p>
      </div>
      <div className="hm-events-list">
        {upcoming.length ? upcoming.map((e) => (
          <article key={e.date + e.title} className="hm-event">
            <Img base={`/images/home/events/${e.image || ""}`} className="hm-event-img" exts={e.image ? ["jpg", "png"] : []}
              fallback={<div className="hm-event-img hm-img-empty" />} />
            <div className="hm-event-body">
              <div>
                <h3>{e.title}</h3>
                <p className="hm-event-desc">{e.desc}</p>
                <p className="hm-event-when">{fmtDate(e.date)}{e.where ? ` • ${e.where}` : ""}</p>
              </div>
              <a className="hm-rsvp" href={`mailto:hello@projectalpaca.org?subject=${encodeURIComponent(`RSVP: ${e.title}`)}`}>RSVP <Squiggle /></a>
            </div>
          </article>
        )) : (
          <div className="hm-events-empty">
            <p>No upcoming events right now. Subscribe to the newsletter below to hear about the next one first.</p>
          </div>
        )}
      </div>
    </section>
  );
}

// Testimonials come straight from the directory's Google Sheet ("Testimonial about Project
// Alpaca" column), so new ones appear here automatically. Two rows scroll in opposite directions.
function Community() {
  const people = useAlpacees().filter((p) => p.quote && p.quote.trim().length > 20);
  if (!people.length) return null;
  const rows = [people.filter((_, i) => i % 2 === 0), people.filter((_, i) => i % 2 === 1)].filter((r) => r.length);
  // Color comes from the card's position in its row, so the duplicated half matches exactly.
  const Card = ({ p, i, ri }) => {
    const k = (i * 2 + ri) % TESTI_BG.length;
    return (
      <figure className="hm-testi" style={{ background: TESTI_BG[k] }}>
        <div className="hm-testi-who">
          <span className="hm-testi-name">{p.name}</span>
          <img className="hm-testi-icon" src={`/images/home/icons/alpaca-${TESTI_ICON[k]}.png`} alt="" />
        </div>
        <div className="hm-testi-rule" aria-hidden="true" />
        <div className="hm-testi-text">
          <div className="hm-eyebrow">Flagship Program • {`Cohort ${p.c}`}</div>
          <blockquote>{p.quote}</blockquote>
        </div>
      </figure>
    );
  };
  return (
    <section className="hm-community">
      <div className="hm-community-head">
        <h2>From our community</h2>
        <Img base="/images/home/illustrations/speech" className="hm-speech" exts={["svg", "png"]} />
      </div>
      {rows.map((row, ri) => (
        <div key={ri} className={`hm-marquee ${ri % 2 ? "rev" : ""}`}>
          <div className="hm-track" style={{ animationDuration: `${Math.max(40, row.length * 14)}s` }}>
            {/* two identical groups so the loop is seamless; the copy is hidden from screen readers */}
            <div className="hm-group">{row.map((p, i) => <Card key={p.id} p={p} i={i} ri={ri} />)}</div>
            <div className="hm-group" aria-hidden="true">{row.map((p, i) => <Card key={`d${p.id}`} p={p} i={i} ri={ri} />)}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default function Home() {
  return (
    <div className="root root-home">
      <Hero />
      <Partners />
      <Impact />
      <Programs />
      <Events />
      <Community />
      <GetInvolved />
      <Newsletter />
      <Footer />
    </div>
  );
}

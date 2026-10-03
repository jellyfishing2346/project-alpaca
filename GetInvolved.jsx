import React, { useEffect, useState } from "react";
import { Nav, Footer, Newsletter, Squiggle } from "./alpacees-directory-final.jsx";
import { Link } from "react-router-dom";
import "./styles.css";

// Get Involved, per the Studio Haven design ("Get Involved" in the Figma export).
// Same building blocks as the program pages (fl-* classes), recolored: Purple + Lime.

// ---- Links: replace the placeholders when the real ones exist ---------------------
const LINKS = {
  mentorApply: "mailto:hello@projectalpaca.org?subject=Mentor%20application", // TODO: mentor application form
  volunteer: "mailto:hello@projectalpaca.org?subject=Volunteering",          // TODO: volunteer form
  partnership: "mailto:partnership@projectalpaca.org",
  deck: "mailto:partnership@projectalpaca.org?subject=Partnership%20deck%20request", // TODO: link the deck PDF
};

// ---- Content -----------------------------------------------------------------------
// NOTE: several parts of the design are placeholders: the same three people (staff) appear as
// both "mentors" and "volunteers", their job lines read "Job at Company", and the same photos
// repeat across sections. Update PEOPLE / photos below as real content arrives.
const P = "/images/people/";
const MENTORS = [
  { name: "Catherine Man", eyebrow: "Co-Founder • Executive Director", job: "", photo: "/images/flagship/catherine-man.jpg" },
  { name: "Claire Igot", eyebrow: "Co-Founder • Board Chair", job: "", photo: P + "claire-igot.jpg" },
  { name: "Donna Meredith", eyebrow: "Role at PA", job: "", photo: P + "donna-meredith.jpg" },
];
const VOLUNTEERS = MENTORS; // placeholder in the design (same three people)

const MENTOR_WAYS = [
  {
    t: "1-on-1 Mentor", photo: "/images/flagship/curriculum.jpg",
    d: "Check in regularly over a 3-month cycle to build a supportive relationship. Help mentees navigate personal professional anxieties, practice interview skills, and learn how to present their best selves to employers.",
    list: [
      ["Engagement Cycle:", "Actively commit to a 3-month mentoring sprint."],
      ["Bi-Weekly Check-Ins:", "Meet 1-on-1 with your assigned Alpacee at least twice a month for 30 minutes to 1 hour."],
      ["Monthly Alignment:", "Join a brief monthly check-in call with Project Alpaca co-founders to provide feedback and track mentee progress."],
      ["Expectations:", "Provide guidance in good faith, maintain professional confidentiality, and encourage the mentee to drive their own meeting agendas."],
    ],
  },
  {
    t: "Class Facilitator / Workshop Instructor", photo: "/images/flagship/curriculum.jpg",
    d: "Lead a one-off virtual or in-person workshop (1-3 hours) focused on technical skills (e.g., portfolio building, AI readiness) or core soft skills (e.g., financial literacy, professional relationships).",
  },
];

const ROLES = [
  ["Content Writer", "Write long-form thought leadership pieces covering education, mentorship, and career readiness for our website, and create short-form social copy."],
  ["Fundraising Manager", "Lead fundraising campaigns, orchestrate donation drives, and handle long-term donor relationships."],
  ["Graphic Designer", "Design visual media, edit photos & short videos for our website and active social channels like LinkedIn, Instagram, and YouTube."],
  ["Grant Writer", "Research regional corporate/foundation grant opportunities and draft detailed funding proposals."],
  ["Partnership Manager", "Target, connect, and build partnerships with local small businesses in NYC to secure job shadowing, company tours, and office visits."],
  ["Videographer/Photographer", "Attend and document live weekend workshops, cohort networking mixers, and student portfolio presentations."],
];

const IMPACTS = [
  ["Hire an Alpacee", "Tap into a vetted pipeline of brilliant CUNY community college students and recent grads specialized in software development, data science, and UI/UX design."],
  ["Host a Cohort for a Day", "Open your office doors to host local corporate site visits, interactive company tours, simulated speed-interview rounds, or portfolio reviews."],
  ["Sponsor a Program", "Fund a specific element of our 9-month program ecosystem. Sponsorship levels support essential student needs like professional laptops, cloud learning subscriptions, workshop dinner catering, or funding student work stipends."],
  ["Corporate Matching & Grants", "Channel corporate philanthropy or foundation matching programs directly to our 501(c)(3) operational fund to keep our training 100% free for students."],
];

const TABS = [["alpacas", "Alpacas"], ["volunteers", "Volunteers"], ["partners", "Partners"]];

// ---- Pieces ------------------------------------------------------------------------
function Tabs() {
  const [active, setActive] = useState(TABS[0][0]);
  useEffect(() => {
    const els = TABS.map(([id]) => document.getElementById(`gi-${id}`)).filter(Boolean);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id.replace("gi-", "")); });
    }, { rootMargin: "-30% 0px -60% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (e, id) => { e.preventDefault(); document.getElementById(`gi-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <nav className="fl-tabs" aria-label="Ways to get involved">
      <div className="fl-tabs-in">
        {TABS.map(([id, label]) => (
          <a key={id} href={`#gi-${id}`} className={active === id ? "on" : ""} aria-current={active === id ? "true" : undefined} onClick={(e) => go(e, id)}>{label}</a>
        ))}
      </div>
    </nav>
  );
}

const Btn = ({ href, kind = "lime", children }) => (
  <a className={`fl-btn fl-btn-${kind}`} href={href}>{children} <Squiggle /></a>
);

function People({ list }) {
  return (
    <div className="fl-grid3">
      {list.map((m) => (
        <div key={m.name} className="fl-pcard fl-pcard-static gi-person">
          <img src={m.photo} alt="" loading="lazy" />
          <div className="fl-pcard-shade" aria-hidden="true" />
          <div className="fl-pcard-text">
            <span className="gi-eyebrow">{m.eyebrow}</span>
            <h3>{m.name}</h3>
            {m.job && <p>{m.job}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Page --------------------------------------------------------------------------
export default function GetInvolved() {
  return (
    <div className="root root-flag root-gi">
      <header className="fl-hero">
        <Nav overlay />
        <h1>Be a Force for Good</h1>
      </header>
      <img className="fl-hero-img" src="/images/flagship/alpacas.jpg" alt="A large group of Alpacas, Alpacees and staff" />
      <section className="fl-intro">
        <p>Bridge the gap between brilliant public college students and professional environments actively seeking to build diverse, inclusive, and equitable workforces. Individuals and organizations can plug directly into our mission through high-impact mentorship, operational support, corporate pipelines, or financial sponsorships.</p>
      </section>

      <Tabs />

      <main className="fl-main">
        {/* Alpacas (mentors) */}
        <section id="gi-alpacas" className="fl-sec gi-split gi-first">
          <div className="gi-split-text">
            <h2 className="fl-h1">Alpacas<br />(Mentors)</h2>
            <p className="gi-lead">We affectionately call our mentors Alpacas because they champion our mentees (the Alpacees). Industry professionals from tech, product, design, and business strategy step in to build student confidence, review portfolios, and guide early careers.</p>
            <Btn href={LINKS.mentorApply}>Apply to be a Mentor</Btn>
          </div>
          <img src="/images/flagship/curriculum.jpg" alt="Two Alpacees working together on laptops" />
        </section>

        <section className="fl-sec gi-s-ways">
          <h2 className="fl-h2 gi-dark">Two Ways to Get Involved</h2>
          {MENTOR_WAYS.map((w, i) => (
            <div key={w.t} className={`gi-way ${i % 2 ? "rev" : ""}`}>
              <img src={w.photo} alt="" loading="lazy" />
              <div>
                <h3>{w.t}</h3>
                <p>{w.d}</p>
                {w.list && <ul>{w.list.map(([b, t]) => <li key={b}><b>{b}</b> {t}</li>)}</ul>}
              </div>
            </div>
          ))}
        </section>

        <section className="fl-sec gi-s-meet gi-s-meet-m">
          <h2 className="fl-h2 gi-dark">Meet our Mentors</h2>
          <People list={MENTORS} />
          <div className="gi-after"><Btn href={LINKS.mentorApply}>Apply to be a Mentor</Btn></div>
        </section>

        <hr className="fl-rule gi-rule gi-rule1" />

        {/* Volunteers */}
        <section id="gi-volunteers" className="fl-sec gi-split gi-s-vol">
          <div className="gi-split-text">
            <h2 className="fl-h1">Volunteers</h2>
            <p className="gi-lead">Offer your specialties to build our organizational capacity, manage community events, or expand our fundraising reach.</p>
            <Btn href={LINKS.volunteer}>Become a Volunteer</Btn>
          </div>
          <img src="/images/flagship/curriculum.jpg" alt="" loading="lazy" />
        </section>

        <section className="fl-sec gi-s-meet gi-s-meet-v">
          <h2 className="fl-h2 gi-dark">Meet our Volunteers</h2>
          <People list={VOLUNTEERS} />
        </section>

        <section className="gi-roles">
          {ROLES.map(([t, d]) => (
            <div key={t} className="gi-role"><h3>{t}</h3><p>{d}</p></div>
          ))}
        </section>
        <div className="gi-after"><Btn href={LINKS.volunteer}>Become a Volunteer</Btn></div>

        <hr className="fl-rule gi-rule" />

        {/* Partners */}
        <section id="gi-partners" className="fl-sec gi-split gi-s-partners">
          <div className="gi-split-text">
            <h2 className="fl-h1">Corporate &amp; Nonprofit Partners</h2>
            <p className="gi-lead">We build tailored, multi-layered alliances with businesses, foundations, and community entities to support early career development.</p>
            <div className="gi-btns-col">
              <Btn href={LINKS.partnership}>Contact Partnership Team</Btn>
              <Btn href={LINKS.deck} kind="line">Download Partnership Deck</Btn>
            </div>
          </div>
          <img src="/images/flagship/curriculum.jpg" alt="" loading="lazy" />
        </section>

        <section className="fl-sec gi-s-impacts">
          <h2 className="fl-h2 gi-dark">Ways to Create Impacts</h2>
          <div className="gi-impacts">
            {IMPACTS.map(([t, d]) => (
              <article key={t} className="gi-impact">
                <img src="/images/flagship/community.jpg" alt="" loading="lazy" />
                <div><h3>{t}</h3><p>{d}</p></div>
              </article>
            ))}
          </div>
          <div className="gi-after gi-btns-row">
            <Btn href={LINKS.partnership}>Contact Partnership Team</Btn>
            <Btn href={LINKS.deck} kind="line">Download Partnership Deck</Btn>
          </div>
        </section>
      </main>

      <section className="fl-support gi-support">
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

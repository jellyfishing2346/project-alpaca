import React from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter } from "./alpacees-directory-final.jsx";
import "./styles.css";

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ImgBox = ({ className }) => (
  <div className={"hi-img " + (className || "")}>
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B7B7C0" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></svg>
  </div>
);

const PARTNERS = ["Company", "School", "Company", "School", "Company", "School"];
const PROGRAMS = [
  { t: "Flagship Program", d: "Our 9-month technology and professional development track equipping high-potential under-resourced college students with industry-level skills, mentorship, and portfolio pieces.", to: "/flagship" },
  { t: "Community Programs", d: "Bite-sized workshops designed for quick, targeted skills development.", to: "/community-programs" },
];
const IMPACT = [["200+", "Alpacees Graduated"], ["50+", "Active Industry Mentors"], ["15", "Cohorts Completed"], ["95%", "Career Placement Rate"]];
const EVENTS = [
  { d: "JUN 12", t: "2:00 PM", title: "Design Portfolio Critique", desc: "Industry professionals from local agencies join us to offer constructive feedback on student UX and graphic work." },
  { d: "JUL 08", t: "11:00 AM", title: "Alumni Roundtable Discussion", desc: "Hear from previous Project Alpaca graduates on their transition into tech roles and higher education." },
  { d: "AUG 15", t: "5:00 PM", title: "Summer Demo Day 2026", desc: "Cohort 5 students present their final capstone products and design prototypes to our donor and partner network." },
];
const TESTIMONIALS = [
  { name: "Alex Rivera", role: "Cohort 3 Alum, UX Designer", q: "Project Alpaca changed my career trajectory. Having access to standard design software and an actual mentor made all the difference in preparing for my college applications." },
  { name: "Sarah Jenkins", role: "Mentor, Engineer, Google", q: "Mentoring here is incredibly fulfilling. You get to see real, direct outcomes of your industry advice and watch young talent transform creative ideas into working prototypes." },
  { name: "Marcus Chen", role: "Creative Director, XYZ", q: "Hiring a graduate from Project Alpaca has consistently brought motivated, hungry, and highly-capable junior talent into our creative tech department." },
];
const INVOLVE = [
  { t: "Support us financially", d: "Directly fund tech resources, laptops, and internship stipends for our upcoming youth cohorts.", cta: "Donate", to: "/donate" },
  { t: "Become our partner", d: "Sponsor a cohort, host workspace trips, or hire talented graduates for junior roles.", cta: "Partner with us", to: "/get-involved" },
  { t: "Join a cohort", d: "If you are a student ready to supercharge your tech capabilities, start your application here.", cta: "Get notified", to: "/flagship" },
  { t: "Join as a volunteer", d: "Lend your skills in administration, event organization, or technical support during events.", cta: "Apply", to: "/get-involved" },
  { t: "Become a mentor", d: "Guide an Alpacee 1-on-1 or instruct a class.", cta: "Apply", to: "/get-involved" },
];

export default function Home() {
  return (
    <div className="root">
      <Nav />
      <div className="home">
        <section className="hero">
          <div className="hero-l">
            <h1>Creating tech leaders locally for New York City</h1>
            <p>Our structured programs empower under-resourced college students with confidence, leadership, and real-world projects.</p>
            <div className="hero-cta">
              <Link className="btn-navy" to="/directory">Meet the Alpacees <Arrow /></Link>
              <Link className="btn-outline" to="/get-involved">Get involved</Link>
            </div>
          </div>
          <ImgBox className="hero-img" />
        </section>

        <section className="hs">
          <h2 className="hs-h">In partnerships with</h2>
          <div className="partners">{PARTNERS.map((p, i) => <div key={i} className="partner"><ImgBox /><span>{p}</span></div>)}</div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Our Programs</h2>
          <div className="prog-grid">
            {PROGRAMS.map((p) => (
              <div key={p.t} className="prog-card">
                <ImgBox className="prog-img" />
                <h3>{p.t}</h3><p>{p.d}</p>
                <Link className="btn-outline" to={p.to}>Learn more <Arrow /></Link>
              </div>
            ))}
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Our Impact</h2>
          <div className="impact">{IMPACT.map(([n, l]) => <div key={l} className="stat"><b>{n}</b><span>{l}</span></div>)}</div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Upcoming Events</h2>
          <div className="events">
            {EVENTS.map((e) => (
              <div key={e.title} className="event">
                <div className="event-date"><b>{e.d}</b><span>{e.t}</span></div>
                <div className="event-body"><h3>{e.title}</h3><p>{e.desc}</p></div>
                <button className="btn-navy sm">RSVP</button>
              </div>
            ))}
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">What Our Community Says</h2>
          <div className="tgrid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="tcardh">
                <div className="stars">★★★★★</div>
                <span className="tqm">&ldquo;</span>
                <p>{t.q}</p>
                <div className="tby"><b>{t.name}</b><span>{t.role}</span></div>
              </div>
            ))}
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Get Involved</h2>
          <div className="inv-grid">
            {INVOLVE.map((i) => (
              <div key={i.t} className="inv-card">
                <ImgBox className="inv-img" />
                <h3>{i.t}</h3><p>{i.d}</p>
                <Link className="inv-cta" to={i.to}>{i.cta} <Arrow /></Link>
              </div>
            ))}
          </div>
        </section>

        <Newsletter />
        <Footer />
      </div>
    </div>
  );
}
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter } from "./alpacees-directory-final.jsx";
import "./styles.css";

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ImgBox = ({ className }) => (
  <div className={"hi-img " + (className || "")}><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#B7B7C0" strokeWidth="1.4"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></svg></div>
);

// "What does your donation go towards?" — the donation breakdown graphic, built in code so it stays
// sharp, screen-reader friendly, and easy to update: edit the percentages in BREAKDOWN (they should sum to 100).
const BREAKDOWN = [
  { pct: 84.5, label: "Programming", color: "#F1E850" },
  { pct: 9, label: "Operations", color: "#CE76C2" },
  { pct: 4.5, label: "Marketing/Website Hosting", color: "#57BEDC" },
  { pct: 2, label: "Fundraising", color: "#3B2038" },
];

const Swirl = ({ color }) => (
  <svg className="db-swirl" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 10.5c0-.8.7-1.3 1.4-1.1.9.3 1.2 1.4.8 2.2-.6 1.2-2.2 1.5-3.3.8-1.5-.9-1.7-3-.8-4.3 1.2-1.7 3.7-2 5.3-.9 2 1.4 2.3 4.3.9 6.2-1.6 2.3-5 2.6-7.1 1-2.6-1.9-2.9-5.7-1-8.1" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

function Donut() {
  // Slices go clockwise; the small ones start just above "3 o'clock", as in the graphic.
  const order = [BREAKDOWN[1], BREAKDOWN[2], BREAKDOWN[3], BREAKDOWN[0]];
  const r = 70, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg className="db-donut" viewBox="0 0 200 200" role="img"
      aria-label={BREAKDOWN.map((b) => `${b.pct}% ${b.label}`).join(", ")}>
      <g transform="rotate(-36 100 100)">
        {order.map((b) => {
          const len = (b.pct / 100) * c;
          const el = <circle key={b.label} cx="100" cy="100" r={r} fill="none" stroke={b.color} strokeWidth="48"
            strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
          offset += len;
          return el;
        })}
      </g>
    </svg>
  );
}

function DonationBreakdown() {
  return (
    <figure className="db">
      <figcaption className="db-title">
        <svg className="db-loop" viewBox="0 0 400 120" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="200" cy="60" rx="194" ry="44" transform="rotate(-3 200 60)" fill="none" stroke="#F2E4CA" strokeWidth="1.2" />
          <ellipse cx="203" cy="62" rx="188" ry="48" transform="rotate(2 200 60)" fill="none" stroke="#F2E4CA" strokeWidth="1" />
        </svg>
        <span>What does your donation go towards?</span>
      </figcaption>
      <Donut />
      <ul className="db-legend">
        {BREAKDOWN.map((b) => (
          <li key={b.label}><Swirl color={b.color === "#3B2038" ? "#7A4A72" : b.color} /><b>{b.pct}%</b> {b.label}</li>
        ))}
      </ul>
    </figure>
  );
}

const AMOUNTS = [25, 50, 100, 250];

export default function Donate() {
  const [freq, setFreq] = useState("one-time");
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState("");

  return (
    <div className="root">
      <Nav />
      <div className="home">
        <section className="hs" style={{ borderTop: 0 }}>
          <h1 style={{ margin: "24px 0 20px" }}>Donate</h1>
          <div className="overview" style={{ alignItems: "start" }}>
            <div>
              <p className="prog-desc">Every dollar donated directly funds professional training, equipment, and mentorship for under-resourced students in New York City. Help us build the next generation of tech leaders.</p>

              <div className="widget">
                <div className="wtoggle">
                  <button className={freq === "one-time" ? "on" : ""} onClick={() => setFreq("one-time")}>One-time</button>
                  <button className={freq === "monthly" ? "on" : ""} onClick={() => setFreq("monthly")}>Monthly</button>
                </div>
                <div className="wamounts">
                  {AMOUNTS.map((a) => (
                    <button key={a} className={amount === a && !custom ? "on" : ""} onClick={() => { setAmount(a); setCustom(""); }}>${a}</button>
                  ))}
                  <input placeholder="Custom" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ""))} />
                </div>
                <button className="btn-navy wbtn">Donate ${custom || amount}{freq === "monthly" ? "/mo" : ""} <Arrow /></button>
                <p className="wnote">Secure checkout to be connected — payment processor pending.</p>
              </div>
            </div>
            <DonationBreakdown />
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Empower At Scale</h2>
          <div className="corp">
            <p>We welcome partnerships with family offices, philanthropic foundations, and corporate social responsibility teams. Large-scale funding helps us secure tech hardware, provide stipends for student internships, and secure learning hubs.</p>
            <div className="corp-contact">
              <span className="corp-label">Prominent Giving Contact</span>
              <a href="mailto:giving@projectalpaca.org">giving@projectalpaca.org</a>
              <a className="btn-navy" href="mailto:giving@projectalpaca.org?subject=Corporate%20%26%20major%20giving">Get in touch <Arrow /></a>
            </div>
          </div>
        </section>

        <section className="hs">
          <div className="support">
            <h2>Other ways to help</h2>
            <p>Beyond financial gifts, you can mentor a student, host a cohort visit, or partner with us to hire our graduates.</p>
            <Link className="btn-outline" to="/get-involved">Explore ways to get involved <Arrow /></Link>
          </div>
        </section>

        <Newsletter />
        <Footer />
      </div>
    </div>
  );
}
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
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.02em", margin: "24px 0 20px" }}>Donate</h1>
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
            <ImgBox className="overview-img" style={{ aspectRatio: "3/4" }} />
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
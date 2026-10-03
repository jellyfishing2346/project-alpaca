import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Nav, Footer, Newsletter, Squiggle } from "./alpacees-directory-final.jsx";
import "./styles.css";

// Contact, per the Studio Haven design ("Contact" in the Figma export).
//
// The form has no server behind it: "Send" opens the visitor's email app with a message
// pre-filled from the form (partnership questions go to partnership@, everything else to hello@).
// To collect submissions directly instead, point the form at a service such as Formspree.

const REASONS = [
  { label: "General question", to: "hello@projectalpaca.org" },
  { label: "Partnership opportunity", to: "partnership@projectalpaca.org" },
  { label: "Becoming a mentor", to: "hello@projectalpaca.org" },
  { label: "Volunteering", to: "hello@projectalpaca.org" },
  { label: "Applying to a cohort", to: "hello@projectalpaca.org" },
  { label: "Press or media", to: "hello@projectalpaca.org" },
  { label: "Donations", to: "hello@projectalpaca.org" },
];
// TODO: link the press kit file when it exists (for now this requests it by email).
const PRESS_KIT_URL = "mailto:hello@projectalpaca.org?subject=Press%20kit%20request";

const Req = () => <span className="ct-req">(Required)</span>;

function ContactForm() {
  const [f, setF] = useState({ first: "", last: "", org: "", email: "", phone: "", reason: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    const reason = REASONS.find((r) => r.label === f.reason);
    const to = reason?.to || "hello@projectalpaca.org";
    const subject = `${f.reason || "Contact"} – ${f.first} ${f.last}`.trim();
    const details = [
      `Name: ${f.first} ${f.last}`.trim(),
      f.org && `Organization: ${f.org}`,
      `Email: ${f.email}`,
      f.phone && `Phone: ${f.phone}`,
      f.reason && `Reason: ${f.reason}`,
    ].filter(Boolean).join("\n");
    const body = `${f.message}\n\n—\n${details}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <form className="ct-form" onSubmit={submit}>
      <div className="ct-row2">
        <label className="ct-field"><span>First name <Req /></span><input required value={f.first} onChange={set("first")} autoComplete="given-name" /></label>
        <label className="ct-field"><span>Last name</span><input value={f.last} onChange={set("last")} autoComplete="family-name" /></label>
      </div>
      <label className="ct-field"><span>Organization</span><input value={f.org} onChange={set("org")} autoComplete="organization" /></label>
      <label className="ct-field"><span>Email <Req /></span><input required type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
      <label className="ct-field"><span>Phone number</span><input type="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" /></label>
      <label className="ct-field ct-select"><span>Contact reason</span>
        <select value={f.reason} onChange={set("reason")}>
          <option value="">Choose one</option>
          {REASONS.map((r) => <option key={r.label}>{r.label}</option>)}
        </select>
      </label>
      <label className="ct-field"><span>Message <Req /></span><textarea required value={f.message} onChange={set("message")} /></label>
      <button className="fl-btn fl-btn-lime ct-send" type="submit">Send <Squiggle /></button>
      {sent && <p className="ct-sent" role="status">Your email app should open with your message ready to send. If it doesn't, email us at hello@projectalpaca.org.</p>}
    </form>
  );
}

export default function Contact() {
  return (
    <div className="root root-flag root-contact">
      <header className="ct-hero">
        <Nav overlay dark />
        <h1>Contact</h1>
        <p className="ct-intro">Have questions about our programs, partnership opportunities, or how to get involved? We'd love to hear from you.</p>
      </header>

      <main className="ct-main">
        <ContactForm />
        <aside className="ct-press">
          <h2>Press Kit</h2>
          <p>Download our official press kit, including brand guidelines, high-resolution logos, program factsheets, and executive bios.</p>
          <a className="fl-btn fl-btn-line" href={PRESS_KIT_URL}>Download <Squiggle /></a>
        </aside>
      </main>

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

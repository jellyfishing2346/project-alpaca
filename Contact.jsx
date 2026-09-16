import React, { useState } from "react";
import { Nav, Footer } from "./alpacees-directory-final.jsx";
import "./styles.css";

const CHANNELS = [
  { t: "General Inquiries", d: "For general questions about Project Alpaca, media inquiries, or student admissions.", e: "hello@projectalpaca.org" },
  { t: "Partnership Opportunities", d: "Interested in becoming an industry partner, mentoring, or hiring our graduates?", e: "partnership@projectalpaca.org" },
];

export default function Contact() {
  const [f, setF] = useState({ first: "", last: "", email: "", subject: "", message: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const send = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(f.subject || "Website inquiry");
    const body = encodeURIComponent(
      `Name: ${f.first} ${f.last}\nEmail: ${f.email}\n\n${f.message}`
    );
    window.location.href = `mailto:hello@projectalpaca.org?subject=${subject}&body=${body}`;
  };

  return (
    <div className="root">
      <Nav />
      <div className="home">
        <section className="hs" style={{ borderTop: 0 }}>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-.02em", margin: "24px 0 12px" }}>Contact</h1>
          <p className="intro" style={{ margin: 0 }}>Have questions about our programs, partnership opportunities, or how to get involved? We'd love to hear from you.</p>

          <div className="cgrid">
            <form className="cform" onSubmit={send}>
              <div className="crow">
                <input placeholder="First name" value={f.first} onChange={set("first")} required />
                <input placeholder="Last name" value={f.last} onChange={set("last")} required />
              </div>
              <input type="email" placeholder="Email" value={f.email} onChange={set("email")} required />
              <input placeholder="Subject" value={f.subject} onChange={set("subject")} />
              <textarea placeholder="Your message" rows={6} value={f.message} onChange={set("message")} required />
              <label className="ccheck"><input type="checkbox" required /> I agree to be contacted by Project Alpaca.</label>
              <button className="btn-navy" type="submit">Send message</button>
            </form>

            <div className="cchans">
              {CHANNELS.map((c) => (
                <div key={c.t} className="cchan">
                  <h3>{c.t}</h3>
                  <p>{c.d}</p>
                  <a href={`mailto:${c.e}`}>{c.e}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="hs">
          <h2 className="hs-h">Press Kit</h2>
          <div className="presskit">
            <div>
              <h3>Media & brand assets</h3>
              <p>Logos, brand guidelines, and program fact sheets for journalists and partners.</p>
            </div>
            <a className="btn-outline" href="mailto:hello@projectalpaca.org?subject=Press%20kit%20request">Request press kit</a>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
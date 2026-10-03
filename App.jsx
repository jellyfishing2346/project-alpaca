import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import DirectoryApp, { Nav, Footer } from "./alpacees-directory-final.jsx";
import Home from "./Home.jsx";
import Contact from "./Contact.jsx";
import About from "./About.jsx";
import CommunityPrograms from "./CommunityPrograms.jsx";
import GetInvolved from "./GetInvolved.jsx";
import Flagship from "./Flagship.jsx";
import Donate from "./Donate.jsx";
import "./styles.css";

// Placeholder page for routes whose real design isn't built yet.
function Page({ title, blurb }) {
  return (
    <div className="root">
      <Nav />
      <div className="home">
        <h1 style={{ marginTop: 32 }}>{title}</h1>
        <p className="intro">{blurb || "This page is coming soon."}</p>
        <p><Link className="inv-cta" to="/directory">← Back to the directory</Link></p>
      </div>
      <Footer />
    </div>
  );
}

// Browser tab titles: "Project Alpaca - <Page>". The directory sets its own (profiles show the person's name).
const TITLES = {
  "/": "Project Alpaca",
  "/home": "Project Alpaca",
  "/flagship": "Project Alpaca - Flagship Program",
  "/community-programs": "Project Alpaca - Community Programs",
  "/get-involved": "Project Alpaca - Get Involved",
  "/about": "Project Alpaca - About",
  "/contact": "Project Alpaca - Contact",
  "/donate": "Project Alpaca - Donate",
  "/projects": "Project Alpaca - Projects",
};
function TabTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    if (path === "/directory") return; // handled inside the directory
    document.title = TITLES[path] || "Project Alpaca";
  }, [pathname]);
  return null;
}

// React Router keeps the old scroll position between routes; reset it so each page starts at the top.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <TabTitle />
      <Routes>
        {/* Marketing Homepage is the front door; directory lives at /directory. */}
        <Route path="/" element={<Home />} />
        <Route path="/directory" element={<DirectoryApp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />

        {/* Stubs — ready to fill with the Figma designs, one at a time. */}
        <Route path="/projects" element={<Page title="Projects" blurb="Alpacee project showcases — coming soon." />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/get-involved" element={<GetInvolved />} />
        <Route path="/community-programs" element={<CommunityPrograms />} />
        <Route path="/flagship" element={<Flagship />} />

        {/* Anything else falls back to the directory. */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
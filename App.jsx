import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DirectoryApp, { Nav, Footer } from "./alpacees-directory-final.jsx";
import Home from "./Home.jsx";
import "./styles.css";

// Placeholder page for routes whose real design isn't built yet.
function Page({ title, blurb }) {
  return (
    <div className="root">
      <Nav />
      <div className="home">
        <h1 style={{ marginTop: 32, fontSize: 40, fontWeight: 800, letterSpacing: "-.02em" }}>{title}</h1>
        <p className="intro">{blurb || "This page is coming soon."}</p>
        <p><Link to="/" style={{ color: "#E8663D", fontWeight: 700, textDecoration: "none" }}>← Back to the directory</Link></p>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Directory stays at "/" for now; the marketing Homepage can take "/" later. */}
        <Route path="/" element={<DirectoryApp />} />
        <Route path="/directory" element={<DirectoryApp />} />
        <Route path="/home" element={<Home />} />

        {/* Stubs — ready to fill with the Figma designs, one at a time. */}
        <Route path="/projects" element={<Page title="Projects" blurb="Alpacee project showcases — coming soon." />} />
        <Route path="/about" element={<Page title="About" />} />
        <Route path="/donate" element={<Page title="Donate" />} />
        <Route path="/get-involved" element={<Page title="Get Involved" />} />
        <Route path="/community-programs" element={<Page title="Community Programs" />} />
        <Route path="/flagship" element={<Page title="Flagship Program" />} />

        {/* Anything else falls back to the directory. */}
        <Route path="*" element={<DirectoryApp />} />
      </Routes>
    </BrowserRouter>
  );
}
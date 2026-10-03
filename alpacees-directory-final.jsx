import React, { useState, useMemo, useEffect } from "react";
import { loadAlpacees } from "./sheet.js";
import "./styles.css";
import { Link } from "react-router-dom";
import avatarPlaceholder from "./avatar-1577909_1280.webp";


/*
  Project Alpaca — Alpacee Directory
  STRICT wireframe build. Matches the Figma frames "Directory - Home" and
  "Directory - Profile" as drawn: neutral grayscale, navy accent, plain image
  placeholders, no added colors / type / brand.

  Where the design has slots for data the sheet doesn't have yet (availability
  "Status", Project name + gallery, real Skills), the wireframe's placeholder
  treatment is kept as-is — those fill in once the columns exist.

  Data honesty: public-safe fields only (no email / demographics). The one skill
  pill is inferred from major/role as a stand-in for a real Skills field.
*/

const NAVY = "#1E2B4D";

const COHORTS = {
  1: { label: "Cohort 1", years: "2019–2022" },
  2: { label: "Cohort 2", years: "2022–2023" },
  3: { label: "Cohort 3", years: "2023–2024" },
  4: { label: "Cohort 4", years: "2024–2025" },
  5: { label: "Cohort 5", years: "2025–2026" },
};

const RAW = [
  {"id": 1, "c": 1, "name": "Zsoreign Sanchez De Oliveria", "school": "Hunter College", "major": "Media Studies with a Concentration in Emerging Media", "grad": "2022", "role": "Tech / Creative Professional"},
  {"id": 2, "c": 1, "name": "Patricia Pack Falcon", "role": "Program Volunteer / Mentor", "company": "Project Alpaca", "linkedin": "https://www.linkedin.com/in/patricia-ppf"},
  {"id": 3, "c": 1, "name": "Kurk Fisher", "school": "John Jay College", "major": "Computer Science with a minor in Mathematics", "grad": "2020", "linkedin": "https://www.linkedin.com/in/kurkfisher"},
  {"id": 4, "c": 1, "name": "Ngozi Fisher", "school": "Lehman College", "major": "Computer Graphics and Imaging", "grad": "2020", "linkedin": "https://www.linkedin.com/in/ngozifisher"},
  {"id": 5, "c": 2, "name": "Huda Ayaz", "school": "Macaulay Honors at Brooklyn College", "major": "Multimedia Computing", "grad": "2025", "role": "Tech Professional", "quote": "I've learned to have more faith in myself over the course of my time being a part of Project Alpaca. The recurring message I've come across has been that most people's journeys are not a straight line, and that is okay.", "linkedin": "https://www.linkedin.com/in/huda-ayaz/"},
  {"id": 6, "c": 2, "name": "Tasfiha Saba", "school": "CUNY Lehman College", "major": "Computer Science", "grad": "Fall 2023", "role": "Tech Professional", "quote": "From this 9-month program, the aspects that I appreciate the most are the connections that I get to make, many feedback that I received from my peers and mentors, and especially the welcome I have felt in this community.", "linkedin": "https://www.linkedin.com/in/tasfiha-saba/"},
  {"id": 7, "c": 2, "name": "Christine Lai", "school": "Brooklyn College", "major": "Computer Science", "grad": "Graduated"},
  {"id": 8, "c": 2, "name": "Cindy Phuong Illas", "school": "BMCC", "major": "Psychology", "grad": "2022 (From BMCC, moving onto senior college)"},
  {"id": 9, "c": 2, "name": "Darren Gao", "school": "Brooklyn College", "major": "Computer Science", "grad": "2023"},
  {"id": 10, "c": 2, "name": "Fatoumata Mariam Soumahoro", "school": "Brooklyn College", "major": "Business Law & Real Estate", "grad": "2024"},
  {"id": 11, "c": 2, "name": "Joshua Grant", "school": "Brooklyn College", "major": "Business Administration - E-Business", "grad": "2023"},
  {"id": 12, "c": 2, "name": "Kira Andrews", "school": "Baruch College", "major": "Communication Studies (Digital Communications & Culture)", "grad": "2024"},
  {"id": 13, "c": 2, "name": "Noel Madera, Jr.", "school": "Brooklyn College", "major": "Computer Science", "grad": "2026"},
  {"id": 14, "c": 2, "name": "Onyx McQueen", "school": "Brooklyn College", "major": "General Mathematics", "grad": "2023, 2024 the latest."},
  {"id": 15, "c": 2, "name": "Safiyyah Kazim", "school": "Brooklyn College", "major": "Computer Information Systems", "grad": "2023"},
  {"id": 16, "c": 2, "name": "Selicia Graham", "school": "Brooklyn College", "major": "Studio Art: Digital Art", "grad": "2023", "linkedin": "https://www.linkedin.com/in/seliciagraham/"},
  {"id": 17, "c": 2, "name": "Tajrin Kashem", "school": "Brooklyn College", "major": "Computer Science", "grad": "2023"},
  {"id": 18, "c": 2, "name": "Tamaya Sara", "school": "CUNY Lehman College", "major": "Computer Science", "grad": "Fall 2023", "linkedin": "https://www.linkedin.com/in/tamaya-sara/"},
  {"id": 19, "c": 3, "name": "Sukhdeep Singh", "school": "Hunter College", "major": "Computer Science", "grad": "2023", "role": "Developer / Analyst", "resume": "https://docs.google.com/document/d/1GdejhinYW5VQ-egxcX4AMJUMf83m6lL_WsY5__lRPEk/edit?usp=sharing"},
  {"id": 20, "c": 3, "name": "Maggie Ma", "school": "CUNY Hunter College", "major": "Computer Science", "grad": "2024", "role": "Product Manager", "company": "Kodely", "quote": "Each panelist has a different vibe. It was very comforting, and I learned that anyone can do anything. Some advice I got: build something you like and get it done.", "linkedin": "https://www.linkedin.com/in/maggeema/", "resume": "https://docs.google.com/document/d/1hpoPFyLbLGPBboNZN55X3ogn_NZSTdzo2DKJqBNi_Jo/edit"},
  {"id": 21, "c": 3, "name": "Candice Arichabala", "school": "Lehman College", "major": "Computer Graphics", "grad": "2023", "role": "Graphic Designer / UX Designer", "resume": "https://docs.google.com/document/d/1Rbql8JR9ZSJX1eJhVnl0AsKWyViR_bbxXe_NG8qnXdc/edit?usp=sharing"},
  {"id": 22, "c": 3, "name": "Aakash Gharti Chhetri", "school": "LaGuardia Community College", "major": "Computer Science"},
  {"id": 23, "c": 3, "name": "Aasim Joseph Jr", "school": "LaGuardia Community College", "major": "Information Technology"},
  {"id": 24, "c": 3, "name": "Asad Ali", "school": "LaGuardia Community College", "major": "Computer Science"},
  {"id": 25, "c": 3, "name": "Fahim Sarker", "school": "LaGuardia Community College", "major": "Psychology"},
  {"id": 26, "c": 3, "name": "Jason Norman", "school": "LaGuardia Community College", "major": "Electrical Engineering"},
  {"id": 27, "c": 3, "name": "Jovanny Guzman", "school": "LaGuardia Community College", "major": "Computer Science"},
  {"id": 28, "c": 3, "name": "Marvellous Nosa", "school": "Lehman College", "major": "Philosophy"},
  {"id": 29, "c": 3, "name": "Md Siddique", "school": "LaGuardia Community College", "major": "Computer Science"},
  {"id": 30, "c": 3, "name": "Rap Louis C Regidor", "school": "Stony Brook University", "major": "Computer Science"},
  {"id": 31, "c": 3, "name": "Tchessy Y Bellevue", "school": "LaGuardia Community College", "major": "Psychology"},
  {"id": 32, "c": 4, "name": "Sayquan Wooden", "school": "Brooklyn College", "major": "Creative Writing", "role": "UI/UX Designer & Creative"},
  {"id": 33, "c": 4, "name": "MD Mujjakkir (MJ)", "school": "LaGuardia Community College", "major": "Network administration and information security", "role": "Cybersecurity Analyst / Student Tech Mentor", "company": "Apex Axis / LaGuardia CC"},
  {"id": 34, "c": 4, "name": "Taiwo Omosowon", "school": "New York City College of Technology (CUNY)", "major": "Data Science", "role": "Data Scientist"},
  {"id": 35, "c": 4, "name": "Adrian Benjamin", "school": "Borough of Manhattan Community College (BMCC)", "major": "Computer Information Systems"},
  {"id": 36, "c": 4, "name": "Ajani King", "school": "Lehman College", "major": "Computer Science"},
  {"id": 37, "c": 4, "name": "Amanda Alegria", "school": "John Jay College", "major": "Economics"},
  {"id": 38, "c": 4, "name": "Bi Rong Liu", "school": "Brooklyn College", "major": "Computer Science"},
  {"id": 39, "c": 4, "name": "Brian Atahualpa", "school": "Hunter College", "major": "Computer Science"},
  {"id": 40, "c": 4, "name": "Carrie Yu", "school": "Hunter College", "major": "Computer Science"},
  {"id": 41, "c": 4, "name": "Edwin Berrouet", "school": "Long Island University Brooklyn", "major": "Computer Science"},
  {"id": 42, "c": 4, "name": "Franchesca Salas", "school": "NYC College of Technology (CUNY)", "major": "Communication Design"},
  {"id": 43, "c": 4, "name": "Hannah Chacko", "school": "Hunter College", "major": "Emerging Media"},
  {"id": 44, "c": 4, "name": "Jonathan Grande", "school": "BMCC", "major": "Computer Science"},
  {"id": 45, "c": 4, "name": "Marcus Demery", "school": "Borough of Manhattan Community College (BMCC)", "major": "Music"},
  {"id": 46, "c": 4, "name": "Oscar Holguin", "school": "Straighterline", "major": "Computer Systems - Software Development"},
  {"id": 47, "c": 4, "name": "Reimy De Leon Espinal", "school": "Lehman College", "major": "Computer Information Systems"},
  {"id": 48, "c": 4, "name": "Sumaiya Fatema", "school": "Lehman College", "major": "Computer Science"},
  {"id": 49, "c": 4, "name": "Jubelkis Diaz", "school": "John Jay College", "major": "Economics"},
  {"id": 50, "c": 4, "name": "Lesley Diaz", "school": "Other", "major": "Digital Design"},
  {"id": 51, "c": 5, "name": "Afifah Monir", "school": "Baruch College", "major": "Finance & Computer Science", "grad": "2027-05-01 0:00:00", "role": "Data Science Intern", "company": "The Information Lab / Datum Republic", "quote": "Being a Bangladeshi woman in male-dominated fields like tech and finance has shown me how crucial access to a community and mentorship is."},
  {"id": 52, "c": 5, "name": "Alexa Montilla", "school": "Lehman College", "major": "Computer Graphics and Imagery"},
  {"id": 53, "c": 5, "name": "Alexander Escamilla", "school": "Lehman College", "major": "Computer Science"},
  {"id": 54, "c": 5, "name": "Ariana Walcott", "school": "New York City College of Technology"},
  {"id": 55, "c": 5, "name": "Faizan Khan", "school": "Brooklyn College", "major": "Computer Science", "grad": "May 2026", "role": "Software Engineer / TA", "company": "CodePath.org", "bio": "I’m a software engineer who loves the puzzle of turning a complex, abstract problem into a practical tool that people actually enjoy using. While my technical background is rooted in the rigor of building and deploying AI platforms, my real focus is on the human element. I believe technology should serve a clear purpose, namely making lives easier and businesses smarter. For me, success isn't just about writing elegant code or leveraging the latest models. Instead, it’s about collaborating across teams to build robust, scalable solutions that deliver genuine, measurable value to the real world.", "quote": "The combination of collaborative project work and direct access to industry experts helped me sharpen my technical skills and better position myself for competitive fintech roles.", "linkedin": "https://www.linkedin.com/in/faizan-khan234", "portfolio": "https://myportfolio-xi-liart-28.vercel.app", "resume": "https://www.overleaf.com/read/jtqnrbkyjqdq#95d7f1", "skills": ["Python", "TypeScript/JavaScript", "Java", "C++", "SQL", "Go", "Rust", "Bash", "PyTorch", "TensorFlow", "Scikit-learn", "LLM Integration", "RAG Pipelines", "Predictive Modeling", "Quantitative Trading Strategies", "Financial Modeling", "Time-series Analysis", "Backtesting Frameworks", "Data Visualization", "AWS EC2", "S3", "Lambda", "EKS", "GCP", "Docker", "Kubernetes", "CI/CD Pipelines", "Node.js/Express", "FastAPI", "RESTful APIs", "Distributed Microservices", "Database Management PostgreSQL", "MongoDB", "Redis"], "photo": "https://lh3.googleusercontent.com/d/1D5GUX4rwR2aCeMeD1U2Oegq6e0qIshgy"},
  {"id": 56, "c": 5, "name": "Fernando Woolcott", "school": "Columbia University", "major": "Computer Science"},
  {"id": 57, "c": 5, "name": "Javier Hernandez", "school": "LaGuardia Community College", "major": "Computer Science"},
  {"id": 58, "c": 5, "name": "Jericho Faderon", "school": "Lehman College", "major": "Computer Science"},
  {"id": 59, "c": 5, "name": "Kay Kay Zin", "school": "LaGuardia Community College", "major": "Business Administration"},
  {"id": 60, "c": 5, "name": "Kayla Greene", "school": "Other", "major": "Communications"},
  {"id": 61, "c": 5, "name": "Miskatul Moon", "school": "Hunter College", "major": "Computer Science"},
  {"id": 62, "c": 5, "name": "Opinderjit Kaur (Amy)", "school": "LaGuardia Community College", "major": "Electrical Engineering"},
  {"id": 63, "c": 5, "name": "Osadebamwen Imade", "school": "Hunter College", "major": "Computer Science and Economics"},
  {"id": 64, "c": 5, "name": "Ruckshada Khan", "school": "Hunter College", "major": "Computer Science"},
  {"id": 65, "c": 5, "name": "Qingquan Li", "school": "Brooklyn College", "major": "Computer Science"}
];

function inferFocus(p) {
  const t = `${p.major || ""} ${p.role || ""}`.toLowerCase();
  if (/(cyber|security)/.test(t)) return "Cybersecurity";
  if (/(data|analyt)/.test(t)) return "Data";
  if (/(ux|ui|graphic|design|animation|art|creative|multimedia|media|communication design)/.test(t)) return "Design";
  if (/(comput|software|develop|engineer|information systems|information technology|\bit\b|e-business)/.test(t)) return "Software";
  return "Other";
}
const CATEGORIES = ["Software Engineering", "Data", "Design", "Business", "Marketing"];

// Category colors from the Studio Haven palette. The same color fills a selected filter pill
// and tints that category's skill tags (at 60%, as in the Figma "Skill tag" component:
// Purple = Design, Night Sky = Project management, Mellow Yellow = Technical).
export const CAT_COLORS = {
  "Software Engineering": "#564538", // Mellow Yellow (Figma "Technical" tag)
  "Data":                 "#2B6140", // Grass
  "Design":               "#5B2D53", // Purple (Figma "Design" tag)
  "Business":             "#1E474D", // Night Sky (Figma "Project management" tag)
  "Marketing":            "#1F1F1F", // Dirt
};
const catColor = (c) => CAT_COLORS[c] || "#1F1F1F";

// Sub-buckets shown inside each category's dropdown. The final list is still TBD by the team:
// edit labels/patterns here and the dropdowns update. A person matches a sub-bucket if they're
// in that category and the pattern matches their major, role or skills. Empty ones are hidden.
const SUBCATEGORIES = {
  "Software Engineering": [
    ["Computer Science", /computer science/],
    ["Information Systems & IT", /information (systems|technology)|\bit\b|network/],
    ["Cybersecurity", /cyber|security/],
    ["Hardware & Electrical", /electrical|hardware/],
  ],
  "Data": [
    ["Data Science", /data scien/],
    ["Analytics", /analy/],
    ["Machine Learning & AI", /machine learning|\bml\b|pytorch|tensorflow|\bllm/],
  ],
  "Design": [
    ["UI Design", /\bui\b|interface/],
    ["UX Research", /\bux\b|user experience|research/],
    ["Graphic & Visual", /graphic|visual|imag|\bart\b/],
    ["Digital Media", /media|multimedia|communication design/],
  ],
  "Business": [
    ["Finance & Economics", /financ|econom|account/],
    ["Business Administration", /business|administration/],
    ["Law & Real Estate", /\blaw\b|real estate/],
  ],
  "Marketing": [
    ["Communications", /communicat/],
    ["Social & Content", /social media|content|brand/],
  ],
};
const personText = (p) => `${p.major || ""} ${p.role || ""} ${(p.skills || []).join(" ")}`.toLowerCase();
function inferCategory(p) {
  const t = `${p.major || ""} ${p.role || ""} ${(p.skills || []).join(" ")}`.toLowerCase();
  if (/(ux|ui|graphic|design|animation|game|art|creative|multimedia|\bmedia\b)/.test(t)) return "Design";
  if (/(data|analyt|statistic|machine learning|\bml\b)/.test(t)) return "Data";
  if (/(market|social media|\bbrand|content strateg)/.test(t)) return "Marketing";
  if (/(business|finance|econom|account|administration|\bmba\b|real estate|\blaw\b|entrepreneur)/.test(t)) return "Business";
  return "Software Engineering";
}
// The sheet's optional "Category" column wins; blank or unrecognized values fall back to
// automatic sorting. Matching is case-insensitive and accepts short forms like "SWE" or "Software".
const CATEGORY_ALIASES = { swe: "Software Engineering", software: "Software Engineering", engineering: "Software Engineering" };
const sheetCategory = (v) => {
  const t = (v || "").trim().toLowerCase();
  if (!t) return "";
  return CATEGORIES.find((c) => c.toLowerCase() === t) || CATEGORY_ALIASES[t] || "";
};
const withDerived = (p) => ({ ...p, focus: inferFocus(p), category: sheetCategory(p.category) || inferCategory(p) });
const FALLBACK = RAW.map(withDerived);

// The roster for other pages (e.g. homepage testimonials): starts with the inline fallback,
// then swaps in the live Google Sheet once it loads.
export function useAlpacees() {
  const [people, setPeople] = useState(FALLBACK);
  useEffect(() => {
    loadAlpacees()
      .then((rows) => { if (rows.length) setPeople(rows.map(withDerived)); })
      .catch(() => {});
  }, []);
  return people;
}
const first = (name) => name.split(/\s+/)[0];

// Transparent vector logos from the Figma export: dark for light backgrounds, white for dark ones.
const LogoImage = ({ className, white = false }) => (
  <img className={className} src={white ? "/logo-white.svg" : "/logo-dark.svg"} alt="Project Alpaca" />
);
const ImgIcon = ({ s = 26 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#B7B7C0" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" />
  </svg>
);
const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
// name -> initials, and a stable brand color per person (for photo-less cards)
const initials = (name = "") => name.replace(/[(),.]/g, "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const TILE = ["#2B6140", "#1E474D", "#5B2D53", "#564538", "#1F1F1F"]; // Grass, Night Sky, Purple, Mellow Yellow, Dirt
const tileColor = (name = "") => TILE[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % TILE.length];

// headshot: real photo when present, otherwise an initials tile
const PersonPhoto = ({ p, variant }) => (
  p.photo
    ? <img className={`ph ph-${variant} ph-photo`} src={p.photo} alt={p.name} style={p.photoPos ? { objectPosition: p.photoPos } : undefined} />
    : <div className={`ph ph-${variant} ph-initials`} style={{ background: tileColor(p.name) }}>{initials(p.name)}</div>
);
// generic image placeholder (project screenshots — not people)
const Ph = ({ variant }) => <div className={`ph ph-${variant}`}><ImgIcon /></div>;

// photo with graceful fallback: initials tile if there's no photo OR the photo fails to load
function Face({ p, imgClass, tileClass }) {
  const [broken, setBroken] = useState(false);
  if (!p.photo || broken) {
    return <div className={`${imgClass} ${tileClass}`} style={{ background: tileColor(p.name) }}>{initials(p.name)}</div>;
  }
  return <img className={imgClass} src={p.photo} alt={p.name} onError={() => setBroken(true)} style={p.photoPos ? { objectPosition: p.photoPos } : undefined} />;
}

// Hover "action shot": a second photo that fades in over the headshot on hover.
// Comes from the sheet's "Action Shot Link" column; hidden if it fails to load.
function ActionShot({ src }) {
  const [ok, setOk] = useState(true);
  return ok ? <img className="pcard-action" src={src} alt="" loading="lazy" onError={() => setOk(false)} /> : null;
}

function Card({ p, onOpen }) {
  const tags = p.skills?.length ? p.skills.slice(0, 3) : [p.category];
  return (
    <article className="pcard" onClick={() => onOpen(p.id)} tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(p.id)}>
      <Face p={p} imgClass="pcard-photo" tileClass="pcard-initials" />
      {p.action && <ActionShot src={p.action} />}
      <div className="pcard-scrim" />
      <div className="pcard-overlay">
        <h3 className="pcard-name">{p.name}</h3>
        <p className="pcard-role">{p.role ? `${p.role}${p.company ? ` at ${p.company}` : ""}` : `${COHORTS[p.c]?.label ?? ""} · Alpacee`}</p>
        <div className="pcard-tags">{tags.map((s) => <span key={s} className="pcard-tag" style={{ background: catColor(p.category) + "99" }}>{s}</span>)}</div>
      </div>
    </article>
  );
}

// Hand-drawn arrow used on the design's outlined buttons.
export const Squiggle = () => (
  <svg className="squiggle" width="64" height="24" viewBox="0 0 88 32" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 20c10 0 16-14 26-12 7 1.5 5 13-2 11-6-2 2-11 14-10 10 1 22 1 41 1" /><path d="M76 5l9 7-9 7" />
  </svg>
);

// Get Involved, per the Figma directory frame. Photos load from /public/images/get-involved/
// as <key>.jpg, or <key>.png if there's no .jpg; if neither exists, the card shows without a photo.
const GI_CARDS = [
  { key: "support",   title: "Support Us Financially", text: "Donate to fund student stipends, MetroCards, and expert instruction.", bg: "#1E474D", accent: "#FFF767", to: "/donate", cta: "Donate", big: true },
  { key: "partner",   title: "Become Our Partner", text: "Sponsor a cohort, host workspace trips, or hire talented graduates for junior roles.", bg: "#5B2D53", accent: "#63FFA1", to: "/get-involved" },
  { key: "mentor",    title: "Become an Alpaca (Mentor)", text: "Guide an Alpacee 1-on-1 or instruct a class.", bg: "#2B6140", accent: "#FF98ED", to: "/get-involved" },
  { key: "cohort",    title: "Join a Cohort", text: "If you are a student ready to supercharge your tech capabilities, start your application here.", bg: "#1F1F1F", accent: "#FF9586", to: "/flagship" },
  { key: "volunteer", title: "Join as a Volunteer", text: "Lend your skills in administration, event organization, or technical support during events.", bg: "#564538", accent: "#37E3FC", to: "/get-involved" },
];
function GiCard({ c }) {
  const exts = ["jpg", "png"];
  const [ext, setExt] = useState(0); // which extension we're trying; past the end = no photo
  return (
    <Link to={c.to} className={`gi2-card ${c.big ? "gi2-big" : ""}`} style={{ background: c.bg }}>
      {ext < exts.length && <img className="gi2-img" src={`/images/get-involved/${c.key}.${exts[ext]}`} alt="" onError={() => setExt((i) => i + 1)} />}
      <div className="gi2-body">
        <div>
          <h3 style={{ color: c.accent }}>{c.title}</h3>
          <p>{c.text}</p>
        </div>
        <span className="gi2-btn" style={{ color: "#63FFA1" }}>{c.cta && <b>{c.cta}</b>}<Squiggle /></span>
      </div>
    </Link>
  );
}
export function GetInvolved() {
  const [support, partner, mentor, cohort, volunteer] = GI_CARDS;
  return (
    <section className="gi2">
      <div className="gi2-row">
        <GiCard c={support} />
        <div className="gi2-col"><GiCard c={partner} /><GiCard c={mentor} /></div>
      </div>
      <div className="gi2-row"><GiCard c={cohort} /><GiCard c={volunteer} /></div>
    </section>
  );
}

// Shared with the marketing pages; renders the Studio Haven design so every page matches the directory.
export function Newsletter() {
  return <DirNewsletter />;
}

// Marketing-page nav. `overlay` sits it on top of a hero photo (white text), as on the Figma homepage.
// Link order follows the design: Programs, About, Get Involved, Donate.
// `dark` keeps the floating layout but with dark text + dark logo (pages without a photo/color hero, e.g. About).
export function Nav({ overlay = false, dark = false }) {
  return (
    <nav className={`nav ${overlay ? "nav-overlay" : ""} ${dark ? "nav-dark" : ""}`}>
      <Link className="nav-l" to="/" style={{ textDecoration: "none" }}><LogoImage className="nav-logo" white={overlay && !dark} /><span className="nav-name">Project Alpaca</span></Link>
      <div className="nav-r">
        <div className="nav-item">
          <button className="nav-trigger">Programs</button>
          <div className="nav-menu">
            <Link to="/flagship">Flagship Program</Link>
            <Link to="/community-programs">Community Programs</Link>
          </div>
        </div>
        <div className="nav-item">
          <button className="nav-trigger">About</button>
          <div className="nav-menu">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <Link to="/get-involved">Get Involved</Link>
        <Link className="donate-btn" to="/donate">Donate <Squiggle /></Link>
      </div>
    </nav>
  );
}

const SOCIALS = [
  { name: "LinkedIn", url: "https://linkedin.com/company/projectalpaca", path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" },
  { name: "Instagram", url: "https://www.instagram.com/projectalpacany/", path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.12 1.38C1.36 2.67.95 3.34.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.12.66.66 1.33 1.07 2.12 1.38.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.12-1.38.66-.66 1.07-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.12C21.33 1.36 20.66.95 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" },
  { name: "YouTube", url: "https://www.youtube.com/@projectalpacany", path: "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" },
  // Medium is in the design's footer; add the team's Medium URL here to show it.
  { name: "Medium", url: "", path: "M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" },
  { name: "Facebook", url: "https://www.facebook.com/projectalpacany", path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" },
].filter((s) => s.url); // order matches the design footer; entries without a URL are hidden

// Shared with the marketing pages; renders the Studio Haven design so every page matches the directory.
export function Footer() {
  return <DirFooter />;
}

// Directory header, per the Figma: a hire banner, then logo + "Alpacee Directory" label and
// "Meet the Alpacees / See Projects". The marketing pages keep using <Nav />.
function DirHeader({ onHome }) {
  return (
    <>
      <div className="dh-banner">
        Want to hire one of our Alpacees? Reach out to us and we'll make an introduction!{" "}
        <a href="mailto:partnership@projectalpaca.org">Email us</a>
      </div>
      <header className="dh">
        <Link className="dh-brand" to="/directory" onClick={onHome}>
          <LogoImage className="dh-logo" />
          <span>Alpacee Directory</span>
        </Link>
        <nav className="dh-links">
          <Link to="/directory" className="on" onClick={onHome}>Meet the Alpacees</Link>
          <Link to="/flagship">See Projects</Link>
        </nav>
      </header>
    </>
  );
}

const Chevron = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
);

// A category filter pill. Outlined when nothing is picked; filled with the category color once
// something is, and the label lists the picks ("Design: UI Design, UX Research").
function FilterPill({ cat, people, sel, toggle, open, setOpen }) {
  const ref = React.useRef(null);
  const col = catColor(cat);
  const inCat = people.filter((p) => p.category === cat);
  const subs = (SUBCATEGORIES[cat] || [])
    .map(([label, re]) => [label, inCat.filter((p) => re.test(personText(p))).length])
    .filter(([, n]) => n > 0);
  const allKey = `cat:${cat}`;
  const picked = subs.map(([l]) => l).filter((l) => sel.has(`sub:${cat}:${l}`));
  const active = sel.has(allKey) || picked.length > 0;
  const label = picked.length && !sel.has(allKey) ? `${cat}: ${picked.join(", ")}` : cat;
  useEffect(() => {
    if (!open) return;
    const off = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    const esc = (e) => { if (e.key === "Escape") setOpen(null); };
    document.addEventListener("mousedown", off); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", off); document.removeEventListener("keydown", esc); };
  }, [open]);
  const Row = ({ k, text, n }) => {
    const on = sel.has(k);
    return (
      <label className="fp-opt">
        <input type="checkbox" checked={on} onChange={() => toggle(k)} />
        <span className="fp-box" style={on ? { background: col, borderColor: col } : undefined} aria-hidden="true">
          {on && <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5 9-10" /></svg>}
        </span>
        <span className="fp-text">{text}</span><span className="fp-n">{n}</span>
      </label>
    );
  };
  return (
    <div className="fp" ref={ref}>
      <button className={`fp-pill ${active ? "on" : ""}`} aria-expanded={open} onClick={() => setOpen(open ? null : cat)}
        style={active ? { background: col, borderColor: col } : undefined}>
        <span>{label}</span><Chevron />
      </button>
      {open && (
        <div className="fp-menu" role="group" aria-label={`${cat} filters`}>
          <Row k={allKey} text={`All ${cat}`} n={inCat.length} />
          {subs.map(([l, n]) => <Row key={l} k={`sub:${cat}:${l}`} text={l} n={n} />)}
        </div>
      )}
    </div>
  );
}

// Page list with gaps, like the design's "1 2 3 … 5 6".
function pageList(cur, total) {
  const keep = new Set([1, 2, total - 1, total, cur - 1, cur, cur + 1].filter((n) => n >= 1 && n <= total));
  const out = []; let prev = 0;
  [...keep].sort((a, b) => a - b).forEach((n) => {
    if (n - prev === 2) out.push(n - 1);            // a gap of one page: just show that page
    else if (n - prev > 2) out.push("gap-" + n);    // a real gap: "…"
    out.push(n); prev = n;
  });
  return out;
}
const PgArrow = ({ left }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{left ? <path d="M19 12H5M11 6l-6 6 6 6" /> : <path d="M5 12h14M13 6l6 6-6 6" />}</svg>
);

function DirNewsletter() {
  return (
    <section className="dn">
      <div className="dn-l">
        <div className="dn-head"><h2>Newsletter</h2><img className="dn-letter" src="/images/home/illustrations/letter.png" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} /></div>
        <p>Subscribe to the Project Alpaca newsletter to stay up to date on our programs, community events, student stories, and ways to get involved.</p>
      </div>
      <form className="dn-r" onSubmit={(e) => e.preventDefault()}>
        <div className="dn-row">
          <input aria-label="First name" placeholder="First Name" />
          <input aria-label="Last name" placeholder="Last Name" />
        </div>
        <input aria-label="Email" type="email" placeholder="Email" />
        <button type="submit" className="dn-btn">Subscribe <Squiggle /></button>
      </form>
    </section>
  );
}

function DirFooter() {
  const cols = [
    ["Project Alpaca", [["About", "/about"], ["Latest News", "#"], ["Annual Reports", "#"], ["Privacy Policy", "#"], ["Terms of Service", "#"], ["Cookie Settings", "#"]]],
    ["Programs", [["Flagship Program", "/flagship"], ["Community Programs", "/community-programs"]]],
    ["Get Involved", [["Meet our Alpacees", "/directory"], ["Mentor our Alpacees", "/get-involved"], ["Become our Partner", "/get-involved"], ["Volunteer with Us", "/get-involved"], ["Support Our Work", "/donate"], ["Mentor Guide", "#"], ["Sponsorship Guide", "#"]]],
    ["Questions?", [["Contact Us", "/contact"], ["FAQs", "#"]]],
  ];
  return (
    <footer className="df">
      <div className="df-top">
        <LogoImage className="df-logo" white />
        <div className="df-cols">
          {cols.map(([h, links]) => (
            <div key={h} className="df-col">
              <h4>{h}</h4>
              {links.map(([l, to]) => (to.startsWith("/") ? <Link key={l} to={to}>{l}</Link> : <a key={l} href={to}>{l}</a>))}
            </div>
          ))}
        </div>
      </div>
      <div className="df-bottom">
        <div className="df-row">
          <div className="df-social">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name}>
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <img className="df-badge" src="/images/candid-platinum-2023.png" alt="Candid Platinum Transparency 2023" />
        </div>
        <div className="df-legal">
          <span>©Copyright Project Alpaca {new Date().getFullYear()}. All rights reserved.</span>
          <span>Designed by Studio Haven</span>
        </div>
      </div>
    </footer>
  );
}

// Graduation year as shown on the profile. The sheet holds free text ("2023", "Fall 2023",
// "2022 (From BMCC, moving onto senior college)", "Graduated"), so keep "Season YYYY" or
// the first year, and drop anything without a year.
function gradLabel(v) {
  const t = String(v || "");
  const season = t.match(/\b(spring|summer|fall|autumn|winter)\s+((?:19|20)\d{2})\b/i);
  if (season) return `${season[1][0].toUpperCase()}${season[1].slice(1).toLowerCase()} ${season[2]}`;
  const year = t.match(/\b(?:19|20)\d{2}\b/);
  return year ? year[0] : "";
}

const PARTNERSHIP = "partnership@projectalpaca.org";
const introLink = (p) => `mailto:${PARTNERSHIP}?subject=${encodeURIComponent(`Introduction to ${p.name}`)}`;
const iconPath = (name) => SOCIALS.find((s) => s.name === name)?.path;
const GITHUB_PATH = "M12 .3a12 12 0 0 0-3.8 23.38c.6.1.82-.26.82-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3";
const href = (u) => (/^https?:\/\//i.test(u) ? u : `https://${u}`);
// Social icons under the profile buttons, per the design. Only links present in the sheet show.
function profileLinks(p) {
  const out = [];
  if (p.linkedin) out.push({ label: "LinkedIn", url: p.linkedin, path: iconPath("LinkedIn") });
  if (p.github) out.push({ label: "GitHub", url: p.github, path: GITHUB_PATH });
  if (p.portfolio) out.push({ label: "Website / portfolio", url: p.portfolio, globe: true });
  if (p.social) {
    const yt = /youtu/i.test(p.social);
    out.push({ label: yt ? "YouTube" : "Instagram", url: p.social, path: iconPath(yt ? "YouTube" : "Instagram") });
  }
  return out;
}
const PfSection = ({ title, children }) => (
  <section className="pf-sec"><h2 className="pf-sec-title">{title}</h2><div className="pf-sec-body">{children}</div></section>
);

// Profile page, per the Studio Haven design (Figma "Directory - Profile", 1158:7075).
function Profile({ p, all, onOpen, onBack }) {
  const similar = (all || []).filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const tags = p.skills?.length ? p.skills : [p.category];
  const col = catColor(p.category);
  const links = profileLinks(p);
  return (
    <div className="pf">
      <button className="pf-back" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 4l-8 8 8 8" /></svg>
        Back to directory
      </button>
      <div className="pf-grid">
        <aside className="pf-side">
          <Face p={p} imgClass="pf-photo" tileClass="pf-photo-initials" />
          <div className="pf-info">
            <PfSection title="Education">
              <p className="pf-line"><b>{p.school || "—"}</b>{gradLabel(p.grad) && <i>{gradLabel(p.grad)}</i>}</p>
              {p.major && <p className="pf-text">{p.major}</p>}
            </PfSection>
            {/* Only with a company: without one, the role alone just repeats the line under the name. */}
            {p.company && (
              <PfSection title="Experience">
                <p className="pf-line"><b>{p.company}</b></p>
                {p.role && <p className="pf-text">{p.role}</p>}
              </PfSection>
            )}
          </div>
        </aside>

        <main className="pf-main">
          <div className="pf-top">
            <div className="pf-eyebrow">Flagship Program • {COHORTS[p.c]?.label ?? "Alpacee"}</div>
            <div className="pf-head">
              <div className="pf-id">
                <h1 className="pf-name">{p.name}</h1>
                <p className="pf-role">{p.role ? `${p.role}${p.company ? ` at ${p.company}` : ""}` : "Alpacee at Project Alpaca"}</p>
                <div className="pf-tags">{tags.map((t) => <span key={t} className="pf-tag" style={{ background: col }}>{t}</span>)}</div>
              </div>
              <div className="pf-actions">
                <a className="pf-btn pf-btn-lime" href={introLink(p)}>Contact <Squiggle /></a>
                {p.resume && <a className="pf-btn pf-btn-line" href={p.resume} target="_blank" rel="noreferrer">Download Resume</a>}
                {links.length > 0 && (
                  <div className="pf-social">
                    {links.map((l) => (
                      <a key={l.label} href={href(l.url)} target="_blank" rel="noreferrer" aria-label={`${first(p.name)}'s ${l.label}`}>
                        {l.globe
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9.5" /><path d="M2.5 12h19M12 2.5c2.6 2.8 3.9 6 3.9 9.5s-1.3 6.7-3.9 9.5c-2.6-2.8-3.9-6-3.9-9.5S9.4 5.3 12 2.5z" /></svg>
                          : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={l.path} /></svg>}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <PfSection title="About">
            <p className="pf-body">{p.bio || "Bio coming soon."}</p>
          </PfSection>

          <PfSection title="Project Showcase">
            <div className="pf-project-empty">Project write-up and gallery coming soon.</div>
          </PfSection>

          {p.quote && (
            <PfSection title="Recommendations">
              <blockquote className="pf-quote">“{p.quote}”</blockquote>
              <div className="pf-author"><span>{p.name}</span><span>{COHORTS[p.c]?.label ?? ""} · Project Alpaca</span></div>
            </PfSection>
          )}

          <div className="pf-hire">
            <p>Interested in hiring {first(p.name)}?<br />Project Alpaca will make an introduction for you.</p>
            <a className="pf-btn pf-btn-lime" href={introLink(p)}>Contact <Squiggle /></a>
          </div>
        </main>
      </div>

      {similar.length > 0 && (
        <div className="pf-similar">
          <PfSection title="Other Alpacees with similar skills">
            <div className="pf-sim-grid">
              {similar.map((s) => (
                <button key={s.id} className="pf-sim" onClick={() => onOpen(s.id)}>
                  <Face p={s} imgClass="pf-sim-photo" tileClass="pf-sim-initials" />
                  <span className="pf-sim-info"><b>{s.name}</b><span>{s.role ? `${s.role}${s.company ? ` at ${s.company}` : ""}` : "Alpacee at Project Alpaca"}</span></span>
                </button>
              ))}
            </div>
          </PfSection>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(() => new Set()); // "cat:<Category>" or "sub:<Category>:<Sub-bucket>"
  const [openPill, setOpenPill] = useState(null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [people, setPeople] = useState(FALLBACK);
  const PER_PAGE = 12;

  useEffect(() => {
    loadAlpacees()
      .then((rows) => { if (rows.length) setPeople(rows.map(withDerived)); })
      .catch((err) => console.warn("Using inline roster —", err.message));
  }, []);

  const toggle = (k) => setSel((cur) => { const n = new Set(cur); n.has(k) ? n.delete(k) : n.add(k); return n; });
  // Selections combine with OR: a person shows if they match any picked category or sub-bucket.
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return people.filter((p) => {
      if (term && !p.name.toLowerCase().includes(term)) return false;
      if (!sel.size || sel.has(`cat:${p.category}`)) return true;
      const t = personText(p);
      return (SUBCATEGORIES[p.category] || []).some(([l, re]) => sel.has(`sub:${p.category}:${l}`) && re.test(t));
    });
  }, [q, sel, people]);
  useEffect(() => { setPage(1); }, [q, sel]);
  const goPage = (n) => { setPage(n); window.scrollTo(0, 0); };

  // Profiles are in-app state (not routes), so the browser never resets scroll on its own.
  // Jump to the top whenever a profile opens, a "similar" profile is picked, or we go back.
  useEffect(() => { window.scrollTo(0, 0); }, [selected]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageClamped = Math.min(page, totalPages);
  const pageItems = filtered.slice((pageClamped - 1) * PER_PAGE, pageClamped * PER_PAGE);
  const person = people.find((p) => p.id === selected);
  // Tab title: the directory, or the open profile's name.
  useEffect(() => {
    document.title = person ? `Project Alpaca - ${person.name}` : "Project Alpaca - Alpacee Directory";
  }, [person]);

  return (
    <div className="root root-dir">
      <DirHeader onHome={() => setSelected(null)} />

      {person ? (
        <Profile p={person} all={people} onOpen={setSelected} onBack={() => setSelected(null)} />
      ) : (
        <>
          <div className="home">
            <p className="intro">Alpacee <i>(Al · pah · key)</i> Directory is a showcase of emerging NYC tech talents by <Link to="/">Project Alpaca</Link>, a 501(c)(3) nonprofit training under-resourced college students and connecting them with mentors, recruiters, and career opportunities.</p>
            <div className="filters">
              <input className="fsearch" aria-label="Search by name" placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
              {CATEGORIES.map((c) => (
                <FilterPill key={c} cat={c} people={people} sel={sel} toggle={toggle} open={openPill === c} setOpen={setOpenPill} />
              ))}
              {(sel.size > 0 || q.trim()) && <button className="clear" onClick={() => { setSel(new Set()); setQ(""); }}>Clear all</button>}
            </div>
            <div className="pgrid">
              {pageItems.length ? pageItems.map((p) => <Card key={p.id} p={p} onOpen={setSelected} />)
                : <div className="empty">No Alpacees match these filters. Try another skill, or clear the filters.</div>}
            </div>
            {totalPages > 1 && (
              <nav className="pager2" aria-label="Pages">
                <button className="pg2-step" style={{ visibility: pageClamped === 1 ? "hidden" : "visible" }} onClick={() => goPage(pageClamped - 1)}><PgArrow left /> Previous</button>
                <div className="pg2-list">
                  {pageList(pageClamped, totalPages).map((n) => typeof n === "string"
                    ? <span key={n} className="pg2-gap">…</span>
                    : <button key={n} className={`pg2-num ${n === pageClamped ? "on" : ""}`} aria-current={n === pageClamped ? "page" : undefined} onClick={() => goPage(n)}>{n}</button>)}
                </div>
                <button className="pg2-step" style={{ visibility: pageClamped === totalPages ? "hidden" : "visible" }} onClick={() => goPage(pageClamped + 1)}>Next <PgArrow /></button>
              </nav>
            )}
          </div>
          <GetInvolved />
          <DirNewsletter />
        </>
      )}
      <DirFooter />
    </div>
  );
}
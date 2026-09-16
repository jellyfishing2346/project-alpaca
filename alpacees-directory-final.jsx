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
function inferCategory(p) {
  const t = `${p.major || ""} ${p.role || ""} ${(p.skills || []).join(" ")}`.toLowerCase();
  if (/(ux|ui|graphic|design|animation|game|art|creative|multimedia|\bmedia\b)/.test(t)) return "Design";
  if (/(data|analyt|statistic|machine learning|\bml\b)/.test(t)) return "Data";
  if (/(market|social media|\bbrand|content strateg)/.test(t)) return "Marketing";
  if (/(business|finance|econom|account|administration|\bmba\b|real estate|\blaw\b|entrepreneur)/.test(t)) return "Business";
  return "Software Engineering";
}
const withDerived = (p) => ({ ...p, focus: inferFocus(p), category: inferCategory(p) });
const FALLBACK = RAW.map(withDerived);
const first = (name) => name.split(/\s+/)[0];

const LogoImage = ({ className }) => (
  <img className={className} src="/project-alpaca-logo.png" alt="Project Alpaca" />
);
const ImgIcon = ({ s = 26 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#B7B7C0" strokeWidth="1.6">
    <rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" />
  </svg>
);
const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
// headshot: real photo when present, otherwise your imported avatar placeholder
const PersonPhoto = ({ p, variant }) => (
  <img className={`ph ph-${variant} ph-photo`} src={p.photo || avatarPlaceholder} alt={p.name} />
);
// generic image placeholder (project screenshots — not people)
const Ph = ({ variant }) => <div className={`ph ph-${variant}`}><ImgIcon /></div>;

function Card({ p, onOpen }) {
  const tags = p.skills?.length ? p.skills.slice(0, 3) : [p.category];
  return (
    <article className="pcard" onClick={() => onOpen(p.id)} tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(p.id)}>
      <img className="pcard-photo" src={p.photo || avatarPlaceholder} alt={p.name} />
      <span className="pcard-badge"><span className="dot-green" /> Open to opportunities</span>
      <div className="pcard-scrim" />
      <div className="pcard-overlay">
        <h3 className="pcard-name">{p.name}</h3>
        <p className="pcard-role">{p.role || `${COHORTS[p.c]?.label ?? ""} · Alpacee`}</p>
        <div className="pcard-tags">{tags.map((s) => <span key={s} className="pcard-tag">{s}</span>)}</div>
      </div>
    </article>
  );
}

function GetInvolved() {
  const items = [
    { t: "Support Us Financially", d: "Sponsor a cohort, host workspace trips, or hire talented graduates for junior roles.", k: "coral" },
    { t: "Become Our Partner", d: "Build a tailored alliance to support early-career tech talent.", k: "navy" },
    { t: "Become an Alpaca (Mentor)", d: "Guide an Alpacee 1-on-1 or instruct a class.", k: "green" },
    { t: "Join as a Volunteer", d: "Lend your skills in administration, events, or technical support.", k: "wool" },
  ];
  return (
    <section className="gi">
      <h2 className="section-h">Get Involved</h2>
      <div className="gi-grid">
        {items.map((i) => (
          <div key={i.t} className={`gi-card gi-${i.k}`}>
            <h3>{i.t}</h3><p>{i.d}</p><span className="gi-arrow"><Arrow /></span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Newsletter() {
  return (
    <section className="news">
      <div className="news-l"><h2>Newsletter</h2>
        <p>Subscribe to the Project Alpaca newsletter to stay up to date on our programs, community events, student stories, and ways to get involved.</p>
      </div>
      <div className="news-r">
        <div className="news-row"><input placeholder="First Name" /><input placeholder="Last Name" /></div>
        <input placeholder="Email" />
        <button className="btn-green">Subscribe <Arrow /></button>
      </div>
    </section>
  );
}

export function Nav() {
  return (
    <nav className="nav">
      <Link className="nav-l" to="/" style={{ textDecoration: "none" }}><LogoImage className="nav-logo" /><span className="nav-name">Project Alpaca</span></Link>
      <div className="nav-r">
        <div className="nav-item">
          <button className="nav-trigger">Programs ▾</button>
          <div className="nav-menu">
            <Link to="/flagship">Flagship Program</Link>
            <Link to="/community-programs">Community Programs</Link>
          </div>
        </div>
        <Link to="/get-involved">Get Involved</Link>
        <div className="nav-item">
          <button className="nav-trigger">About ▾</button>
          <div className="nav-menu">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <Link className="donate-btn" to="/donate">Donate</Link>
      </div>
    </nav>
  );
}

export function Footer() {
  const cols = [
    ["Explore", [["Flagship Program", "/flagship"], ["Community Programs", "/community-programs"], ["Meet our Alpacees", "/directory"], ["Mentor our Alpacees", "/get-involved"], ["Become our Partner", "/get-involved"], ["Volunteer with Us", "/get-involved"]]],
    ["Resources", [["Annual Reports", "#"], ["Student Work", "/directory"], ["Mentor Guide", "#"], ["Sponsorship Guide", "#"], ["Latest News", "#"], ["FAQs", "#"]]],
    ["Legal", [["Privacy Policy", "#"], ["Terms of Service", "#"], ["Cookie Settings", "#"], ["Nondiscrimination", "#"], ["IRS 501(c)(3) Status", "#"], ["Donor Rights", "#"]]],
  ];
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <LogoImage className="footer-logo" />
          <div className="footer-contact">
            <b>Project Alpaca</b>
            <p>Email: hello@projectalpaca.org<br />Address: 123 Main St, New York, NY</p>
            <p>Partnerships: partnership@projectalpaca.org<br />Inquiries: hello@projectalpaca.org</p>
          </div>
        </div>
        <div className="footer-cols">
          {cols.map(([h, links]) => (
            <div key={h} className="footer-col">
              <h4>{h}</h4>
              {links.map(([l, to]) => (to.startsWith("/") ? <Link key={l} to={to}>{l}</Link> : <a key={l} href={to}>{l}</a>))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Project Alpaca. All rights reserved.</span>
        <span className="footer-social">
          {["in", "ig", "yt", "f"].map((s) => <a key={s} href="#" aria-label={s}>{s}</a>)}
        </span>
      </div>
    </footer>
  );
}

function Profile({ p, all, onOpen, onBack }) {
  const similar = (all || []).filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const tags = p.skills?.length ? p.skills : [p.focus];
  return (
    <div className="np">
      <button className="np-back" onClick={onBack}>← Back to directory</button>
      <div className="np-grid">
        <aside className="np-side">
          <img className="np-photo" src={p.photo || avatarPlaceholder} alt={p.name} />
          <div>
            <div className="np-label">Education</div>
            <p className="np-line"><b>{p.school || "—"}</b>{p.grad ? ` · ${p.grad}` : ""}</p>
            {p.major && <p className="np-sub">{p.major}</p>}
          </div>
          {(p.company || p.role) && (
            <div>
              <div className="np-label">Experience</div>
              <p className="np-line"><b>{p.company || p.role}</b></p>
              {p.company && p.role && <p className="np-sub">{p.role}</p>}
            </div>
          )}
        </aside>

        <main className="np-main">
          <div className="np-kicker">{COHORTS[p.c]?.label ?? "Alpacee"}{p.category ? ` · ${p.category}` : ""}</div>
          <div className="np-head">
            <div>
              <h1 className="np-name">{p.name} <span className="np-open"><span className="dot-green" /> Open to opportunities</span></h1>
              <p className="np-role">{p.role ? `${p.role}${p.company ? ` at ${p.company}` : ""}` : "Alpacee at Project Alpaca"}</p>
              <div className="np-tags">{tags.map((s) => <span key={s} className="np-tag">{s}</span>)}</div>
            </div>
            <div className="np-actions">
              {p.linkedin
                ? <a className="btn-green" href={p.linkedin} target="_blank" rel="noreferrer">Contact <Arrow /></a>
                : <button className="btn-green" disabled>Contact <Arrow /></button>}
              {p.resume && <a className="np-resume" href={p.resume} target="_blank" rel="noreferrer">Download résumé ⌄</a>}
            </div>
          </div>

          <div className="np-section">
            <div className="np-label">About</div>
            <p className="np-body">{p.bio || p.quote || "Bio coming soon."}</p>
          </div>

          <div className="np-section">
            <div className="np-label">Project Showcase</div>
            <div className="np-project">Project write-up + gallery — pending content in the sheet.</div>
          </div>

          {(p.quote || p.bio) && (
            <div className="np-section">
              <div className="np-label">Recommendations</div>
              <blockquote className="np-quote">“{p.quote || p.bio}”</blockquote>
              <div className="np-attr"><b>{p.name}</b><span>{COHORTS[p.c]?.label ?? ""} · Project Alpaca</span></div>
            </div>
          )}

          <div className="np-hire">
            <div><b>Interested in hiring {first(p.name)}?</b><br />Project Alpaca will make an introduction for you.</div>
            {p.linkedin
              ? <a className="btn-green" href={p.linkedin} target="_blank" rel="noreferrer">Contact <Arrow /></a>
              : <button className="btn-green" disabled>Contact <Arrow /></button>}
          </div>
        </main>
      </div>

      {similar.length > 0 && (
        <div className="np-similar">
          <div className="np-label">Other Alpacees with similar skills</div>
          <div className="np-similar-grid">
            {similar.map((s) => (
              <button key={s.id} className="np-sim" onClick={() => onOpen(s.id)}>
                <img src={s.photo || avatarPlaceholder} alt={s.name} />
                <div><b>{s.name}</b><span>{s.role || "Alpacee at Project Alpaca"}</span></div>
              </button>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function App() {
  const [q, setQ] = useState("");
  const [cats, setCats] = useState([]);
  const [selected, setSelected] = useState(null);
  const [people, setPeople] = useState(FALLBACK);

  useEffect(() => {
    loadAlpacees()
      .then((rows) => { if (rows.length) setPeople(rows.map(withDerived)); })
      .catch((err) => console.warn("Using inline roster —", err.message));
  }, []);

  const toggleCat = (c) => setCats((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return people.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if (term && !p.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [q, cats, people]);
  const person = people.find((p) => p.id === selected);

  return (
    <div className="root">
      <Nav />

      {person ? (
        <Profile p={person} all={people} onOpen={setSelected} onBack={() => setSelected(null)} />
      ) : (
        <div className="home">
          <p className="intro"><b>Alpacee</b> (Al·puh·kee) Directory is a showcase of emerging NYC tech talent by Project Alpaca, a 501(c)(3) nonprofit training under-resourced college students and connecting them with mentors, recruiters, and career opportunities.</p>
          <div className="filters">
            <input className="fsearch" placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
            {CATEGORIES.map((c) => (
              <button key={c} className={`cat ${cats.includes(c) ? "cat-on" : ""}`} onClick={() => toggleCat(c)}>{c}</button>
            ))}
            {cats.length > 0 && <button className="clear" onClick={() => setCats([])}>Clear all</button>}
          </div>
          <div className="pgrid">
            {filtered.length ? filtered.map((p) => <Card key={p.id} p={p} onOpen={setSelected} />)
              : <div className="empty">No matches. Try a different name or category.</div>}
          </div>
          <GetInvolved />
          <Newsletter />
          <Footer />
        </div>
      )}
    </div>
  );
}
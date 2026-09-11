import React, { useState, useMemo, useEffect } from "react";
import { loadAlpacees } from "./sheet.js";
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
  {"id": 19, "c": 3, "name": "Sukhdeep Singh", "school": "Hunter College", "major": "Computer Science", "grad": "2023", "role": "Developer / Analyst"},
  {"id": 20, "c": 3, "name": "Maggie Ma", "school": "CUNY Hunter College", "major": "Computer Science", "grad": "2024", "role": "Product Manager", "company": "Kodely", "quote": "Each panelist has a different vibe. It was very comforting, and I learned that anyone can do anything. Some advice I got: build something you like and get it done.", "linkedin": "https://www.linkedin.com/in/maggeema/"},
  {"id": 21, "c": 3, "name": "Candice Arichabala", "school": "Lehman College", "major": "Computer Graphics", "grad": "2023", "role": "Graphic Designer / UX Designer"},
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
  {"id": 55, "c": 5, "name": "Faizan Khan", "school": "Brooklyn College", "major": "Computer Science", "grad": "May 2026", "role": "Software Engineer / TA", "company": "CodePath.org", "bio": "I’m a software engineer who loves the puzzle of turning a complex, abstract problem into a practical tool that people actually enjoy using. While my technical background is rooted in the rigor of building and deploying AI platforms, my real focus is on the human element. I believe technology should serve a clear purpose, namely making lives easier and businesses smarter. For me, success isn't just about writing elegant code or leveraging the latest models. Instead, it’s about collaborating across teams to build robust, scalable solutions that deliver genuine, measurable value to the real world.", "quote": "The combination of collaborative project work and direct access to industry experts helped me sharpen my technical skills and better position myself for competitive fintech roles.", "linkedin": "https://www.linkedin.com/in/faizan-khan234", "portfolio": "https://myportfolio-xi-liart-28.vercel.app", "skills": ["Python", "TypeScript/JavaScript", "Java", "C++", "SQL", "Go", "Rust", "Bash", "PyTorch", "TensorFlow", "Scikit-learn", "LLM Integration", "RAG Pipelines", "Predictive Modeling", "Quantitative Trading Strategies", "Financial Modeling", "Time-series Analysis", "Backtesting Frameworks", "Data Visualization", "AWS EC2", "S3", "Lambda", "EKS", "GCP", "Docker", "Kubernetes", "CI/CD Pipelines", "Node.js/Express", "FastAPI", "RESTful APIs", "Distributed Microservices", "Database Management PostgreSQL", "MongoDB", "Redis"], "photo": "https://lh3.googleusercontent.com/d/1D5GUX4rwR2aCeMeD1U2Oegq6e0qIshgy"},
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
const FALLBACK = RAW.map((p) => ({ ...p, focus: inferFocus(p) }));
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
  return (
    <article className="card">
      <div className="c-status"><span className="dot" /><span>Status</span>
        {p.dupe && <span className="review" title={p.dupe}>needs review</span>}
      </div>
      <PersonPhoto p={p} variant="card" />
      <h3 className="c-name">{p.name}</h3>
      <p className="c-meta">{COHORTS[p.c]?.label ?? "Cohort —"}{p.company ? ` · ${p.company}` : ""}</p>
      <p className="c-role">{p.role || <span className="muted">Role</span>}</p>
      <div className="pills">
        {p.skills?.length
          ? p.skills.slice(0, 4).map((s) => <span key={s} className="pill">{s}</span>)
          : <><span className="pill">{p.focus}</span><span className="pill pill-ghost" title="Skills column is empty in the sheet">+ skills</span></>}
      </div>
      <p className="c-bio">{p.bio || p.quote || <span className="muted">Short intro pending.</span>}</p>
      <button className="viewlink" onClick={() => onOpen(p.id)}>View Profile</button>
    </article>
  );
}

function Profile({ p, onBack }) {
  return (
    <div className="prof">
      <button className="back" onClick={onBack}>← All Alpacees</button>
      <div className="prof-grid">
        <aside className="prof-side">
          <PersonPhoto p={p} variant="prof" />
          <div>
            <div className="side-label">Skills</div>
            <div className="pills">
              {p.skills?.length
                ? p.skills.map((s) => <span key={s} className="pill">{s}</span>)
                : <span className="pill">{p.focus}</span>}
            </div>
            {!p.skills?.length && <p className="pending">Real skill tags pending a Skills column.</p>}
          </div>
          <div>
            <div className="side-label">University</div>
            <p className="side-p">{p.school || "—"}{p.major ? <><br />{p.major}</> : null}{p.grad ? <><br />Class of {p.grad}</> : null}</p>
          </div>
        </aside>

        <main className="prof-main">
          <div className="prof-head">
            <div>
              <h2 className="prof-name">{p.name}<span className="prof-status"><span className="dot" />Status</span></h2>
              <p className="prof-sub">{COHORTS[p.c]?.label ?? ""}</p>
              <p className="prof-role">{p.role ? `${p.role}${p.company ? ` at ${p.company}` : ""}` : <span className="muted">Role</span>}</p>
            </div>
            <div className="prof-actions">
              <button className="btn btn-primary">Contact {first(p.name)} <Arrow /></button>
              <button className="dl" disabled title="No résumé link in the sheet">Download Resume ⌄</button>
            </div>
          </div>

          <p className="prof-about">{p.bio || p.quote || <span className="muted">Bio pending.</span>}</p>

          <h3 className="prof-h">End-of-year Project:</h3>
          <div className="proj-empty">Project write-up + gallery — pending content in the sheet.</div>
          <div className="proj-imgs"><Ph variant="proj" /><Ph variant="proj" /><Ph variant="proj" /></div>
          <button className="btn btn-primary btn-inline" disabled>Read more <Arrow /></button>

          <div className="tcard">
            <span className="tquote">“</span>
            <p className="ttext">{p.quote || "Testimonial pending."}</p>
            <div className="tperson">
              <LogoImage className="tavatar" />
              <div className="tname">{p.name}</div>
              <div className="ttitle">{COHORTS[p.c]?.label ?? "Cohort"} · Project Alpaca</div>
            </div>
            <div className="tdots"><span className="td on" /><span className="td" /><span className="td" /><span className="td" /><span className="td" /></div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [q, setQ] = useState("");
  const [foci, setFoci] = useState([]);
  const [cohort, setCohort] = useState("all");
  const [selected, setSelected] = useState(null);
  const [people, setPeople] = useState(FALLBACK);

  useEffect(() => {
    loadAlpacees()
      .then((rows) => { if (rows.length) setPeople(rows.map((p) => ({ ...p, focus: inferFocus(p) }))); })
      .catch((err) => console.warn("Using inline roster —", err.message));
  }, []);

  const FOCI = useMemo(() => [...new Set(people.map((p) => p.focus))].sort(), [people]);

  const toggleFocus = (f) => setFoci((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]));
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return people.filter((p) => {
      if (cohort !== "all" && String(p.c) !== cohort) return false;
      if (foci.length && !foci.includes(p.focus)) return false;
      if (term && !p.name.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [q, foci, cohort, people]);
  const person = people.find((p) => p.id === selected);

  return (
    <div className="root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing:border-box; }
        .root { font-family:'Inter',system-ui,sans-serif; background:#FFFFFF; color:#23232A; min-height:100vh; }
        .muted { color:#9A9AA2; }
        .dot { width:9px; height:9px; border-radius:50%; background:${NAVY}; display:inline-block; }

        .nav { display:flex; align-items:center; justify-content:space-between; padding:15px 40px;
          background:#EAEAEE; border-bottom:1px solid #DEDEE3; }
        .nav-l { display:flex; align-items:center; gap:11px; }
        .nav-logo { height:38px; width:auto; display:block; }
        .hire-logo { width:74px; height:74px; border-radius:50%; object-fit:contain; margin:0 auto 14px; display:block; }
        .nav-name { font-size:13.5px; font-weight:500; color:#3A3A42; }
        .donate { background:${NAVY}; color:#fff; border:0; padding:9px 22px; border-radius:999px; font:inherit; font-weight:600; font-size:13.5px; cursor:pointer; }

        .layout { display:grid; grid-template-columns:222px 1fr; gap:40px; max-width:1180px; margin:0 auto; padding:34px 40px; }
        .side { position:sticky; top:20px; align-self:start; display:flex; flex-direction:column; gap:24px; }
        .fg h4 { font-size:14px; font-weight:700; margin:0 0 9px; }
        .input { width:100%; padding:10px 12px; border:1px solid #D8D8DE; border-radius:8px; font:inherit; font-size:13.5px; }
        .input:focus { outline:2px solid ${NAVY}; outline-offset:1px; border-color:transparent; }
        .check { display:flex; align-items:center; gap:9px; font-size:13.5px; color:#3B3B42; padding:3.5px 0; cursor:pointer; }
        .check input { accent-color:${NAVY}; width:15px; height:15px; }
        .select { width:100%; padding:9px 12px; border:1px solid #D8D8DE; border-radius:8px; font:inherit; font-size:13.5px; background:#fff; }
        .pending { font-size:11px; color:#A6A6AE; margin:6px 0 0; }

        .hire { border:1px solid #E3E3E8; border-radius:14px; padding:20px 18px; }
        .hire .ph { width:74px; height:74px; border-radius:50%; margin:0 auto 14px; }
        .hire p { font-size:13px; line-height:1.5; color:#3B3B42; margin:0 0 15px; }

        .main-title { font-size:13px; color:#8A8A92; margin:0 0 18px; }
        .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:22px; }
        .card { border:1px solid #E3E3E8; border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:8px; }
        .c-status { display:flex; align-items:center; gap:8px; font-size:12.5px; color:#3B3B42; font-weight:500; }
        .review { margin-left:auto; font-size:10px; color:#B26A00; background:#FBF2E4; padding:2px 7px; border-radius:6px; }

        .ph { background:#EFEFF2; border:1px solid #E7E7EC; display:flex; align-items:center; justify-content:center; overflow:hidden; }
        .ph-photo { object-fit:cover; padding:0; }
        .ph-card { aspect-ratio:1/1; border-radius:8px; }
        .ph-prof { aspect-ratio:1/1; border-radius:10px; }
        .ph-proj { aspect-ratio:4/3; border-radius:8px; }

        .c-name { font-size:16px; font-weight:700; margin:4px 0 0; }
        .c-meta { font-size:12.5px; color:#6B6B73; margin:0; }
        .c-role { font-size:13px; color:#33333A; margin:0; }
        .pills { display:flex; flex-wrap:wrap; gap:7px; margin:2px 0; }
        .pill { font-size:11.5px; padding:4px 11px; border-radius:999px; background:#F1F1F4; border:1px solid #E4E4EA; color:#4A4A52; }
        .pill-ghost { background:transparent; border:1px dashed #D4D4DC; color:#A6A6AE; }
        .c-bio { font-size:12.5px; line-height:1.5; color:#54545C; margin:2px 0 0;
          display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .viewlink { margin-top:10px; align-self:center; background:none; border:0; color:${NAVY}; font:inherit; font-size:13.5px; font-weight:600; cursor:pointer; }

        .empty { grid-column:1/-1; text-align:center; padding:60px; color:#8A8A92; }

        .btn { display:inline-flex; align-items:center; gap:8px; background:${NAVY}; color:#fff; border:0;
          padding:10px 18px; border-radius:999px; font:inherit; font-weight:600; font-size:13px; cursor:pointer; }
        .btn:disabled { opacity:.55; cursor:default; }

        .prof { max-width:940px; margin:0 auto; padding:32px 40px; }
        .back { background:none; border:0; color:${NAVY}; font:inherit; font-weight:600; cursor:pointer; margin-bottom:22px; padding:0; }
        .prof-grid { display:grid; grid-template-columns:280px 1fr; gap:40px; }
        .prof-side { display:flex; flex-direction:column; gap:22px; }
        .side-label { font-size:10.5px; font-weight:700; letter-spacing:.09em; text-transform:uppercase; color:#9A9AA2; margin-bottom:9px; }
        .side-p { font-size:14px; line-height:1.55; color:#33333A; margin:0; }

        .prof-head { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; margin-bottom:18px; }
        .prof-name { font-size:26px; font-weight:700; margin:0 0 6px; display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
        .prof-status { display:inline-flex; align-items:center; gap:7px; font-size:13px; font-weight:500; color:#6B6B73; }
        .prof-sub { font-size:13.5px; color:#6B6B73; margin:0; }
        .prof-role { font-size:14px; color:#33333A; margin:3px 0 0; }
        .prof-actions { display:flex; flex-direction:column; align-items:flex-end; gap:12px; flex:none; }
        .dl { background:none; border:0; color:${NAVY}; font:inherit; font-weight:600; font-size:13px; opacity:.55; cursor:default; }
        .prof-about { font-size:15px; line-height:1.65; color:#3B3B42; margin:14px 0 26px; max-width:66ch; }
        .prof-h { font-size:19px; font-weight:700; margin:0 0 12px; }
        .proj-empty { border:1px dashed #D6D6DE; border-radius:12px; padding:18px; font-size:13px; color:#8A8A92; background:#FBFBFC; margin-bottom:16px; }
        .proj-imgs { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:18px; }
        .prof-main .btn-inline { margin-bottom:30px; }

        .tcard { background:#F4F4F6; border:1px solid #EAEAEE; border-radius:16px; padding:34px 30px 26px; position:relative; text-align:center; }
        .tquote { position:absolute; left:24px; top:14px; font-size:48px; color:#C4C4CC; font-family:Georgia,serif; line-height:1; }
        .ttext { font-size:15px; line-height:1.6; color:#3B3B42; max-width:60ch; margin:0 auto 20px; }
        .tperson { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .tavatar { width:44px; height:44px; border-radius:50%; border:1px solid #D4D4DC; object-fit:contain; padding:7px; display:block; margin-bottom:4px; }
        .tname { font-size:13.5px; font-weight:600; }
        .ttitle { font-size:12px; color:#8A8A92; }
        .tdots { display:flex; gap:7px; justify-content:center; margin-top:16px; }
        .td { width:8px; height:8px; border-radius:50%; background:#CFCFD6; }
        .td.on { background:${NAVY}; }

        @media (max-width:860px){ .layout{grid-template-columns:1fr;} .side{position:static;} .prof-grid{grid-template-columns:1fr;} .prof-head{flex-direction:column;} .prof-actions{align-items:flex-start;} }
      `}</style>

      <nav className="nav">
        <div className="nav-l"><LogoImage className="nav-logo" /><span className="nav-name">Alpacee Directory</span></div>
        <button className="donate">Donate</button>
      </nav>

      {person ? (
        <Profile p={person} onBack={() => setSelected(null)} />
      ) : (
        <div className="layout">
          <aside className="side">
            <div className="fg"><h4>Search</h4>
              <input className="input" placeholder="Search by name" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <div className="fg"><h4>Skills</h4>
              {FOCI.map((f) => (
                <label key={f} className="check"><input type="checkbox" checked={foci.includes(f)} onChange={() => toggleFocus(f)} /> {f}</label>
              ))}
              <p className="pending">Inferred from major/role — placeholder for a real Skills field.</p>
            </div>
            <div className="fg"><h4>Open to opportunities</h4>
              <label className="check"><input type="checkbox" disabled /> Open</label>
              <label className="check"><input type="checkbox" disabled /> Not at the moment</label>
              <p className="pending">Needs a new sheet column — no data yet.</p>
            </div>
            <div className="fg"><h4>Cohort year</h4>
              <select className="select" value={cohort} onChange={(e) => setCohort(e.target.value)}>
                <option value="all">All</option>
                {Object.entries(COHORTS).map(([k, v]) => <option key={k} value={k}>{v.label} ({v.years})</option>)}
              </select>
            </div>
            <div className="hire">
              <LogoImage className="hire-logo" />
              <p>Want to hire one of our Alpacees? Reach out to us and we'll make an introduction!</p>
              <button className="btn">Contact <Arrow /></button>
            </div>
          </aside>

          <main>
            <p className="main-title">{filtered.length} {filtered.length === 1 ? "Alpacee" : "Alpacees"}</p>
            <div className="grid">
              {filtered.length ? filtered.map((p) => <Card key={p.id} p={p} onOpen={setSelected} />)
                : <div className="empty">No matches. Try a different name, skill, or cohort.</div>}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

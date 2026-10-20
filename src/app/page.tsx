"use client";

import { useState } from "react";

type Role = "Student" | "Teacher" | "HOD";

const practiceTests = [
  {
    title: "Normalization sprint",
    topic: "Normalization",
    meta: "20 questions · 30 min",
    level: "Medium",
  },
  {
    title: "ER model foundations",
    topic: "ER Model",
    meta: "15 questions · 20 min",
    level: "Easy",
  },
  {
    title: "Transaction control",
    topic: "Transactions",
    meta: "10 questions · 15 min",
    level: "Hard",
  },
];

const roleNavigation: Record<Role, string[]> = {
  Student: ["Overview", "Practice tests", "My subjects", "My analytics"],
  Teacher: [
    "Overview",
    "Practice tests",
    "Subjects & syllabus",
    "Secure examinations",
    "Performance",
  ],
  HOD: ["Release overview", "Release queue", "Audit trail", "Exam history"],
};

export default function Home( ) {
  const [role, setRole] = useState<Role>("Teacher");
  const [activePage, setActivePage] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = roleNavigation[role];

  function changeRole(newRole: Role) {
    setRole(newRole);
    setActivePage(roleNavigation[newRole][0]);
    setMobileOpen(false);
  }

  function startPractice(title: string) {
    window.alert(`${title} selected. Practice workflow will be connected later.`);
  }

  function renderPageContent() {
    if (activePage === "Subjects & syllabus") {
      return (
        <section className="workspace-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SUBJECTS & SYLLABUS</span>
              <h2>Build your grounded source library</h2>
              <p>
                Upload reference material and prepare it for retrieval-based
                question generation.
              </p>
            </div>
            <span className="status-pill blue">READY</span>
          </div>

          <div className="upload-layout">
            <div className="form-card">
              <label>
                Reference file name
                <input defaultValue="DBMS_2026_reference.pdf" />
              </label>

              <label>
                Extracted academic text
                <textarea
                  rows={7}
                  defaultValue="Normalization organizes relations to reduce redundancy. Functional dependencies define relationships between attributes. Transactions preserve atomicity, consistency, isolation, and durability."
                />
              </label>

              <div className="upload-box">
                <strong>Drop PDF, DOCX, or TXT files</strong>
                <span>
                  Files will later be stored, chunked, and indexed by Member 3.
                </span>
                <button className="outline-button">Choose file</button>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  window.alert("Syllabus indexing will be connected later.")
                }
              >
                Index syllabus with RAG
              </button>
            </div>

            <div className="pipeline-card">
              <span className="eyebrow">INGESTION PIPELINE</span>

              <div className="pipeline-step complete">
                <b>✓</b>
                <span>File type and size validation</span>
              </div>

              <div className="pipeline-step active">
                <b>2</b>
                <span>Chunk academic text</span>
              </div>

              <div className="pipeline-step">
                <b>3</b>
                <span>Create embedding references</span>
              </div>

              <div className="pipeline-step">
                <b>4</b>
                <span>Retrieve relevant context</span>
              </div>
            </div>
          </div>
        </section>
      );
    }

    if (activePage === "Secure examinations" || activePage === "Release queue") {
      return (
        <section className="workspace-panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SECURE EXAMINATIONS</span>
              <h2>Controlled paper workflow</h2>
              <p>
                Requirements are locked before generation, validation,
                encryption, and release.
              </p>
            </div>
            <span className="status-pill amber">DRAFT</span>
          </div>

          <div className="exam-card">
            <div className="exam-card-header">
              <div>
                <span className="eyebrow">CONFIGURATION PREVIEW</span>
                <h3>Internal Assessment 1</h3>
                <p>Database Management Systems · Semester 4</p>
              </div>

              <span className="lock-label">🔒 Immutable after submit</span>
            </div>

            <div className="exam-details">
              <div>
                <span>TOPICS</span>
                <strong>ER Model · Normalization · Transactions</strong>
              </div>

              <div>
                <span>QUESTION PATTERN</span>
                <strong>5 × 2 · 2 × 5 · 1 × 10</strong>
              </div>

              <div>
                <span>DIFFICULTY</span>
                <strong>20% Easy · 50% Medium · 30% Hard</strong>
              </div>

              <div>
                <span>BLOOM LEVELS</span>
                <strong>Remember · Understand · Apply · Analyze</strong>
              </div>
            </div>

            <div className="security-message">
              Teacher view displays only metadata. Plaintext questions will
              later be restricted to the HOD release workflow.
            </div>

            <button
              className="primary-button"
              onClick={() =>
                window.alert("Exam generation will be connected by Member 3.")
              }
            >
              Lock requirements and generate securely
            </button>
          </div>
        </section>
      );
    }

    return (
      <>
        <section className={`hero-banner ${role.toLowerCase()}`}>
          <div>
            <span className="eyebrow">
              {role.toUpperCase()} CONSOLE · MONDAY 28 SEP 2026
            </span>

            <h1>
              {role === "Student"
                ? "Keep your momentum, Ananya."
                : role === "Teacher"
                  ? "Good morning, Rohan."
                  : "Good morning, Kavita."}
            </h1>

            <p>
              {role === "Student"
                ? "You are on a 4-day practice streak."
                : role === "Teacher"
                  ? "Your secure assessment pipeline is ready for review."
                  : "One internal examination is awaiting controlled release."}
            </p>
          </div>

          <div className="hero-status">
            <span>● SYSTEMS NOMINAL</span>
            <small>Last sync 10:42:18</small>
          </div>
        </section>

        <section className="metric-grid">
          <MetricCard label="Active practice tests" value="06" change="+2 this week" />
          <MetricCard label="Student attempts" value="184" change="+21.5%" />
          <MetricCard label="Average accuracy" value="78%" change="+4.2%" />
          <MetricCard label="Pipeline status" value="Secure" change="AES-256-GCM" />
        </section>

        <section className="content-grid">
          <div className="workspace-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">WORKSPACE ACTIVITY</span>
                <h2>What needs your attention</h2>
                <p>Your academic workspace at a glance.</p>
              </div>
            </div>

            <div className="activity-list">
              <ActivityItem
                title="Practice test published"
                detail="Normalization sprint · 20 questions"
                time="12 min ago"
              />
              <ActivityItem
                title="Syllabus indexed"
                detail="DBMS_2026_reference.pdf · 42 chunks"
                time="36 min ago"
              />
              <ActivityItem
                title="One validation retry"
                detail="Question Q-219 · grammar check"
                time="1 hr ago"
              />
            </div>
          </div>

          <div className="workspace-panel class-card">
            <span className="eyebrow">CLASS SNAPSHOT</span>
            <h2>DBMS · Semester 4</h2>
            <p>32 students enrolled</p>

            <div className="score-circle">
              <strong>78%</strong>
              <span>average score</span>
            </div>

            <div className="legend-row">
              <span>● Mastery</span>
              <strong>14</strong>
            </div>

            <div className="legend-row">
              <span>● On track</span>
              <strong>11</strong>
            </div>

            <div className="legend-row">
              <span>● Needs help</span>
              <strong>07</strong>
            </div>
          </div>
        </section>

        <section className="workspace-panel practice-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ONLINE PRACTICE WORKSPACE</span>
              <h2>Build confidence before exam day</h2>
              <p>
                Short focused practice with instant evaluation and topic-level
                recommendations.
              </p>
            </div>
            <span className="status-pill green">INDEPENDENT</span>
          </div>

          <div className="practice-list">
            {practiceTests.map((test, index) => (
              <div className="practice-row" key={test.title}>
                <div className="practice-number">0{index + 1}</div>

                <div className="practice-info">
                  <strong>{test.title}</strong>
                  <span>
                    {test.topic} · {test.meta}
                  </span>
                </div>

                <span className="difficulty">{test.level}</span>

                <button
                  className="outline-button"
                  onClick={() => startPractice(test.title)}
                >
                  {role === "Student" ? "Start test" : "View test"} →
                </button>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <main className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <strong>axiom</strong>
            <span>academic systems</span>
          </div>
        </div>

        <div className="workspace-select">
          <span>WORKSPACE</span>
          <strong>{role} console</strong>
          <small>Semester 4 · 2026</small>
        </div>

        <nav>
          <span className="nav-label">NAVIGATION</span>

          {navigation.map((item) => (
            <button
              key={item}
              className={activePage === item ? "nav-item active" : "nav-item"}
              onClick={() => {
                setActivePage(item);
                setMobileOpen(false);
              }}
            >
              <span className="nav-icon">□</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="security-card">
          <span>SECURITY CENTER</span>
          <strong>● All systems nominal</strong>
          <small>Storage encrypted · audit active</small>
        </div>

        <div className="profile-card">
          <div className="avatar">{role === "HOD" ? "KS" : "RM"}</div>
          <div>
            <strong>{role === "Student" ? "Ananya Shah" : role === "HOD" ? "Kavita Srinivasan" : "Rohan Mehta"}</strong>
            <small>{role}</small>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>

          <div className="breadcrumbs">
            Workspace <span>›</span> <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <span className="online-pill">● SYSTEM ONLINE</span>

            <button className="search-button">⌕ Search anything</button>

            <span className="preview-label">PREVIEW AS</span>

            {(["Student", "Teacher", "HOD"] as Role[]).map((item) => (
              <button
                key={item}
                className={role === item ? "role-button selected" : "role-button"}
                onClick={() => changeRole(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </header>

        <div className="page-content">{renderPageContent()}</div>

        <footer>Axiom Academic Systems · Secure by design · v0.1.0</footer>
      </section>
    </main>
  );
}

function MetricCard({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{change} vs last month</small>
    </div>
  );
}

function ActivityItem({
  title,
  detail,
  time,
}: {
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="activity-item">
      <div className="activity-icon">✓</div>
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <time>{time}</time>
    </div>
  );
}

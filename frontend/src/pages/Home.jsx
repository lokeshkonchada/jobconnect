import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="eyebrow">Careers, connected</span>
              <h1 className="hero-title">
                Building the bridge between <span className="accent">great talent</span> and the right opportunity
              </h1>
              <p className="hero-subtitle">
                JobConnect helps candidates find roles that fit their skills, and helps
                recruiters find people who move the needle — faster, and without the noise.
              </p>
              <div className="hero-cta">
                <Link to="/jobs" className="btn btn-primary btn-lg me-3">Browse Jobs</Link>
                <Link to="/register" className="btn btn-outline-light btn-lg">Post a Job</Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-stat-card">
                <div className="stat-row">
                  <div className="stat-num">2026</div>
                  <div className="stat-label">Founded</div>
                </div>
                <div className="stat-row">
                  <div className="stat-num">100%</div>
                  <div className="stat-label">Remote-friendly hiring</div>
                </div>
                <div className="stat-row">
                  <div className="stat-num">JWT</div>
                  <div className="stat-label">Secured platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <span className="eyebrow eyebrow-dark">About us</span>
              <h2 className="section-title">A platform built on one idea: hiring shouldn't be this hard</h2>
              <p className="section-text">
                JobConnect was founded in {currentYear} to strip away the friction on both sides of
                the hiring process. Candidates get a clean, focused way to search and apply.
                Recruiters get a dashboard that shows exactly who applied, and where they stand —
                no spreadsheets, no guesswork.
              </p>
              <p className="section-text">
                We're a small, product-first team building for people who'd rather spend time
                interviewing than managing tools.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h5>Smart Search</h5>
                  <p>Filter by title, location, and role in seconds.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🔒</div>
                  <h5>Secure by Design</h5>
                  <p>JWT authentication and role-based access, built in.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h5>Applicant Tracking</h5>
                  <p>Recruiters see status at a glance — no guesswork.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h5>Built for Speed</h5>
                  <p>A lightweight app that gets out of your way.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="cta-band">
        <div className="container text-center">
          <h2>Ready to find what's next?</h2>
          <p>Whether you're hiring or looking — JobConnect gets you there faster.</p>
          <Link to="/register" className="btn btn-light btn-lg">Get Started — It's Free</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="footer-brand">JobConnect</h5>
              <p className="footer-text">Connecting candidates and recruiters since {currentYear}.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="footer-text">© {currentYear} JobConnect. All rights reserved.</p>
              <p className="footer-text">Built with Java Spring Boot &amp; React.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
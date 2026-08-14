import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="jc-navbar">
      <div className="jc-navbar-inner">
        <Link className="jc-brand" to="/">
          <span className="jc-brand-mark">JC</span>
          <span className="jc-brand-text">JobConnect</span>
        </Link>

        <div className="jc-links">
          <Link className={`jc-link ${isActive('/jobs') ? 'active' : ''}`} to="/jobs">
            Jobs
          </Link>

          {!user && (
            <>
              <Link className={`jc-link ${isActive('/login') ? 'active' : ''}`} to="/login">
                Login
              </Link>
              <Link className="jc-cta" to="/register">
                Get Started
              </Link>
            </>
          )}

          {user && user.role === 'CANDIDATE' && (
            <Link
              className={`jc-link ${isActive('/candidate/dashboard') ? 'active' : ''}`}
              to="/candidate/dashboard"
            >
              My Applications
            </Link>
          )}

          {user && user.role === 'RECRUITER' && (
            <Link
              className={`jc-link ${isActive('/recruiter/dashboard') ? 'active' : ''}`}
              to="/recruiter/dashboard"
            >
              Dashboard
            </Link>
          )}

          {user && (
            <div className="jc-user">
              <span className="jc-avatar">{user.email.charAt(0).toUpperCase()}</span>
              <span className="jc-email">{user.email}</span>
              <button className="jc-logout" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">JobConnect</Link>
      <div className="d-flex gap-3 ms-auto">
        <Link className="nav-link text-white" to="/jobs">Jobs</Link>

        {!user && (
          <>
            <Link className="nav-link text-white" to="/login">Login</Link>
            <Link className="nav-link text-white" to="/register">Register</Link>
          </>
        )}

        {user && user.role === 'CANDIDATE' && (
          <Link className="nav-link text-white" to="/candidate/dashboard">My Applications</Link>
        )}

        {user && user.role === 'RECRUITER' && (
          <Link className="nav-link text-white" to="/recruiter/dashboard">Dashboard</Link>
        )}

        {user && (
          <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
            Logout ({user.email})
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
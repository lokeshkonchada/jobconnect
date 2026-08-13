import { useState, useEffect } from 'react';
import api from '../api/axios';

const statusColors = {
  APPLIED: 'primary',
  SHORTLISTED: 'info',
  SELECTED: 'success',
  REJECTED: 'danger',
};

function CandidateDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await api.get('/applications/my');
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Applications</h2>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && applications.length === 0 && <p>You haven't applied to any jobs yet.</p>}

      <div className="list-group">
        {applications.map((app) => (
          <div key={app.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">{app.jobTitle}</h6>
              <small className="text-muted">{app.company}</small>
            </div>
            <span className={`badge bg-${statusColors[app.status] || 'secondary'}`}>
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateDashboard;
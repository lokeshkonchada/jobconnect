import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data);
      } catch (err) {
        setError('Job not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setMessage('');
    setError('');
    try {
      await api.post(`/applications/${id}`);
      setMessage('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data || 'Failed to apply. You may have already applied.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setMessage('');
    setError('');
    try {
      await api.post(`/saved-jobs/${id}`);
      setMessage('Job saved!');
    } catch (err) {
      setError(err.response?.data || 'Failed to save job.');
    }
  };

  if (loading) return <div className="container mt-4"><p>Loading...</p></div>;
  if (!job) return <div className="container mt-4"><p>Job not found.</p></div>;

  return (
    <div className="container mt-4" style={{ maxWidth: '700px' }}>
      <h2>{job.title}</h2>
      <h5 className="text-muted mb-3">{job.company}</h5>

      <p>📍 {job.location}</p>
      {job.salary && <p>💰 ₹{job.salary.toLocaleString()}</p>}
      {job.jobType && <p>🕒 {job.jobType}</p>}

      <hr />

      <h5>Description</h5>
      <p>{job.description}</p>

      {message && <div className="alert alert-success mt-3">{message}</div>}
      {error && <div className="alert alert-danger mt-3">{String(error)}</div>}

      {(!user || user.role === 'CANDIDATE') && (
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary" onClick={handleApply}>Apply Now</button>
          <button className="btn btn-outline-secondary" onClick={handleSave}>Save Job</button>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
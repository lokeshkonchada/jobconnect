import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;

      const response = await api.get('/jobs', { params });
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Find your next opportunity</h2>

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Search by job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">Search</button>
        </div>
      </form>

      {loading && <p>Loading jobs...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && jobs.length === 0 && <p>No jobs found.</p>}

      <div className="row g-3">
        {jobs.map((job) => (
          <div className="col-md-6" key={job.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{job.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                <p className="card-text mb-1">📍 {job.location}</p>
                {job.salary && <p className="card-text mb-2">₹{job.salary.toLocaleString()}</p>}
                <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
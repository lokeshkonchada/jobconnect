import { useState, useEffect } from 'react';
import api from '../api/axios';

function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', company: '', location: '', salary: '', jobType: '',
  });

  const [applicantsFor, setApplicantsFor] = useState(null);
  const [applicants, setApplicants] = useState([]);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      setJobs(response.data);
    } catch (err) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', company: '', location: '', salary: '', jobType: '' });
    setEditingJobId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const payload = { ...formData, salary: formData.salary ? Number(formData.salary) : null };
      if (editingJobId) {
        await api.put(`/jobs/${editingJobId}`, payload);
        setMessage('Job updated successfully!');
      } else {
        await api.post('/jobs', payload);
        setMessage('Job posted successfully!');
      }
      resetForm();
      fetchMyJobs();
    } catch (err) {
      setError(err.response?.data || 'Failed to save job.');
    }
  };

  const handleEdit = (job) => {
    setFormData({
      title: job.title,
      description: job.description || '',
      company: job.company,
      location: job.location || '',
      salary: job.salary || '',
      jobType: job.jobType || '',
    });
    setEditingJobId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      fetchMyJobs();
    } catch (err) {
      setError(err.response?.data || 'Failed to delete job.');
    }
  };

  const viewApplicants = async (jobId) => {
    setError('');
    try {
      const response = await api.get(`/applications/job/${jobId}`);
      setApplicants(response.data);
      setApplicantsFor(jobId);
    } catch (err) {
      setError('Failed to load applicants.');
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await api.put(`/applications/${applicationId}/status`, { status });
      viewApplicants(applicantsFor);
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Recruiter Dashboard</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Post New Job'}
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{String(error)}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="card card-body mb-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Job Title</label>
              <input className="form-control" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Company</label>
              <input className="form-control" name="company" value={formData.company} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input className="form-control" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Salary</label>
              <input className="form-control" type="number" name="salary" value={formData.salary} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Job Type</label>
              <input className="form-control" name="jobType" value={formData.jobType} onChange={handleChange} placeholder="FULL_TIME, INTERNSHIP..." />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3">
            {editingJobId ? 'Update Job' : 'Post Job'}
          </button>
        </form>
      )}

      {loading && <p>Loading jobs...</p>}

      <div className="list-group mb-4">
        {jobs.map((job) => (
          <div key={job.id} className="list-group-item">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">{job.title}</h6>
                <small className="text-muted">{job.company} — {job.location}</small>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={() => viewApplicants(job.id)}>Applicants</button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => handleEdit(job)}>Edit</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applicantsFor && (
        <div className="card card-body">
          <h5>Applicants</h5>
          {applicants.length === 0 && <p>No applicants yet.</p>}
          {applicants.map((app) => (
            <div key={app.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
              <div>
                <strong>{app.candidateName}</strong> — <small>{app.candidateEmail}</small>
              </div>
              <select
                className="form-select form-select-sm"
                style={{ width: '160px' }}
                value={app.status}
                onChange={(e) => updateStatus(app.id, e.target.value)}
              >
                <option value="APPLIED">APPLIED</option>
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="SELECTED">SELECTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
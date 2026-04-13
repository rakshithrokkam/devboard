import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Briefcase, Code, MapPin, DollarSign, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: 'All', stack: [] });
  const [socket, setSocket] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '', company: '', role: 'Frontend', stack: '', location: '', type: 'Remote', description: '', salary: ''
  });

  const availableRoles = ['All', 'Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'Data', 'Other'];

  useEffect(() => {
    fetchJobs();
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('new_job_alert', (job) => {
      setJobs((prev) => [job, ...prev]);
      addToast(job);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('subscribe_filters', filters);
    }
    fetchJobs();
  }, [filters, socket]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/jobs`;
      const queryParams = [];
      if (filters.role !== 'All') queryParams.push(`role=${filters.role}`);
      if (filters.stack.length > 0) queryParams.push(`stack=${filters.stack.join(',')}`);
      
      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const response = await axios.get(url);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToast = (job) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, job }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const jobData = { ...newJob, stack: newJob.stack.split(',').map(s => s.trim()) };
      await axios.post(`${API_URL}/jobs`, jobData);
      setShowPostForm(false);
      setNewJob({ title: '', company: '', role: 'Frontend', stack: '', location: '', type: 'Remote', description: '', salary: ''});
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <Briefcase size={32} color="#60a5fa" />
          DevBoard
        </div>
        <button className="apply-btn" onClick={() => setShowPostForm(!showPostForm)}>
          {showPostForm ? 'Cancel' : 'Post a Job'}
        </button>
      </header>

      {showPostForm && (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Post a New Job</h3>
          <form className="post-job-form" onSubmit={handlePostJob}>
            <div className="form-row">
              <div className="form-group">
                <label>Job Title</label>
                <input required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} placeholder="e.g. Senior React Developer" />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input required value={newJob.company} onChange={e => setNewJob({...newJob, company: e.target.value})} placeholder="e.g. TechCorp Inc." />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Role</label>
                <select value={newJob.role} onChange={e => setNewJob({...newJob, role: e.target.value})}>
                  {availableRoles.filter(r => r !== 'All').map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Stack (comma separated)</label>
                <input required value={newJob.stack} onChange={e => setNewJob({...newJob, stack: e.target.value})} placeholder="React, Node.js, TypeScript" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} placeholder="e.g. Remote, San Francisco" />
              </div>
              <div className="form-group">
                <label>Work Type</label>
                <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value})}>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Salary (Optional)</label>
              <input value={newJob.salary} onChange={e => setNewJob({...newJob, salary: e.target.value})} placeholder="e.g. $120,000 - $150,000" />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea required rows="3" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} placeholder="Job description and requirements..."></textarea>
            </div>

            <button className="apply-btn" type="submit" style={{ alignSelf: 'flex-start' }}>Submit Job</button>
          </form>
        </div>
      )}

      <main className="main-content">
        <aside className="filters-section">
          <div className="glass-panel">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Role</label>
              <select className="filter-select" value={filters.role} onChange={e => setFilters({...filters, role: e.target.value})}>
                {availableRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Tech Stack</label>
              <input 
                className="filter-select" 
                placeholder="e.g. react, node" 
                onChange={(e) => {
                  const val = e.target.value;
                  const stackArr = val ? val.split(',').map(s => s.trim()).filter(s => s) : [];
                  setFilters({ ...filters, stack: stackArr });
                }} 
              />
            </div>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
              When you set filters, Socket.io will only alert you for matching jobs!
            </p>
          </div>
        </aside>

        <section className="job-list">
          {loading ? (
            <div className="loader">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel" style={{textAlign: 'center', padding: '3rem'}}>
              <h3 style={{color: 'var(--text-muted)'}}>No jobs found matching your filters.</h3>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job._id || Math.random()} className="glass-panel job-card">
                <div className="job-header">
                  <div>
                    <div className="job-title">{job.title}</div>
                    <div className="job-company">{job.company}</div>
                  </div>
                  <button className="apply-btn">Apply Now</button>
                </div>

                <div className="job-tags">
                  {job.stack && job.stack.map(tech => (
                    <span key={tech} className="tag">{tech}</span>
                  ))}
                </div>

                <div className="job-details-grid">
                  <div><Briefcase size={16} /> {job.role} &bull; {job.type}</div>
                  <div><MapPin size={16} /> {job.location}</div>
                  {job.salary && <div><DollarSign size={16} /> {job.salary}</div>}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '1rem' }}>
                  {job.description}
                </p>
              </div>
            ))
          )}
        </section>
      </main>

      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            <div className="toast-content" style={{flex: 1}}>
              <h4>New Job Alert!</h4>
              <p>{t.job.title} at {t.job.company}</p>
            </div>
            <button className="toast-close" onClick={() => removeToast(t.id)}>
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

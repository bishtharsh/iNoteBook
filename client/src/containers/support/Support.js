import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import ROUTES from '../../navigations/Routes';
import Header from '../../components/Header';
import Logo from '../../assets/iLogo2(T).png';
import axios from 'axios';

import 'boxicons/css/boxicons.min.css';
import '../../components/style.css';
import './support.css';

function Support() {
  const navigate = useNavigate();
  const Swal = require('sweetalert2');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    description: '',
  });

  const [formStatus, setFormStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const storedDarkMode = sessionStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.body.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get('http://localhost:1011/api/getToken', {
          withCredentials: true,
        });
        if (response.data.status === 'success') {
          let decodedToken = jwtDecode(response.data.token);
          setUserId(decodedToken.id);
          return true;
        } else {
          Swal.fire({
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            icon: 'error',
            confirmButtonText: 'OK',
          }).then(() => {
            navigate(ROUTES.login.name);
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Session Expired',
          text: 'There was an error checking your session. Please log in again.',
          icon: 'error',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate(ROUTES.login.name);
        });
      }
    };

    checkToken();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const handleSearch = () => {
    setIsSidebarOpen(true);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    if (newDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    sessionStorage.setItem('isDarkMode', newDarkMode.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const c1 = await axios.get('http://localhost:1011/api/getToken', {
      withCredentials: true,
    });
    if (c1.data.status !== 'success') {
      Swal.fire({
        title: 'Session Expired',
        text: 'Your session has expired. Please log in again.',
        icon: 'error',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(ROUTES.login.name);
      });
    }

    // Simulate a successful form submission
    setFormStatus('Your support request has been submitted. We will get back to you soon.');

    let timer = 100;
    const interval = setInterval(() => {
      timer -= 0.8;
      setProgress(timer);
      if (timer <= 0) {
        clearInterval(interval); // Stop the progress bar when it reaches 100%
      }
    }, 50); // Increase the progress every 100ms (10 seconds total to reach 100%)

    // Hide the message and reset progress after 10 seconds
    setTimeout(() => {
      setFormStatus('');
      setProgress(100); // Reset progress
    }, 5000);
    // Here, you can integrate actual form submission logic (e.g., API call)
    // Reset form data
    setFormData({
      name: '',
      email: '',
      issueType: '',
      description: '',
    });
  };

  const handleReset = (e) => {
    e.preventDefault();
    // Here, you can integrate actual form submission logic (e.g., API call)
    // Reset form data
    setFormData({
      name: '',
      email: '',
      issueType: '',
      description: '',
    });
  };

  return (
    <div className={`dashboard-container ${isDarkMode ? 'dark' : ''}`}>
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleSearch={handleSearch}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <div className={`home ${isSidebarOpen ? '' : 'Close'}`}>
        <div className='img-container'>
          <img src={Logo} alt="Logo" className='img' />
        </div>
        <div className="Text">
          iNoteBook-Support
        </div>
        <div className='notes-container'>
          <div className='notes-body support'>
            {formStatus && (
              <div className="form-status-container">
                <span className="form-status">{formStatus}</span>
                <div className="progress-bar-background">
                  <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <p>If you're experiencing any issues with iNoteBook, please use the form below to get in touch with our support team.</p>

            <form onSubmit={handleSubmit} onReset={handleReset}>
              <div className="form-Group">
                <label htmlFor="name">Name <span className='text-danger '>*</span></label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-Group">
                <label htmlFor="email">Email <span className='text-danger '>*</span></label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-Group">
                <label htmlFor="issueType">Issue Type <span className='text-danger '>*</span></label>
                <select
                  id="issueType"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select an issue type</option>
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Issue</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div className="form-Group">
                <label htmlFor="description">Description of the Issue <span className='text-danger '>*</span></label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className='btn btn-outline-success'>Submit Support Request</button>
              <button type='reset' className='ml-1 btn btn-secondary'>Reset</button>
            </form>

            <div className="support-info">
              <h2>Other Support Resources</h2>
              <ul>
                <li>Check our <a href="/faq">FAQ</a> for common issues and solutions.</li>
                <li>Visit our <a href="/help-center">Help Center</a> for guides and tutorials.</li>
                <li>Contact our support team directly via email: <a href="mailto:support@inotebook.com">support@inotebook.com</a></li>
              </ul>
            </div>
            <footer className="support-footer">
              <span>&copy; 2025 iNoteBook | All rights reserved</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Support
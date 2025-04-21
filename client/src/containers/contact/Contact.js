import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import ROUTES from '../../navigations/Routes';
import Header from '../../components/Header';
import Logo from '../../assets/iLogo2(T).png';
import axios from 'axios';

import 'boxicons/css/boxicons.min.css';
import '../../components/style.css';
import './contact.css';

function Contact() {
  const navigate = useNavigate();
  const Swal = require('sweetalert2');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState('');
  const [userId, setUserId] = useState('');

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    setFormStatus('Thank you for contacting us! We will get back to you soon.');
    setTimeout(() => {
      setFormStatus('');
    }, 6000);
    // Here, you can integrate actual form submission logic (e.g., API call)
    // Reset form data
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  const handleReset = (e) => {
    e.preventDefault();

    // Here, you can integrate actual form submission logic (e.g., API call)
    // Reset form data
    setFormData({
      name: '',
      email: '',
      message: ''
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
          iNoteBook-Contact
        </div>
        <div className='notes-container'>
          <div className='notes-body contact-us'>
            <p>If you have any questions or feedback, feel free to reach out to us using the form below:</p>
            {formStatus && <p className="form-status">{formStatus}</p>}
            <form onSubmit={handleSubmit} onReset={handleReset}>
              <div className="form-Group">
                <label htmlFor="name">Name<span className='text-danger '>*</span></label>
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
                <label htmlFor="message">Message <span className='text-danger '>*</span></label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className='btn btn-outline-success'>Submit</button>
              <button type='reset' className='ml-1 btn btn-secondary'>Reset</button>
            </form>
            <footer className="contact-footer">
              <span>&copy; 2025 iNoteBook | All rights reserved</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contact
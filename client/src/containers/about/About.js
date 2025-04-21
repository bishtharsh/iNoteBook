import React, { useState , useEffect } from 'react';
import '../../components/style.css';
import Header from '../../components/Header';
import Logo from '../../assets/iLogo2(T).png';
import 'boxicons/css/boxicons.min.css';
import './about.css';

function About() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedDarkMode = sessionStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.body.classList.add('dark');
    }
  }, []);
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
          iNoteBook-About
        </div>
        <div className='notes-container about-div'>
          <div className='notes-body about-container'>
            <section className="about-section">
              <div className='about-block'>
                <div className="section-title">
                  <h2>Who We Are</h2>
                </div>
                <p>
                  iNoteBook is an innovative online platform that provides users with a seamless experience to create, organize, and manage their notes.
                  Whether you're a student, professional, or casual note-taker, iNoteBook offers a clean and user-friendly interface to store your ideas.
                </p>
              </div>
            </section>

            <section className="about-section">
              <div className='about-block'>
                <div className="section-title">
                  <h2>Our Mission</h2>
                </div>
                <p>
                  Our mission is to provide a simple and efficient tool that helps individuals to stay organized and productive.
                  We believe in making note-taking more accessible, effective, and enjoyable.
                </p>
              </div> 
            </section>

            <section className="about-section">
              <div className='about-block'>
                <div className="section-title">
                  <h2>Our Values</h2>
                </div>
                <ul>
                  <li><strong>Innovation:</strong> We constantly improve and innovate to provide the best user experience.</li>
                  <li><strong>Quality:</strong> We prioritize high-quality features and a smooth user interface.</li>
                  <li><strong>Customer-Centric:</strong> Our focus is always on meeting the needs and preferences of our users.</li>
                </ul>
              </div>
            </section>

            <section className="about-section">
              <div className='about-block'>
                <div className="section-title">
                  <h2>Join Us</h2>
                </div>
                <p>
                  We are always looking for passionate individuals to join our team. If you're excited about making an impact, we'd love to hear from you.
                </p>
                <button className="join-button" title='Sorry, No more contant available.'>Learn More</button>
              </div>
            </section>

            <footer className="about-footer">
              <span>&copy; 2025 iNoteBook | All rights reserved</span>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';  // Ensure that your CSS file is correctly imported
import logo from '../assets/logo(T).png';
import { Link } from 'react-router-dom';
import ROUTES from '../navigations/Routes';
import axios from 'axios';

function Header({ isSidebarOpen, toggleSidebar, toggleDarkMode, isDarkMode }) {
  const navigate = useNavigate();
  const Swal = require('sweetalert2');
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  const handleLogout = async() =>{
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to sign out of the app?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, sign out!',
      cancelButtonText: 'No, stay logged in!',
    });
    if (confirmDelete.isConfirmed) {
      try {
        const response = await axios.post("http://localhost:1011/api/logout", {}, { withCredentials: true });
        if(response.data.status === 'success'){
          Toast.fire({
            title: response.data.message,
            icon: 'success',
          });
          navigate(ROUTES.login.name);
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Logout Failed',
            text: 'There was an error while logging out. Please try again later.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'An error occurred while logging out. Please try again.',
        });
      }
    }
  }

  return (
    <div>
      <nav className={`sideBar ${isSidebarOpen ? 'open' : 'close'} active`}>
        <header>
          <div className="image-text">
            <span className="image">
              <img src={logo} alt="logo"  />
            </span>
            <div className="Text logo-Text">
              <span className="name">iNoteBook</span>
              <span className="profession">Personal</span>
            </div>
          </div>

          <i
            className="bx bx-chevron-right toggle"
            onClick={toggleSidebar}
            title="Toggle Sidebar"
          ></i>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links">
              {/* Other menu items */}
              <li>
                <Link to={ROUTES.home.name} data-toggle="tooltip" data-placement="right" title="Home">
                  <i className="bx bx-home-alt icon"></i>
                  <span className="Text nav-text">Home</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.about.name} data-toggle="tooltip" data-placement="right" title="About US">
                  <i className="bx bx-info-circle icon"></i>
                  <span className="Text nav-text">About</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.contact.name} data-toggle="tooltip" data-placement="right" title="Contact Us">
                  <i className="bx bx-phone icon"></i>
                  <span className="Text nav-text">Contact</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.support.name} data-toggle="tooltip" data-placement="right" title="Support">
                  <i className="bx bx-support icon"></i>
                  <span className="Text nav-text">Support</span>
                </Link>
              </li>
              <li>
                <Link to={ROUTES.profile.name}data-toggle="tooltip" data-placement="right"  title="Profile">
                  <i className='bx bx-user icon' ></i>
                  <span className="Text nav-text">Profile</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="bottom-content">
            <li>
              <a onClick={handleLogout} data-toggle="tooltip" data-placement="right" title="Sign Out">
                <i className="bx bx-log-out icon"></i>
                <span className="Text nav-text">Logout</span>
              </a>
            </li>

            <li className="mode">
              <div className="sun-moon">
                <i
                  className={`bx bx-moon icon ${isDarkMode ? 'moon' : ''}`}
                ></i>
                <i
                  className={`bx bx-sun icon ${isDarkMode ? 'sun' : ''}`}
                ></i>
              </div>
              <span className="mode-text Text">
                {isDarkMode ? 'Light mode' : 'Dark mode'}
              </span>

              <div
                className="toggle-switch"
                onClick={toggleDarkMode} data-toggle="tooltip" data-placement="right"
                title={isDarkMode ? 'Light mode' : 'Dark mode'}
              >
                <span className="switch"></span>
              </div>
            </li>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import ROUTES from '../../navigations/Routes';
import Logo from '../../assets/iLogo2(T).png';
import lock from '../../assets/lock.gif';
import Header from '../../components/Header';
import open from '../../assets/icon/open50.png';
import closed from '../../assets/icon/close50.png';
//import $ from 'jquery';
import axios from 'axios';

import 'boxicons/css/boxicons.min.css';
import '../../components/style.css';



function Home() {
  const navigate = useNavigate();
  const refClose = useRef(null);
  const readModalRef = useRef(null);
  const editModalRef = useRef(null);
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

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState('');
  const [typeModal, setTypeModal] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //const [modalOpen, setModalOpen] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const [modalData, setModalData] = useState({ id: '', title: '', description: '', tag: '', lock: false, password: '', date: null });
  const [errors, setErrors] = useState({ title: '', description: '', password: '', });

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

  useEffect(() => {
    if (userId) {
      console.log('User ID:', userId);
      getAllNotesById();
    }
  }, [userId]);

  useEffect(() => {
    if(modalData.lock){
      if (typeModal === 'read' && readModalRef.current) {
        readModalRef.current.style.backdropFilter = 'brightness(0.5) ';
        setTimeout(() => {
          readModalRef.current.classList.add('show');
        }, 10);
      }else if(typeModal === 'edit' && editModalRef.current) {
        editModalRef.current.style.backdropFilter = 'brightness(0.5) ';
        setTimeout(() => {
          editModalRef.current.classList.add('show');
        }, 10);
      }
    }
  }, [typeModal, modalData]);

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

  const handleModalChange = (e) => {
    const { name, value, type, checked } = e.target;

    setModalData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

  };

  const countWordsAndCharacters = (text) => {
    if (!text) {
      return { words: 0, characters: 0 };  
    }
    const characterCount = text.length;
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  
    return { words: wordCount, characters: characterCount };
  };
  const { words, characters } = countWordsAndCharacters(modalData.description);

  const validateInputs = () => {
    let formErrors = {};
    let isValid = true;

    if (!modalData.title) {
      formErrors.title = 'Title is required';
      isValid = false;
    } else if (modalData.title.trim().length < 5) {
      formErrors.title = 'Please ensure the title is no less than 5 characters.';
      isValid = false;
    }

    if (!modalData.description) {
      formErrors.description = 'Description is required';
      isValid = false;
    } else if (modalData.description.trim().length < 15) {
      formErrors.description = 'Please ensure the description is no less than 15 characters.';
      isValid = false;
    }

    if (modalData.lock && !modalData.password) {
      formErrors.password = 'Password is required for locked notes';
      isValid = false;
    } else if (modalData.lock && modalData.password) {
      if (!modalData.id && (modalData.password.trim().length < 6 || modalData.password.trim().length > 15)) {
        formErrors.password = 'Please ensure the password is between 6 and 15 characters.';
        isValid = false;
      } else if (modalData.id && (modalData.password.trim().length < 6 || modalData.password.trim().length > 15)) {
        formErrors.password = 'Please ensure the password is between 6 and 15 characters.';
        isValid = true;
      }
    }

    setErrors(formErrors);
    return isValid;
  };

  const resetForm = () => {
    setTimeout(() => {
      setModalData({
        id: '',
        title: '',
        description: '',
        tag: '',
        lock: false,
        password: ''
      });
      setErrors({ title: '', description: '', password: '' });
    }, 300);
  };

  const openModal = (noteData = {}) => {
    setModalData(noteData);
    if(typeModal === '')
      setTypeModal('new');
  };

  const closeModal = () => {
    setTypeModal('');
    setIsPasswordVerified(false);
    resetForm();
  };

  function formatDate(date) {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate)) {
      return 'Invalid date'; // Return a fallback if the date is invalid
    }
    const options = {
      year: 'numeric', // Full year (e.g., '2025')
      month: 'long', // Full month name (e.g., 'March')
      day: 'numeric', // Day of the month (e.g., '29')
      hour: 'numeric', // Hour (e.g., '3')
      minute: 'numeric', // Minute (e.g., '45')
      hour12: true, // 12-hour format (AM/PM)
    };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(parsedDate).replace('at', '');
    return formattedDate;
  }

  const truncateText = (text, limit) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  const modalProps = isPasswordVerified ? {
    "data-toggle": "modal",
    "data-target": typeModal !== "read" ? "#exampleModal" : "#readModal",  // Your modal ID
  } : {};

  //CheckPassword
  const handlePasswordCheck = async (item) => {
    const { value: password, isConfirmed } = await Swal.fire({
      title: 'Password required',
      input: 'password',
      inputLabel: 'Enter password',
      inputPlaceholder: 'Password',
      inputAttributes: { maxlength: 20, autocapitalize: 'off', autocorrect: 'off' },
      showCancelButton: true,
      cancelButtonText: 'Cancel',
    });
    if (!isConfirmed) {
      return false;
    }
    if (password === '') {
      Swal.fire({
        title: 'Error',
        text: 'Password is required to update the note.',
        icon: 'error',
      });
      return false;
    } else {
      try {
        let response = await axios.get(`http://localhost:1011/api/getNote?id=${item._id}&pwd=${password}`, { withCredentials: true });
        if (response.data.status === 'success') {
          return true;
        } else {
          Swal.fire({
            title: 'Incorrect Password',
            text: 'The password you entered is incorrect.',
            icon: 'error',
          });
          return false;
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to get the note to update.',
          icon: 'error',
        });
        return false;
      }
    }
  };
  //GetAllNotes
  const getAllNotesById = async () => {
    try {
      const response = await axios.get('http://localhost:1011/api/getAllNotes', { withCredentials: true, });
      if (response.data.status === 'success') {
        setNotes(response.data.notes);
      }// else {
      // Swal.fire({
      //   title: 'Error',
      //   text: response.data.message || 'Unable to fetch notes. Please try again.',
      //   icon: 'error',
      // });
      //}
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to get notes!',
        icon: 'error',
      });
    }
  };
  //DeleteNotes
  const deleteNote = async (id) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    });

    if (confirmDelete.isConfirmed) {
      try {
        const note = notes.find((n) => n._id === id);
        if (!note) {
          Swal.fire({
            title: 'Error',
            text: 'Note not found.',
            icon: 'error',
          });
          return;
        }
        let response;
        if (note.lock) {
          const { value: password, isConfirmed } = await Swal.fire({
            title: 'Password required',
            input: 'password',
            inputLabel: 'Enter password',
            inputPlaceholder: 'Password',
            inputAttributes: { maxlength: 20, autocapitalize: 'off', autocorrect: 'off' },
            showCancelButton: true,
            cancelButtonText: 'Cancel',
          });
          if (!isConfirmed) {
            return;
          }
          if (password === '') {
            Swal.fire({
              title: 'Error',
              text: 'Password is required to delete the note.',
              icon: 'error',
            });
            return;
          }

          response = await axios.delete(`http://localhost:1011/api/deleteNote?id=${id}`, {
            data: { password },
            withCredentials: true,
          });

        } else {
          response = await axios.delete(`http://localhost:1011/api/deleteNote?id=${id}`, { withCredentials: true });
        }

        if (response.data.status === 'success') {
          Toast.fire({
            title: 'Your note has been deleted.',
            icon: 'success',
          });
          getAllNotesById();
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.message || 'Failed to delete the note. Please try again.',
            icon: 'error',
          });
        }
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to delete the note.',
          icon: 'error',
        });
      }
    }
  };
  //ReadNote
  const handleReadNote = async (id) => {
    try {
      const note = notes.find((n) => n._id === id);
      if (!note) {
        Swal.fire({
          title: 'Error',
          text: 'Note not found.',
          icon: 'error',
        });
        return;
      } else {  
        if (note.lock) {
          const passwordVerified = await handlePasswordCheck(note);
          if (passwordVerified === true) {
            Swal.fire({
              icon: 'success',
              title: 'Password is verified',
              html: 'To read the note, please press "Ok".',
              allowOutsideClick: true, // Prevent closing by clicking outside
              confirmButtonText: 'OK' // Ensure OK button is shown
            }).then((result) => {
              if (result.isConfirmed) {
                openModal({ ...note, id: note._id });
                setTypeModal('read');
              } else {
                if (refClose.current) {
                  refClose.current.click(); // Safely click only if ref exists
                } else {
                  closeModal(); // fallback function
                }
              }
            });          
          }
        } else {
          setIsPasswordVerified(true);
          openModal({ ...note, id: note._id });
          setTypeModal('read');
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Failed to read the note. Please try again.',
        icon: 'error',
      });
    }
  };
  //EditNote
  const editNote = async (id) => {
    const note = notes.find((n) => n._id === id);
    if (!note) {
      Swal.fire({
        title: 'Error',
        text: 'Note not found!',
        icon: 'error',
      });
      return;
    } else {
      
      if (note.lock) {
        const passwordVerified = await handlePasswordCheck(note);
        if (passwordVerified === true) {
          Swal.fire({
            icon: 'success',
            title: 'Password is verified',
            html: 'To update the note, please press "Ok".',
            allowOutsideClick: true, 
            confirmButtonText: 'OK' 
          }).then((result) => {
            if (result.isConfirmed) {
              openModal({ ...note, id: note._id });setTypeModal('edit');
            } else {
              if (refClose.current) {
                refClose.current.click(); // Safely click only if ref exists
              } else {
                closeModal(); // fallback function
              }
            }
          });     
        }
      } else {
        setIsPasswordVerified(true);
        openModal({ ...note, id: note._id });
        setTypeModal('edit');
      }
    }
  };
  //SaveChanges
  const handleSave = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      const noteData = {
        title: modalData.title,
        tag: modalData.tag,
        description: modalData.description,
        lock: modalData.lock,
        password: modalData.password,
      };
      const response = modalData.id
        ? await axios.put(`http://localhost:1011/api/updateNote?id=${modalData.id}`, noteData, { withCredentials: true })
        : await axios.post('http://localhost:1011/api/createNote', noteData, { withCredentials: true });

      if (response.data.status === 'success') {
        const message = modalData.id ? 'Note updated successfully!' : 'Note created successfully!';
        Toast.fire({ title: message, icon: 'success' });
        getAllNotesById();
        refClose.current.click();
      } else {
        Swal.fire({
          title: "Error",
          text: response.data.message || "Failed to save the note. Please try again.",
          icon: "error"
        });
      }

    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to save the note. Please try again.!",
        icon: "error"
      });
    }
  };
  //CollectionNotes
  function renderNotes() {
    if (!notes || notes.length === 0) {
      return <p className="mx-auto text-center">No notes available. Start by creating a <a title='New Note' data-toggle="modal" data-target="#exampleModal" onClick={() => openModal()}
        style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
      >new note!</a></p>;
    } else {
      const filteredData = notes.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
      );
      if (filteredData.length === 0) {
        return <p className="mx-auto text-center">No notes match your search string "{search}".</p>;
      }

      return filteredData.map((item) => {
        return (
          <div className="note" key={item._id}>
            <div className="note-header">
              <span>{truncateText(item.title, 18)}</span>{/* 21 */}
            </div>
            <div className="note-body text-left" >
              <p className='w-100 mb-0'>{item.lock ? (
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column' }}>
                  <img src={lock} className='mb-1' style={{ width: '7vw', height: '11.7vh', borderRadius: '21px', boxShadow: 'rgb(226 226 226 / 29%) 0px 0px 20px 5px', }} />
                  <span style={{ display: 'flex', width: '100%', justifyContent: 'center', }}>
                    Description is locked.
                  </span>
                </div>) : truncateText(item.description, 120)}</p> {/* 180 */}
            </div>
            <div className="note-footer">
              <span>{formatDate(item.date)}</span> {/* Make sure item.date is a valid date */}
            </div>
            <div className="note-overlay">
              <button className="Btn read" title="Read Note" {...modalProps}
                onClick={() => handleReadNote(item._id)}>
                Read
              </button>
              <div className="btn-row">
                <button className="Btn edit" title="Edit Note" {...modalProps}
                  onClick={() =>
                    editNote(item._id)
                  }>
                  <i className="bx bxs-edit"></i>
                </button>
                <button className="Btn trash " title="Delete Note" onClick={() => deleteNote(item._id)}>
                  <i className="bx bxs-trash"></i>
                </button>
              </div>
            </div>
          </div>
        );
      });
    }
  }
  //New&EditModal
  const modalShow = (
    <div className={`modal fade bd-example-modal-lg ${typeModal === 'edit' || typeModal === 'new' ? ' d-block' : ''}`} id='exampleModal' tabIndex="-1" role="dialog" data-backdrop='static' data-keyboard='false' aria-hidden="true" ref={editModalRef} 
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title " id="exampleModalLabel">{modalData.id ? 'Edit Note' : 'New Note'}</h5>
          </div>
          <div className="modal-body">
            <form>
              <div className='row text-left'>
                <div className="form-group col-6">
                  <label htmlFor="noteTitle">Title <span className='text-danger '>*</span></label>
                  <input
                    type="text"
                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                    id="noteTitle"
                    name="title"
                    value={modalData.title}
                    onChange={handleModalChange}
                    placeholder="Enter title"
                  />
                  {errors.title && <div className="invalid-feedback pl-2">{errors.title}</div>}
                </div>
                <div className="form-group col-6">
                  <label htmlFor="noteTag">Tag</label>
                  <input
                    type="text"
                    className="form-control"
                    id="noteTag"
                    name="tag"
                    value={modalData.tag}
                    onChange={handleModalChange}
                    placeholder="Enter tag"
                  />
                </div>
              </div>

              <div className="form-group text-left">
                <label htmlFor="noteDescription">Description <span className='text-danger '>*</span></label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''} pb-4`}
                  id="noteDescription"
                  name="description"
                  value={modalData.description}
                  onChange={handleModalChange}
                  rows="4"
                  placeholder="Enter description"
                />
                <span className='text-color text-count'>
                  <span>
                    {characters} {characters <= 1 ? "character" : "characters"},{" "}
                    {words} {words <= 1 ? "word" : "words"}
                  </span>
                </span>
                {errors.description && <div className="invalid-feedback pl-2 d-error">{errors.description}</div>}
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="lockToggle"
                  name="lock"
                  checked={modalData.lock}
                  onChange={handleModalChange}
                />
                <label className="form-check-label" htmlFor="lockToggle">
                  Lock Note
                </label>
              </div>

              {modalData.lock && (
                <div className="form-group text-left">
                  <label htmlFor="password">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    onChange={handleModalChange}
                    placeholder="Enter password"
                  />
                  <span className={`e-icon ${errors.password ? 'e-icon-error' : ''}`} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      //<i class="fas fa-eye" style={styles.img} title='Show'></i>
                      <img src={open} className='img-eye' title='Show'/>
                    ) : (
                      //<i class="fas fa-eye-slash" style={styles.img} title='Show'></i>
                      <img src={closed} className='img-eye' title='Hide'/>
                    )}
                  </span>
                  {errors.password && <div className="invalid-feedback pl-2">{errors.password}</div>}
                </div>
              )}
            </form>
          </div>
          <div className="modal-footer">
            <button ref={refClose} type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>
            <button type="button" className="btn save-btn" onClick={handleSave} >Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
  //ReadModal
  const modalContent = (
    <div className={`modal fade bd-example-modal-lg ${typeModal === 'read' ? 'd-block' : ''}`} id="readModal" tabIndex="-1" role="dialog" aria-hidden="true" data-backdrop='static' data-keyboard='false' ref={readModalRef} 
    >
      <div className="modal-dialog modal-lg" role="document" >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">View Note</h5>
          </div>
          <div className="modal-body ">
            <div className="form-group text-left" title="Note Title">
              <span className="text-title" >{modalData.title}</span>
            </div>
            <div className="form-group text-left" title="Note Description">
              <label className='text-label' >Description : </label>
              <textarea className="form-control" style={{ background: "white" }} rows="5" readOnly >{modalData.description}</textarea>
              <span className='text-color text-count'>
                <span>
                  {characters} {characters <= 1 ? "character" : "characters"},{" "}
                  {words} {words <= 1 ? "word" : "words"}
                </span>
              </span>
            </div>
            <div className="form-group row px-3">
              <div className="col-6" title={`Note ${modalData.lock ? ' Locked' : ' Unlocked'}`}>
                <label className='text-label '>Lock Status : </label>
                <span >{modalData.lock ? ' Locked' : ' Unlocked'}</span>
              </div>
              <div className='col-6' title="Note Tag">
                <label className='text-label '>Tag : </label>
                <span> {modalData.tag}</span>
              </div>
            </div>

            <div className="form-group" title="Note Created At">
              <label className='text-label'>Created At :</label>
              <span> {formatDate(modalData.date)}</span>
            </div>
          </div>
          <div className="modal-footer">
            <button ref={refClose} type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return <>
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
          iNoteBook-Home
        </div>
        <div className='notes-container'>
          <div className='notes-body'>
            <div className='searchBar'>
              <li className="search-box" title='Search'>
                <i className="bx bx-search-alt icon"></i>
                <input
                  type="text"
                  placeholder="Search Notes..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </li>
            </div>
            <div className="notes-div">
              {renderNotes()}
            </div>
            <footer className="home-footer">
              <p>&copy; 2025 iNoteBook | All rights reserved</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
    {/* Render modal content dynamically */}
    {(typeModal==='edit' || typeModal==='new') && modalShow}
    {typeModal==='read' && modalContent}
    <div className='new-btn'>
      <button title='New Note' type="button" className="btn n-btn" data-toggle="modal" data-target="#exampleModal" onClick={() => 
          openModal()}>
        <i className="bx bx-plus icon"></i>
      </button>
    </div>
  </>;
}

export default Home;

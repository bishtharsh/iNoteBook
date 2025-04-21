import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import profile from '../../assets/profile.gif'
import ROUTES from '../../navigations/Routes';
import Header from '../../components/Header';
import Logo from '../../assets/iLogo2(T).png';
import open from '../../assets/icon/open50.png';
import closed from '../../assets/icon/close50.png';
import axios from 'axios';
import 'boxicons/css/boxicons.min.css';
import '../../components/style.css';
import './profile.css';

function Profile() {
    const navigate = useNavigate();
    const Swal = require('sweetalert2');
    const refClose = useRef(null);
    const pwdModalRef = useRef(null);
    const editModalRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userDetails, setUserDetails] = useState([]);
    const [notes, setNotes] = useState([]);
    const [userId, setUserId] = useState('');
    const [typeModal, setTypeModal] = useState('');
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '', currentPassword: '',
    });
    const [errors, setErrors] = useState({
        name: '', email: '', password: '', confirmPassword: '', currentPassword: '',
    });

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
        }

        checkToken()
    }, [navigate]);
    useEffect(() => {
        if (userId !== '') {
            getUserById();
            getAllNotesById();
        }
    }, [userId]);
    useEffect(() => {
        if (userDetails) {
            if (typeModal === 'password' && pwdModalRef.current) {
                pwdModalRef.current.style.backdropFilter = 'brightness(0.5) ';
                setTimeout(() => {
                    pwdModalRef.current.classList.add('show');
                }, 10);
            } else if (typeModal === 'user' && editModalRef.current) {
                editModalRef.current.style.backdropFilter = 'brightness(0.5) ';
                setTimeout(() => {
                    editModalRef.current.classList.add('show');
                }, 10);
            }
        }
    }, [typeModal, userDetails]);

    const getUserById = async () => {
        try {
            const response = await axios.get('http://localhost:1011/api/user', { withCredentials: true, });
            if (response.data.status === 'success') {
                setUserDetails(response.data.userData);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to get notes!',
                icon: 'error',
            });
        }
    };

    const getAllNotesById = async () => {
        try {
            const response = await axios.get('http://localhost:1011/api/getAllNotes', { withCredentials: true, });
            if (response.data.status === 'success') {
                setNotes(response.data.notes);
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Failed to get notes!',
                icon: 'error',
            });
        }
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

    // Handle change in edit fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setForm({
            name: '', email: '', password: '', confirmPassword: '', currentPassword: '',
        });
        setErrors({
            name: '', email: '', password: '', confirmPassword: '', currentPassword: '',
        });
        setShowPassword(false);
    }

    const closeModal = () => {
        setTypeModal('');
        resetForm();
    }
    const validateInputs = () => {
        let formErrors = {};
        let isValid = true;

        if (typeModal === 'user') {
            if (!form.name) {
                formErrors.name = 'Full Name is required';
                isValid = false;
            }
            if (!form.email) {
                formErrors.email = 'E-mail Address is required';
                isValid = false;
            }
        } else if (typeModal === 'password') {
            if (!form.currentPassword) {
                formErrors.currentPassword = 'Current Password is required';
                isValid = false;
            }

            if (!form.password) {
                formErrors.password = 'New Password is required';
                isValid = false;
            } else if (form.password.trim().length < 6 || form.password.trim().length > 15) {
                formErrors.password = 'Please ensure the password is between 6 and 15 characters.';
                isValid = false;
            }

            if (!form.confirmPassword) {
                formErrors.confirmPassword = 'Confirm Password is required';
                isValid = false;
            } else if (form.password.trim() !== form.confirmPassword.trim()) {
                formErrors.confirmPassword = 'Password and Confirm Password not same !!!';
                isValid = false;
            }
        }

        setErrors(formErrors);
        return isValid;
    }

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
                let response = await axios.get(`http://localhost:1011/api/verifyPwd?id=${item.id}&pwd=${password}`, { withCredentials: true });
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

    const handleUser = async () => {
        if (!userDetails) {
            Swal.fire({
                title: 'Error',
                text: 'User details not found.',
                icon: 'error',
            });
            return;
        } else {
            const passwordVerified = await handlePasswordCheck(userDetails);
            if (passwordVerified === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password is verified',
                    html: 'To edit the user details, please press "Ok".',
                    allowOutsideClick: true, // Prevent closing by clicking outside
                    confirmButtonText: 'OK' // Ensure OK button is shown
                }).then((result) => {
                    if (result.isConfirmed) {
                        setForm({
                            name: userDetails.name,
                            email: userDetails.email,
                        });
                        setTypeModal('user');
                    } else {
                        if (refClose.current) {
                            refClose.current.click(); // Safely click only if ref exists
                        } else {
                            closeModal(); // fallback function
                        }
                    }
                });
            }
        }
    };

    const handlePassword = async () => {
        if (!userDetails) {
            Swal.fire({
                title: 'Error',
                text: 'User details not found.',
                icon: 'error',
            });
            return;
        } else {
            const passwordVerified = await handlePasswordCheck(userDetails);
            if (passwordVerified === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Password is verified',
                    html: 'To change the password, please press "Ok".',
                    allowOutsideClick: true, // Prevent closing by clicking outside
                    confirmButtonText: 'OK' // Ensure OK button is shown
                }).then((result) => {
                    if (result.isConfirmed) {
                        setTypeModal('password');
                    } else {
                        if (refClose.current) {
                            refClose.current.click(); // Safely click only if ref exists
                        } else {
                            closeModal(); // fallback function
                        }
                    }
                });

            }
        }
    };

    const saveUser = async () => {
        if (!validateInputs()) {
            return;
        }
        try {
            const userData = {
                id: userId,
                name: form.name,
                email: form.email,
            }
            const response = await axios.put("http://localhost:1011/api/updateDetails", userData, { withCredentials: true });
            if (response.data.status === 'success') {
                Toast.fire({ title: response.data.message, icon: 'success' });
                getUserById();
                refClose.current.click();
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.data.message || "Failed to save the user details. Please try again.",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to save the user details. Please try again.!",
                icon: "error"
            });
        }
    };

    const savePassword = async () => {
        if (!validateInputs()) {
            return;
        }
        try {
            const userData = {
                userId,
                newPassword: form.password,
                currentPassword: form.currentPassword,
            }
            const response = await axios.put("http://localhost:1011/api/updatePassword", userData, { withCredentials: true });
            if (response.data.status === 'success') {
                Toast.fire({ title: response.data.message, icon: 'success' });
                getUserById();
                refClose.current.click();
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.data.message || "Failed to save the user password. Please try again.",
                    icon: "error"
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Failed to save the user password. Please try again.!",
                icon: "error"
            });
        }
    };

    const modalPassword = (
        <div className={`modal fade  ${typeModal === 'password' ? ' d-block' : ''}`} id='pwdModal' tabIndex="-1" role="dialog" data-backdrop='static' data-keyboard='false' aria-hidden="true" ref={pwdModalRef} aria-labelledby="pwdModalTitle">
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title " id="pwdModalTitle">Edit Password</h5>
                        <div className=''>
                            <span className='btn fieldIcon' title={showPassword ? 'Show' : 'Hide'} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    // <i class="fa fa-eye" style={styles.img} title='Show'></i>
                                    <img src={open} className="img-eye" />
                                ) : (
                                    //<i class="fa fa-eye-slash" style={styles.img} title='Show'></i>
                                    <img src={closed} className="img-eye" />
                                )
                                }
                            </span>
                        </div>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className='form-group text-left'>
                                <label htmlFor="currentPassword">Current Password <span className='text-danger '>*</span></label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                                    id="currentPassword"
                                    name="currentPassword"
                                    onChange={handleChange}
                                    placeholder="Enter current password"
                                />
                                {errors.currentPassword && <div className="invalid-feedback pl-2">{errors.currentPassword}</div>}
                            </div><div className='form-group text-left'>
                                <label htmlFor="password">New Password <span className='text-danger '>*</span></label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    id="password"
                                    name="password"
                                    onChange={handleChange}
                                    placeholder="Enter New Password"
                                />
                                {errors.password && <div className="invalid-feedback pl-2">{errors.password}</div>}
                            </div>
                            <div className='form-group text-left'>
                                <label htmlFor="confirmPassword">Confirm Password <span className='text-danger '>*</span></label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChange={handleChange}
                                    placeholder="Enter Confirm Password"
                                />
                                {errors.confirmPassword && <div className="invalid-feedback pl-2">{errors.confirmPassword}</div>}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button ref={refClose} type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>
                        <button type="button" className="btn save-btn" onClick={savePassword} >Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const modalUser = (
        <div className={`modal fade ${typeModal === 'user' ? ' d-block' : ''}`} id='userModal' tabIndex="-1" role="dialog" data-backdrop='static' data-keyboard='false' aria-hidden="true" ref={editModalRef} aria-labelledby="userModalTitle">
            <div className="modal-dialog " role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title " id="userModalTitle">Edit Details</h5>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className='form-group text-left'>
                                <label htmlFor="name">Full Name <span className='text-danger '>*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter Full Name"
                                />
                                {errors.name && <div className="invalid-feedback pl-2">{errors.name}</div>}
                            </div>
                            <div className='form-group text-left'>
                                <label htmlFor="email">E-mail <span className='text-danger '>*</span></label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Enter E-mail Address"
                                />
                                {errors.email && <div className="invalid-feedback pl-2">{errors.email}</div>}
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button ref={refClose} type="button" className="btn btn-outline-secondary" data-dismiss="modal" onClick={closeModal}>Close</button>
                        <button type="button" className="btn save-btn" onClick={saveUser} >Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const groupedNotes = notes.reduce((acc, note) => {
        if (!note || !note.tag) return acc;
        if (!acc[note.tag]) {
            acc[note.tag] = { locked: 0, unlocked: 0 };
        }
        if (note.lock === true) {
            acc[note.tag].locked += 1;
        } else {
            acc[note.tag].unlocked += 1;
        }
        return acc;
    }, {});

    // Get distinct tags and sort them in ascending order
    const distinctTags = Object.keys(groupedNotes).sort();

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
                    iNoteBook-Profile
                </div>
                <div className='notes-container'>
                    <div className='notes-body'>
                        <div className="profile-container ">
                            <div className="profile-section ">
                                <h2 className='h2'>Account Details</h2>
                                <img src={profile} />
                                <div className='details-contain'>
                                    <span className='p'><strong>Full Name :</strong> {userDetails.name}</span>
                                    <span className='p'><strong>E-mail Address :</strong> {userDetails.email}</span>
                                </div>
                                <div className='btns-contain'>
                                    <button title='Change User Details' onClick={() => handleUser()} className="btn btn-sm btn-outline-info ">
                                        Edit Details
                                    </button>
                                    <button title='Change User Password' onClick={() => handlePassword()} className="btn btn-sm btn-info">
                                        Password Change
                                    </button>
                                </div>

                            </div>
                            <div className="note-section">
                                <h2 className='h2'>Notes Collection</h2>
                                <div className='notes-contain'>
                                    <table className="table mb-0">
                                        <thead>
                                            <tr className='row px-1'>
                                                <th className='col-2'>Sr.No.</th>
                                                <th className='col-4'>Note Types</th>
                                                <th className='col-3'>Locked</th>
                                                <th className='col-3'>Un-Locked</th>
                                            </tr>
                                        </thead>
                                        <tbody className='scrollable-tbody'>
                                            {distinctTags.map((tag, index) => (
                                                <tr key={index} className="row px-1">
                                                    <td className="col-2">{index + 1 || '#'}</td>
                                                    <td className="col-4">{tag
                                                        ? (tag.length > 10
                                                            ? tag.charAt(0).toUpperCase() + tag.slice(1, 10) + '...'
                                                            : tag.charAt(0).toUpperCase() + tag.slice(1))
                                                        : 'No Tag'}</td>
                                                    <td className="col-3">{groupedNotes[tag] ? groupedNotes[tag].locked : 0}</td>
                                                    <td className="col-3">{groupedNotes[tag] ? groupedNotes[tag].unlocked : 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <footer className="profile-footer">
                            <span >&copy; 2025 iNoteBook | All rights reserved</span>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
        {typeModal === 'user' && modalUser}
        {typeModal === 'password' && modalPassword}
    </>;
}

export default Profile;

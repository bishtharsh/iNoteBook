import React, { useState} from 'react'
//import Header from '../../components/Header'
import { useNavigate} from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import ROUTES from '../../navigations/Routes';
import imgLogo from '../../assets/iLogo2(T).png';
import open from '../../assets/icon/open50.png';
import closed from '../../assets/icon/close50.png';

// Firebase
import { auth, googleProvider, facebookProvider, twitterProvider } from '../../firebase';
import { signInWithPopup } from 'firebase/auth';

function Login() {
  const [form,setForm] = useState({email:"",password:""});
  const [formError,setFormError] = useState({email:"",password:""});
  const navigate = useNavigate();
  const Swal = require('sweetalert2');
  const [showPassword, setShowPassword] = useState(false);

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

  const changeHandler = (e)=>{
    setForm({...form,[e.target.name]: e.target.value});
  };

  const loginUser = async () => {
    try { 
      const d = await axios.post("http://localhost:1011/api/login",form,{ withCredentials: true }); 
      if(d.data.status === 'success'){
        
          //document.cookie = `auth_token=${token}; path=/; max-age=600`;
        navigate(ROUTES.home.name);
        Toast.fire({
          icon: "success",
          title: d.data.message,
        });   
      }else{
        Swal.fire({
          title: "Check your credentials",
          text: `!! ${d.data.message} !!`,
          icon: "error"
        });
      }             
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Fail to submit data !!!",
        icon: "error"
      });
    }
  }

  function onUserSubmit(){
    let errors = false;
    let error = {
      email:"",password:""
    };

    if(form.email.trim().length === 0){
      errors = true;
      error = {...error,email:"E-mail Empty !!!"};
    }
    if(!(form.password.trim().length>=6 && form.password.trim().length<=13)){
      errors = true;
      error = {...error,password:"Password length bwt 6 to 13 chars long !!!"};
    }
    if(form.password.trim().length === 0){
      errors = true;
      error = {...error,password:"Password Empty !!!"};
    }

    if(errors)
    {
      setFormError(error);
    }else
    {
      setFormError(error);
      loginUser();
    }
  }

  const socialLogin = async (provider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      Toast.fire({
        icon: "success",
        title: `Welcome ${user.displayName || 'User'}!`,
      });
      navigate(ROUTES.home.name);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error"
      });
    }
  };

  return <div className='' style={{height:'98vh',overflow: 'hidden',}}>
    {/* <Header/> */}
    <div className='row p-2 m-2 h-100'>
      <div className='mx-auto rounded d-flex align-items-center flex-column' style={{width:"20.5%", marginTop:'10vh',}}>
        <img src={imgLogo} className='w-auto mb-4 img' style={{maxHeight:'28%'}} title='iNoteBook'/>
        <div className="card " style={{boxShadow: '0px 0px 10px 5px rgb(0 0 0 / 19%)',}} >
          <div className="card-header border-bottom-0">
            <h5 className='text-center'>Sign In</h5>
          </div>
          <div className="card-body mx-2 pt-1 pb-1">
            <div className='row mb-2'>
              <label className='col-12 text-left font-weight-bold' htmlFor="email">Username <span className='text-danger '>*</span></label>
              <div className='col-12'>
                <input className='form-control'style={{fontSize: '13.5px',}} name='email' type="text" id="email" placeholder='Enter e-mail' onChange={changeHandler} value={form.email}/>
                <span className='text-danger' style={{fontSize: '13.5px',fontWeight: '500',}}>{formError.email}</span>
              </div>
            </div>
            <div className='row mb-2'>
              <label className='col-12 text-left font-weight-bold' htmlFor="password">Password <span className='text-danger '>*</span></label>
              <div className='col-12 '>
                <input className='form-control' style={{fontSize: '13.5px',paddingRight: '1.8rem',}} name='password' type={showPassword ? "text" : "password"} id="password" placeholder='Enter password' onChange={changeHandler} value={form.password}/>
                <span className='' style={styles.fieldIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                      //<i className="fa fa-eye" style={styles.img} title='Show'></i>
                       <img src={open} style={styles.img} title='Show'/>
                    ) : (
                      //<i className="fa fa-eye-slash" style={styles.img} title='Show'></i>
                      <img src={closed} style={styles.img} title='Hide'/>
                    )
                  }
                </span>
                <span className='w-100 text-danger' style={{fontSize: '13.5px',fontWeight: '500',}}>{formError.password}</span>
              </div>
            </div>
            <div className='mt-3'>
              <button className='col-5 btn btn-sm btn-outline-success' onClick={()=>{onUserSubmit();}}>Sign In</button>
            </div>
          </div>
          
          <hr />
          <p className="text-center font-weight-bold" style={{ fontSize: '14px' }}>Or sign in with:</p>
          <div className="d-flex justify-content-around mb-2">
            <button className="btn btn-outline-danger btn-sm" onClick={() => socialLogin(googleProvider)}>
              <i className="fa fa-google"></i> Google
            </button>
            <button className="btn btn-outline-primary btn-sm" onClick={() => socialLogin(facebookProvider)}>
              <i className="fa fa-facebook"></i> Facebook
            </button>
            <button className="btn btn-outline-info btn-sm" onClick={() => socialLogin(twitterProvider)}>
              <i className="fa fa-twitter"></i> Twitter
            </button>
          </div>
          <div className='card-footer border-top-0' style={{fontSize: '15px',}}>
            <span>Don't have an account? <a href="" className='text-primary' onClick={()=>{
              navigate(ROUTES.register.name);
            }}>Sign up</a></span>
          </div>
        </div>
      </div>
    </div>
  </div>;

}
const styles ={
  fieldIcon:{
    float: "right",
    right: "8px",
    top: "-30px",
    position:"relative",
    zIndex: 2,
    height: "0px",
    cursor:'pointer',
  },
  img:{
    width:'1vw',
  },
} 

export default Login
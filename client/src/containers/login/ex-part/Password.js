import React, { useState,useEffect} from 'react'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import Swal from 'sweetalert2'
import ROUTES from '../../../navigations/Routes';


function Password(){
    const navigate = useNavigate();
    const token= localStorage.getItem('token');
    const Swal = require('sweetalert2');
    const [form, setForm] = useState({old:"",new:"",confirm:""});
    const [formError,setFormError] = useState({old:"",new:"",confirm:""});
    const [oldData,setOldData]= useState(null);

    useEffect(() => {
      if(token){
        axios.get("http://localhost:8081/profile?id="+token).then((d) => {
            setOldData(d.data.userData.password);
          });
      }
    }, []);
    
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

      function changePassword(){
        try {
            axios.post("http://localhost:8081/changepassword?id="+token,form).then((d)=>{ 
              if(d.data.status === "success"){
                navigate(ROUTES.home.name);
                Toast.fire({
                    icon: "success",
                    title: d.data.message,
                });
              }else{
                Toast.fire({
                  icon: "error",
                  title: d.data.message,
              });
              }
            });     
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
          old:"",new:"",confirm:""
        };
    
        if(form.old.trim().length == 0){
          errors = true;
          error = {...error,old:"Old password Empty !!!"};
        }else if(form.old != oldData ){
            errors = true;
            error = {...error,old:"password not same from old password !!!"}
        }

        if (form.new.trim().length == 0){
          errors = true;
          error = {...error,new:"New Password Empty !!!"};
        }else if(!(form.new.trim().length>=6 && form.new.trim().length<=12)){
          errors = true;
          error = {...error,new:"Password length bwt 6 to 12 chars long !!!"};
        } 

        if (form.confirm.trim().length == 0){
            errors = true;
            error = {...error,confirm:"Confirm Password Empty !!!"};
        }else if(form.new != form.confirm){
            errors = true;
            error = {...error,confirm:"Password and Confirm Password not same !!!"};
        }
    
        if(errors)
        {
          setFormError(error);
        }else
        {
          setFormError(error);
          changePassword();
        }
      }

      return <div>
        <Header/>
        <div className='row p-2 m-2'>
        <div className='mx-auto  rounded border-dark' style={{width:"30%"}}>
            <div class="card ">
            <div class="card-header bg-dark text-white">
                <h5 >Change Password</h5>
            </div>
            <div class="card-body mx-3">
                <div className='row '>
                    <label className='col-4' for="old">Old Password</label>
                    <div className='col-8'>
                        <input className='form-control' name='old' type="password" id="old" placeholder='Enter old password' onChange={changeHandler} value={form.old}/>
                        <p className='text-danger'>{formError.old}</p>
                    </div>
                </div>
                <div className='row '>
                    <label className='col-4' for="new">New Password</label>
                    <div className='col-8'>
                        <input className='form-control' name='new' type="password" id="new" placeholder='Enter new password' onChange={changeHandler} value={form.new}/>
                        <p className='text-danger'>{formError.new}</p>
                    </div>
                </div>
                <div className='row '>
                    <label className='col-4' for="confirm">Confirm Password</label>
                    <div className='col-8'>
                        <input className='form-control' name='confirm' type="password" id="confirm" placeholder='Enter confirm password' onChange={changeHandler} value={form.confirm}/>
                        <p className='text-danger'>{formError.confirm}</p>
                    </div>
                </div>
                <div >
                    <button className='col-5 btn btn-outline-success' onClick={()=>{onUserSubmit();}}>Save Changes</button>
                </div>
            </div>
            <div className='card-footer bg-dark text-white'>
                <p>Don't have an account? <a href=""className='text-warning' onClick={()=>{
                navigate(ROUTES.register.name);
                }}>Sign up</a></p>
            </div>
            </div>
        </div>
        </div>
      </div>;
}


export default Password
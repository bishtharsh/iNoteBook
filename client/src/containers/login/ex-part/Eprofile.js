import React,{ useState,useEffect} from 'react'
import Header from '../../../components/Header'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import Swal from 'sweetalert2'
import ROUTES from '../../../navigations/Routes';

function Eprofile() {
    const [form,setForm] = useState({name:"", phone:"",email:"",address:"",country:"",state:"",city:"",});
    const [formError,setFormError] = useState({ phone:"",address:"",country:"",state:"",city:"",});
    const navigate = useNavigate();
    const Swal = require('sweetalert2');
    const token= localStorage.getItem('token');

    //
      const [countries, setCountries] = useState([]);
      const [states, setStates] = useState([]);
      const [cities, setCities] = useState([]);
    
      const [selectedCountry, setSelectedCountry] = useState('');
      const [selectedState, setSelectedState] = useState('');
      const [selectedCity, setSelectedCity] = useState('');
    //

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

    useEffect(() => {
      if(token){
        axios.get("http://localhost:8081/profile?id="+token).then((d) => {
            const user = d.data.userData;
            setForm({...form,
                name:user.name,
                phone:user.phone,
                email:user.email,
                address:user.address,
                country:user.country,
                state:user.state,
                city:user.city
            });
            setSelectedCountry(user.country);
            setSelectedState(user.state);
            setSelectedCity(user.city);

            // Fetch states and cities for the preselected values
            if (user.country) {
                axios.get(`http://localhost:8081/state?countryId=${user.country}`)
                .then((response) => setStates(response.data.staData));
            }
            if (user.state) {
                axios.get(`http://localhost:8081/city?stateId=${user.state}`)
                .then((response) => setCities(response.data.citData));
            }
        });
      }
    }, []);


    // Fetch countries when the component mounts
    useEffect(() => {
        fetchCountries();
    }, []);

    function fetchCountries() {
        try {
        axios.get('http://localhost:8081/country').then((d)=>{
            setCountries(d.data.couData);
        }); 
        } catch (error) {
        console.error('Error fetching countries:', error);
        }
    };

    function fetchStates(countryId){
        try {
        axios.get('http://localhost:8081/state?countryId='+countryId).then((d)=>{
            setStates(d.data.staData);
        }); 
        } catch (error) {
        console.error('Error fetching states:', error);
        }
    };

    function fetchCities(stateId) {
        try {
        axios.get('http://localhost:8081/city?stateId='+stateId).then((d)=>{ // Replace with your API URL
            setCities(d.data.citData);
        }); 
        } catch (error) {
        console.error('Error fetching cities:', error);
        }
    };

    const handleCountryChange = (event) => {
        const countryId = event.target.value;
        setSelectedCountry(countryId);
        form.country = countryId;
        setSelectedState('');
        setSelectedCity('');
        setStates([]);
        setCities([]);

        if (countryId) {
        fetchStates(countryId);
        }
    };

    const handleStateChange = (event) => {
        const stateId = event.target.value;
        setSelectedState(stateId);
        form.state = stateId;
        setSelectedCity('');
        setCities([]);

        if (stateId) {
        fetchCities(stateId);
        }
    };

    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        form.city = event.target.value;
    };
    //

    function editUser(){
        try {
          axios.post("http://localhost:8081/editprofile?id="+token,form).then((d)=>{
            if(d.data.status == 'success'){
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
          phone:"",address:"",country:"",state:"",city:"",
        };
       
        if(form.phone.trim().length == 0){
          errors = true;
          error = {...error,phone:"phone Empty !!!"};
        }
        if(form.address.trim().length == 0){
            errors = true;
            error = {...error,address:"address Empty !!!"};
        }
        if(selectedCountry.trim().length == 0){
          errors = true;
          error = {...error,country:"Country Empty !!!"};
        }else if(selectedState.trim().length == 0){
          errors = true;
          error = {...error,state:"State Empty !!!"};
        }else if(selectedCity.trim().length == 0){
          errors = true;
          error = {...error,city:"City Empty !!!"};
        }
        
        if(errors)
        {
          setFormError(error);
        }else
        {
          setFormError(error);
          editUser();
        }
    }

    return <div>
        <Header/>
        <div className='row p-2 m-2'>
        <div className='mx-auto  rounded border-dark' style={{width:"28%"}}>
            <div class="card ">
            <div class="card-header bg-dark text-white">
                <h5 >Edit Profile</h5>
            </div>
            <div class="card-body mx-3">
                <div className='row '>
                    <label className='col-4' for="first">Name</label>
                    <div className='col-8'>
                        <input className='form-control' name='name' type="text" id="first" placeholder='Enter Full name' disabled value={form.name}/>
                        <p className='text-danger'>{formError.firstName}</p>
                    </div>
                </div>
                <div className='row '>
                    <label className='col-4' for="last">Phone No.</label>
                    <div className='col-8'>
                        <input className='form-control' name='phone' type="number"  id="last" placeholder='Enter Phone No.' onChange={changeHandler} value={form.phone}/>
                        <p className='text-danger'>{formError.phone}</p>
                    </div>
                </div>
                <div className='row '>
                    <label className='col-4' for="email">E-mail</label>
                    <div className='col-8'>
                        <input className='form-control' name='email' type="text" id="email" placeholder='Enter e-mail' onChange={changeHandler} value={form.email} disabled/>
                        <p className='text-danger'>{formError.email}</p>
                    </div>
                </div>
                <div className='row '>
                    <label className='col-4' for="add">Address</label>
                    <div className='col-8'>
                        <input className='form-control' name='address' type="text" id="add" placeholder='Enter Address' onChange={changeHandler} value={form.address}/>
                        <p className='text-danger'>{formError.address}</p>
                    </div>
                </div>
                <div className='row '>
                    <label className='col-4' for="country">Country</label>
                    <div className='col-8'>
                        {/* Country Dropdown */}
                        <select 
                        value={selectedCountry} 
                        onChange={handleCountryChange} 
                        className='form-control ' id='country'
                        >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country._id} value={country._id}>
                            {country.name}
                            </option>
                        ))}
                        </select>
                        <p className='text-danger'>{formError.country}</p>
                    </div>
                </div>
                <div className='row '>
                <label className='col-4' for="state">State</label>
                    <div className='col-8'>
                        {/* State Dropdown */}
                        <select
                        value={selectedState}
                        onChange={handleStateChange}
                        disabled={!selectedCountry}
                        className='form-control' id='state'
                        >
                        <option value="">Select State</option>
                        {states?.map((state) => (
                            <option key={state._id} value={state._id}>
                            {state.name}
                            </option>
                        ))}
                        </select>
                        <p className='text-danger'>{formError.state}</p>
                    </div>
                </div>
                <div className='row '>
                    <label className='col-4' for="city">City</label>
                    <div className='col-8'>
                        {/* City Dropdown */}
                        <select
                        value={selectedCity}
                        onChange={handleCityChange}
                        disabled={!selectedState}
                        className='form-control' id='city'
                        >
                        <option value="">Select City</option>
                        {cities?.map((city) => (
                            <option key={city._id} value={city._id}>
                            {city.name}
                            </option>
                        ))}
                        </select>
                        <p className='text-danger'>{formError.city}</p>
                    </div>
                </div>
                <div >
                    <button className='col-5 btn btn-outline-success p-1' onClick={()=>{onUserSubmit();}}>Save Changes</button>
                </div>
            </div>
            <div className='card-footer bg-dark text-white'>
                <p>Already have an account? <a href=""className='text-warning' onClick={()=>{
                navigate(ROUTES.login.name);
                }}>Log in</a></p>
            </div>
            </div>
        </div>
        </div>
    </div>
}

export default Eprofile

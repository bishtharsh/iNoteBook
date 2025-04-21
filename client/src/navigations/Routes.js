import About from "../containers/about/About";
import Contact from "../containers/contact/Contact";
import Login from "../containers/login/Login";
import Register from "../containers/register/Register";
import Support from "../containers/support/Support";
import Home from "../containers/home/Home";
import Profile from "../containers/profile/Profile";



const ROUTES = {
    about:{
        name:"/about",
        component:<About/>,
    },
    contact:{
        name:"/contact",
        component:<Contact/>,
    }, 
    support:{
        name:"/support",
        component:<Support/>,
    },
    login:{
        name:"/",
        component:<Login/>,
    },
    register:{
        name:"/register",
        component:<Register/>,
    },
    home:{
        name:"/home",
        component:<Home/>,
    },
    profile:{
        name:"/profile",
        component:<Profile/>,
    },
};

export default ROUTES;
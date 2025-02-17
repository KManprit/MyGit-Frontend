import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'


// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";
// Auth Context
import { useAuth } from "./authContext";

const ProjectRoutes = ()=>{
    const{currentUser , setCurrentUser} = useAuth();
    const navigate = useNavigate();//jb bhi redirection krna h uske liye navigate ka use krege 


    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");
        if(userIdFromStorage && !currentUser){//id hai but user login nh h to login kr dege 
          setCurrentUser(userIdFromStorage);
          
        } 
        //agr nh h login to redirect them to the login router 
        if(!userIdFromStorage &&  !["/auth", "/signup"].includes(window.location.pathname)){//login  nh h aur auth and signup per bhi nh h to redirect kr dege auth per
            navigate("/auth");
        }

        //already logged in hai direct dashboard per le ke jana hai
        if(userIdFromStorage && window.location.pathname == '/auth'){
            navigate("/");
        }

    },[currentUser, navigate, setCurrentUser]);//if anyone of these will changes then it will trigger reload


    let element = useRoutes([
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },

        {
            path : "/create",
            element:<CreateRepo/>

        },

        {
            path: "*", // For undefined routes
            element: <h1>404 - Page Not Found</h1>,
        },
    ]);
    return element;


}

export default ProjectRoutes;
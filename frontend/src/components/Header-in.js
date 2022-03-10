import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { NavLink, useNavigate  } from 'react-router-dom';
 
const Header = () => {
    const [myId, setId] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate(); 
 
    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setId(decoded.userId);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
              navigate("/", { replace: true });
            }
        }
    }
  
    const axiosJWT = axios.create();
  
    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/users/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/users/logout');
            navigate("/", { replace: true });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <header>
                <h1 className="py-4 px-3"><img className='is-centered' src="/assets/icon-left-font-monochrome-black.svg" width="200" alt="Groupomania" /></h1>
                <div className="tabs is-centered">
                    <ul>
                        <li>
                            <NavLink to="home" className={({ isActive }) => (isActive ? 'nav-active' : 'inactive')}>
                                <span>Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'profile/id/' + myId} onClick={() => navigate(`/profile/id/${myId}`)} className={({ isActive }) => (isActive ? 'nav-active' : 'inactive')}>
                                <span>Mon profil</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="settings" className={({ isActive }) => (isActive ? 'nav-active' : 'inactive')}>
                                <span>Éditer mon profil</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="logout" onClick={Logout} className={({ isActive }) => (isActive ? 'nav-active' : 'inactive')}>
                                {/* <span className="icon is-small"><i className="fa-right-from-bracket" aria-hidden="true"></i></span> */}
                                <span>Se déconnecter</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </header>
        </>
    )
}
 
export default Header
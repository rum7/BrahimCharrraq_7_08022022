import React from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
 
const Navbar = () => {
    const navigate = useNavigate();
 
    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/logout');
            navigate("/", { replace: true });
        } catch (error) {
            console.log(error);
        }
    }
 
    return (
        <>
            <header className="hero has-background-info-light p-3">
                <h1 className="title is-1 has-text-info">Groupomania</h1>
                <nav className="breadcrumb">
                    <ul className="">
                        <li><Link to="/profile" className="has-text-info">Mon profil</Link></li>
                        <li><Link to="/settings" className="has-text-info">Éditer mon profil</Link></li>
                        <li><Link to="#" className="has-text-info" onClick={Logout}>Se déconnecter</Link></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}
 
export default Navbar
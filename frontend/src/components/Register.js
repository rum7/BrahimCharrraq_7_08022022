import React, { useState } from 'react'
import axios from "axios";
import { useNavigate  } from "react-router-dom";

const Register = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
 
    const Signup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/users', {
                nom: nom,
                prenom: prenom,
                email: email,
                password: password,
                confPassword: confPassword
            });
            navigate("/login", { replace: true });
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
 
    return (
        <>
            <h2 className="title is-6 has-text-light mb-2 px-2 pt-1 pb-2 has-background-info box">S'inscrire</h2>
            <form onSubmit={Signup} className="box">
                <p className="has-text-centered">{msg}</p>
                <div className="field">
                    <label htmlFor='prenom' className="label">Prenom</label>
                    <div className="controls">
                        <input name='prenom' type="text" className="input" placeholder="Prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor='nom' className="label">Nom</label>
                    <div className="controls">
                        <input name='nom' type="text" className="input" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                    </div>
                </div>

                <div className="field mt-5">
                    <label className="label">Email</label>
                    <div className="controls">
                        <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Password</label>
                    <div className="controls">
                        <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Confirm Password</label>
                    <div className="controls">
                        <input type="password" className="input" placeholder="******" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <button className="button has-background-info-light has-text-info is-fullwidth">Inscription</button>
                </div>
            </form>
        </>
    )
}
 
export default Register
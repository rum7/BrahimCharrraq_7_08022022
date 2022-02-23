import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const navigate = useNavigate();
 
    const Auth = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/login', {
                email: email,
                password: password
            });
            navigate("/profile", { replace: true });
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
 
    return (
        <>
            <h2 className="title is-6 has-text-light mb-2 px-2 pt-1 pb-2 has-background-info box">Se connecter</h2>
            <form onSubmit={Auth} className="box">
                <p className="has-text-centered">{msg}</p>
                <div className="field mt-5">
                    <label className="label">Email</label>
                    <div className="controls">
                        <input type="text" className="input" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <label className="label">Password</label>
                    <div className="controls">
                        <input type="password" className="input" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
                <div className="field mt-5">
                    <button className="button has-background-info-light has-text-info is-fullwidth">Connexion</button>
                </div>
            </form>
        </>
    )
}
 
export default Login
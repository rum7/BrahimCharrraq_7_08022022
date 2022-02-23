import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Dashboard = () => {
  const [myId, setId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [image, setImage] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
      refreshToken();
  }, []);

  const refreshToken = async () => {
      try {
          const response = await axios.get('http://localhost:5000/token');
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setId(decoded.userId);
          setNom(decoded.nom);
          setPrenom(decoded.prenom);
          setImage(decoded.image);
          setEmail(decoded.email);
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
          const response = await axios.get('http://localhost:5000/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setNom(decoded.nom);
          setPrenom(decoded.prenom);
          setImage(decoded.image);
          setEmail(decoded.email);
          setExpire(decoded.exp);
      }
      return config;
  }, (error) => {
      return Promise.reject(error);
  });

  const updateUser = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('image', image);
        formData.append('email', email);
        await axios.put(`http://localhost:5000/users/${myId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate("/profile", { replace: true });

        // await axios.put(`http://localhost:5000/users/${myId}`, {
        //   headers: { Authorization: `Bearer ${token}` },
        //   nom: nom,
        //   prenom: prenom,
        //   image: image,
        //   email: email
        // });
    } catch (error) {
      if (error.response) {
          setMsg(error.response.data.msg);
      }
    }
  }

  const delUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${myId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate("/register", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <>
      <section className="hero has-background-light box">
        <h2 className="title is-6 has-text-light mb-2 px-2 pt-1 pb-2 has-background-link box">Mes info</h2>
        <p className="has-text-centered">{msg}</p>
        <form onSubmit={updateUser}>
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
          <div className="field">
            <label htmlFor='image' className="label">Image</label>
            <div className="controls">
                <input name='image' type="file" className="input" onChange={(e) => setImage(e.target.files[0])} />
            </div>
          </div>
          <div className="field mt-5">
            <label className="label">Email</label>
            <div className="controls">
                <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="field mt-5">
            <button className="button is-success is-outlined">
              <span>Enregistrer les modifications</span>
              <span className="icon is-small">
                <i className="fas fa-check"></i>
              </span>
            </button>
          </div>
        </form>
        <p className="has-text-centered">{msg}</p>
      </section>
      <div className="buttons is-justify-content-flex-end">
        <button onClick={() => {delUser(myId)}} type="submit" className="button is-danger is-outlined">
          <span>Supprimer mon compte</span>
          <span className="icon is-small">
            <i className="fas fa-times"></i>
          </span>
        </button>
      </div>
    </>
  );
}

export default Dashboard
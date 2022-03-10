import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

const Dashboard = () => {
  const [myId, setId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [userImg, setUserImg] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
      refreshToken();
      getUsers();
  }, []);

  const refreshToken = async () => {
      try {
          const response = await axios.get('http://localhost:5000/users/token');
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setId(decoded.userId);
          setNom(decoded.nom);
          setPrenom(decoded.prenom);
          setUserImg(decoded.userImg);
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
          const response = await axios.get('http://localhost:5000/users/token');
          config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setNom(decoded.nom);
          setPrenom(decoded.prenom);
          setUserImg(decoded.userImg);
          setEmail(decoded.email);
          setExpire(decoded.exp);
      }
      return config;
  }, (error) => {
      return Promise.reject(error);
  });

  const getUsers = async () => {
      const response = await axiosJWT.get('http://localhost:5000/users', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      setUsers(response.data);
  }

  // const delUser = async () => {
  //   try {
  //     await axios.delete(`http://localhost:5000/users/${myId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     navigate("/register", { replace: true });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return(
    <>
      <section>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
              <img src={'images/profilepictures/' + userImg} alt='pp' />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{prenom} {nom}</p>
              <p className="subtitle is-6">{email}</p>
            </div>
          </div>
        </div>

        <h2 className="title is-6 mb-2 px-2 pt-1 pb-2 has-background-link has-text-light box">Tous les membres</h2>
        <table className="table is-striped is-fullwidth mb-2">
            <thead>
                <tr>
                  <th>img</th>
                  <th>id</th>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Email</th>
                  {/* <th>Del</th> */}
                </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td><figure className="image is-96x96"><img id="imgPreview" src={'images/profilepictures/' + user.userImg} alt='pp' /></figure></td>
                  {/* <td>{user.image}</td> */}
                  <td>{user.id}</td>
                  <td>{user.prenom}</td>
                  <td>{user.nom}</td>
                  <td>{user.email}</td>
                  {/* <td><button onClick={() => {delUser(user.id)}} className="button is-danger is-fullwidth is-outlined">Supprimer</button></td> */}
                </tr>
              ))}
            </tbody>
        </table>
      </section>
    </>
  );
}

export default Dashboard
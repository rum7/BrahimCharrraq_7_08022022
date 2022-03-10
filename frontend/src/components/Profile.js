import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Dashboard = () => {
  const [myId, setId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [userImg, setUserImg] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [user, setUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate(); 

  const { id } = useParams();
  // console.log("test user info");
  // console.log(id);
  
  useEffect(() => {
      refreshToken();
      getUser();
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

  const getUser = async () => {
      const response = await axiosJWT.get(`http://localhost:5000/users/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      // console.log("test user info");
      //console.log(user.userImg);
      // console.log(user.nom)
      // console.log(user.prenom)
      // console.log(user.userImg)
  };

  const getUsers = async () => {
    const response = await axiosJWT.get('http://localhost:5000/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setUsers(response.data);
}

  const initialValues = {
    nom: `${nom}`,
    prenom: `${prenom}`,
    email: `${email}`,
    userImg: `${userImg}`,
    postMsg: "",
    postImg: ""
  };

  const validationSchema = Yup.object().shape({
    postMsg: Yup.string().min(1, "Le message doit contenir au moins 1 caractère").required("")
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
        await axios.post('http://localhost:5000/posts', data);
        const postToAdd = {
          nom: `${nom}`,
          prenom: `${prenom}`,
          email: `${email}`,
          userImg: `${userImg}`,
          postMsg: data.postMsg,
          postImg: data.postImg
        };
        setPosts([...posts, postToAdd]);
        // navigate("/home", { replace: true });
        window.location.reload();
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
  };

  return(
    <>
        <section className="mesInfos">
          <div className="card">
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                  <img className="userImg is-rounded" src={'../images/profilepictures/' + user.userImg} alt='pp' />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="publish-post">
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} enableReinitialize={true}>
                      <Form>
                        { msg ? (<p className="notification is-danger is-size-6 p-2 mt-1">{msg}</p>) : ("")}
                        <div className="field">
                          <div className="controls grow-wrap">
                            <Field name="postMsg" as="textarea" placeholder={'Alors ' + user.prenom +', quoi de neuf ?' } autoComplete="off" className="textarea is-dark-light" rows="2"></Field>
                          </div>
                          <ErrorMessage name="postMsg" component="p" className="notification is-danger is-italic is-light p-2 mt-2" />
                        </div>
                        <button type='submit' className="button is-pulled-right is-link is-outlined mt-4">Envoyer</button>
                      </Form>
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tousLesMessages mt-5">
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
                  <td><figure className="image is-96x96"><img id="imgPreview" src={'../images/profilepictures/' + user.userImg} alt='pp' /></figure></td>
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
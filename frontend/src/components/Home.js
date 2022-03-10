import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import fr from 'timeago.js/lib/lang/fr';
timeago.register('fr', fr);


const Dashboard = () => {
  const [myId, setId] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [userImg, setUserImg] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate(); 

  const location = useLocation();

  useEffect(() => {
      refreshToken();
      getPosts();
  }, [location.key]);

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
        navigate("/home", { replace: true });
        // window.location.reload();
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
  };

  const getPosts = async () => {
    const response = await axiosJWT.get('http://localhost:5000/posts', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setPosts(response.data);
  }

  const LastSeen = (date) => {
    return (<TimeAgo datetime={date} locale='fr' />);
  }

  return(
    <>
        <section className="mesInfos">
          <div className="card">
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                  <img className="userImg is-rounded" src={'images/profilepictures/' + userImg} alt='pp' />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="publish-post">
                    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema} enableReinitialize={true}>
                      <Form>
                        { msg ? (<p className="notification is-danger is-size-6 p-2 mt-1">{msg}</p>) : ("")}
                        <div className="field">
                          <div className="controls grow-wrap">
                            <Field name="postMsg" as="textarea" placeholder={'Alors ' + prenom +', quoi de neuf ?' } autoComplete="off" className="textarea is-dark-light" rows="2"></Field>
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
          {posts.slice(0).reverse().map((post, index) => {
          return post.nom === `${nom}` ?
          <div key={index} className="card mb-5">
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                  <img className="userImg is-rounded" src={'images/profilepictures/' + post.userImg} alt='pp' />
                  </figure>
                </div>
                <div className="media-content">
                <p className="title is-size-6 has-text-info-dark">
                  <NavLink to={'../profile/' + post.userId} className="">
                  {post.prenom} {post.nom} </NavLink> <span className="has-text-grey has-text-weight-light">{post.email}</span>
                </p>
                <p className="subtitle is-size-7 has-text-grey">{LastSeen(post.createdAt)}</p>
                </div>
              </div>
              <div className="content">
                <p>{post.postMsg}</p>
              </div>
            </div>
          </div>
          :
          <div key={index} className="card mb-5">
          <div className="card-content">
            <div className="media">
              <div className="media-left">
                <figure className="image is-48x48">
                <img className="userImg is-rounded" src={'images/profilepictures/' + post.userImg} alt='pp' />
                </figure>
              </div>
              <div className="media-content">
                <p className="title is-size-6 has-text-grey-dark">
                  <NavLink to={'../profile/' + post.userId} className="">
                  {post.prenom} {post.nom} </NavLink><span className="has-text-grey has-text-weight-light">{post.email}</span>
                </p>
                <p className="subtitle is-size-7 has-text-grey">{LastSeen(post.createdAt)}</p>
              </div>
            </div>
            <div className="content">
              <p>{post.postMsg}</p>
            </div>
          </div>
        </div>
        })}
        </section>
    </>
  );
}

export default Dashboard
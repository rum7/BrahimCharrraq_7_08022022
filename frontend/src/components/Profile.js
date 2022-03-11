import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import TimeAgo from 'timeago-react';
import * as timeago from 'timeago.js';
import fr from 'timeago.js/lib/lang/fr';
timeago.register('fr', fr);


const Dashboard = () => {
  const [isAdmin, setAdmin] = useState('');
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 

  const { id } = useParams();
  const location = useLocation()

  useEffect(() => {
      refreshToken();
      getUser();
      getPosts();
  }, [location.key]);

  const refreshToken = async () => {
      try {
          const response = await axios.get('http://localhost:5000/users/token');
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setAdmin(decoded.isAdmin);
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
          setAdmin(decoded.isAdmin);
          setExpire(decoded.exp);
      }
      return config;
  }, (error) => {
      return Promise.reject(error);
  });

  const getPosts = async () => {
    const response = await axiosJWT.get(`http://localhost:5000/posts/id/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setPosts(response.data);
  }

  const getUser = async () => {
    const response = await axiosJWT.get(`http://localhost:5000/users/id/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setUser(response.data);
  }

  const deletePost = async (postId) => {
    try {
      if (window.confirm("Voulez-vous vraiment supprimer ce message ?")) {
        await axios.delete(`http://localhost:5000/posts/id/${postId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // navigate("/profile", { replace: true }); 
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const delUser = async (userId) => {
    try {
      if (window.confirm("Voulez-vous vraiment supprimer ce compte ?")) {
        await axios.delete(`http://localhost:5000/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate("/home", { replace: true }); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const LastSeen = (date) => {
    return (<TimeAgo datetime={date} locale='fr' />);
  }

  return(
    <>
        <section className="mesInfos">
          <div className={user.isAdmin == 1 ? ("card mb-5 has-background-danger-light") : ("card mb-5 has-background-info-light")}>
            <div className="card-content">
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                  <img className="userImg is-rounded" src={'../images/profilepictures/' + user.userImg} alt='pp' />
                  </figure>
                </div>
                <div className="media-content">
                  <p className={user.isAdmin == 1 ? ("title is-size-6 has-text-danger-dark mb-5") : ("title is-size-6 has-text-info-dark mb-5")}>
                    {user.prenom} {user.nom} <span className="has-text-grey has-text-weight-light">{user.email}</span>
                  </p>
                  <p className="subtitle is-italic is-size-7 has-text-grey"> À rejoint l'équipe {LastSeen(user.createdAt)}</p>
                </div>
              </div>
              <div className="content pb-5">
                {isAdmin == 1 ? (<button type='button' className="button is-pulled-right is-danger is-outlined" onClick={() => {delUser(user.id)}}>Supprimer</button>) : ('')}
              </div>
            </div>
          </div>
        </section>

        <section className="tousLesMessages">
          { posts.slice(0).reverse().map((post, index) => {
            return(
            <div key={index} className="card mb-5">
              <div className="card-content">
                <div className="media">
                  <div className="media-left">
                    <figure className="image is-48x48">
                    <img className="userImg is-rounded" src={'../images/profilepictures/' + post.userImg} alt='pp' />
                    </figure>
                  </div>
                  <div className="media-content">
                    <p className={user.isAdmin == 1 ? ("title is-size-6 has-text-danger-dark mb-5") : ("title is-size-6 has-text-info-dark mb-5")}>
                    {post.prenom} {post.nom} <span className="has-text-grey has-text-weight-light">{post.email}</span>
                    </p>
                    <p className="subtitle is-size-7 has-text-grey">{LastSeen(post.createdAt)}</p>
                  </div>
                </div>
                <div className="content pb-5">
                  <p>{post.postMsg}</p>
                  {isAdmin == 1 ? (<button type='button' className="button is-pulled-right is-danger is-outlined" onClick={() => {deletePost(post.id)}}>Supprimer</button>) : ('')}
                </div>
              </div>
            </div>
            )
          })}
        </section>
    </>
  );
}

export default Dashboard
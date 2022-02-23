import React from 'react';
import { Link } from "react-router-dom";

class Title extends React.Component {
  render() {
    return (
      <>
        <h1 className="title is-1">Groupomania</h1>
      </>
    );
  }
}

class Nav extends React.Component {
  render() {
    return (
      <>
        <nav className="breadcrumb">
          <ul className="">
            {/* <li><Link to="/">Accueil</Link></li> */}
            <li><Link to="/Register">S'inscrire</Link></li>
            <li><Link to="/Login">Se connecter</Link></li>
          </ul>
        </nav>
      </>
    );
  }
}

const Header = () => {
  return(
    <>
      <header className="hero is-info p-3">
        <Title />
        <Nav />
      </header>
    </>
  );
};

export default Header;
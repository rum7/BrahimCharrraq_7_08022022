import React from 'react';
import { Link } from "react-router-dom";

class Title extends React.Component {
  render() {
    return (
      <>
        <h3 className="title is-5 m-0">Groupomania</h3>
      </>
    );
  }
}

class Nav extends React.Component {
  render() {
    return (
      <>
        <div className="column">
        <h4>Transactions</h4>
          <ul>
            <li><a>Payments</a></li>
            <li><a>Transfers</a></li>
            <li><a>Balance</a></li>
          </ul>
        </div>

        <div className="column">
        <h4>Transactions</h4>
          <ul>
            <li><a>Payments</a></li>
            <li><a>Transfers</a></li>
            <li><a>Balance</a></li>
          </ul>
        </div>

        <div className="column">
          <h4>Transactions</h4>
          <ul>
            <li><a>Payments</a></li>
            <li><a>Transfers</a></li>
            <li><a>Balance</a></li>
          </ul>
        </div>
      </>
    );
  }
}

const Footer = () => {
  return(
    <>
      <footer className="hero is-link p-3">
        <Title />
        <div className="columns is-mobile mt-1">
          <Nav />
        </div>
      </footer>
    </>
  );
};

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css';

const NavBar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <img src="/assets/logo.png" alt="Home" className="logo" />
      </Link>
    </nav>
  );
};

export default NavBar;
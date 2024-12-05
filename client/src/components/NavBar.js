
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; 
import logo from '../assets/logo.png'; 

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
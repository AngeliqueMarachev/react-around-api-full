import React from "react";
import { Link, useLocation } from 'react-router-dom';
import logo from "../images/logo.svg";


function Header({ loggedIn, email, signOut }) {

  const location = useLocation();

  return (
    <header className="header">
      <img
        src={logo}
        alt="Around the U.S logo"
        className="header__logo"
        id="logo"
      />

      <div>
        {loggedIn ? (
          <div className="header__container">
            <p className="header__email">{email}</p>
            <div className='header__text' onClick={signOut}>
              Log Out
            </div>
          </div>
        ) : (
            <div>
              <Link to={location.pathname === '/signin' ? '/signup' : '/signin'} className='header__link'>
              {location.pathname === '/signin' ? 'Sign up' : 'Sign in'} 
              </Link>
            </div>
        )}
      </div>
    </header>
  );
}

export default Header;
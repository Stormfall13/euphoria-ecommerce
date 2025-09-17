import React from 'react';

import logo from '../assets/Logo.png';
import search from '../assets/search.svg';

const AuthHeader = () => {
  return (
    <div className='auth__header'>
        <div className="auth__header-wrapp">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="search__wrapp">
                <button className='search__btn'>
                  <img src={search} alt="search img" />
                </button>
                <input type="text" placeholder='Search'/>
            </div>
          <select className='language__select'>
            <option value="English (united States)">English (united States)</option>
            <option value="Russian (Russian Federation)">Russian (Russian Federation)</option>
          </select>
          <div className="btn__wrapp">
            <a href="/login" className="btn__link">Login</a>
            <a href="/register" className="btn__link">Sign Up</a>
          </div>
        </div>
    </div>
  )
}

export default AuthHeader;

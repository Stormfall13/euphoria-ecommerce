import React from 'react';

import facebook from '../assets/facebook.svg';
import instagram from '../assets/instagram.svg';
import linkedin from '../assets/linkedin.svg';
import twitter from '../assets/twitter.svg';

import popularArrowDown from '../assets/popular-arrow-down.svg';

import appstore from '../assets/appstore.png';
import googleplay from '../assets/googleplay.png';

const socialFooterData = [
    {
        id: 1,
        icon: facebook,
        link: '#',
    },
    {
        id: 2,
        icon: instagram,
        link: '#',
    },
    {
        id: 3,
        icon: linkedin,
        link: '#',
    },
    {
        id: 4,
        icon: twitter,
        link: '#',
    },
]

const Footer = () => {
  return (
    <footer className='footer'>
        <div className="footer__wrapp">
            <div className="footer__wrapp-colums">
                <div className="three__colums-menu">
                    <nav className="footer__menu">
                        <p className="title__menu">Need Help</p>
                        <ul>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">Track Order</a></li>
                            <li><a href="#">Return & Refunds</a></li>
                            <li><a href="#">FAQ's</a></li>
                            <li><a href="#">Career</a></li>
                        </ul>
                    </nav>
                    <nav className="footer__menu">
                        <p className="title__menu">Company</p>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">euphoria Blog</a></li>
                            <li><a href="#">euphoriastan</a></li>
                            <li><a href="#">Collaboration</a></li>
                            <li><a href="#">Media</a></li>
                        </ul>
                    </nav>
                    <nav className="footer__menu">
                        <p className="title__menu">More Info</p>
                        <ul>
                            <li><a href="#">Term and Contitions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Shipping Policy</a></li>
                            <li><a href="#">Sitemap</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="contacts">
                    <p className="title__contacts">Location</p>
                    <div className="contacts__wrapp">
                        <p className="contacts__text">support@euphoria.in</p>
                        <p className="contacts__text">Eklingpura Chouraha, Ahmedabad Main Road</p>
                        <p className="contacts__text">(NH 8- Near Mahadev Hotel) Udaipur, India- 313002</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="footer__middle">
            <div className="social__wrapp">
                {socialFooterData.map(items => (
                    <a href={items.link} className="social__link" key={items.id}>
                        <img src={items.icon} alt="social" />
                    </a>
                ))}
            </div>
            <div className="download__app-wrapp">
                <p className="title__download">Download The App</p>
                <div className="variant__download">
                    <div className="variant__img"><img src={googleplay} alt="google play" /></div>
                    <div className="variant__img"><img src={appstore} alt="app store" /></div>
                </div>
            </div>
        </div>
        <div className="popular__categories">
            <div className="popular__btn">
                <p className='popular__title'>Popular Categories</p>
                <div className="arrow__popular">
                    <img src={popularArrowDown} alt="arrow" />
                </div>
            </div>
        </div>
        <p className="copyright">Copyright © 2023 Euphoria Folks Pvt Ltd. All rights reserved.</p>
    </footer>
  )
}

export default Footer

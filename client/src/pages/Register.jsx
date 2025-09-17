import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AuthHeader from "../components/AuthHeader";

import google from '../assets/google.png';
import twitter from '../assets/twitter.png';
import hideView from '../assets/hide-view.svg';
import showView from '../assets/show-view.svg';

import registerImg from '../assets/bbanner22.png';


const Register = () => {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();
    const [hiddenPassword, setHiddenPassword] = useState(true);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, form);
            navigate("/login");
        } catch (error) {
            console.error("Ошибка регистрации:", error.response?.data?.message);
            alert(error.response?.data?.message)
        }
    };

    return (
        <>
        <AuthHeader />
        <div className="auth-container">
            <div className="auth__left">
                <img src={registerImg} alt="register img" />
            </div>
            <div className="auth__right">
                <div className="sign__header">
                    <h1 className="sign__title">Sign Up</h1>
                    <p className="sign__text">Sign up for free to access to in any of our products </p>
                </div>
                <div className="social__sign">
                    <a href="#" className="social__sign-link">
                        <img src={google} alt=" sign img" />
                        <p className="social__text">Continue With Google</p>
                    </a>
                    <a href="#" className="social__sign-link">
                        <img src={twitter} alt=" sign img" />
                        <p className="social__text">Continue With Twitter</p>
                    </a>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input__wrapp">
                        <div className="input__wrapper">
                            <label htmlFor="username">User name</label>
                            <input id="username" type="text" name="username"  value={form.username} onChange={handleChange} required />
                        </div>
                        <div className="input__wrapper">
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" name="email" value={form.email} onChange={handleChange} required />
                        </div>
                        <div className="input__wrapper">
                                <div className="label__hidden-btn">
                                    <label htmlFor="password">Password</label>
                                    <button 
                                        type="button"
                                        className="hidden__btn"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setHiddenPassword(!hiddenPassword);
                                        }}
                                        >
                                            {hiddenPassword ? (
                                                <img src={hideView} alt="hide"/>
                                            ) : (
                                                <img src={showView} alt="show"/>
                                            )}
                                            {hiddenPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <input 
                                    id="password" 
                                    type={`${hiddenPassword ? 'password' : 'text'}`} 
                                    name="password"  
                                    value={form.password} 
                                    onChange={handleChange} required />
                                    <p className="help__password">
                                        Use 8 or more characters with a mix of letters, numbers & symbols
                                    </p>
                            </div>
                    </div>
                    <div className="checkbox__wrapp">
                        <div className="checkbox__wrapper">
                            <input id="checkbox" type="checkbox"/>
                            <label htmlFor="checkbox">
                                Agree to our <a href="#">Terms of use</a> and 
                                <a href="#">Privacy Policy</a>
                            </label>
                        </div>
                        <div className="checkbox__wrapper">
                            <input id="checkbox" type="checkbox"/>
                            <label htmlFor="checkbox">Subclrible to our monthly newsletter</label>
                        </div>
                    </div>
                    <div className="sign__wrapp">
                        <button type="submit" className="submit__btn">Sign Up</button>
                        <p className="sing__text">Already have an account?
                            <a href="/login">Log in
                        </a></p>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default Register;

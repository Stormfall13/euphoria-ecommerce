import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginSuccess } from "../store/slices/authSlice";

import AuthHeader from "../components/AuthHeader";

import loginImg from '../assets/login-img.png';
import google from '../assets/google.png';
import twitter from '../assets/twitter.png';
import hideView from '../assets/hide-view.svg';
import showView from '../assets/show-view.svg';



const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [hiddenPassword, setHiddenPassword] = useState(true);

    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);
            // console.log("Ответ сервера:", res.data); // 🔍 Лог для проверки
            dispatch(loginSuccess(res.data));
            navigate("/");
        } catch (error) {
            console.error("Ошибка входа:", error.response?.data?.message);
            alert(error.response?.data?.message)
        }
    };

    return (
        <>
        <AuthHeader />
        <div className="auth-container">
            <div className="auth__left">
                <img src={loginImg} alt="login img" />
            </div>
            <div className="auth__right">
                <h1 className="sign__title">Sign in Page</h1>
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
                <div className="alternative__line">
                    <div className="line"></div>
                    <p className="alternative__text">OR</p>
                    <div className="line"></div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input__wrapp">
                        <div className="input__wrapper">
                            <label htmlFor="email">User name or email address</label>
                            <input 
                                id="email" 
                                type="email" 
                                name="email" 
                                value={form.email} 
                                onChange={handleChange} required />
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
                                <div className="forget__link">Forget your password</div>
                        </div>
                    </div>
                    <div className="sign__wrapp">
                        <button type="submit" className="submit__btn">Sign Up</button>
                        <p className="sing__text">Don't have an account? 
                            <a href="/register">Sign up</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default Login;

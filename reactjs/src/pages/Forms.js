import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../components/context/AuthContext";
import axiosInstance from "../components/axiosInstance";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const LoginForm = ({ handleChange, handleSubmit }) => (
    <>
        <h4 className="text-center mb-4" style={{fontFamily:"fantasy"}}>Login</h4>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Enter your username"
                    required
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    required
                    onChange={handleChange}
                />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
                Login
            </button>
        </form>
    </>
);

const SignupForm = ({ handleChange, handleSubmit }) => (
    <>
        <h4 className="text-center mb-4" style={{fontFamily:"fantasy"}}>Signup</h4>
        <form onSubmit={handleSubmit} >
            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Enter your username"
                    required
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    onChange={handleChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    required
                    onChange={handleChange}
                />
                <ul class="form-text text-danger">
                    <li>Minimum 8 characters</li>
                    <li>Lowercase and Uppercase Letters</li>
                    <li>Numbers & Symbols</li>
                </ul>
            </div>
            <button type="submit" className="btn btn-success w-100 mt-3">
                Signup
            </button>
        </form>
    </>
);

export default function Forms() {
    const [formType, setFormType] = useState("login"); // Track form type
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false); // Loading state for spinner
    const navigate = useNavigate();
    const { isAuthenticated, verifyToken } = useAuthContext();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        /*
            ^ - Asserts the start of the string.
            (?=.*[a-z]) - Ensures there is at least one lowercase letter.
            (?=.*[A-Z]) - Ensures there is at least one uppercase letter.
            (?=.*\d) - Ensures there is at least one digit (number).
            (?=.*[\W_]) - Ensures there is at least one special character (non-word character or _). This covers symbols like @, #, !, etc.
            .{8,} - Ensures the total length is at least 8 characters.
            $ - Asserts the end of the string.
        */
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password); // True if password match requirements

    }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post("token/", {
                username: formData.username,
                password: formData.password,
            });
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);
            localStorage.setItem('username', response.data.user.username);
            axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access;
            await verifyToken();
            navigate("/");
        } catch (err) {
            console.error(err);
            toast.error("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        console.log()
        if (validatePassword(formData.password) ) {
            setLoading(true);
            try {
                const response = await axiosInstance.post("signup/", formData);
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
                axiosInstance.defaults.headers["Authorization"] = "Bearer " + response.data.access;
                await verifyToken();
                navigate("/");
            } catch (err) {
                console.error(err);
                toast.error("Signup failed. Please check your details and try again.",);
            } finally {
                setLoading(false);
            }
        }else {
            toast.error("Invalid password .",{
                autoClose: 5000,

            });
        }

    };

    useEffect(() => {
        console.log("Auth state changed:", isAuthenticated);
    }, [isAuthenticated]);

    return (
        <div className="container-fluid">
            <div className="row justify-content-center align-items-center" id="auth-form">
                <div className="col-auto card shadow bg-light">
                    <div className=" card-body d-flex flex-column justify-content-center p-4" >
                        {loading ? (
                            <Spinner />
                        ) : formType === "login" ? (
                            <>
                                <LoginForm
                                    handleChange={handleChange}
                                    handleSubmit={handleLoginSubmit}
                                />

                                <button
                                    onClick={() => {
                                        setFormType("signup");
                                        setFormData({ username: "", email: "", password: "" });
                                    }}
                                    className='btn btn-link w-100 mt-3 text-center text-decoration-none'
                                >
                                    Don't have an account? Sign up here!
                                </button>

                            </>
                        ) : (
                            <>
                                <SignupForm
                                    handleChange={handleChange}
                                    handleSubmit={handleSignupSubmit}
                                />
                                <button
                                    onClick={() => {
                                        setFormType("login");
                                        setFormData({ username: "", email: "", password: "" });
                                    }}
                                    className='btn btn-link w-100 mt-3 text-center text-decoration-none'
                                >
                                    Already have an account? Log in here!
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

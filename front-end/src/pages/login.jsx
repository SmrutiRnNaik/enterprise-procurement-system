import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../services/authService";
import {
    showSuccess,
    showError
} from "../utils/notifications";

import loginImage from "../assets/login.png";

function Login() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await loginUser(form);

            const user = response.data;


            /* Store logged-in user's details */

            localStorage.setItem(
                "userId",
                user.userId
            );

            localStorage.setItem(
                "username",
                user.name
            );

            localStorage.setItem(
                "email",
                user.email
            );

            localStorage.setItem(
                "designation",
                user.designation
            );

            localStorage.setItem(
                "departmentId",
                user.departmentId
            );


            if (rememberMe) {

                localStorage.setItem(
                    "rememberMe",
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "rememberMe"
                );

            }


            showSuccess(
                "Login Successful",
                `Welcome back, ${user.name}!`
            );


            navigate("/dashboard");


        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Invalid username or password.";


            showError(
                "Login Failed",
                message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page login-page">

            <div className="login-container">


                {/* =================================================
                    LEFT IMAGE PANEL
                ================================================= */}

                <section className="login-visual">

                    <img
                        src={loginImage}
                        alt="InfyProcure"
                        className="login-image"
                    />

                </section>


                {/* =================================================
                    RIGHT LOGIN PANEL
                ================================================= */}

                <section className="login-form-panel">

                    <div className="login-form-wrapper">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="login-form-header">

                            <span className="form-step">
                                EMPLOYEE PORTAL
                            </span>

                            <h2>
                                Welcome Back!
                            </h2>

                            <p>
                                Please enter your details to sign in
                            </p>

                        </div>


                        {/* =================================================
                            LOGIN FORM
                        ================================================= */}

                        <form onSubmit={handleSubmit}>


                            {/* Username */}

                            <div className="auth-field">

                                <label htmlFor="name">
                                    Username
                                </label>

                                <div className="auth-input-wrapper">

                                    <i className="bi bi-person"></i>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                    />

                                </div>

                            </div>


                            {/* Password */}

                            <div className="auth-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="auth-input-wrapper">

                                    <i className="bi bi-lock"></i>

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="auth-input-action"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        <i
                                            className={
                                                showPassword
                                                    ? "bi bi-eye-slash"
                                                    : "bi bi-eye"
                                            }
                                        ></i>

                                    </button>

                                </div>

                            </div>


                            {/* Remember Me */}

                            <div className="login-options">

                                <div className="form-check">

                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="rememberMe"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(
                                                e.target.checked
                                            )
                                        }
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="rememberMe"
                                    >
                                        Remember me
                                    </label>

                                </div>

                            </div>


                            {/* Login Button */}

                            <button
                                type="submit"
                                className="login-submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>

                                        Signing In...
                                    </>

                                ) : (

                                    <>
                                        Login

                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </>

                                )}

                            </button>


                            {/* Terms */}

                            <p className="login-terms">

                                By signing in, you agree to our
                                Terms of Service and Privacy Policy.

                            </p>

                        </form>


                        {/* =================================================
                            REGISTER
                        ================================================= */}

                        <div className="login-divider">

                            <span>
                                Don't have an account?
                            </span>

                        </div>


                        <Link
                            to="/"
                            className="login-register-link"
                        >

                            Create an account

                            <i className="bi bi-arrow-right ms-2"></i>

                        </Link>

                    </div>

                </section>

            </div>

        </div>

    );

}

export default Login;
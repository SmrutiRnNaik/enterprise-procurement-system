import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";

import {
    showSuccess,
    showError
} from "../utils/notifications";

import loginImage from "../assets/login.png";


function SupplierLogin() {

    const navigate = useNavigate();


    const [form, setForm] = useState({
        email: "",
        password: ""
    });


    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);


    /* =========================================================
       HANDLE INPUT
       ========================================================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };


    /* =========================================================
       SUPPLIER LOGIN
       ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await axios.post(
                "http://localhost:8080/api/suppliers/login",
                form
            );

            const supplier = response.data;


            /* =================================================
               STORE LOGIN DETAILS
            ================================================= */

            localStorage.setItem(
                "userId",
                supplier.userId
            );

            localStorage.setItem(
                "username",
                supplier.name
            );

            localStorage.setItem(
                "email",
                supplier.email
            );

            localStorage.setItem(
                "designation",
                supplier.designation
            );

            localStorage.setItem(
                "role",
                supplier.role
            );


            /*
             * Suppliers do not have a department.
             */

            localStorage.removeItem(
                "departmentId"
            );


            /* =================================================
               REMEMBER ME
               ================================================= */

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


            /* =================================================
               SUCCESS MESSAGE
               ================================================= */

            showSuccess(
                "Login Successful",
                `Welcome back, ${supplier.name}!`
            );


            /* =================================================
               SUPPLIER DASHBOARD
               ================================================= */

            navigate("/supplier-dashboard");


        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Invalid email or password.";


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
                                SUPPLIER PORTAL
                            </span>

                            <h2>
                                Welcome Back!
                            </h2>

                            <p>
                                Sign in to manage your procurement orders
                            </p>

                        </div>


                        {/* =================================================
                            LOGIN FORM
                           ================================================= */}

                        <form onSubmit={handleSubmit}>


                            {/* Email */}

                            <div className="auth-field">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">

                                    <i className="bi bi-envelope"></i>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        autoComplete="email"
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
                            EMPLOYEE LOGIN
                           ================================================= */}

                        <div className="login-divider">

                            <span>
                                Are you an employee?
                            </span>

                        </div>


                        <Link
                            to="/login"
                            className="login-register-link"
                        >

                            Employee Login

                            <i className="bi bi-arrow-right ms-2"></i>

                        </Link>


                    </div>

                </section>

            </div>

        </div>

    );

}


export default SupplierLogin;
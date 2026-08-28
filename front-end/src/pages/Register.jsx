import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
    registerUser,
    getDepartments
} from "../services/authService";

import {
    showSuccess,
    showError
} from "../utils/notifications";

import registerImage from "../assets/register.png";

function Register() {

    const [form, setForm] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        designation: "",
        password: "",
        departmentId: ""
    });

    const [departments, setDepartments] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);


    /* =========================================================
       DESIGNATIONS
       ========================================================= */

    const designations = [
        "Developer",
        "Software Engineer",
        "Senior Software Engineer",
        "Technical Lead",
        "Project Manager",
        "Business Analyst",
        "HR Executive",
        "Accountant",
        "Finance Manager",
        "Procurement Executive"
    ];


    /* =========================================================
       FETCH DEPARTMENTS
       ========================================================= */

    useEffect(() => {

        const fetchDepartments = async () => {

            try {

                const response =
                    await getDepartments();

                setDepartments(response.data);

            } catch (error) {

                console.error(
                    "Failed to load departments",
                    error
                );

                showError(
                    "Unable to Load Departments",
                    "Please refresh the page and try again."
                );

            }

        };

        fetchDepartments();

    }, []);


    /* =========================================================
       FORM CHANGE
       ========================================================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]:
                name === "departmentId"
                    ? Number(value)
                    : value
        });

    };


    /* =========================================================
       PASSWORD STRENGTH
       ========================================================= */

    const getPasswordStrength = () => {

        const password = form.password;

        if (password.length === 0) {

            return {
                text: "",
                color: "",
                width: "0%"
            };

        }

        if (password.length < 6) {

            return {
                text: "Weak",
                color: "danger",
                width: "33%"
            };

        }

        if (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        ) {

            return {
                text: "Strong",
                color: "success",
                width: "100%"
            };

        }

        return {
            text: "Medium",
            color: "warning",
            width: "66%"
        };

    };


    const strength =
        getPasswordStrength();


    /* =========================================================
       REGISTER
       ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const payload = {

                name: form.name,

                password: form.password,

                phoneNumber: form.phoneNumber,

                email: form.email,

                designation: form.designation,

                department: {
                    departmentId: form.departmentId
                }

            };


            const response =
                await registerUser(payload);


            showSuccess(
                "Registration Successful",
                response.data ||
                "User registered successfully."
            );


            setForm({
                name: "",
                email: "",
                phoneNumber: "",
                designation: "",
                password: "",
                departmentId: ""
            });


        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Something went wrong.";


            showError(
                "Registration Failed",
                message
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="auth-page register-page">

            <div className="register-container">

                {/* LEFT IMAGE PANEL */}

                <section className="register-visual">

                    <img
                        src={registerImage}
                        alt="InfyProcure"
                        className="register-image"
                    />

                    <div className="register-visual-overlay"></div>

                </section>


                {/* RIGHT FORM PANEL */}

                <section className="register-form-panel">

                    <div className="register-form-wrapper">

                        <div className="register-form-header">

                            <div className="mobile-auth-brand">

                                <div className="auth-logo">
                                    IP
                                </div>

                                <span>
                                    INFYPROCURE
                                </span>

                            </div>

                            <span className="form-step">
                                STEP 1 OF 1
                            </span>

                            <h2>
                                Create your account
                            </h2>

                            <p>
                                Enter your details to get started
                                with InfyProcure.
                            </p>

                        </div>


                        <form onSubmit={handleSubmit}>

                            {/* Full Name */}

                            <div className="auth-field">

                                <label htmlFor="name">
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    required
                                />

                            </div>


                            {/* Email */}

                            <div className="auth-field">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="name@company.com"
                                    autoComplete="email"
                                    required
                                />

                            </div>


                            {/* Phone */}

                            <div className="auth-field">

                                <label htmlFor="phoneNumber">
                                    Phone Number
                                </label>

                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    name="phoneNumber"
                                    value={form.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="10-digit number"
                                    maxLength={10}
                                    pattern="[6-9][0-9]{9}"
                                    autoComplete="tel"
                                    required
                                />

                            </div>


                            {/* Department */}

                            <div className="auth-field">

                                <label htmlFor="departmentId">
                                    Department
                                </label>

                                <select
                                    id="departmentId"
                                    name="departmentId"
                                    value={form.departmentId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select your department
                                    </option>

                                    {departments.map(
                                        (dept) => (

                                            <option
                                                key={
                                                    dept.departmentId
                                                }
                                                value={
                                                    dept.departmentId
                                                }
                                            >

                                                {
                                                    dept.departmentName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Designation */}

                            <div className="auth-field">

                                <label htmlFor="designation">
                                    Designation
                                </label>

                                <select
                                    id="designation"
                                    name="designation"
                                    value={form.designation}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select your designation
                                    </option>

                                    {designations.map(
                                        (designation) => (

                                            <option
                                                key={designation}
                                                value={designation}
                                            >

                                                {designation}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Password */}

                            <div className="auth-field">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="auth-password-wrapper">

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
                                        placeholder="Create a secure password"
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
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


                            {/* Password Strength */}

                            {strength.text && (

                                <div className="password-strength">

                                    <div className="password-strength-track">

                                        <div
                                            className={`password-strength-bar strength-${strength.color}`}
                                            style={{
                                                width:
                                                    strength.width
                                            }}
                                        ></div>

                                    </div>

                                    <span
                                        className={`strength-text strength-${strength.color}-text`}
                                    >

                                        Password strength:{" "}
                                        {strength.text}

                                    </span>

                                </div>

                            )}


                            {/* Submit */}

                            <button
                                type="submit"
                                className="register-submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>

                                        Creating Account...
                                    </>

                                ) : (

                                    <>
                                        Create Account

                                        <i className="bi bi-arrow-right ms-2"></i>
                                    </>

                                )}

                            </button>


                            {/* Terms */}

                            <p className="auth-terms">

                                By creating an account, you agree to
                                our Terms of Service and Privacy Policy.

                            </p>

                        </form>


                        {/* Login Link */}

                        <div className="auth-divider">

                            <span>
                                Already registered?
                            </span>

                        </div>


                        <Link
                            to="/login"
                            className="register-login-link"
                        >

                            Sign in to your account

                            <i className="bi bi-arrow-right"></i>

                        </Link>

                    </div>

                </section>

            </div>

        </div>

    );

}

export default Register;
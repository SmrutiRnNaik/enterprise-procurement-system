import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser, getDepartments } from "../services/authService";

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

    useEffect(() => {

        const fetchDepartments = async () => {

            try {

                const response = await getDepartments();
                setDepartments(response.data);

            } catch (error) {

                console.error("Failed to load departments", error);

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Unable to load departments."
                });

            }

        };

        fetchDepartments();

    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: name === "departmentId" ? Number(value) : value
        });

    };

    const getPasswordStrength = () => {

        const password = form.password;

        if (password.length === 0)
            return { text: "", color: "", width: "0%" };

        if (password.length < 6)
            return { text: "Weak", color: "danger", width: "33%" };

        if (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password) &&
            /[^A-Za-z0-9]/.test(password)
        ) {
            return { text: "Strong", color: "success", width: "100%" };
        }

        return { text: "Medium", color: "warning", width: "66%" };

    };

    const strength = getPasswordStrength();

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

            const response = await registerUser(payload);

            Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: response.data || "User registered successfully.",
                confirmButtonColor: "#0d6efd"
            });

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

            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: message,
                confirmButtonColor: "#0d6efd"
            });

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="registration-page">

            <div className="card registration-card">

                <div className="card-body p-4">

                    <div className="text-center mb-4">

                        <div className="registration-logo">
                            <i className="bi bi-building registration-icon"></i>
                        </div>

                        <h3 className="fw-bold mt-3 mb-1">
                            Enterprise Procurement System
                        </h3>

                        <p className="text-muted mb-0">
                            Employee Registration Portal
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Full Name
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Email Address
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="name@company.com"
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                className="form-control"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="Enter 10-digit phone number"
                                maxLength={10}
                                pattern="[6-9][0-9]{9}"
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Designation
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="designation"
                                value={form.designation}
                                onChange={handleChange}
                                placeholder="Enter your designation"
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Department
                            </label>

                            <select
                                className="form-select"
                                name="departmentId"
                                value={form.departmentId}
                                onChange={handleChange}
                                required
                            >

                                <option value="">Select Department</option>

                                {departments.map((dept) => (

                                    <option
                                        key={dept.departmentId}
                                        value={dept.departmentId}
                                    >
                                        {dept.departmentName}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="mb-2">

                            <label className="form-label fw-semibold">
                                Password
                            </label>

                            <div className="input-group">

                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a secure password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
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

                        {strength.text && (
                            <div className="mb-4">

                                <div
                                    className="progress"
                                    style={{ height: "6px" }}
                                >

                                    <div
                                        className={`progress-bar bg-${strength.color}`}
                                        style={{ width: strength.width }}
                                    ></div>

                                </div>

                                <small className={`text-${strength.color}`}>
                                    Password Strength: {strength.text}
                                </small>

                            </div>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                    ></span>
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}

                        </button>

                    </form>

                    <hr className="my-4" />

                    <p className="text-center text-muted mb-0">
                        Already have an account?

                        <Link
                            to="/login"
                            className="text-decoration-none ms-1 fw-semibold"
                        >
                            Sign In
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Register;
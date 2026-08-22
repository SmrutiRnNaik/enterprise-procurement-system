import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { loginUser } from "../services/authService";

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

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {

            const response = await loginUser(form);

            Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: response.data || "Welcome back!",
                confirmButtonColor: "#0d6efd",
                timer: 1500,
                showConfirmButton: false
            });

            if (rememberMe) {
                localStorage.setItem("username", form.name);
            }

            navigate("/dashboard");

        } catch (error) {

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Invalid username or password.";

            Swal.fire({
                icon: "error",
                title: "Login Failed",
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

                        <i className="bi bi-person-circle registration-icon"></i>

                        <h3 className="fw-bold mt-2">
                            Enterprise Procurement System
                        </h3>

                        <p className="text-muted">
                            Employee Login Portal
                        </p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Username
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your username"
                                required
                            />

                        </div>

                        <div className="mb-3">

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
                                    placeholder="Enter your password"
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

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div className="form-check">

                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(e.target.checked)
                                    }
                                />

                                <label
                                    className="form-check-label"
                                    htmlFor="rememberMe"
                                >
                                    Remember Me
                                </label>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 py-2 fw-semibold"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Signing In...
                                </>
                            ) : (
                                "Login"
                            )}

                        </button>

                    </form>

                    <hr className="my-4" />

                    <p className="text-center text-muted mb-0">

                        Don't have an account?

                        <Link
                            to="/"
                            className="text-decoration-none ms-1"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    );

}

export default Login;
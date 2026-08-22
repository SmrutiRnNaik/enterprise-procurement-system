import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Navbar() {

    const navigate = useNavigate();

    const handleLogout = () => {

        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0d6efd",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Logout"
        }).then((result) => {

            if (result.isConfirmed) {

                localStorage.removeItem("username");

                Swal.fire({
                    icon: "success",
                    title: "Logged Out",
                    timer: 1000,
                    showConfirmButton: false
                });

                navigate("/login");
            }

        });

    };

    return (

        <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">

            <div className="container">

                <span className="navbar-brand fw-bold text-primary">

                    <i className="bi bi-building me-2"></i>

                    Enterprise Procurement System

                </span>

                <div className="ms-auto d-flex align-items-center gap-3">

                    <span className="text-muted">
                        Welcome, <strong>{localStorage.getItem("username") || "Employee"}</strong>
                    </span>

                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={handleLogout}
                    >

                        <i className="bi bi-box-arrow-right me-1"></i>

                        Logout

                    </button>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;
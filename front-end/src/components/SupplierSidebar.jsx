import { NavLink, useNavigate } from "react-router-dom";

import {
    showConfirm
} from "../utils/notifications";

import logo from "../assets/logo.png";


function SupplierSidebar() {

    const navigate = useNavigate();


    const username =
        localStorage.getItem("username") || "Supplier";

    const designation =
        localStorage.getItem("designation") || "Supplier";


    /* =========================================================
       LOGOUT
       ========================================================= */

    const handleLogout = async () => {

        const result = await showConfirm(
            "Logout?",
            "Are you sure you want to logout?"
        );


        if (result.isConfirmed) {

            localStorage.removeItem("userId");
            localStorage.removeItem("username");
            localStorage.removeItem("email");
            localStorage.removeItem("designation");
            localStorage.removeItem("departmentId");
            localStorage.removeItem("role");
            localStorage.removeItem("rememberMe");

            navigate("/login");

        }

    };


    return (

        <aside className="infy-sidebar">


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="sidebar-brand">

                <img
                    src={logo}
                    alt="InfyProcure"
                    className="sidebar-logo"
                />

            </div>


            {/* =================================================
                SUPPLIER NAVIGATION
            ================================================= */}

            <div className="sidebar-menu">


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <NavLink
                    to="/supplier-dashboard"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >

                    <i className="bi bi-grid-1x2-fill"></i>

                    <span>
                        Dashboard
                    </span>

                </NavLink>


                {/* =================================================
                    SUPPLY & REQUESTS
                ================================================= */}

                <NavLink
                    to="/supplier-requests"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >

                    <i className="bi bi-box-seam"></i>

                    <span>
                        Supply & Requests
                    </span>

                </NavLink>


                {/* =================================================
                    PAYMENT HISTORY
                ================================================= */}

                <NavLink
                    to="/supplier-payment-history"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >

                    <i className="bi bi-credit-card"></i>

                    <span>
                        Payment History
                    </span>

                </NavLink>


            </div>


            {/* =================================================
                SUPPLIER USER / LOGOUT
            ================================================= */}

            <div className="sidebar-footer">


                {/* USER */}

                <div className="sidebar-user">

                    <div className="user-avatar">

                        {username
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div className="user-info">

                        <div className="user-name">

                            {username}

                        </div>


                        <div className="user-designation">

                            {designation}

                        </div>

                    </div>

                </div>


                {/* LOGOUT */}

                <button
                    type="button"
                    className="logout-button"
                    onClick={handleLogout}
                >

                    <i className="bi bi-box-arrow-left"></i>

                    <span>
                        Logout
                    </span>

                </button>


            </div>


        </aside>

    );

}


export default SupplierSidebar;
import { NavLink, useNavigate } from "react-router-dom";

import {
    showConfirm
} from "../utils/notifications";

import logo from "../assets/logo.png";


function AdminSidebar() {

    const navigate = useNavigate();


    const username =
        localStorage.getItem("username") || "Admin";

    const designation =
        localStorage.getItem("designation") || "Administrator";


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
                ADMIN NAVIGATION
            ================================================= */}

            <div className="sidebar-menu">


                {/* =================================================
                    DASHBOARD
                ================================================= */}

                <NavLink
                    to="/admin-dashboard"
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
                    REQUEST HISTORY
                ================================================= */}

                <NavLink
                    to="/admin-request-history"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >

                    <i className="bi bi-clock-history"></i>

                    <span>
                        Request History
                    </span>

                </NavLink>


                {/* =================================================
                    PAYMENT HISTORY
                ================================================= */}

                <NavLink
                    to="/admin-payment-history"
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
                ADMIN USER / LOGOUT
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


export default AdminSidebar;
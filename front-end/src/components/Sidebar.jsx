import { NavLink, useNavigate } from "react-router-dom";

import {
    showConfirm
} from "../utils/notifications";

import logo from "../assets/logo.png";


function Sidebar() {

    const navigate = useNavigate();


    const username =
        localStorage.getItem("username") || "User";

    const designation =
        localStorage.getItem("designation") || "Employee";


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
                NAVIGATION
            ================================================= */}

            <div className="sidebar-menu">


                {/* Dashboard */}

                <NavLink
                    to="/dashboard"
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


                {/* Raise Request */}

                <button
                    type="button"
                    className="raise-request-button"
                    onClick={() =>
                        navigate("/raise-request")
                    }
                >

                    <i className="bi bi-plus-lg"></i>

                    <span>
                        Raise Request
                    </span>

                </button>


                {/* Request History */}

                <NavLink
                    to="/request-history"
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


                {/* Ratings & Reviews */}

                <NavLink
                    to="/ratings"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >

                    <i className="bi bi-star-fill"></i>

                    <span>
                        Ratings & Reviews
                    </span>

                </NavLink>


            </div>


            {/* =================================================
                USER / LOGOUT
            ================================================= */}

            <div className="sidebar-footer">


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

export default Sidebar;
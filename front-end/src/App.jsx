import { Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import RaiseRequest from "./pages/RaiseRequest";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRequestHistory from "./components/AdminRequestHistory";
import RequestHistory from "./components/RequestHistory";


function App() {

    return (

        <Routes>


            {/* =================================================
                REGISTER
            ================================================= */}

            <Route
                path="/"
                element={<Register />}
            />


            {/* =================================================
                LOGIN
            ================================================= */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =================================================
                USER DASHBOARD
            ================================================= */}

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />


            {/* =================================================
                USER REQUEST HISTORY
            ================================================= */}

            <Route
                path="/request-history"
                element={<RequestHistory />}
            />


            {/* =================================================
                USER RAISE REQUEST
            ================================================= */}

            <Route
                path="/raise-request"
                element={<RaiseRequest />}
            />


            {/* =================================================
                ADMIN DASHBOARD
            ================================================= */}

            <Route
                path="/admin-dashboard"
                element={<AdminDashboard />}
            />
            <Route
                path="/admin-request-history"
                element={<AdminRequestHistory />}
            />


        </Routes>

        

    );

}


export default App;
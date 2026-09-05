import { Routes, Route } from "react-router-dom";


/* =========================================================
   USER PAGES
   ========================================================= */

import Register from "./pages/Register";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import SupplierLogin from "./pages/SupplierLogin";
import SupplierRequests from "./pages/SupplierRequests";
import SupplierDashboard from "./pages/SupplierDashboard";
import RaiseRequest from "./pages/RaiseRequest";
import SupplierPaymentHistory from "./pages/SupplierPaymentHistory";


/* =========================================================
   USER COMPONENTS
   ========================================================= */

import RequestHistory from "./components/RequestHistory";


/* =========================================================
   ADMIN PAGES
   ========================================================= */

import AdminDashboard from "./pages/AdminDashboard";


/* =========================================================
   ADMIN COMPONENTS
   ========================================================= */

import AdminRequestHistory from "./components/AdminRequestHistory";
import AdminPaymentHistory from "./components/AdminPaymentHistory";


/* =========================================================
   PAYMENT PAGE
   ========================================================= */

import PaymentPage from "./pages/PaymentPage";


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
                EMPLOYEE LOGIN
            ================================================= */}

            <Route
                path="/login"
                element={<Login />}
            />


            {/* =================================================
                SUPPLIER LOGIN
            ================================================= */}

            <Route
                path="/supplier-login"
                element={<SupplierLogin />}
            />


            {/* =================================================
                USER DASHBOARD
            ================================================= */}

            <Route
                path="/dashboard"
                element={<Dashboard />}
            />


            {/* =================================================
                SUPPLIER DASHBOARD
            ================================================= */}

            <Route
                path="/supplier-dashboard"
                element={<SupplierDashboard />}
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


            {/* =================================================
                ADMIN REQUEST HISTORY
            ================================================= */}

            <Route
                path="/admin-request-history"
                element={<AdminRequestHistory />}
            />


            {/* =================================================
                ADMIN PAYMENT HISTORY
            ================================================= */}

            <Route
                path="/admin-payment-history"
                element={<AdminPaymentHistory />}
            />


            {/* =================================================
                PAYMENT
            ================================================= */}

            <Route
                path="/payment"
                element={<PaymentPage />}
            />

            <Route
                path="/supplier-requests"
                element={<SupplierRequests />}
            />

            <Route
                path="/supplier-payment-history"
                element={<SupplierPaymentHistory />}
            />


        </Routes>

    );

}


export default App;
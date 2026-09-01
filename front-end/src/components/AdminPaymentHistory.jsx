import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";

import {
    getAdminRequests,
    getAdminPaymentHistory
} from "../services/adminService";

import {
    showError
} from "../utils/notifications";


function AdminPaymentHistory() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);


    /* =========================================================
       ADMIN ID
       ========================================================= */

    const adminId =
        localStorage.getItem("userId");


    /* =========================================================
       FETCH DATA
       ========================================================= */

    const fetchData = async () => {

        try {

            setLoading(true);


            if (!adminId) {

                showError(
                    "Admin Not Found",
                    "Admin information is missing. Please login again."
                );

                navigate("/login");

                return;

            }


            /* =================================================
               FETCH APPROVED / ALL REQUESTS
               ================================================= */

            const requestsResponse =
                await getAdminRequests();


            const requestData =
                requestsResponse.data?.data || [];


            setRequests(requestData);


            /* =================================================
               FETCH COMPLETED PAYMENTS
               ================================================= */

            const paymentsResponse =
                await getAdminPaymentHistory(
                    Number(adminId)
                );


            const paymentData =
                paymentsResponse.data?.data || [];


            setPayments(paymentData);


        } catch (error) {

            console.error(
                "Failed to load admin payment history:",
                error
            );


            showError(
                "Error",
                "Failed to load payment history."
            );


        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchData();

    }, []);


    /* =========================================================
       APPROVED REQUESTS
       ========================================================= */

    const approvedRequests =
        requests.filter(
            request =>
                request.status === "APPROVED"
        );


    /* =========================================================
       COMPLETED PAYMENT PRODUCT IDS
       ========================================================= */

    const paidProductIds =
        new Set(
            payments.map(
                payment =>
                    Number(payment.productId)
            )
        );


    /* =========================================================
       PENDING PAYMENTS
       
       Approved request
       BUT
       No payment record exists
       ========================================================= */

    const pendingPayments =
        approvedRequests.filter(
            request =>
                !paidProductIds.has(
                    Number(request.productId)
                )
        );


    /* =========================================================
       TOTAL AMOUNT PAID
       ========================================================= */

    const totalAmountPaid =
        payments.reduce(
            (total, payment) =>
                total +
                Number(payment.amount || 0),
            0
        );


    /* =========================================================
       FORMAT CURRENCY
       ========================================================= */

    const formatCurrency = (amount) => {

        return Number(amount || 0)
            .toLocaleString(
                "en-IN",
                {
                    style: "currency",
                    currency: "INR"
                }
            );

    };


    /* =========================================================
       FORMAT DATE
       ========================================================= */

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        return new Date(date)
            .toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    };


    /* =========================================================
       PAYMENT MODE
       ========================================================= */

    const formatPaymentMode = (mode) => {

        switch (mode) {

            case "CREDIT_CARD":
                return "Credit Card";

            case "DEBIT_CARD":
                return "Debit Card";

            case "UPI":
                return "UPI";

            case "SCANNER":
                return "QR Code";

            default:
                return mode || "-";

        }

    };


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="dashboard-page">

                <AdminSidebar />

                <main className="dashboard-content">

                    <div className="container-fluid">

                        <div className="dashboard-header mb-4">

                            <div>

                                <span className="raise-request-label">
                                    ADMINISTRATION
                                </span>

                                <h2>
                                    Payment History
                                </h2>

                                <p className="text-muted mb-0">
                                    View completed and pending procurement payments.
                                </p>

                            </div>

                        </div>


                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <div
                                    className="spinner-border"
                                    role="status"
                                ></div>

                                <p className="text-muted mt-3 mb-0">
                                    Loading payment history...
                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    /* =========================================================
       MAIN PAGE
       ========================================================= */

    return (

        <div className="dashboard-page">

            <AdminSidebar />


            <main className="dashboard-content">

                <div className="container-fluid">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="dashboard-header mb-4">

                        <div>

                            <span className="raise-request-label">
                                ADMINISTRATION
                            </span>

                            <h2>
                                Payment History
                            </h2>

                            <p className="text-muted mb-0">

                                View all completed and pending
                                procurement payments.

                            </p>

                        </div>


                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            onClick={() =>
                                navigate(
                                    "/admin-dashboard"
                                )
                            }
                        >

                            <i className="bi bi-arrow-left me-2"></i>

                            Dashboard

                        </button>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="row g-3 mb-4">


                        {/* TOTAL APPROVED */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Total Approved Requests
                                    </small>

                                    <h3 className="fw-bold mb-0 mt-1">
                                        {approvedRequests.length}
                                    </h3>

                                </div>

                            </div>

                        </div>


                        {/* COMPLETED */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Completed Payments
                                    </small>

                                    <h3 className="fw-bold mb-0 mt-1">
                                        {payments.length}
                                    </h3>

                                </div>

                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Pending Payments
                                    </small>

                                    <h3 className="fw-bold mb-0 mt-1">
                                        {pendingPayments.length}
                                    </h3>

                                </div>

                            </div>

                        </div>


                        {/* TOTAL AMOUNT */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Total Amount Paid
                                    </small>

                                    <h3 className="fw-bold mb-0 mt-1">

                                        {formatCurrency(
                                            totalAmountPaid
                                        )}

                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        PENDING PAYMENTS
                    ================================================= */}

                    {pendingPayments.length > 0 && (

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-body">


                                <div className="d-flex justify-content-between align-items-center mb-3">

                                    <div>

                                        <h5 className="fw-bold mb-1">

                                            Pending Payments

                                        </h5>

                                        <p className="text-muted small mb-0">

                                            Approved requests awaiting payment.

                                        </p>

                                    </div>


                                    <span className="badge bg-warning text-dark">

                                        {pendingPayments.length}
                                        {" "}
                                        Pending

                                    </span>

                                </div>


                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th>
                                                    Request ID
                                                </th>

                                                <th>
                                                    Product
                                                </th>

                                                <th>
                                                    Requested By
                                                </th>

                                                <th>
                                                    Supplier
                                                </th>

                                                <th>
                                                    Quantity
                                                </th>

                                                <th>
                                                    Amount
                                                </th>

                                                <th>
                                                    Approved Date
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {pendingPayments.map(
                                                request => (

                                                    <tr
                                                        key={
                                                            request.productId
                                                        }
                                                    >

                                                        <td>

                                                            #
                                                            {
                                                                request.productId
                                                            }

                                                        </td>


                                                        <td className="fw-semibold">

                                                            {
                                                                request.productName
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                request.requestedBy ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                request.supplierName ||
                                                                "-"
                                                            }

                                                        </td>


                                                        <td>

                                                            {
                                                                request.quantity
                                                            }

                                                        </td>


                                                        <td className="fw-semibold">

                                                            {formatCurrency(
                                                                request.totalPrice
                                                            )}

                                                        </td>


                                                        <td>

                                                            {formatDate(
                                                                request.createdDate
                                                            )}

                                                        </td>


                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-dark"
                                                                onClick={() =>
                                                                    navigate(
                                                                        "/payment",
                                                                        {
                                                                            state: {
                                                                                product: request
                                                                            }
                                                                        }
                                                                    )
                                                                }
                                                            >

                                                                <i className="bi bi-credit-card me-1"></i>

                                                                Pay Now

                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        NO PENDING PAYMENTS
                    ================================================= */}

                    {pendingPayments.length === 0 && (

                        <div className="card border-0 shadow-sm mb-4">

                            <div className="card-body">

                                <div className="d-flex align-items-center">

                                    <i
                                        className="bi bi-check-circle me-3"
                                        style={{
                                            fontSize: "1.5rem"
                                        }}
                                    ></i>

                                    <div>

                                        <h6 className="fw-bold mb-1">
                                            All approved requests are paid
                                        </h6>

                                        <p className="text-muted small mb-0">
                                            There are no pending payments.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        COMPLETED PAYMENTS
                    ================================================= */}

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">


                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        Completed Payments
                                    </h5>

                                    <p className="text-muted small mb-0">

                                        {payments.length}
                                        {" "}
                                        completed payment records

                                    </p>

                                </div>

                            </div>


                            {payments.length === 0 ? (

                                <div className="request-empty-state">

                                    <div className="request-empty-icon">

                                        <i className="bi bi-credit-card"></i>

                                    </div>

                                    <h6 className="fw-bold mt-3">
                                        No completed payments
                                    </h6>

                                    <p className="text-muted mb-0">
                                        No payments have been completed yet.
                                    </p>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th>
                                                    Payment ID
                                                </th>

                                                <th>
                                                    Product
                                                </th>

                                                <th>
                                                    Supplier
                                                </th>

                                                <th>
                                                    Amount
                                                </th>

                                                <th>
                                                    Payment Mode
                                                </th>

                                                <th>
                                                    Transaction Reference
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Payment Date
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {payments.map(
                                                payment => (

                                                    <tr
                                                        key={
                                                            payment.paymentId
                                                        }
                                                    >

                                                        <td>

                                                            #
                                                            {
                                                                payment.paymentId
                                                            }

                                                        </td>


                                                        <td>

                                                            <div className="fw-semibold">

                                                                {
                                                                    payment.productName
                                                                }

                                                            </div>

                                                            <small className="text-muted">

                                                                Product #
                                                                {
                                                                    payment.productId
                                                                }

                                                            </small>

                                                        </td>


                                                        <td>

                                                            <div className="fw-semibold">

                                                                {
                                                                    payment.supplierName
                                                                }

                                                            </div>

                                                            <small className="text-muted">

                                                                Supplier #
                                                                {
                                                                    payment.supplierId
                                                                }

                                                            </small>

                                                        </td>


                                                        <td className="fw-semibold">

                                                            {formatCurrency(
                                                                payment.amount
                                                            )}

                                                        </td>


                                                        <td>

                                                            <span className="badge bg-light text-dark border">

                                                                {
                                                                    formatPaymentMode(
                                                                        payment.paymentMode
                                                                    )
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span className="text-danger">

                                                                {
                                                                    payment.transactionReference
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span className="badge bg-success">

                                                                {
                                                                    payment.paymentStatus
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            {formatDate(
                                                                payment.paymentDate
                                                            )}

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default AdminPaymentHistory;
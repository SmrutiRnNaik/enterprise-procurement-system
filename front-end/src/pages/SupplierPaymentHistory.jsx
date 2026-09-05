import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Supplier.css";

import SupplierSidebar from "../components/SupplierSidebar";

function SupplierPaymentHistory() {

    const BASE_URL = "http://localhost:8080/api";

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const supplierId = localStorage.getItem("userId");


    useEffect(() => {

        fetchPaymentHistory();

    }, []);


    const fetchPaymentHistory = async () => {

        if (!supplierId) {

            Swal.fire({
                icon: "error",
                title: "Session Expired",
                text: "Please login again."
            });

            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const response = await axios.get(
                `${BASE_URL}/payments/supplier/${supplierId}/history`
            );

            /*
             * Backend returns:
             *
             * {
             *     message: "...",
             *     data: [...]
             * }
             */
            const data = response.data?.data || [];

            setPayments(data);

        } catch (error) {

            console.error(
                "Error loading supplier payment history:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Unable to Load Payment History",
                text:
                    error.response?.data?.message ||
                    "Could not load supplier payment history."
            });

        } finally {

            setLoading(false);

        }
    };


    const formatPrice = (amount) => {

        if (
            amount === null ||
            amount === undefined ||
            amount === ""
        ) {
            return "₹0.00";
        }

        return `₹${Number(amount).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch (error) {

            return date;

        }
    };


    const formatDateTime = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        } catch (error) {

            return date;

        }
    };


    const getPaymentMode = (mode) => {

        switch (mode) {

            case "UPI":
                return "UPI";

            case "CREDIT_CARD":
                return "Credit Card";

            case "DEBIT_CARD":
                return "Debit Card";

            case "SCANNER":
                return "Scan & Pay";

            default:

                if (!mode) {
                    return "-";
                }

                return mode
                    .replaceAll("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                    );
        }
    };


    const getPaymentStatus = (status) => {

        switch (status) {

            case "COMPLETED":
                return "Completed";

            case "PENDING":
                return "Pending";

            case "FAILED":
                return "Failed";

            case "CANCELLED":
                return "Cancelled";

            default:

                if (!status) {
                    return "-";
                }

                return status
                    .replaceAll("_", " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                    );
        }
    };


    const getPaymentStatusClass = (status) => {

        switch (status) {

            case "COMPLETED":
                return "history-status approved";

            case "FAILED":
            case "CANCELLED":
                return "history-status rejected";

            case "PENDING":
                return "history-status pending";

            default:
                return "history-status pending";
        }
    };


    const totalPayments = payments.length;


    const totalAmount = payments.reduce(
        (total, payment) =>
            total + Number(payment.amount || 0),
        0
    );


    const completedPayments = payments.filter(
        (payment) =>
            payment.paymentStatus === "COMPLETED"
    ).length;


    const completedAmount = payments
        .filter(
            (payment) =>
                payment.paymentStatus === "COMPLETED"
        )
        .reduce(
            (total, payment) =>
                total + Number(payment.amount || 0),
            0
        );


    return (

        <div className="dashboard-page supplier-page">

            <SupplierSidebar />


            <main className="dashboard-content">

                <div className="container-fluid">


                    {/* =================================================
                        PAGE HEADER
                       ================================================= */}

                    <div className="raise-request-header">

                        <div>

                            <span className="raise-request-label">
                                PAYMENTS
                            </span>

                            <h2>
                                Payment History
                            </h2>

                            <p className="text-muted mb-0">
                                View your completed and recorded payment transactions.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        PAYMENT SUMMARY
                       ================================================= */}

                    {!loading && (

                        <div
                            className="stats-grid"
                            style={{
                                marginBottom: "24px"
                            }}
                        >

                            <div className="stats-card">

                                <div className="stats-card-icon">

                                    <i className="bi bi-credit-card"></i>

                                </div>

                                <div>

                                    <span className="stats-card-label">
                                        Total Payments
                                    </span>

                                    <h3>
                                        {totalPayments}
                                    </h3>

                                </div>

                            </div>


                            <div className="stats-card">

                                <div className="stats-card-icon">

                                    <i className="bi bi-cash-stack"></i>

                                </div>

                                <div>

                                    <span className="stats-card-label">
                                        Total Amount
                                    </span>

                                    <h3>
                                        {formatPrice(totalAmount)}
                                    </h3>

                                </div>

                            </div>


                            <div className="stats-card">

                                <div className="stats-card-icon">

                                    <i className="bi bi-check-circle"></i>

                                </div>

                                <div>

                                    <span className="stats-card-label">
                                        Completed Payments
                                    </span>

                                    <h3>
                                        {completedPayments}
                                    </h3>

                                </div>

                            </div>


                            <div className="stats-card">

                                <div className="stats-card-icon">

                                    <i className="bi bi-wallet2"></i>

                                </div>

                                <div>

                                    <span className="stats-card-label">
                                        Completed Amount
                                    </span>

                                    <h3>
                                        {formatPrice(completedAmount)}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        PAYMENT TABLE
                       ================================================= */}

                    <div className="history-table-card">


                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border"
                                    role="status"
                                ></div>

                                <p className="mt-3 text-muted">
                                    Loading payment history...
                                </p>

                            </div>

                        ) : payments.length === 0 ? (

                            <div className="text-center py-5">

                                <i
                                    className="bi bi-wallet2"
                                    style={{
                                        fontSize: "42px"
                                    }}
                                ></i>

                                <h5 className="mt-3">
                                    No Payment Records Found
                                </h5>

                                <p className="text-muted">
                                    No payment transactions have been recorded for your supplier account.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="history-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                Payment ID
                                            </th>

                                            <th>
                                                Request ID
                                            </th>

                                            <th>
                                                Product
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
                                                Payment Status
                                            </th>

                                            <th>
                                                Payment Date
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {payments.map(
                                            (payment, index) => (

                                                <tr
                                                    key={
                                                        payment.paymentId ||
                                                        index
                                                    }
                                                >

                                                    <td>

                                                        <strong>
                                                            #{payment.paymentId}
                                                        </strong>

                                                    </td>


                                                    <td>
                                                        {payment.productId
                                                            ? `#${payment.productId}`
                                                            : "-"
                                                        }
                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                payment.productName ||
                                                                "-"
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {formatPrice(
                                                                payment.amount
                                                            )}
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span className="payment-mode">

                                                            <i
                                                                className={
                                                                    payment.paymentMode ===
                                                                    "UPI"
                                                                        ? "bi bi-phone me-2"
                                                                        : payment.paymentMode ===
                                                                            "CREDIT_CARD"
                                                                            ? "bi bi-credit-card me-2"
                                                                            : payment.paymentMode ===
                                                                                "DEBIT_CARD"
                                                                                ? "bi bi-credit-card-2-front me-2"
                                                                                : "bi bi-qr-code me-2"
                                                                }
                                                            ></i>

                                                            {
                                                                getPaymentMode(
                                                                    payment.paymentMode
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            style={{
                                                                fontFamily:
                                                                    "monospace",
                                                                fontSize:
                                                                    "13px"
                                                            }}
                                                        >
                                                            {
                                                                payment.transactionReference ||
                                                                "-"
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                getPaymentStatusClass(
                                                                    payment.paymentStatus
                                                                )
                                                            }
                                                        >
                                                            {
                                                                getPaymentStatus(
                                                                    payment.paymentStatus
                                                                )
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            title={
                                                                formatDateTime(
                                                                    payment.paymentDate
                                                                )
                                                            }
                                                        >
                                                            {
                                                                formatDate(
                                                                    payment.paymentDate
                                                                )
                                                            }
                                                        </span>

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

            </main>

        </div>

    );
}

export default SupplierPaymentHistory;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";
import DownloadDropdown from "../components/DownloadDropdown";

import { getRequestHistory } from "../services/dashboardService";

function RequestHistory() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);


    /* =========================================================
       FETCH REQUEST HISTORY
       ========================================================= */

    useEffect(() => {

        const fetchRequestHistory = async () => {

            try {

                const userId =
                    localStorage.getItem("userId");

                if (!userId) {

                    console.error("User ID not found.");

                    navigate("/login");

                    return;
                }

                const response =
                    await getRequestHistory(userId);

                setRequests(
                    response.data.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load request history:",
                    error
                );

                Swal.fire({
                    icon: "error",
                    title: "Unable to Load Requests",
                    text:
                        error.response?.data?.message ||
                        "Failed to load your request history.",
                    confirmButtonColor: "#111111"
                });

            } finally {

                setLoading(false);

            }

        };

        fetchRequestHistory();

    }, [navigate]);


    /* =========================================================
       STATUS
       ========================================================= */

    const getStatusClass = (status) => {

        switch (status) {

            case "APPROVED":
                return "history-status approved";

            case "PENDING_APPROVAL":
                return "history-status pending";

            case "REJECTED":
                return "history-status rejected";

            case "DELIVERED":
                return "history-status delivered";

            default:
                return "history-status";

        }

    };


    const formatStatus = (status) => {

        switch (status) {

            case "APPROVED":
                return "Approved";

            case "PENDING_APPROVAL":
                return "Pending Approval";

            case "REJECTED":
                return "Rejected";

            case "DELIVERED":
                return "Delivered";

            default:
                return status || "Unknown";

        }

    };


    /* =========================================================
       PRICE
       ========================================================= */

    const formatPrice = (price) => {

        const numericPrice =
            Number(price);

        if (Number.isNaN(numericPrice)) {
            return "₹0";
        }

        return `₹${numericPrice.toLocaleString(
            "en-IN"
        )}`;

    };


    /* =========================================================
       DATE
       ========================================================= */

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        const parsedDate =
            new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "—";
        }

        return parsedDate.toLocaleDateString(
            "en-IN"
        );

    };


    /* =========================================================
       OPEN RATING PAGE
       ========================================================= */

    const handleRateProduct = (request) => {

        navigate(
            `/rate-product/${request.productId}`,
            {
                state: {
                    productId:
                        request.productId,

                    productName:
                        request.productName,

                    quantity:
                        request.quantity,

                    totalPrice:
                        request.totalPrice
                }
            }
        );

    };


    return (

        <div className="dashboard-page">

            <Sidebar />


            <main className="dashboard-content">

                <div className="dashboard-shell">

                    <div className="container-fluid">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="history-header">

                            <h2>
                                Request History
                            </h2>


                            <DownloadDropdown />

                        </div>


                        {/* =================================================
                            REQUEST TABLE
                        ================================================= */}

                        <div className="history-table-card">

                            {loading ? (

                                <div className="history-loading">

                                    <div
                                        className="spinner-border"
                                        role="status"
                                    ></div>

                                    <p>
                                        Loading request history...
                                    </p>

                                </div>

                            ) : requests.length === 0 ? (

                                <div className="history-empty">

                                    <div className="history-empty-icon">

                                        <i className="bi bi-inbox"></i>

                                    </div>

                                    <h5>
                                        No requests found
                                    </h5>

                                    <p>
                                        You haven't raised any procurement requests yet.
                                    </p>

                                    <button
                                        type="button"
                                        className="btn btn-dark"
                                        onClick={() =>
                                            navigate("/raise-request")
                                        }
                                    >

                                        <i className="bi bi-plus-lg me-2"></i>

                                        Raise Request

                                    </button>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table history-table align-middle mb-0">

                                        <thead>

                                            <tr>

                                                <th>
                                                    ID
                                                </th>

                                                <th>
                                                    Product
                                                </th>

                                                <th>
                                                    Department
                                                </th>

                                                <th>
                                                    Quantity
                                                </th>

                                                <th>
                                                    Total Price
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Date
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {requests.map(
                                                (request, index) => {

                                                    const isDelivered =
                                                        request.status ===
                                                        "DELIVERED";


                                                    return (

                                                        <tr
                                                            key={
                                                                request.productId ||
                                                                request.id ||
                                                                index
                                                            }
                                                        >

                                                            <td>

                                                                <span className="history-id">

                                                                    #
                                                                    {
                                                                        request.productId ||
                                                                        request.id ||
                                                                        "—"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* =================================================
                                                                PRODUCT
                                                            ================================================= */}

                                                            <td>

                                                                {isDelivered ? (

                                                                    <button
                                                                        type="button"
                                                                        className="history-product rating-product-link"
                                                                        onClick={() =>
                                                                            handleRateProduct(
                                                                                request
                                                                            )
                                                                        }
                                                                        title="Click to rate this delivered product"
                                                                    >

                                                                        {
                                                                            request.productName ||
                                                                            "—"
                                                                        }

                                                                    </button>

                                                                ) : (

                                                                    <span className="history-product">

                                                                        {
                                                                            request.productName ||
                                                                            "—"
                                                                        }

                                                                    </span>

                                                                )}

                                                            </td>


                                                            <td>

                                                                {
                                                                    request.department ||
                                                                    "—"
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    request.quantity ??
                                                                    0
                                                                }

                                                            </td>


                                                            <td>

                                                                <span className="history-price">

                                                                    {
                                                                        formatPrice(
                                                                            request.totalPrice
                                                                        )
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* =================================================
                                                                STATUS
                                                            ================================================= */}

                                                            <td>

                                                                {isDelivered ? (

                                                                    <button
                                                                        type="button"
                                                                        className="rating-status-button"
                                                                        onClick={() =>
                                                                            handleRateProduct(
                                                                                request
                                                                            )
                                                                        }
                                                                    >

                                                                        <span
                                                                            className={
                                                                                getStatusClass(
                                                                                    request.status
                                                                                )
                                                                            }
                                                                        >

                                                                            <span className="history-status-dot"></span>

                                                                            {
                                                                                formatStatus(
                                                                                    request.status
                                                                                )
                                                                            }

                                                                        </span>


                                                                        <span className="rating-action-text">

                                                                            ⭐ Rate Product

                                                                        </span>

                                                                    </button>

                                                                ) : (

                                                                    <span
                                                                        className={
                                                                            getStatusClass(
                                                                                request.status
                                                                            )
                                                                        }
                                                                    >

                                                                        <span className="history-status-dot"></span>

                                                                        {
                                                                            formatStatus(
                                                                                request.status
                                                                            )
                                                                        }

                                                                    </span>

                                                                )}

                                                            </td>


                                                            <td>

                                                                {
                                                                    formatDate(
                                                                        request.createdDate
                                                                    )
                                                                }

                                                            </td>

                                                        </tr>

                                                    );

                                                }
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

export default RequestHistory;
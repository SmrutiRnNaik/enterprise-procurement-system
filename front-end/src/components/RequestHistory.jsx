import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import DownloadDropdown from "../components/DownloadDropdown";
import OrderStatusTracker from "./OrderStatusTracker";

import { getRequestHistory } from "../services/dashboardService";


function RequestHistory() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedRequest, setSelectedRequest] =
        useState(null);

    const [orderStatus, setOrderStatus] =
        useState(null);


    /* =========================================================
       FETCH REQUEST HISTORY
       ========================================================= */

    useEffect(() => {

        const fetchRequestHistory = async () => {

            try {

                const userId =
                    localStorage.getItem("userId");

                if (!userId) {

                    console.error(
                        "User ID not found."
                    );

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
       STATUS CLASS
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


    /* =========================================================
       STATUS LABEL
       ========================================================= */

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

        const numericPrice = Number(price);

        if (Number.isNaN(numericPrice)) {
            return "₹0";
        }

        return `₹${numericPrice.toLocaleString("en-IN")}`;
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

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "—";
        }

        return parsedDate.toLocaleDateString(
            "en-IN"
        );
    };


    /* =========================================================
       RATE PRODUCT
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


    /* =========================================================
       VIEW ORDER STATUS
       ========================================================= */

    const handleViewOrderStatus = async (request) => {

        /*
         * IMPORTANT:
         * Open the tracker FIRST.
         *
         * The tracker must not depend on the API call
         * succeeding before it becomes visible.
         */

        setSelectedRequest(request);

        setOrderStatus(null);


        try {

            const response = await axios.get(
                `http://localhost:8080/api/orders/status/${request.productId}`
            );


            const data =
                response.data?.data;


            if (data) {

                setOrderStatus(data);

            } else {

                setOrderStatus({
                    orderStatus: null,
                    updatedDate: null
                });

            }

        } catch (error) {

            /*
             * Do NOT close the tracker if the request fails.
             *
             * This also handles approved requests which
             * do not have an order_tracking record yet.
             */

            console.error(
                `Failed to load order status for product ${request.productId}:`,
                error
            );

            setOrderStatus({
                orderStatus: null,
                updatedDate: null
            });

        }

    };


    /* =========================================================
       CLOSE ORDER STATUS
       ========================================================= */

    const closeOrderStatus = () => {

        setSelectedRequest(null);

        setOrderStatus(null);

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
                            TABLE
                        ================================================= */}

                        <div className="history-table-card">

                            {loading ? (

                                <div className="history-loading">

                                    <div className="spinner-border text-secondary"></div>

                                    <p>
                                        Loading request history...
                                    </p>

                                </div>

                            ) : requests.length === 0 ? (

                                <div className="history-empty">

                                    <i className="bi bi-inbox"></i>

                                    <p>
                                        No requests found.
                                    </p>

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


                                                    const isApproved =
                                                        request.status ===
                                                        "APPROVED";


                                                    return (

                                                        <tr
                                                            key={
                                                                request.productId ||
                                                                request.id ||
                                                                index
                                                            }
                                                        >


                                                            {/* =========================
                                                                ID
                                                            ========================= */}

                                                            <td>

                                                                <span className="history-id">

                                                                    #
                                                                    {request.productId ||
                                                                        request.id ||
                                                                        "—"}

                                                                </span>

                                                            </td>


                                                            {/* =========================
                                                                PRODUCT
                                                            ========================= */}

                                                            <td>

                                                                {isDelivered ? (

                                                                    <span
                                                                        className="history-product rating-product-link"
                                                                        onClick={() =>
                                                                            handleRateProduct(
                                                                                request
                                                                            )
                                                                        }
                                                                        title="Click to rate this delivered product"
                                                                    >

                                                                        {request.productName ||
                                                                            "—"}

                                                                    </span>

                                                                ) : isApproved ? (

                                                                    <span
                                                                        className="history-product order-status-product-link"
                                                                        onClick={() =>
                                                                            handleViewOrderStatus(
                                                                                request
                                                                            )
                                                                        }
                                                                        title="Click to view order status"
                                                                    >

                                                                        {request.productName ||
                                                                            "—"}

                                                                    </span>

                                                                ) : (

                                                                    <span className="history-product">

                                                                        {request.productName ||
                                                                            "—"}

                                                                    </span>

                                                                )}

                                                            </td>


                                                            {/* =========================
                                                                DEPARTMENT
                                                            ========================= */}

                                                            <td>

                                                                {request.department ||
                                                                    "—"}

                                                            </td>


                                                            {/* =========================
                                                                QUANTITY
                                                            ========================= */}

                                                            <td>

                                                                {request.quantity ??
                                                                    0}

                                                            </td>


                                                            {/* =========================
                                                                TOTAL PRICE
                                                            ========================= */}

                                                            <td>

                                                                <span className="history-price">

                                                                    {formatPrice(
                                                                        request.totalPrice
                                                                    )}

                                                                </span>

                                                            </td>


                                                            {/* =========================
                                                                STATUS
                                                            ========================= */}

                                                            <td>

                                                                {isDelivered ? (

                                                                    <span
                                                                        className={
                                                                            getStatusClass(
                                                                                request.status
                                                                            )
                                                                        }
                                                                    >

                                                                        <span className="history-status-dot"></span>

                                                                        {formatStatus(
                                                                            request.status
                                                                        )}

                                                                    </span>

                                                                ) : isApproved ? (

                                                                    <span
                                                                        className="order-status-table-button"
                                                                        onClick={() =>
                                                                            handleViewOrderStatus(
                                                                                request
                                                                            )
                                                                        }
                                                                        title="Click to view order status"
                                                                    >

                                                                        <span className="history-status approved">

                                                                            <span className="history-status-dot"></span>

                                                                            Approved

                                                                        </span>


                                                                        <span className="order-status-arrow">
                                                                            ›
                                                                        </span>

                                                                    </span>

                                                                ) : (

                                                                    <span
                                                                        className={
                                                                            getStatusClass(
                                                                                request.status
                                                                            )
                                                                        }
                                                                    >

                                                                        <span className="history-status-dot"></span>

                                                                        {formatStatus(
                                                                            request.status
                                                                        )}

                                                                    </span>

                                                                )}

                                                            </td>


                                                            {/* =========================
                                                                DATE
                                                            ========================= */}

                                                            <td>

                                                                {formatDate(
                                                                    request.createdDate
                                                                )}

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


            {/* =========================================================
                ORDER STATUS TRACKER
            ========================================================= */}

            {selectedRequest && (

                <OrderStatusTracker

                    currentStatus={
                        orderStatus?.orderStatus || null
                    }

                    productName={
                        selectedRequest.productName
                    }

                    productId={
                        selectedRequest.productId
                    }

                    updatedDate={
                        orderStatus?.updatedDate || null
                    }

                    onClose={
                        closeOrderStatus
                    }

                />

            )}

        </div>

    );
}


export default RequestHistory;
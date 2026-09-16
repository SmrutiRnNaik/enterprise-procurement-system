import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import OrderStatusTracker from "./OrderStatusTracker";

import {
    getAdminRequests,
    updateRequestStatus,
    downloadAdminHistory
} from "../services/adminService";

import {
    showSuccess,
    showError,
    showConfirm
} from "../utils/notifications";

import "./AdminRequestHistory.css";


function AdminRequestHistory() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingAction, setUpdatingAction] = useState(null);
    const [downloading, setDownloading] = useState(false);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [statusLoading, setStatusLoading] = useState(false);


    /* =========================================================
       FETCH REQUESTS
       ========================================================= */

    const fetchRequests = async () => {

        try {

            setLoading(true);

            const response = await getAdminRequests();

            setRequests(
                response.data?.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load admin request history:",
                error
            );

            showError(
                "Error",
                "Failed to load procurement requests."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchRequests();
    }, []);


    /* =========================================================
       STATUS
       ========================================================= */

    const getBadge = (status) => {

        switch (status) {

            case "APPROVED":
                return "approved";

            case "PENDING_APPROVAL":
                return "pending";

            case "REJECTED":
                return "rejected";

            case "DELIVERED":
                return "delivered";

            default:
                return "default";

        }

    };


    const formatStatus = (status) => {

        switch (status) {

            case "PENDING_APPROVAL":
                return "Pending Approval";

            case "APPROVED":
                return "Approved";

            case "REJECTED":
                return "Rejected";

            case "DELIVERED":
                return "Delivered";

            default:
                return status || "Unknown";

        }

    };


    /* =========================================================
       ORDER STATUS TRACKER
       ========================================================= */

    const handleViewOrderStatus = async (request) => {

        try {

            setSelectedRequest(request);
            setOrderStatus(null);
            setStatusLoading(true);


            const response = await fetch(
                `http://localhost:8080/api/orders/status/${request.productId}`
            );


            /*
             * No tracking record exists yet.
             *
             * This is not an error.
             * Open the tracker with no current status
             * so all milestones remain dark.
             */
            if (response.status === 404) {

                setOrderStatus({
                    orderStatus: null,
                    updatedDate: null
                });

                return;
            }


            /*
             * Any other unsuccessful response
             * is treated as a real error.
             */
            if (!response.ok) {

                let errorMessage =
                    "Unable to fetch order status.";

                try {

                    const errorData =
                        await response.json();

                    errorMessage =
                        errorData?.message ||
                        errorMessage;

                } catch (error) {
                    // Ignore JSON parsing failure.
                }

                throw new Error(errorMessage);

            }


            const responseData =
                await response.json();


            const data =
                responseData?.data;


            if (!data) {

                throw new Error(
                    "Order status information is unavailable."
                );

            }


            setOrderStatus(data);

        } catch (error) {

            console.error(
                "Failed to load order status:",
                error
            );


            setSelectedRequest(null);
            setOrderStatus(null);


            showError(
                "Unable to Load Status",
                error.message ||
                "Could not fetch the current order status."
            );

        } finally {

            setStatusLoading(false);

        }

    };


    const closeOrderStatus = () => {

        setSelectedRequest(null);
        setOrderStatus(null);
        setStatusLoading(false);

    };


    /* =========================================================
       APPROVE / REJECT
       ========================================================= */

    const handleStatusChange = async (
        productId,
        status
    ) => {

        const isApproving =
            status === "APPROVED";

        const action =
            isApproving
                ? "approve"
                : "reject";


        const result = await showConfirm(
            isApproving
                ? "Approve Request?"
                : "Reject Request?",
            `Are you sure you want to ${action} request #${productId}?`,
            isApproving
                ? "Approve"
                : "Reject"
        );


        if (!result.isConfirmed) {
            return;
        }


        try {

            setUpdatingAction({
                productId,
                status
            });


            await updateRequestStatus(
                productId,
                status
            );


            if (isApproving) {

                const approvedRequest =
                    requests.find(
                        request =>
                            request.productId === productId
                    );


                if (!approvedRequest) {

                    showError(
                        "Error",
                        "Approved request details could not be found."
                    );

                    await fetchRequests();

                    return;

                }


                showSuccess(
                    "Request Approved",
                    `Request #${productId} has been approved successfully.`
                );


                navigate(
                    "/payment",
                    {
                        state: {
                            product: approvedRequest
                        }
                    }
                );

                return;

            }


            showSuccess(
                "Request Rejected",
                `Request #${productId} has been rejected successfully.`
            );


            await fetchRequests();

        } catch (error) {

            console.error(
                "Failed to update request status:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to update request status.";

            showError(
                "Update Failed",
                message
            );

        } finally {

            setUpdatingAction(null);

        }

    };


    /* =========================================================
       DOWNLOAD
       ========================================================= */

    const handleDownload = async (format) => {

        try {

            setDownloading(true);

            const response =
                await downloadAdminHistory(format);


            let extension = format;

            if (format === "excel") {
                extension = "xlsx";
            }


            const mimeType =
                format === "pdf"
                    ? "application/pdf"
                    : format === "csv"
                        ? "text/csv"
                        : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";


            const blob =
                new Blob(
                    [response.data],
                    {
                        type: mimeType
                    }
                );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                `admin-procurement-history.${extension}`;


            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Failed to download admin history:",
                error
            );

            showError(
                "Download Failed",
                "Unable to download request history."
            );

        } finally {

            setDownloading(false);

        }

    };


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="dashboard-page admin-history-page">

                <AdminSidebar />

                <main className="dashboard-content">

                    <div className="admin-history-container">

                        <div className="admin-history-header">

                            <div>

                                <span className="admin-history-eyebrow">
                                    ADMINISTRATION
                                </span>

                                <h2>
                                    Request History
                                </h2>

                            </div>

                        </div>


                        <div className="admin-history-panel">

                            <div className="admin-history-loading">

                                <div className="admin-history-spinner"></div>

                                <span>
                                    Loading requests...
                                </span>

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

        <div className="dashboard-page admin-history-page">

            <AdminSidebar />

            <main className="dashboard-content">

                <div className="admin-history-container">


                    {/* =================================================
                       HEADER
                    ================================================= */}

                    <div className="admin-history-header">

                        <div>

                            <span className="admin-history-eyebrow">
                                ADMINISTRATION
                            </span>

                            <h2>
                                Request History
                            </h2>

                            <p>
                                Review and manage all procurement requests
                                across the organization.
                            </p>

                        </div>


                        <div className="admin-history-actions">

                            <div className="admin-history-dropdown">

                                <button
                                    type="button"
                                    className="admin-history-download"
                                    disabled={downloading}
                                    onClick={(event) => {

                                        const menu =
                                            event.currentTarget
                                                .nextElementSibling;

                                        menu.classList.toggle("show");

                                    }}
                                >

                                    {downloading ? (

                                        <>
                                            <span className="admin-history-small-spinner"></span>
                                            Downloading...
                                        </>

                                    ) : (

                                        <>
                                            <i className="bi bi-download"></i>
                                            Download
                                            <i className="bi bi-chevron-down"></i>
                                        </>

                                    )}

                                </button>


                                <div className="admin-history-download-menu">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDownload("pdf")
                                        }
                                    >
                                        <i className="bi bi-file-earmark-pdf"></i>
                                        Download PDF
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDownload("xlsx")
                                        }
                                    >
                                        <i className="bi bi-file-earmark-excel"></i>
                                        Download Excel
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDownload("csv")
                                        }
                                    >
                                        <i className="bi bi-filetype-csv"></i>
                                        Download CSV
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       SUMMARY
                    ================================================= */}

                    <div className="admin-summary-grid">

                        <div className="admin-stat-card">

                            <div className="admin-stat-icon neutral">
                                <i className="bi bi-layers"></i>
                            </div>

                            <div>

                                <span>
                                    Total Requests
                                </span>

                                <strong>
                                    {requests.length}
                                </strong>

                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon pending">
                                <i className="bi bi-hourglass-split"></i>
                            </div>

                            <div>

                                <span>
                                    Pending Approval
                                </span>

                                <strong>
                                    {
                                        requests.filter(
                                            request =>
                                                request.status ===
                                                "PENDING_APPROVAL"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon approved">
                                <i className="bi bi-check-lg"></i>
                            </div>

                            <div>

                                <span>
                                    Approved
                                </span>

                                <strong>
                                    {
                                        requests.filter(
                                            request =>
                                                request.status ===
                                                "APPROVED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="admin-stat-card">

                            <div className="admin-stat-icon rejected">
                                <i className="bi bi-x-lg"></i>
                            </div>

                            <div>

                                <span>
                                    Rejected
                                </span>

                                <strong>
                                    {
                                        requests.filter(
                                            request =>
                                                request.status ===
                                                "REJECTED"
                                        ).length
                                    }
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                       TABLE PANEL
                    ================================================= */}

                    <div className="admin-history-panel">

                        <div className="admin-history-panel-header">

                            <div>

                                <h3>
                                    All Procurement Requests
                                </h3>

                                <span>
                                    {requests.length} total requests
                                </span>

                            </div>


                            <button
                                type="button"
                                className="admin-history-back"
                                onClick={() =>
                                    navigate("/admin-dashboard")
                                }
                            >

                                <i className="bi bi-arrow-left"></i>

                                Dashboard

                            </button>

                        </div>


                        {requests.length === 0 ? (

                            <div className="admin-history-empty">

                                <i className="bi bi-inbox"></i>

                                <h4>
                                    No procurement requests
                                </h4>

                                <p>
                                    There are currently no requests.
                                </p>

                            </div>

                        ) : (

                            <div className="admin-history-table-wrapper">

                                <table className="admin-history-table">

                                    <thead>

                                        <tr>

                                            <th>ID</th>
                                            <th>Product</th>
                                            <th>Requested By</th>
                                            <th>Department</th>
                                            <th>Category</th>
                                            <th>Qty</th>
                                            <th>Total Price</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                            <th>Date</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {requests.map(
                                            (request) => {

                                                const isTrackable =
                                                    request.status ===
                                                    "APPROVED" ||
                                                    request.status ===
                                                    "DELIVERED";


                                                return (

                                                    <tr
                                                        key={
                                                            request.productId
                                                        }
                                                    >

                                                        <td>

                                                            <span className="admin-request-id">
                                                                #{request.productId}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            {isTrackable ? (

                                                                <button
                                                                    type="button"
                                                                    className="admin-product-link"
                                                                    onClick={() =>
                                                                        handleViewOrderStatus(
                                                                            request
                                                                        )
                                                                    }
                                                                >

                                                                    {
                                                                        request.productName
                                                                    }

                                                                    <i className="bi bi-arrow-up-right"></i>

                                                                </button>

                                                            ) : (

                                                                <span className="admin-product-name">
                                                                    {
                                                                        request.productName
                                                                    }
                                                                </span>

                                                            )}

                                                        </td>


                                                        <td>
                                                            {
                                                                request.requestedBy ||
                                                                "—"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                request.department ||
                                                                "—"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                request.category ||
                                                                "—"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                request.quantity
                                                            }
                                                        </td>


                                                        <td>

                                                            <span className="admin-price">
                                                                ₹
                                                                {Number(
                                                                    request.totalPrice
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </span>

                                                        </td>


                                                        <td>

                                                            {isTrackable ? (

                                                                <button
                                                                    type="button"
                                                                    className="admin-status-button"
                                                                    onClick={() =>
                                                                        handleViewOrderStatus(
                                                                            request
                                                                        )
                                                                    }
                                                                >

                                                                    <span
                                                                        className={
                                                                            `admin-status-badge ${getBadge(
                                                                                request.status
                                                                            )}`
                                                                        }
                                                                    >

                                                                        <span className="admin-status-dot"></span>

                                                                        {
                                                                            formatStatus(
                                                                                request.status
                                                                            )
                                                                        }

                                                                    </span>

                                                                    <i className="bi bi-chevron-right"></i>

                                                                </button>

                                                            ) : (

                                                                <span
                                                                    className={
                                                                        `admin-status-badge ${getBadge(
                                                                            request.status
                                                                        )}`
                                                                    }
                                                                >

                                                                    <span className="admin-status-dot"></span>

                                                                    {
                                                                        formatStatus(
                                                                            request.status
                                                                        )
                                                                    }

                                                                </span>

                                                            )}

                                                        </td>


                                                        <td>

                                                            {request.status ===
                                                            "PENDING_APPROVAL" ? (

                                                                <div className="admin-action-buttons">

                                                                    <button
                                                                        type="button"
                                                                        className="admin-approve-button"
                                                                        disabled={
                                                                            updatingAction !==
                                                                            null
                                                                        }
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                request.productId,
                                                                                "APPROVED"
                                                                            )
                                                                        }
                                                                    >

                                                                        {
                                                                            updatingAction?.productId ===
                                                                                request.productId &&
                                                                            updatingAction?.status ===
                                                                                "APPROVED"
                                                                                ? (
                                                                                    <span className="admin-button-spinner"></span>
                                                                                )
                                                                                : (
                                                                                    <i className="bi bi-check-lg"></i>
                                                                                )
                                                                        }

                                                                        Approve

                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        className="admin-reject-button"
                                                                        disabled={
                                                                            updatingAction !==
                                                                            null
                                                                        }
                                                                        onClick={() =>
                                                                            handleStatusChange(
                                                                                request.productId,
                                                                                "REJECTED"
                                                                            )
                                                                        }
                                                                    >

                                                                        {
                                                                            updatingAction?.productId ===
                                                                                request.productId &&
                                                                            updatingAction?.status ===
                                                                                "REJECTED"
                                                                                ? (
                                                                                    <span className="admin-button-spinner"></span>
                                                                                )
                                                                                : (
                                                                                    <i className="bi bi-x-lg"></i>
                                                                                )
                                                                        }

                                                                        Reject

                                                                    </button>

                                                                </div>

                                                            ) : (

                                                                <span className="admin-no-action">
                                                                    —
                                                                </span>

                                                            )}

                                                        </td>


                                                        <td>

                                                            <span className="admin-date">

                                                                {
                                                                    new Date(
                                                                        request.createdDate
                                                                    ).toLocaleDateString(
                                                                        "en-IN"
                                                                    )
                                                                }

                                                            </span>

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

            </main>


            {/* =========================================================
               ORDER STATUS
            ========================================================= */}

            {selectedRequest && (

                statusLoading ? (

                    <div
                        className="order-status-loading-overlay"
                        onClick={closeOrderStatus}
                    >

                        <div
                            className="order-status-loading-modal"
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        >

                            <div className="admin-history-loading">

                                <div className="admin-history-spinner"></div>

                                <span>
                                    Loading order status...
                                </span>

                            </div>

                        </div>

                    </div>

                ) : orderStatus ? (

                    <OrderStatusTracker

                        currentStatus={
                            orderStatus.orderStatus
                        }

                        productName={
                            selectedRequest.productName
                        }

                        productId={
                            selectedRequest.productId
                        }

                        updatedDate={
                            orderStatus.updatedDate
                        }

                        onClose={
                            closeOrderStatus
                        }

                    />

                ) : null

            )}

        </div>

    );

}


export default AdminRequestHistory;
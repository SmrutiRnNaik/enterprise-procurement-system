import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";

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


function AdminRequestHistory() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [updatingAction, setUpdatingAction] = useState(null);

    const [downloading, setDownloading] = useState(false);


    /* =========================================================
       FETCH ALL ADMIN REQUESTS
       ========================================================= */

    const fetchRequests = async () => {

        try {

            setLoading(true);

            const response =
                await getAdminRequests();

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
       STATUS BADGE
       ========================================================= */

    const getBadge = (status) => {

        switch (status) {

            case "APPROVED":
                return "success";

            case "PENDING_APPROVAL":
                return "warning";

            case "REJECTED":
                return "danger";

            default:
                return "secondary";

        }

    };


    /* =========================================================
       FORMAT STATUS
       ========================================================= */

    const formatStatus = (status) => {

        switch (status) {

            case "PENDING_APPROVAL":
                return "Pending Approval";

            case "APPROVED":
                return "Approved";

            case "REJECTED":
                return "Rejected";

            default:
                return status;

        }

    };


    /* =========================================================
       APPROVE / REJECT REQUEST
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


        /* =====================================================
           CONFIRMATION POPUP
        ===================================================== */

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

            /*
             * Store both product ID and action.
             * This allows only the clicked button to
             * display the loading spinner.
             */

            setUpdatingAction({
                productId: productId,
                status: status
            });


            /* =================================================
               UPDATE REQUEST STATUS
               ================================================= */

            await updateRequestStatus(
                productId,
                status
            );


            /* =================================================
               APPROVED REQUEST
               ================================================= */

            if (isApproving) {

                /*
                 * Find the request that was just approved.
                 */

                const approvedRequest =
                    requests.find(
                        request =>
                            request.productId === productId
                    );


                /*
                 * If request details cannot be found,
                 * reload the list and stop.
                 */

                if (!approvedRequest) {

                    showError(
                        "Error",
                        "Approved request details could not be found."
                    );

                    await fetchRequests();

                    return;

                }


                /*
                 * Show approval message.
                 */

                showSuccess(
                    "Request Approved",
                    `Request #${productId} has been approved successfully.`
                );


                /*
                 * Open payment page.
                 *
                 * The complete approved request is passed
                 * through React Router state.
                 *
                 * PaymentPage can access it using:
                 *
                 * location.state.product
                 */

                navigate(
                    "/payment",
                    {
                        state: {
                            product: approvedRequest
                        }
                    }
                );


                /*
                 * Stop here.
                 *
                 * We do not reload the request page because
                 * the admin is being taken to the payment page.
                 */

                return;

            }


            /* =================================================
               REJECTED REQUEST
               ================================================= */

            showSuccess(
                "Request Rejected",
                `Request #${productId} has been rejected successfully.`
            );


            /*
             * Reload the complete admin request list
             * after rejection.
             */

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

    const handleDownload = async (
        format
    ) => {

        try {

            setDownloading(true);


            const response =
                await downloadAdminHistory(
                    format
                );


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
                window.URL.createObjectURL(
                    blob
                );


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
       LOADING PAGE
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
                                    Request History
                                </h2>

                            </div>

                        </div>


                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <div
                                    className="spinner-border"
                                    role="status"
                                ></div>

                                <p className="text-muted mt-3 mb-0">
                                    Loading requests...
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
                                Request History
                            </h2>

                            <p className="text-muted mb-0">

                                Review and manage all procurement requests
                                across the organization.

                            </p>

                        </div>


                        {/* =================================================
                            DOWNLOAD
                        ================================================= */}

                        <div className="dropdown">

                            <button
                                className="btn btn-dark dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                disabled={downloading}
                            >

                                {downloading ? (

                                    <>

                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>

                                        Downloading...

                                    </>

                                ) : (

                                    <>

                                        <i className="bi bi-download me-2"></i>

                                        Download

                                    </>

                                )}

                            </button>


                            <ul className="dropdown-menu dropdown-menu-end">

                                <li>

                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDownload("pdf")
                                        }
                                    >

                                        <i className="bi bi-file-earmark-pdf me-2"></i>

                                        Download PDF

                                    </button>

                                </li>


                                <li>

                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDownload("xlsx")
                                        }
                                    >

                                        <i className="bi bi-file-earmark-excel me-2"></i>

                                        Download Excel

                                    </button>

                                </li>


                                <li>

                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() =>
                                            handleDownload("csv")
                                        }
                                    >

                                        <i className="bi bi-filetype-csv me-2"></i>

                                        Download CSV

                                    </button>

                                </li>

                            </ul>

                        </div>

                    </div>


                    {/* =================================================
                        SUMMARY CARDS
                    ================================================= */}

                    <div className="row g-3 mb-4">


                        {/* TOTAL */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Total Requests
                                    </small>

                                    <h3 className="fw-bold mb-0">
                                        {requests.length}
                                    </h3>

                                </div>

                            </div>

                        </div>


                        {/* PENDING */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Pending Approval
                                    </small>

                                    <h3 className="fw-bold mb-0">

                                        {
                                            requests.filter(
                                                request =>
                                                    request.status ===
                                                    "PENDING_APPROVAL"
                                            ).length
                                        }

                                    </h3>

                                </div>

                            </div>

                        </div>


                        {/* APPROVED */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Approved
                                    </small>

                                    <h3 className="fw-bold mb-0">

                                        {
                                            requests.filter(
                                                request =>
                                                    request.status ===
                                                    "APPROVED"
                                            ).length
                                        }

                                    </h3>

                                </div>

                            </div>

                        </div>


                        {/* REJECTED */}

                        <div className="col-md-3">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body">

                                    <small className="text-muted">
                                        Rejected
                                    </small>

                                    <h3 className="fw-bold mb-0">

                                        {
                                            requests.filter(
                                                request =>
                                                    request.status ===
                                                    "REJECTED"
                                            ).length
                                        }

                                    </h3>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        REQUEST TABLE
                    ================================================= */}

                    <div className="card border-0 shadow-sm">

                        <div className="card-body">


                            {/* TABLE HEADER */}

                            <div className="d-flex justify-content-between align-items-center mb-3">

                                <div>

                                    <h5 className="fw-bold mb-1">
                                        All Procurement Requests
                                    </h5>

                                    <p className="text-muted small mb-0">

                                        {requests.length}
                                        {" "}
                                        total requests

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-dark"
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


                            {/* EMPTY STATE */}

                            {requests.length === 0 ? (

                                <div className="request-empty-state">

                                    <div className="request-empty-icon">

                                        <i className="bi bi-inbox"></i>

                                    </div>

                                    <h6 className="fw-bold mt-3">
                                        No procurement requests
                                    </h6>

                                    <p className="text-muted mb-0">
                                        There are currently no requests.
                                    </p>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-hover align-middle mb-0">

                                        <thead className="table-light">

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
                                                (request) => (

                                                    <tr
                                                        key={
                                                            request.productId
                                                        }
                                                    >


                                                        {/* ID */}

                                                        <td>

                                                            #
                                                            {
                                                                request.productId
                                                            }

                                                        </td>


                                                        {/* PRODUCT */}

                                                        <td className="fw-semibold">

                                                            {
                                                                request.productName
                                                            }

                                                        </td>


                                                        {/* REQUESTED BY */}

                                                        <td>

                                                            {
                                                                request.requestedBy
                                                            }

                                                        </td>


                                                        {/* DEPARTMENT */}

                                                        <td>

                                                            {
                                                                request.department
                                                            }

                                                        </td>


                                                        {/* CATEGORY */}

                                                        <td>

                                                            {
                                                                request.category
                                                            }

                                                        </td>


                                                        {/* QUANTITY */}

                                                        <td>

                                                            {
                                                                request.quantity
                                                            }

                                                        </td>


                                                        {/* TOTAL PRICE */}

                                                        <td>

                                                            ₹
                                                            {Number(
                                                                request.totalPrice
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </td>


                                                        {/* STATUS */}

                                                        <td>

                                                            <span
                                                                className={`badge bg-${getBadge(
                                                                    request.status
                                                                )}`}
                                                            >

                                                                {
                                                                    formatStatus(
                                                                        request.status
                                                                    )
                                                                }

                                                            </span>

                                                        </td>


                                                        {/* ACTION */}

                                                        <td>

                                                            {request.status ===
                                                            "PENDING_APPROVAL" ? (

                                                                <div className="d-flex gap-2">


                                                                    {/* APPROVE */}

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-success"
                                                                        disabled={
                                                                            updatingAction !== null
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

                                                                                    <span
                                                                                        className="spinner-border spinner-border-sm"
                                                                                        role="status"
                                                                                    ></span>

                                                                                )
                                                                                : (

                                                                                    <i className="bi bi-check-lg"></i>

                                                                                )
                                                                        }


                                                                        <span className="ms-1">

                                                                            Approve

                                                                        </span>

                                                                    </button>


                                                                    {/* REJECT */}

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        disabled={
                                                                            updatingAction !== null
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

                                                                                    <span
                                                                                        className="spinner-border spinner-border-sm"
                                                                                        role="status"
                                                                                    ></span>

                                                                                )
                                                                                : (

                                                                                    <i className="bi bi-x-lg"></i>

                                                                                )
                                                                        }


                                                                        <span className="ms-1">

                                                                            Reject

                                                                        </span>

                                                                    </button>


                                                                </div>

                                                            ) : (

                                                                <span className="text-muted small">

                                                                    No action

                                                                </span>

                                                            )}

                                                        </td>


                                                        {/* DATE */}

                                                        <td>

                                                            {
                                                                new Date(
                                                                    request.createdDate
                                                                ).toLocaleDateString(
                                                                    "en-IN"
                                                                )
                                                            }

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


export default AdminRequestHistory;
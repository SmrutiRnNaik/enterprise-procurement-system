import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getRequestHistory } from "../services/dashboardService";

function RequestTable({ limit, showHeader = true }) {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchRequests = async () => {

            try {

                const userId = localStorage.getItem("userId");

                if (!userId) {
                    console.error("User ID not found.");
                    return;
                }

                const response = await getRequestHistory(userId);

                setRequests(response.data.data || []);

            } catch (error) {

                console.error(
                    "Failed to load request history",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchRequests();

    }, []);


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


    const displayedRequests = limit
        ? requests.slice(0, limit)
        : requests;


    if (loading) {

        return (

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

        );

    }


    return (

        <div className="card border-0 shadow-sm">

            <div className="card-body">


                {/* =================================================
                    OPTIONAL HEADER

                    Hidden on Dashboard because Dashboard
                    already provides the Recent Requests header.
                ================================================= */}

                {showHeader && (

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <div>

                            <h5 className="fw-bold mb-1">
                                {limit
                                    ? "Recent Requests"
                                    : "Request History"
                                }
                            </h5>

                            <p className="text-muted small mb-0">

                                {limit
                                    ? "Your latest procurement requests"
                                    : "Complete history of your procurement requests"
                                }

                            </p>

                        </div>


                        <div className="d-flex align-items-center gap-3">

                            <small className="text-muted">
                                {requests.length} Requests
                            </small>


                            {limit && requests.length > 0 && (

                                <button
                                    type="button"
                                    className="btn btn-sm btn-outline-dark"
                                    onClick={() =>
                                        navigate("/request-history")
                                    }
                                >

                                    View Full History

                                    <i className="bi bi-arrow-right ms-2"></i>

                                </button>

                            )}

                        </div>

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {displayedRequests.length === 0 ? (

                    <div className="request-empty-state">

                        <div className="request-empty-icon">

                            <i className="bi bi-inbox"></i>

                        </div>

                        <h6 className="fw-bold mt-3">
                            No requests yet
                        </h6>

                        <p className="text-muted mb-3">
                            You haven't raised any procurement requests.
                        </p>


                        {limit && (

                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={() =>
                                    navigate("/raise-request")
                                }
                            >

                                <i className="bi bi-plus-lg me-2"></i>

                                Raise Your First Request

                            </button>

                        )}

                    </div>

                ) : (

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>ID</th>

                                    <th>Product</th>

                                    <th>Department</th>

                                    <th>Quantity</th>

                                    <th>Total Price</th>

                                    <th>Status</th>

                                    <th>Date</th>

                                </tr>

                            </thead>


                            <tbody>

                                {displayedRequests.map((request) => (

                                    <tr key={request.productId}>

                                        <td>
                                            #{request.productId}
                                        </td>

                                        <td className="fw-semibold">
                                            {request.productName}
                                        </td>

                                        <td>
                                            {request.department}
                                        </td>

                                        <td>
                                            {request.quantity}
                                        </td>

                                        <td>
                                            ₹
                                            {Number(
                                                request.totalPrice
                                            ).toLocaleString("en-IN")}
                                        </td>

                                        <td>

                                            <span
                                                className={`badge bg-${getBadge(
                                                    request.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    request.status
                                                )}
                                            </span>

                                        </td>

                                        <td>

                                            {new Date(
                                                request.createdDate
                                            ).toLocaleDateString(
                                                "en-IN"
                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default RequestTable;
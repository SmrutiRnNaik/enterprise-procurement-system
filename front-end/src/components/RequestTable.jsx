import { useEffect, useState } from "react";
import { getRequestHistory } from "../services/dashboardService";

function RequestTable() {

    const [requests, setRequests] = useState([]);

    useEffect(() => {

        const fetchRequests = async () => {

            try {

                const response = await getRequestHistory(1);
                setRequests(response.data.data);

            } catch (error) {

                console.error("Failed to load request history", error);

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

    return (

        <div className="card border-0 shadow-sm">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h5 className="fw-bold mb-0">
                        Request History
                    </h5>

                    <small className="text-muted">
                        {requests.length} Requests
                    </small>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover align-middle">

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

                            {requests.map((request) => (

                                <tr key={request.productId}>

                                    <td>#{request.productId}</td>

                                    <td>{request.productName}</td>

                                    <td>{request.department}</td>

                                    <td>{request.quantity}</td>

                                    <td>₹{request.totalPrice.toLocaleString()}</td>

                                    <td>

                                        <span className={`badge bg-${getBadge(request.status)}`}>
                                            {request.status.replace("_", " ")}
                                        </span>

                                    </td>

                                    <td>
                                        {new Date(request.createdDate).toLocaleDateString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default RequestTable;
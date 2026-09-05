import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../Supplier.css";

import SupplierSidebar from "../components/SupplierSidebar";

function SupplierRequests() {

    const BASE_URL = "http://localhost:8080/api";

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [downloadOpen, setDownloadOpen] = useState(false);

    const supplierId = localStorage.getItem("userId");


    useEffect(() => {

        fetchRequests();

    }, []);


    const fetchRequests = async () => {

        if (!supplierId) {

            Swal.fire({
                icon: "error",
                title: "Session Expired",
                text: "Please login again."
            });

            return;
        }

        try {

            setLoading(true);

            const response = await axios.get(
                `${BASE_URL}/products/history?type=supplier&id=${supplierId}`
            );

            const data = response.data?.data || [];

            /*
             * Supplier Supply & Requests contains
             * approved requests only.
             *
             * This frontend filter is intentional as a
             * defensive check even though the backend also
             * filters supplier history.
             */
            const approvedRequests = data.filter(
                (request) => request.status === "APPROVED"
            );


            const requestsWithOrderStatus =
                await Promise.all(
                    approvedRequests.map(async (request) => {

                        /*
                         * Order tracking is created when the
                         * supplier starts fulfillment.
                         *
                         * Therefore, an approved request may
                         * not have an order tracking record yet.
                         */
                        if (request.productId) {

                            try {

                                const orderResponse =
                                    await axios.get(
                                        `${BASE_URL}/orders/status/${request.productId}`
                                    );

                                return {
                                    ...request,
                                    orderStatus:
                                        orderResponse.data?.data?.orderStatus ||
                                        null
                                };

                            } catch (error) {

                                /*
                                 * 404 means order fulfillment
                                 * has not started yet.
                                 */
                                if (
                                    error.response?.status === 404
                                ) {

                                    return {
                                        ...request,
                                        orderStatus: null
                                    };
                                }

                                console.error(
                                    `Error loading order status for product ${request.productId}:`,
                                    error
                                );

                                return {
                                    ...request,
                                    orderStatus: null
                                };
                            }

                        }

                        return {
                            ...request,
                            orderStatus: null
                        };

                    })
                );


            setRequests(requestsWithOrderStatus);

        } catch (error) {

            console.error(
                "Error loading supplier requests:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Unable to Load Requests",
                text:
                    error.response?.data?.message ||
                    "Could not load supplier requests."
            });

        } finally {

            setLoading(false);

        }
    };


    const getOrderStatus = (request) => {

        if (!request.orderStatus) {
            return "Not Started";
        }

        switch (request.orderStatus) {

            case "ORDER_RECEIVED":
                return "Order Received";

            case "PACKED":
                return "Packed";

            case "SHIPPED":
                return "Shipped";

            case "OUT_FOR_DELIVERY":
                return "Out for Delivery";

            case "DELIVERED":
                return "Delivered";

            default:
                return "Not Started";
        }
    };


    const getOrderStatusClass = (request) => {

        switch (request.orderStatus) {

            case "DELIVERED":
                return "history-status approved";

            case "ORDER_RECEIVED":
            case "PACKED":
            case "SHIPPED":
            case "OUT_FOR_DELIVERY":
                return "history-status pending";

            default:
                return "history-status pending";
        }
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


    const formatPrice = (price) => {

        if (
            price === null ||
            price === undefined ||
            price === ""
        ) {
            return "₹0.00";
        }

        return `₹${Number(price).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    const handleDownload = async (format) => {

        if (!supplierId) {

            Swal.fire({
                icon: "error",
                title: "Session Expired",
                text: "Please login again."
            });

            return;
        }

        try {

            setDownloading(true);
            setDownloadOpen(false);

            const response = await axios.get(
                `${BASE_URL}/products/history?type=supplier&id=${supplierId}&format=${format}`,
                {
                    responseType: "blob"
                }
            );

            let fileType;
            let extension;

            switch (format) {

                case "pdf":

                    fileType = "application/pdf";
                    extension = "pdf";

                    break;

                case "xlsx":

                    fileType =
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    extension = "xlsx";

                    break;

                case "csv":

                    fileType = "text/csv";
                    extension = "csv";

                    break;

                default:

                    fileType =
                        "application/octet-stream";
                    extension = format;

            }


            const blob = new Blob(
                [response.data],
                {
                    type: fileType
                }
            );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `supplier-approved-requests-${supplierId}.${extension}`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);


            Swal.fire({
                icon: "success",
                title: "Download Started",
                text:
                    `Approved supplier requests downloaded as ${extension.toUpperCase()}.`,
                timer: 1800,
                showConfirmButton: false
            });

        } catch (error) {

            console.error(
                "Error downloading supplier history:",
                error
            );

            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text:
                    "Unable to download supplier request history."
            });

        } finally {

            setDownloading(false);

        }
    };


    return (

        <div className="dashboard-page supplier-page">

            <SupplierSidebar />


            <main className="dashboard-content">

                <div className="container-fluid">


                    {/* Header */}

                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <span className="raise-request-label">
                                PROCUREMENT
                            </span>

                            <h2>
                                Supply & Requests
                            </h2>

                            <p className="text-muted mb-0">
                                View approved procurement requests assigned to you.
                            </p>

                        </div>


                        {/* Download Dropdown */}

                        <div
                            className="download-dropdown"
                            style={{
                                position: "relative"
                            }}
                        >

                            <button
                                type="button"
                                className="btn-primary"
                                onClick={() =>
                                    setDownloadOpen(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                disabled={
                                    downloading ||
                                    loading ||
                                    requests.length === 0
                                }
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

                                        <i className="bi bi-chevron-down ms-2"></i>

                                    </>

                                )}

                            </button>


                            {downloadOpen && (

                                <div className="download-menu">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDownload(
                                                "pdf"
                                            )
                                        }
                                    >

                                        <i className="bi bi-file-earmark-pdf me-2"></i>

                                        Download PDF

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDownload(
                                                "xlsx"
                                            )
                                        }
                                    >

                                        <i className="bi bi-file-earmark-excel me-2"></i>

                                        Download Excel

                                    </button>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDownload(
                                                "csv"
                                            )
                                        }
                                    >

                                        <i className="bi bi-filetype-csv me-2"></i>

                                        Download CSV

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* Approved Requests Table */}

                    <div className="history-table-card">


                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border"
                                    role="status"
                                ></div>

                                <p className="mt-3 text-muted">
                                    Loading supplier requests...
                                </p>

                            </div>

                        ) : requests.length === 0 ? (

                            <div className="text-center py-5">

                                <i
                                    className="bi bi-inbox"
                                    style={{
                                        fontSize: "42px"
                                    }}
                                ></i>

                                <h5 className="mt-3">
                                    No Approved Requests Found
                                </h5>

                                <p className="text-muted">
                                    There are currently no approved procurement
                                    requests assigned to you.
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="history-table">

                                    <thead>

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
                                                Department
                                            </th>

                                            <th>
                                                Category
                                            </th>

                                            <th>
                                                Quantity
                                            </th>

                                            <th>
                                                Price
                                            </th>

                                            <th>
                                                Total
                                            </th>

                                            <th>
                                                Supply Status
                                            </th>

                                            <th>
                                                Created
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {requests.map(
                                            (request, index) => {

                                                const quantity =
                                                    Number(
                                                        request.quantity || 0
                                                    );


                                                /*
                                                 * ProductResponse uses
                                                 * pricePerProduct.
                                                 */
                                                const price =
                                                    Number(
                                                        request.pricePerProduct || 0
                                                    );


                                                const total =
                                                    request.totalPrice !==
                                                        undefined &&
                                                    request.totalPrice !==
                                                        null
                                                        ? Number(
                                                            request.totalPrice
                                                        )
                                                        : price *
                                                        quantity;


                                                return (

                                                    <tr
                                                        key={
                                                            request.productId ||
                                                            request.id ||
                                                            index
                                                        }
                                                    >

                                                        <td>
                                                            {request.productId ||
                                                                request.id ||
                                                                "-"}
                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {
                                                                    request.productName ||
                                                                    request.product ||
                                                                    "-"
                                                                }
                                                            </strong>

                                                        </td>


                                                        <td>
                                                            {
                                                                request.requestedBy ||
                                                                request.userName ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                request.department ||
                                                                request.departmentName ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                request.category ||
                                                                request.categoryName ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {quantity}
                                                        </td>


                                                        <td>
                                                            {formatPrice(
                                                                price
                                                            )}
                                                        </td>


                                                        <td>

                                                            <strong>
                                                                {formatPrice(
                                                                    total
                                                                )}
                                                            </strong>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={
                                                                    getOrderStatusClass(
                                                                        request
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    getOrderStatus(
                                                                        request
                                                                    )
                                                                }
                                                            </span>

                                                        </td>


                                                        <td>
                                                            {
                                                                formatDate(
                                                                    request.createdDate ||
                                                                    request.createdAt ||
                                                                    request.created
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

            </main>


            {/* Dropdown CSS */}

            <style>
                {`
                    .download-menu {
                        position: absolute;
                        top: calc(100% + 8px);
                        right: 0;
                        min-width: 190px;
                        background: #ffffff;
                        border: 1px solid #e5e7eb;
                        border-radius: 10px;
                        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
                        padding: 6px;
                        z-index: 1000;
                    }

                    .download-menu button {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        padding: 10px 12px;
                        border: none;
                        background: transparent;
                        border-radius: 7px;
                        text-align: left;
                        cursor: pointer;
                        font-size: 14px;
                    }

                    .download-menu button:hover {
                        background: #f5f6f8;
                    }

                    .download-menu button:focus {
                        outline: none;
                    }
                `}
            </style>

        </div>

    );
}

export default SupplierRequests;
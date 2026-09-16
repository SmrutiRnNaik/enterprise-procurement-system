import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import SupplierSidebar from "../components/SupplierSidebar";
import StatsCard from "../components/StatsCard";

import {
    showSupplierSuccess,
    showSupplierError,
    showSupplierInfo,
    showSupplierConfirm
} from "../utils/notifications";

import "../Supplier.css";


const BASE_URL = "http://localhost:8080/api";


const SupplierDashboard = () => {

    const navigate = useNavigate();


    const [requests, setRequests] = useState([]);

    const [orderStatuses, setOrderStatuses] =
        useState({});

    const [loading, setLoading] =
        useState(true);

    const [updatingId, setUpdatingId] =
        useState(null);

    const [activeChartSegment, setActiveChartSegment] =
        useState(null);


    const supplierId =
        localStorage.getItem("userId");


    /* =========================================================
       LOAD SUPPLIER REQUESTS
    ========================================================= */

    useEffect(() => {

        if (!supplierId) {

            navigate("/supplier-login");

            return;

        }


        /*
         * Initial load.
         * This shows the loading state.
         */

        fetchSupplierRequests(true);


        /*
         * Automatically refresh every 10 seconds.
         *
         * Background refreshes are silent, so the
         * dashboard does not flicker or show loading
         * repeatedly.
         */

        const refreshInterval =
            setInterval(() => {

                fetchSupplierRequests(false);

            }, 10000);


        /*
         * Refresh immediately when the user returns
         * to the browser window.
         */

        const handleFocus = () => {

            fetchSupplierRequests(false);

        };


        /*
         * Refresh immediately when the browser tab
         * becomes visible again.
         */

        const handleVisibilityChange = () => {

            if (
                document.visibilityState ===
                "visible"
            ) {

                fetchSupplierRequests(false);

            }

        };


        window.addEventListener(
            "focus",
            handleFocus
        );


        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );


        return () => {

            clearInterval(
                refreshInterval
            );


            window.removeEventListener(
                "focus",
                handleFocus
            );


            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );

        };

    }, [supplierId, navigate]);


    const fetchSupplierRequests = async (
        showLoading = false
    ) => {

        try {

            if (showLoading) {

                setLoading(true);

            }


            const response =
                await axios.get(
                    `${BASE_URL}/products/history?type=supplier&id=${supplierId}`
                );


            const data =
                response.data?.data || [];


            /*
             * Supplier dashboard only displays
             * approved procurement requests.
             */

            const approvedRequests =
                data.filter(
                    (request) =>
                        request.status === "APPROVED"
                );


            setRequests(
                approvedRequests
            );


            /*
             * Fetch current fulfillment status
             * for every approved request.
             *
             * A 404 simply means that the supplier
             * has not started the order yet.
             */

            const statusResults =
                await Promise.all(

                    approvedRequests.map(
                        async (request) => {

                            try {

                                const statusResponse =
                                    await axios.get(
                                        `${BASE_URL}/orders/status/${request.productId}`
                                    );


                                return {

                                    productId:
                                        request.productId,

                                    status:
                                        statusResponse.data
                                            ?.data
                                            ?.orderStatus ||
                                        null

                                };

                            } catch (error) {

                                return {

                                    productId:
                                        request.productId,

                                    status:
                                        null

                                };

                            }

                        }
                    )

                );


            const statusMap = {};


            statusResults.forEach(
                (item) => {

                    statusMap[
                        item.productId
                    ] = item.status;

                }
            );


            setOrderStatuses(
                statusMap
            );


        } catch (error) {

            console.error(
                "Error fetching supplier requests:",
                error
            );


            /*
             * Only show the error toast during
             * a visible/initial load.
             *
             * Background refresh failures should
             * not repeatedly disturb the supplier.
             */

            if (showLoading) {

                showSupplierError(
                    "Unable to Load Requests",
                    error.response?.data?.message ||
                    "Could not fetch supplier request history."
                );

            }

        } finally {

            if (showLoading) {

                setLoading(false);

            }

        }

    };


    /* =========================================================
       STATUS HELPERS
    ========================================================= */

    const formatStatus = (
        status
    ) => {

        if (!status) {

            return "Pending / Not Started";

        }


        return status

            .replace(
                /_/g,
                " "
            )

            .toLowerCase()

            .replace(
                /\b\w/g,
                (char) =>
                    char.toUpperCase()
            );

    };


    const getNextStatus = (
        currentStatus
    ) => {

        switch (currentStatus) {

            case null:

            case undefined:

                return "ORDER_RECEIVED";


            case "ORDER_RECEIVED":

                return "PACKED";


            case "PACKED":

                return "SHIPPED";


            case "SHIPPED":

                return "OUT_FOR_DELIVERY";


            case "OUT_FOR_DELIVERY":

                return "DELIVERED";


            case "DELIVERED":

                return null;


            default:

                return "ORDER_RECEIVED";

        }

    };


    const getSupplyStatus = (
        productId
    ) => {

        const status =
            orderStatuses[
                productId
            ];


        if (!status) {

            return {

                label:
                    "Pending / Not Started",

                className:
                    "history-status pending"

            };

        }


        if (
            status ===
            "DELIVERED"
        ) {

            return {

                label:
                    "Completed",

                className:
                    "history-status approved"

            };

        }


        return {

            label:
                "In Progress",

            className:
                "history-status approved"

        };

    };


    /* =========================================================
       ORDER STATUS UPDATE
    ========================================================= */

    const updateOrderStatus = async (
        productId,
        orderStatus
    ) => {

        try {

            setUpdatingId(
                productId
            );


            await axios.put(
                `${BASE_URL}/orders/status/${productId}`,
                {
                    orderStatus
                }
            );


            setOrderStatuses(
                (previous) => ({

                    ...previous,

                    [productId]:
                        orderStatus

                })
            );


            showSupplierSuccess(
                "Status Updated",
                `Order status changed to ${formatStatus(
                    orderStatus
                )}.`
            );


        } catch (error) {

            console.error(
                "Error updating order status:",
                error
            );


            showSupplierError(
                "Update Failed",
                error.response?.data?.message ||
                "Unable to update the order status."
            );


        } finally {

            setUpdatingId(
                null
            );

        }

    };


    const handleStatusUpdate = async (
        request
    ) => {

        const currentStatus =
            orderStatuses[
                request.productId
            ] || null;


        const nextStatus =
            getNextStatus(
                currentStatus
            );


        /* =====================================================
           ALREADY DELIVERED
        ===================================================== */

        if (!nextStatus) {

            showSupplierInfo(
                "Order Completed",
                "This order has already been delivered."
            );

            return;

        }


        /* =====================================================
           CONFIRM STATUS CHANGE
        ===================================================== */

        const result =
            await showSupplierConfirm(

                "Update Order Status",

                `Change status to ${formatStatus(
                    nextStatus
                )}?`,

                "Update"

            );


        /* =====================================================
           CONFIRMED
        ===================================================== */

        if (
            result.isConfirmed
        ) {

            await updateOrderStatus(
                request.productId,
                nextStatus
            );

        }

    };


    /* =========================================================
       APPROVED REQUESTS
    ========================================================= */

    const approvedRequests =
        requests;


    /* =========================================================
       SUPPLIER STATISTICS
    ========================================================= */

    const pendingCount =
        approvedRequests.filter(
            (request) =>
                !orderStatuses[
                    request.productId
                ]
        ).length;


    const inProgressCount =
        approvedRequests.filter(
            (request) => {

                const status =
                    orderStatuses[
                        request.productId
                    ];


                return (

                    status &&

                    status !==
                        "DELIVERED"

                );

            }
        ).length;


    const completedCount =
        approvedRequests.filter(
            (request) =>
                orderStatuses[
                    request.productId
                ] ===
                "DELIVERED"
        ).length;


    /* =========================================================
       ACTIVE SUPPLY REQUESTS
    ========================================================= */

    /*
     * Only active approved requests are shown here.
     *
     * Active means:
     *
     * 1. Pending / Not Started
     * 2. In Progress
     *
     * Completed / DELIVERED requests are excluded.
     *
     * Requests are sorted oldest first.
     *
     * There is intentionally NO .slice(0, 5)
     * so all active approved requests are shown.
     */

    const firstFiveRequests =
        [...approvedRequests]

            .filter(
                (request) =>
                    orderStatuses[
                        request.productId
                    ] !==
                    "DELIVERED"
            )

            .sort(
                (a, b) => {

                    if (
                        a.createdDate &&
                        b.createdDate
                    ) {

                        return (

                            new Date(
                                a.createdDate
                            ) -

                            new Date(
                                b.createdDate
                            )

                        );

                    }


                    return (

                        Number(
                            a.productId
                        ) -

                        Number(
                            b.productId
                        )

                    );

                }
            );


    /* =========================================================
       CHART DATA
    ========================================================= */

    const totalOrders =
        pendingCount +
        inProgressCount +
        completedCount;


    const chartSegments = [

        {
            key:
                "completed",

            label:
                "Completed",

            count:
                completedCount,

            color:
                "#16945f"
        },

        {
            key:
                "inProgress",

            label:
                "In Progress",

            count:
                inProgressCount,

            color:
                "#315bea"
        },

        {
            key:
                "pending",

            label:
                "Pending / Not Started",

            count:
                pendingCount,

            color:
                "#f4b400"
        }

    ];


    /* =========================================================
       SVG ARC HELPERS
    ========================================================= */

    const chartCenter =
        150;

    const chartRadius =
        105;

    const chartStrokeWidth =
        42;


    const polarToCartesian = (
        centerX,
        centerY,
        radius,
        angleInDegrees
    ) => {

        const angleInRadians =
            (angleInDegrees - 90) *
            Math.PI /
            180;


        return {

            x:
                centerX +
                radius *
                    Math.cos(
                        angleInRadians
                    ),

            y:
                centerY +
                radius *
                    Math.sin(
                        angleInRadians
                    )

        };

    };


    const describeArc = (
        startAngle,
        endAngle
    ) => {

        const start =
            polarToCartesian(
                chartCenter,
                chartCenter,
                chartRadius,
                endAngle
            );


        const end =
            polarToCartesian(
                chartCenter,
                chartCenter,
                chartRadius,
                startAngle
            );


        const largeArcFlag =
            endAngle -
                startAngle <=
            180
                ? "0"
                : "1";


        return [

            "M",

            start.x,

            start.y,

            "A",

            chartRadius,

            chartRadius,

            0,

            largeArcFlag,

            0,

            end.x,

            end.y

        ].join(" ");

    };


    /* =========================================================
       BUILD CHART SEGMENTS
    ========================================================= */

    let currentAngle =
        0;


    const renderedSegments =
        chartSegments

            .filter(
                (segment) =>
                    segment.count >
                    0
            )

            .map(
                (segment) => {

                    const percentage =
                        segment.count /
                        totalOrders;


                    const angle =
                        percentage *
                        360;


                    const gap =
                        1.5;


                    const startAngle =
                        currentAngle +
                        gap;


                    const endAngle =
                        currentAngle +
                        angle -
                        gap;


                    currentAngle +=
                        angle;


                    return {

                        ...segment,

                        startAngle,

                        endAngle,

                        percentage:
                            percentage *
                            100

                    };

                }
            );


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="dashboard-page supplier-page">

            <SupplierSidebar />


            <main className="dashboard-content">


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="dashboard-header">

                    <div>

                        <h1>
                            Supplier Dashboard
                        </h1>

                        <p>
                            Manage your procurement requests
                            and track order fulfillment.
                        </p>

                    </div>

                </div>


                {/* =================================================
                   STATISTICS
                ================================================= */}

                <div className="stats-grid">

                    <StatsCard
                        title="Total Requests"
                        value={
                            approvedRequests.length
                        }
                        icon="box-seam"
                        color="primary"
                    />


                    <StatsCard
                        title="Pending / Not Started"
                        value={
                            pendingCount
                        }
                        icon="hourglass-split"
                        color="warning"
                    />


                    <StatsCard
                        title="In Progress"
                        value={
                            inProgressCount
                        }
                        icon="truck"
                        color="primary"
                    />


                    <StatsCard
                        title="Completed"
                        value={
                            completedCount
                        }
                        icon="check-circle"
                        color="success"
                    />

                </div>


                {/* =================================================
                   ORDER STATUS OVERVIEW
                ================================================= */}

                <div className="history-table-card supplier-chart-card">


                    <div className="history-table-header">

                        <div>

                            <h2>
                                Order Status Overview
                            </h2>

                            <p>
                                Current fulfillment status of your
                                approved procurement requests.
                            </p>

                        </div>

                    </div>


                    {approvedRequests.length ===
                    0 ? (

                        <div className="empty-state">

                            <div className="empty-state-icon">
                                📊
                            </div>

                            <h3>
                                No Approved Orders
                            </h3>

                            <p>
                                The order status chart will appear
                                once procurement requests are approved.
                            </p>

                        </div>

                    ) : (

                        <div className="supplier-chart-container">


                            <div
                                className="supplier-pie-wrapper"
                                onMouseLeave={() =>
                                    setActiveChartSegment(
                                        null
                                    )
                                }
                            >


                                <svg
                                    width="300"
                                    height="300"
                                    viewBox="0 0 300 300"
                                    className="supplier-pie-chart"
                                >


                                    {/* =================================================
                                       BACKGROUND RING
                                    ================================================= */}

                                    <circle
                                        cx="150"
                                        cy="150"
                                        r={
                                            chartRadius
                                        }
                                        fill="none"
                                        stroke="#eef0f3"
                                        strokeWidth={
                                            chartStrokeWidth
                                        }
                                        pointerEvents="none"
                                    />


                                    {/* =================================================
                                       PIE SEGMENTS
                                    ================================================= */}

                                    {renderedSegments.map(
                                        (segment) => (

                                            <path
                                                key={
                                                    segment.key
                                                }

                                                d={
                                                    describeArc(
                                                        segment.startAngle,
                                                        segment.endAngle
                                                    )
                                                }

                                                fill="none"

                                                stroke={
                                                    segment.color
                                                }

                                                strokeWidth={
                                                    chartStrokeWidth
                                                }

                                                strokeLinecap="butt"

                                                pointerEvents="stroke"

                                                className="pie-segment"

                                                onMouseEnter={() =>
                                                    setActiveChartSegment(
                                                        segment.key
                                                    )
                                                }

                                            />

                                        )
                                    )}

                                </svg>


                                {/* =================================================
                                   CENTER
                                ================================================= */}

                                <div className="supplier-pie-center">

                                    <strong>
                                        {
                                            totalOrders
                                        }
                                    </strong>

                                    <span>
                                        Approved Orders
                                    </span>

                                </div>


                                {/* =================================================
                                   HOVER TOOLTIP
                                ================================================= */}

                                {activeChartSegment && (

                                    <div
                                        className="supplier-chart-tooltip"
                                    >

                                        {(() => {

                                            const segment =
                                                renderedSegments.find(
                                                    (item) =>
                                                        item.key ===
                                                        activeChartSegment
                                                );


                                            if (!segment) {

                                                return null;

                                            }


                                            return (

                                                <>

                                                    <span className="tooltip-title">

                                                        {
                                                            segment.label
                                                        }

                                                    </span>


                                                    <strong>

                                                        {
                                                            segment.count
                                                        }

                                                    </strong>


                                                    <span className="tooltip-orders">

                                                        {
                                                            segment.count ===
                                                            1

                                                                ? "Order"

                                                                : "Orders"

                                                        }

                                                    </span>


                                                    <span className="tooltip-percentage">

                                                        {
                                                            segment.percentage.toFixed(
                                                                1
                                                            )
                                                        }%

                                                    </span>

                                                </>

                                            );

                                        })()}

                                    </div>

                                )}

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                   ACTIVE SUPPLY REQUESTS
                ================================================= */}

                <div className="history-table-card">


                    <div className="history-table-header">

                        <div>

                            <h2>
                                Supply Requests
                            </h2>

                            <p>
                                Active approved procurement requests
                                assigned to you.
                            </p>

                        </div>


                        <button
                            className="btn-primary"
                            onClick={() =>
                                navigate(
                                    "/supplier-requests"
                                )
                            }
                        >
                            View All Requests
                        </button>

                    </div>


                    {loading ? (

                        <div className="empty-state">

                            <div className="loading-spinner"></div>

                            <p>
                                Loading supplier requests...
                            </p>

                        </div>

                    ) : firstFiveRequests.length ===
                    0 ? (

                        <div className="empty-state">

                            <div className="empty-state-icon">
                                📦
                            </div>

                            <h3>
                                No Active Requests
                            </h3>

                            <p>
                                There are currently no pending or
                                in-progress procurement requests.
                            </p>

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="history-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Product
                                        </th>

                                        <th>
                                            Quantity
                                        </th>

                                        <th>
                                            Total
                                        </th>

                                        <th>
                                            Supply Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {firstFiveRequests.map(
                                        (request) => {

                                            const currentOrderStatus =
                                                orderStatuses[
                                                    request.productId
                                                ] || null;


                                            const canUpdate =
                                                currentOrderStatus !==
                                                "DELIVERED";


                                            const supplyStatus =
                                                getSupplyStatus(
                                                    request.productId
                                                );


                                            return (

                                                <tr
                                                    key={
                                                        request.productId
                                                    }
                                                >

                                                    <td>

                                                        <div className="product-name-cell">

                                                            <strong>
                                                                {
                                                                    request.productName
                                                                }
                                                            </strong>

                                                            <span>
                                                                Request #
                                                                {
                                                                    request.productId
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>
                                                        {
                                                            request.quantity
                                                        }
                                                    </td>


                                                    <td>

                                                        ₹
                                                        {Number(
                                                            request.totalPrice ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={
                                                                supplyStatus.className
                                                            }
                                                        >
                                                            {
                                                                supplyStatus.label
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        {canUpdate ? (

                                                            <button
                                                                className="btn-secondary"
                                                                disabled={
                                                                    updatingId ===
                                                                    request.productId
                                                                }
                                                                onClick={() =>
                                                                    handleStatusUpdate(
                                                                        request
                                                                    )
                                                                }
                                                            >

                                                                {
                                                                    updatingId ===
                                                                    request.productId

                                                                        ? "Updating..."

                                                                        : currentOrderStatus

                                                                        ? `Mark ${formatStatus(
                                                                            getNextStatus(
                                                                                currentOrderStatus
                                                                            )
                                                                        )}`

                                                                        : "Start Order"
                                                                }

                                                            </button>

                                                        ) : (

                                                            <span className="completed-text">

                                                                ✓ Completed

                                                            </span>

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


            </main>

        </div>

    );

};


export default SupplierDashboard;
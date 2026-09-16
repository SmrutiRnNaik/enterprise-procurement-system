import React from "react";
import { createPortal } from "react-dom";
import "./OrderStatusTracker.css";


function OrderStatusTracker({
    currentStatus,
    productName,
    productId,
    updatedDate,
    onClose
}) {

    const statuses = [
        {
            key: "ORDER_RECEIVED",
            label: "Order Received"
        },
        {
            key: "PACKED",
            label: "Packed"
        },
        {
            key: "SHIPPED",
            label: "Shipped"
        },
        {
            key: "OUT_FOR_DELIVERY",
            label: "Out for Delivery"
        },
        {
            key: "DELIVERED",
            label: "Delivered"
        }
    ];


    const currentIndex =
        currentStatus
            ? statuses.findIndex(
                status =>
                    status.key === currentStatus
            )
            : -1;


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

        return parsedDate.toLocaleString(
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


    const formatCurrentStatus = () => {

        const status =
            statuses.find(
                item =>
                    item.key === currentStatus
            );

        return status
            ? status.label
            : "Not Started";
    };


    const progressWidth =
        currentIndex <= 0
            ? "0%"
            : `${(
                currentIndex /
                (statuses.length - 1)
            ) * 100}%`;


    /* =========================================================
       RENDER DIRECTLY INTO BODY
       ========================================================= */

    return createPortal(

        <div
            className="order-status-overlay"
            onClick={onClose}
        >

            <div
                className="order-status-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="order-status-header">

                    <div>

                        <span>
                            ORDER TRACKING
                        </span>

                        <h3>
                            {productName || "Product"}
                        </h3>

                        <p>
                            Request #{productId}
                        </p>

                    </div>


                    <button
                        type="button"
                        className="order-status-close"
                        onClick={onClose}
                        aria-label="Close"
                    >

                        <i className="bi bi-x-lg"></i>

                    </button>

                </div>


                {/* =================================================
                    TRACKER
                ================================================= */}

                <div className="order-status-tracker">

                    <div className="order-status-line">

                        <div
                            className="order-status-line-progress"
                            style={{
                                width:
                                    progressWidth
                            }}
                        ></div>

                    </div>


                    <div className="order-status-steps">

                        {statuses.map(
                            (status, index) => {

                                const isCompleted =
                                    currentIndex >= 0 &&
                                    index <= currentIndex;

                                const isCurrent =
                                    currentIndex >= 0 &&
                                    index === currentIndex;


                                return (

                                    <div
                                        key={status.key}
                                        className={
                                            `order-status-step ${
                                                isCompleted
                                                    ? "completed"
                                                    : ""
                                            } ${
                                                isCurrent
                                                    ? "current"
                                                    : ""
                                            }`
                                        }
                                    >

                                        <div className="order-status-bubble">

                                            {isCompleted ? (

                                                <i className="bi bi-check"></i>

                                            ) : (

                                                <span>
                                                    {index + 1}
                                                </span>

                                            )}

                                        </div>


                                        <span className="order-status-label">

                                            {status.label}

                                        </span>

                                    </div>

                                );

                            }
                        )}

                    </div>

                </div>


                {/* =================================================
                    CURRENT STATUS
                ================================================= */}

                <div className="order-status-current">

                    <div>

                        <span>
                            CURRENT STATUS
                        </span>

                        <strong>
                            {formatCurrentStatus()}
                        </strong>

                    </div>


                    <div className="order-status-updated">

                        <span>
                            LAST UPDATED
                        </span>

                        <strong>
                            {formatDate(updatedDate)}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="order-status-footer">

                    <button
                        type="button"
                        className="order-status-close-button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>,

        document.body

    );
}


export default OrderStatusTracker;
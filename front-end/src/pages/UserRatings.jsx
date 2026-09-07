import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";

import {
    showError
} from "../utils/notifications";

import "../Supplier.css";
import "../UserRatings.css";


const BASE_URL = "http://localhost:8080/api";


function UserRatings() {

    const navigate = useNavigate();


    const [deliveredProducts, setDeliveredProducts] =
        useState([]);

    const [ratings, setRatings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [selectedRating, setSelectedRating] =
        useState(null);


    /* =========================================================
       USER ID
    ========================================================= */

    const userId =
        localStorage.getItem("userId");


    /* =========================================================
       FETCH DELIVERED PRODUCTS + USER RATINGS
    ========================================================= */

    useEffect(() => {

        if (!userId) {

            navigate("/login");

            return;

        }

        fetchRatingsData();

    }, [userId, navigate]);


    const fetchRatingsData = async () => {

        try {

            setLoading(true);


            /* =================================================
               FETCH USER PROCUREMENT HISTORY
            ================================================= */

            const historyResponse =
                await axios.get(
                    `${BASE_URL}/products/history?type=user&id=${userId}`
                );


            const history =
                historyResponse.data?.data || [];


            /* =================================================
               CHECK ORDER STATUS
            ================================================= */

            const productsWithOrderStatus =
                await Promise.all(

                    history.map(
                        async (product) => {

                            let orderStatus =
                                product.orderStatus ||
                                null;

                            let deliveredDate =
                                null;


                            if (
                                product.status ===
                                "DELIVERED"
                            ) {

                                orderStatus =
                                    "DELIVERED";

                                deliveredDate =
                                    product.updatedDate ||
                                    product.createdDate ||
                                    null;

                            }


                            if (
                                product.productId
                            ) {

                                try {

                                    const orderResponse =
                                        await axios.get(
                                            `${BASE_URL}/orders/status/${product.productId}`
                                        );


                                    const orderData =
                                        orderResponse.data?.data;


                                    if (
                                        orderData
                                    ) {

                                        orderStatus =
                                            orderData.orderStatus ||
                                            orderStatus;


                                        if (
                                            orderData.orderStatus ===
                                            "DELIVERED"
                                        ) {

                                            deliveredDate =
                                                orderData.updatedDate ||
                                                null;

                                        }

                                    }

                                } catch (error) {

                                    console.debug(
                                        `No order tracking found for product ${product.productId}.`
                                    );

                                }

                            }


                            return {

                                ...product,

                                orderStatus,

                                deliveredDate

                            };

                        }
                    )

                );


            /* =================================================
               ONLY DELIVERED PRODUCTS
            ================================================= */

            const confirmedDelivered =
                productsWithOrderStatus.filter(
                    (product) =>
                        product.orderStatus ===
                        "DELIVERED" ||
                        product.status ===
                        "DELIVERED"
                );


            /* =================================================
               FETCH USER RATINGS
            ================================================= */

            const ratingsResponse =
                await axios.get(
                    `${BASE_URL}/ratings/user/${userId}`
                );


            const userRatings =
                ratingsResponse.data?.data || [];


            setDeliveredProducts(
                confirmedDelivered
            );


            setRatings(
                userRatings
            );


        } catch (error) {

            console.error(
                "Error loading user ratings:",
                error
            );


            showError(
                "Unable to Load Ratings",
                error.response?.data?.message ||
                "Could not load your delivered products and ratings."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       FIND RATING FOR PRODUCT
    ========================================================= */

    const getRatingForProduct = (
        productId
    ) => {

        return ratings.find(
            (rating) =>
                Number(
                    rating.productId
                ) ===
                Number(
                    productId
                )
        );

    };


    /* =========================================================
       DATE FORMAT
    ========================================================= */

    const formatDate = (
        date
    ) => {

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
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    /* =========================================================
       RATING STARS
    ========================================================= */

    const renderStars = (
        rating
    ) => {

        return (

            <div className="supplier-rating-stars">

                {[1, 2, 3, 4, 5].map(
                    (star) => (

                        <span
                            key={star}
                            className={
                                star <= rating
                                    ? "filled"
                                    : "empty"
                            }
                        >
                            ★
                        </span>

                    )
                )}

            </div>

        );

    };


    /* =========================================================
       RATE PRODUCT
    ========================================================= */

    const handleRateProduct = (
        product
    ) => {

        navigate(
            `/rate-product/${product.productId}`,
            {
                state: {

                    productId:
                        product.productId,

                    productName:
                        product.productName ||
                        product.product,

                    quantity:
                        product.quantity,

                    totalPrice:
                        product.totalPrice

                }
            }
        );

    };


    /* =========================================================
       VIEW RATING
    ========================================================= */

    const handleViewRating = (
        rating
    ) => {

        setSelectedRating(
            rating
        );

    };


    /* =========================================================
       CLOSE RATING
    ========================================================= */

    const closeRating = () => {

        setSelectedRating(
            null
        );

    };


    /* =========================================================
       RATING COUNTS
    ========================================================= */

    const ratedCount =
        deliveredProducts.filter(
            (product) =>
                getRatingForProduct(
                    product.productId
                )
        ).length;


    const unratedCount =
        deliveredProducts.length -
        ratedCount;


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="dashboard-page user-ratings-page">

            <Sidebar />


            <main className="dashboard-content">

                <div className="dashboard-shell">

                    <div className="container-fluid">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="history-header">

                            <div>

                                <span className="raise-request-label">
                                    FEEDBACK
                                </span>

                                <h2>
                                    Ratings & Reviews
                                </h2>

                                <p>
                                    Rate your delivered products and
                                    review your previous feedback.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            SUMMARY CARDS
                        ================================================= */}

                        {!loading &&
                            deliveredProducts.length > 0 && (

                                <div className="user-ratings-summary">


                                    <div className="user-rating-summary-card">

                                        <div className="user-rating-summary-icon delivered">

                                            <i className="bi bi-box-seam"></i>

                                        </div>

                                        <div>

                                            <span>
                                                DELIVERED PRODUCTS
                                            </span>

                                            <strong>
                                                {
                                                    deliveredProducts.length
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="user-rating-summary-card">

                                        <div className="user-rating-summary-icon rated">

                                            <i className="bi bi-star-fill"></i>

                                        </div>

                                        <div>

                                            <span>
                                                RATED
                                            </span>

                                            <strong>
                                                {ratedCount}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="user-rating-summary-card">

                                        <div className="user-rating-summary-icon unrated">

                                            <i className="bi bi-star"></i>

                                        </div>

                                        <div>

                                            <span>
                                                PENDING REVIEW
                                            </span>

                                            <strong>
                                                {unratedCount}
                                            </strong>

                                        </div>

                                    </div>

                                </div>

                            )}


                        {/* =================================================
                            CONTENT
                        ================================================= */}

                        {loading ? (

                            <div className="history-table-card">

                                <div className="history-loading">

                                    <div
                                        className="spinner-border"
                                        role="status"
                                    ></div>

                                    <p>
                                        Loading delivered products...
                                    </p>

                                </div>

                            </div>

                        ) : deliveredProducts.length === 0 ? (

                            <div className="history-table-card">

                                <div className="history-empty">

                                    <div className="history-empty-icon">

                                        <i className="bi bi-box-seam"></i>

                                    </div>

                                    <h5>
                                        No Delivered Products
                                    </h5>

                                    <p>
                                        Ratings and reviews become available
                                        after your procurement requests are
                                        delivered.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <div className="history-table-card">


                                <div className="history-table-header">

                                    <div>

                                        <h2>
                                            Delivered Products
                                        </h2>

                                        <p>
                                            Rate delivered products or view
                                            your existing reviews.
                                        </p>

                                    </div>

                                </div>


                                <div className="table-responsive">

                                    <table className="table history-table align-middle mb-0">

                                        <thead>

                                            <tr>

                                                <th>S.No.</th>

                                                <th>Product ID</th>

                                                <th>Product Name</th>

                                                <th>Quantity</th>

                                                <th>Delivered On</th>

                                                <th>Rating Status</th>

                                                <th>Action</th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {deliveredProducts.map(
                                                (
                                                    product,
                                                    index
                                                ) => {

                                                    const rating =
                                                        getRatingForProduct(
                                                            product.productId
                                                        );


                                                    return (

                                                        <tr
                                                            key={
                                                                product.productId ||
                                                                index
                                                            }
                                                        >

                                                            <td>
                                                                {index + 1}
                                                            </td>


                                                            <td>

                                                                <span className="history-id">

                                                                    #
                                                                    {
                                                                        product.productId ||
                                                                        product.id ||
                                                                        "—"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <span className="history-product">

                                                                    {
                                                                        product.productName ||
                                                                        product.product ||
                                                                        "—"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                {
                                                                    product.quantity ??
                                                                    "—"
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    formatDate(
                                                                        product.deliveredDate ||
                                                                        product.updatedDate
                                                                    )
                                                                }

                                                            </td>


                                                            <td>

                                                                {rating ? (

                                                                    <span className="user-rating-status rated">

                                                                        <i className="bi bi-check-circle-fill"></i>

                                                                        Rated

                                                                    </span>

                                                                ) : (

                                                                    <span className="user-rating-status unrated">

                                                                        <i className="bi bi-star"></i>

                                                                        Unrated

                                                                    </span>

                                                                )}

                                                            </td>


                                                            <td>

                                                                {rating ? (

                                                                    <button
                                                                        type="button"
                                                                        className="user-rating-action view"
                                                                        onClick={() =>
                                                                            handleViewRating(
                                                                                rating
                                                                            )
                                                                        }
                                                                    >

                                                                        <i className="bi bi-eye"></i>

                                                                        View Rating

                                                                    </button>

                                                                ) : (

                                                                    <button
                                                                        type="button"
                                                                        className="user-rating-action rate"
                                                                        onClick={() =>
                                                                            handleRateProduct(
                                                                                product
                                                                            )
                                                                        }
                                                                    >

                                                                        <i className="bi bi-star"></i>

                                                                        Rate Product

                                                                    </button>

                                                                )}

                                                            </td>

                                                        </tr>

                                                    );

                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </main>


            {/* =========================================================
                VIEW RATING MODAL
                ---------------------------------------------------------
                Reuses the same working Supplier Ratings modal.
            ========================================================= */}

            {selectedRating && (

                <div
                    className="supplier-review-overlay"
                    onClick={closeRating}
                >

                    <div
                        className="supplier-review-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="supplier-review-modal-header">

                            <div>

                                <span>
                                    Your Review
                                </span>

                                <h3>
                                    {
                                        selectedRating.productName ||
                                        "Product"
                                    }
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="supplier-review-close"
                                onClick={closeRating}
                                aria-label="Close review"
                            >
                                ×
                            </button>

                        </div>


                        <div className="supplier-review-meta">

                            <div>

                                <span>
                                    Product ID
                                </span>

                                <strong>
                                    #
                                    {
                                        selectedRating.productId
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Quantity
                                </span>

                                <strong>
                                    {
                                        selectedRating.quantity ??
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Rated On
                                </span>

                                <strong>
                                    {
                                        formatDate(
                                            selectedRating.createdDate
                                        )
                                    }
                                </strong>

                            </div>

                        </div>


                        <div className="supplier-review-rating">

                            {
                                renderStars(
                                    selectedRating.rating
                                )
                            }

                            <span>
                                {
                                    selectedRating.rating
                                } / 5
                            </span>

                        </div>


                        <div className="supplier-review-content">

                            <span>
                                Review
                            </span>

                            <p>
                                "
                                {
                                    selectedRating.description ||
                                    "No review description provided."
                                }
                                "
                            </p>

                        </div>


                        <div className="supplier-review-modal-footer">

                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={closeRating}
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default UserRatings;
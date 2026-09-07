import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import SupplierSidebar from "../components/SupplierSidebar";

import "../Supplier.css";


const BASE_URL = "http://localhost:8080/api";


function SupplierRatings() {

    const navigate = useNavigate();


    const [ratingData, setRatingData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [selectedRating, setSelectedRating] =
        useState(null);


    /* =========================================================
       SUPPLIER ID
    ========================================================= */

    const supplierId =
        localStorage.getItem("userId");


    /* =========================================================
       FETCH SUPPLIER RATINGS
    ========================================================= */

    useEffect(() => {

        if (!supplierId) {

            navigate("/supplier-login");

            return;

        }

        fetchSupplierRatings();

    }, [supplierId, navigate]);


    const fetchSupplierRatings = async () => {

        try {

            setLoading(true);


            const response =
                await axios.get(
                    `${BASE_URL}/ratings/supplier/${supplierId}`
                );


            setRatingData(
                response.data?.data || null
            );


        } catch (error) {

            console.error(
                "Failed to load supplier ratings:",
                error
            );


            Swal.fire({

                icon: "error",

                title: "Unable to Load Ratings",

                text:
                    error.response?.data?.message ||
                    "Failed to load ratings and reviews.",

                confirmButtonColor:
                    "#111111"

            });

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       DATE FORMAT
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

    const renderStars = (rating) => {

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
       GET RATING PERCENTAGE
    ========================================================= */

    const getRatingPercentage = (
        count
    ) => {

        const total =
            ratingData?.totalRatings || 0;


        if (!total) {
            return 0;
        }


        return (
            count / total
        ) * 100;

    };


    /* =========================================================
       OPEN REVIEW
    ========================================================= */

    const handleReviewClick = (
        rating
    ) => {

        setSelectedRating(
            rating
        );

    };


    /* =========================================================
       CLOSE REVIEW
    ========================================================= */

    const closeReview = () => {

        setSelectedRating(null);

    };


    /* =========================================================
       EMPTY DATA
    ========================================================= */

    const hasRatings =
        ratingData &&
        ratingData.totalRatings > 0;


    return (

        <div className="dashboard-page supplier-page">

            <SupplierSidebar />


            <main className="dashboard-content">

                <div className="dashboard-shell">

                    <div className="container-fluid">


                        {/* =================================================
                            HEADER
                        ================================================= */}

                        <div className="history-header">

                            <div>

                                <h2>
                                    Ratings & Reviews
                                </h2>

                                <p>
                                    View customer ratings and feedback
                                    for your supplied products.
                                </p>

                            </div>

                        </div>


                        {loading ? (

                            /* =================================================
                               LOADING
                            ================================================= */

                            <div className="history-table-card">

                                <div className="history-loading">

                                    <div
                                        className="spinner-border"
                                        role="status"
                                    ></div>

                                    <p>
                                        Loading ratings and reviews...
                                    </p>

                                </div>

                            </div>

                        ) : !hasRatings ? (

                            /* =================================================
                               EMPTY STATE
                            ================================================= */

                            <div className="history-table-card">

                                <div className="history-empty">

                                    <div className="history-empty-icon">

                                        <i className="bi bi-star"></i>

                                    </div>

                                    <h5>
                                        No Ratings Yet
                                    </h5>

                                    <p>
                                        Customer ratings and reviews
                                        will appear here once a delivered
                                        product has been reviewed.
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <>


                                {/* =================================================
                                    RATING SUMMARY
                                ================================================= */}

                                <div className="supplier-rating-summary">


                                    {/* AVERAGE */}

                                    <div className="supplier-rating-average">

                                        <span className="supplier-rating-summary-label">

                                            Average Rating

                                        </span>


                                        <div className="supplier-rating-average-value">

                                            {
                                                Number(
                                                    ratingData.averageRating || 0
                                                ).toFixed(1)
                                            }

                                            <span>
                                                ★
                                            </span>

                                        </div>


                                        <div className="supplier-rating-summary-stars">

                                            {
                                                renderStars(
                                                    Math.round(
                                                        ratingData.averageRating || 0
                                                    )
                                                )
                                            }

                                        </div>


                                        <span className="supplier-rating-total">

                                            {ratingData.totalRatings}

                                            {
                                                ratingData.totalRatings === 1
                                                    ? " Review"
                                                    : " Reviews"
                                            }

                                        </span>

                                    </div>


                                    {/* DISTRIBUTION */}

                                    <div className="supplier-rating-distribution">

                                        <div className="rating-distribution-row">

                                            <span>
                                                5 ★
                                            </span>

                                            <div className="rating-distribution-bar">

                                                <div
                                                    className="rating-distribution-fill"
                                                    style={{
                                                        width:
                                                            `${getRatingPercentage(
                                                                ratingData.fiveStarCount
                                                            )}%`
                                                    }}
                                                ></div>

                                            </div>

                                            <span>
                                                {
                                                    ratingData.fiveStarCount
                                                }
                                            </span>

                                        </div>


                                        <div className="rating-distribution-row">

                                            <span>
                                                4 ★
                                            </span>

                                            <div className="rating-distribution-bar">

                                                <div
                                                    className="rating-distribution-fill"
                                                    style={{
                                                        width:
                                                            `${getRatingPercentage(
                                                                ratingData.fourStarCount
                                                            )}%`
                                                    }}
                                                ></div>

                                            </div>

                                            <span>
                                                {
                                                    ratingData.fourStarCount
                                                }
                                            </span>

                                        </div>


                                        <div className="rating-distribution-row">

                                            <span>
                                                3 ★
                                            </span>

                                            <div className="rating-distribution-bar">

                                                <div
                                                    className="rating-distribution-fill"
                                                    style={{
                                                        width:
                                                            `${getRatingPercentage(
                                                                ratingData.threeStarCount
                                                            )}%`
                                                    }}
                                                ></div>

                                            </div>

                                            <span>
                                                {
                                                    ratingData.threeStarCount
                                                }
                                            </span>

                                        </div>


                                        <div className="rating-distribution-row">

                                            <span>
                                                2 ★
                                            </span>

                                            <div className="rating-distribution-bar">

                                                <div
                                                    className="rating-distribution-fill"
                                                    style={{
                                                        width:
                                                            `${getRatingPercentage(
                                                                ratingData.twoStarCount
                                                            )}%`
                                                    }}
                                                ></div>

                                            </div>

                                            <span>
                                                {
                                                    ratingData.twoStarCount
                                                }
                                            </span>

                                        </div>


                                        <div className="rating-distribution-row">

                                            <span>
                                                1 ★
                                            </span>

                                            <div className="rating-distribution-bar">

                                                <div
                                                    className="rating-distribution-fill"
                                                    style={{
                                                        width:
                                                            `${getRatingPercentage(
                                                                ratingData.oneStarCount
                                                            )}%`
                                                    }}
                                                ></div>

                                            </div>

                                            <span>
                                                {
                                                    ratingData.oneStarCount
                                                }
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    RATED PRODUCTS TABLE
                                ================================================= */}

                                <div className="history-table-card">

                                    <div className="history-table-header">

                                        <div>

                                            <h2>
                                                Product Ratings
                                            </h2>

                                            <p>
                                                Click any rated product to
                                                view the customer's review.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="table-responsive">

                                        <table className="table history-table align-middle mb-0">

                                            <thead>

                                                <tr>

                                                    <th>
                                                        S.No.
                                                    </th>

                                                    <th>
                                                        Product ID
                                                    </th>

                                                    <th>
                                                        Product Name
                                                    </th>

                                                    <th>
                                                        Quantity
                                                    </th>

                                                    <th>
                                                        Requested By
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {ratingData.ratings.map(
                                                    (rating, index) => (

                                                        <tr
                                                            key={
                                                                rating.ratingId
                                                            }
                                                            className="supplier-rating-row"
                                                            onClick={() =>
                                                                handleReviewClick(
                                                                    rating
                                                                )
                                                            }
                                                        >

                                                            <td>

                                                                {
                                                                    index + 1
                                                                }

                                                            </td>


                                                            <td>

                                                                <span className="history-id">

                                                                    #
                                                                    {
                                                                        rating.productId
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <span className="history-product">

                                                                    {
                                                                        rating.productName ||
                                                                        "—"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                {
                                                                    rating.quantity ??
                                                                    "—"
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    rating.userName ||
                                                                    "—"
                                                                }

                                                            </td>

                                                        </tr>

                                                    )
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            </main>


            {/* =========================================================
                REVIEW DETAILS
            ========================================================= */}

            {selectedRating && (

                <div
                    className="supplier-review-overlay"
                    onClick={closeReview}
                >

                    <div
                        className="supplier-review-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >


                        {/* HEADER */}

                        <div className="supplier-review-modal-header">

                            <div>

                                <span>
                                    Customer Review
                                </span>

                                <h3>
                                    {
                                        selectedRating.productName
                                    }
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="supplier-review-close"
                                onClick={closeReview}
                                aria-label="Close review"
                            >

                                ×

                            </button>

                        </div>


                        {/* PRODUCT DETAILS */}

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
                                    Requested By
                                </span>

                                <strong>
                                    {
                                        selectedRating.userName ||
                                        "—"
                                    }
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Reviewed On
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


                        {/* RATING */}

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


                        {/* REVIEW */}

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


                        {/* CLOSE */}

                        <div className="supplier-review-modal-footer">

                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={closeReview}
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


export default SupplierRatings;
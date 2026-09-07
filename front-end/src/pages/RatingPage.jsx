import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/Sidebar";

import "../RatingPage.css";


function RatingPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const { productId } = useParams();


    const product =
        location.state || {};


    const [rating, setRating] =
        useState(0);

    const [hoverRating, setHoverRating] =
        useState(0);

    const [description, setDescription] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);


    /* =========================================================
       PRODUCT DETAILS
    ========================================================= */

    const productName =
        product.productName ||
        "Product";


    const quantity =
        product.quantity ??
        "—";


    const totalPrice =
        product.totalPrice;


    /* =========================================================
       SUBMIT RATING
    ========================================================= */

    const handleSubmit = async (event) => {

        event.preventDefault();


        const userId =
            localStorage.getItem("userId");


        if (!userId) {

            navigate("/login");

            return;

        }


        if (rating < 1 || rating > 5) {

            Swal.fire({

                icon: "warning",

                title: "Rating Required",

                text:
                    "Please select a rating from 1 to 5 stars.",

                confirmButtonColor:
                    "#111111"

            });

            return;

        }


        if (!description.trim()) {

            Swal.fire({

                icon: "warning",

                title: "Review Required",

                text:
                    "Please enter a description for your review.",

                confirmButtonColor:
                    "#111111"

            });

            return;

        }


        try {

            setSubmitting(true);


            await axios.post(
                "http://localhost:8080/api/ratings",
                {
                    productId:
                        Number(productId),

                    userId:
                        Number(userId),

                    rating:
                        rating,

                    description:
                        description.trim()
                }
            );


            await Swal.fire({

                icon: "success",

                title: "Rating Submitted",

                text:
                    "Thank you for reviewing the product.",

                confirmButtonColor:
                    "#111111"

            });


            navigate(
                "/request-history"
            );


        } catch (error) {

            console.error(
                "Failed to submit rating:",
                error
            );


            Swal.fire({

                icon: "error",

                title: "Unable to Submit Rating",

                text:
                    error.response?.data?.message ||
                    "Failed to submit your rating.",

                confirmButtonColor:
                    "#111111"

            });

        } finally {

            setSubmitting(false);

        }

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <div className="dashboard-page rating-page">

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
                                    Rate Product
                                </h2>

                                <p>
                                    Share your experience with this delivered product.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            RATING CARD
                        ================================================= */}

                        <div className="rating-page-container">

                            <div className="rating-card">


                                {/* PRODUCT */}

                                <div className="rating-product-info">

                                    <span className="rating-product-label">
                                        Product
                                    </span>

                                    <h3>
                                        {productName}
                                    </h3>

                                    <div className="rating-product-meta">

                                        <span>
                                            Request #{productId}
                                        </span>

                                        <span>
                                            Quantity: {quantity}
                                        </span>

                                        {totalPrice !== undefined && (

                                            <span>
                                                Total: ₹
                                                {Number(
                                                    totalPrice
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>

                                        )}

                                    </div>

                                </div>


                                <div className="rating-divider"></div>


                                {/* =================================================
                                    STAR RATING
                                ================================================= */}

                                <div className="rating-section">

                                    <h4>
                                        How would you rate this product?
                                    </h4>


                                    <div
                                        className="rating-stars"
                                        onMouseLeave={() =>
                                            setHoverRating(0)
                                        }
                                        role="radiogroup"
                                        aria-label="Product rating"
                                    >

                                        {[1, 2, 3, 4, 5].map(
                                            (star) => {

                                                const isActive =
                                                    star <=
                                                    (
                                                        hoverRating ||
                                                        rating
                                                    );


                                                return (

                                                    <button
                                                        key={star}
                                                        type="button"
                                                        className={
                                                            `rating-star ${
                                                                isActive
                                                                    ? "active"
                                                                    : ""
                                                            }`
                                                        }
                                                        onMouseEnter={() =>
                                                            setHoverRating(
                                                                star
                                                            )
                                                        }
                                                        onClick={() =>
                                                            setRating(
                                                                star
                                                            )
                                                        }
                                                        aria-label={
                                                            `${star} star${
                                                                star > 1
                                                                    ? "s"
                                                                    : ""
                                                            }`
                                                        }
                                                    >
                                                        ★
                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>


                                    <div className="rating-value">

                                        {rating > 0
                                            ? `${rating} out of 5`
                                            : "Select a rating"}

                                    </div>

                                </div>


                                {/* =================================================
                                    DESCRIPTION
                                ================================================= */}

                                <div className="rating-description-section">

                                    <label htmlFor="rating-description">

                                        Your Review

                                    </label>


                                    <textarea
                                        id="rating-description"
                                        value={description}
                                        onChange={(event) =>
                                            setDescription(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Tell us about your experience with the product and procurement process..."
                                        rows="6"
                                        maxLength="1000"
                                    ></textarea>


                                    <div className="rating-character-count">

                                        {description.length}/1000

                                    </div>

                                </div>


                                {/* =================================================
                                    ACTIONS
                                ================================================= */}

                                <div className="rating-actions">

                                    <button
                                        type="button"
                                        className="rating-cancel-button"
                                        onClick={() =>
                                            navigate(
                                                "/request-history"
                                            )
                                        }
                                        disabled={submitting}
                                    >
                                        Cancel
                                    </button>


                                    <button
                                        type="button"
                                        className="rating-submit-button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                    >

                                        {submitting
                                            ? "Submitting..."
                                            : "Submit Rating"}

                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default RatingPage;
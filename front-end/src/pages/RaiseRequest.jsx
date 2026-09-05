import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import { getCategoriesByDepartment } from "../services/categoryService";
import { getProductsByCategory } from "../services/productCatalogService";
import { raiseRequest } from "../services/dashboardService";

import {
    showSuccess,
    showError
} from "../utils/notifications";


function RaiseRequest() {

    const navigate = useNavigate();


    const [categories, setCategories] = useState([]);

    const [products, setProducts] = useState([]);

    const [categoryId, setCategoryId] = useState("");

    const [productId, setProductId] = useState("");

    const [quantity, setQuantity] = useState(1);

    const [description, setDescription] = useState("");

    const [loadingCategories, setLoadingCategories] = useState(true);

    const [loadingProducts, setLoadingProducts] = useState(false);

    const [submitting, setSubmitting] = useState(false);


    /* =========================================================
       LOAD CATEGORIES FOR LOGGED-IN USER'S DEPARTMENT
       ========================================================= */

    useEffect(() => {

        const fetchCategories = async () => {

            const departmentId =
                localStorage.getItem("departmentId");


            if (!departmentId) {

                showError(
                    "Department Not Found",
                    "Please login again."
                );

                navigate("/login");

                return;

            }


            try {

                setLoadingCategories(true);

                const response =
                    await getCategoriesByDepartment(
                        departmentId
                    );

                setCategories(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Error loading categories:",
                    error
                );

                showError(
                    "Unable to Load Categories",
                    "Please try again."
                );

            } finally {

                setLoadingCategories(false);

            }

        };


        fetchCategories();

    }, [navigate]);


    /* =========================================================
       LOAD PRODUCTS WHEN CATEGORY CHANGES
       ========================================================= */

    useEffect(() => {

        const fetchProducts = async () => {

            if (!categoryId) {

                setProducts([]);

                return;

            }


            try {

                setLoadingProducts(true);

                setProducts([]);

                setProductId("");

                setQuantity(1);


                const response =
                    await getProductsByCategory(
                        categoryId
                    );


                setProducts(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Error loading products:",
                    error
                );

                showError(
                    "Unable to Load Items",
                    "Could not load items for the selected category."
                );

            } finally {

                setLoadingProducts(false);

            }

        };


        fetchProducts();

    }, [categoryId]);


    /* =========================================================
       SELECTED PRODUCT
       ========================================================= */

    const selectedProduct =
        products.find(
            (product) =>
                String(product.catalogProductId) ===
                String(productId)
        );


    /* =========================================================
       PRICE
       ========================================================= */

    const pricePerProduct =
        selectedProduct
            ? Number(selectedProduct.price)
            : 0;


    /* =========================================================
       TOTAL
       ========================================================= */

    const totalPrice =
        pricePerProduct * quantity;


    /* =========================================================
       CATEGORY CHANGE
       ========================================================= */

    const handleCategoryChange = (e) => {

        setCategoryId(e.target.value);

        setProductId("");

        setQuantity(1);

    };


    /* =========================================================
       PRODUCT CHANGE
       ========================================================= */

    const handleProductChange = (e) => {

        setProductId(e.target.value);

        setQuantity(1);

    };


    /* =========================================================
       QUANTITY
       ========================================================= */

    const decreaseQuantity = () => {

        setQuantity(
            (current) =>
                Math.max(1, current - 1)
        );

    };


    const increaseQuantity = () => {

        setQuantity(
            (current) =>
                current + 1
        );

    };


    /* =========================================================
       PRICE FORMAT
       ========================================================= */

    const formatPrice = (price) => {

        return `₹${Number(price).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

    };


    /* =========================================================
       SUBMIT REQUEST
       ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();


        const userId =
            localStorage.getItem("userId");

        const departmentId =
            localStorage.getItem("departmentId");


        if (!userId || !departmentId) {

            showError(
                "Session Expired",
                "Please login again."
            );

            navigate("/login");

            return;

        }


        if (!categoryId) {

            showError(
                "Category Required",
                "Please select a category."
            );

            return;

        }


        if (!selectedProduct) {

            showError(
                "Item Required",
                "Please select an item."
            );

            return;

        }


        if (!description.trim()) {

            showError(
                "Description Required",
                "Please provide a description for the request."
            );

            return;

        }


        setSubmitting(true);


        /*
         * ProductRequest expects:
         *
         * catalogProductId
         * userId
         * departmentId
         * quantity
         * description
         *
         * Product name, price, category and supplier
         * are obtained automatically by the backend
         * from the selected catalog product.
         */

        const payload = {

            catalogProductId:
                Number(selectedProduct.catalogProductId),

            userId:
                Number(userId),

            departmentId:
                Number(departmentId),

            quantity,

            description:
                description.trim()

        };


        try {

            const response =
                await raiseRequest(payload);


            showSuccess(
                "Request Submitted",
                response.data?.message ||
                "Your procurement request has been submitted successfully."
            );


            setCategoryId("");

            setProductId("");

            setProducts([]);

            setQuantity(1);

            setDescription("");


            setTimeout(() => {

                navigate("/request-history");

            }, 1200);


        } catch (error) {

            console.error(
                "Error submitting request:",
                error
            );


            const message =
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to submit the procurement request.";


            showError(
                "Request Failed",
                message
            );

        } finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="dashboard-page">

            <Sidebar />


            <main className="dashboard-content">

                <div className="container-fluid">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="raise-request-header">

                        <div>

                            <span className="raise-request-label">
                                PROCUREMENT
                            </span>

                            <h2>
                                Raise Request
                            </h2>

                        </div>

                    </div>


                    {/* =================================================
                        REQUEST CARD
                    ================================================= */}

                    <div className="raise-request-card">

                        <form onSubmit={handleSubmit}>


                            {/* =================================================
                                CATEGORY
                            ================================================= */}

                            <div className="raise-request-field">

                                <label htmlFor="category">
                                    Category
                                </label>


                                <select
                                    id="category"
                                    value={categoryId}
                                    onChange={
                                        handleCategoryChange
                                    }
                                    disabled={
                                        loadingCategories
                                    }
                                    required
                                >

                                    <option value="">

                                        {loadingCategories
                                            ? "Loading categories..."
                                            : "Select a category"}

                                    </option>


                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category.categoryId
                                                }
                                                value={
                                                    category.categoryId
                                                }
                                            >

                                                {
                                                    category.categoryName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                ITEM
                            ================================================= */}

                            <div className="raise-request-field">

                                <label htmlFor="product">
                                    Item
                                </label>


                                <select
                                    id="product"
                                    value={productId}
                                    onChange={
                                        handleProductChange
                                    }
                                    disabled={
                                        !categoryId ||
                                        loadingProducts
                                    }
                                    required
                                >

                                    <option value="">

                                        {loadingProducts
                                            ? "Loading items..."
                                            : categoryId
                                                ? "Select an item"
                                                : "Select a category first"}

                                    </option>


                                    {products.map(
                                        (product) => (

                                            <option
                                                key={
                                                    product.catalogProductId
                                                }
                                                value={
                                                    product.catalogProductId
                                                }
                                            >

                                                {
                                                    product.productName
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                PRICE
                            ================================================= */}

                            {selectedProduct && (

                                <div className="raise-request-price">

                                    <div>

                                        <span>
                                            Price per item
                                        </span>

                                        <strong>
                                            {
                                                formatPrice(
                                                    pricePerProduct
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <span className="price-note">
                                        Fixed catalogue price
                                    </span>

                                </div>

                            )}


                            {/* =================================================
                                QUANTITY
                            ================================================= */}

                            <div className="raise-request-field">

                                <label>
                                    Quantity
                                </label>


                                <div className="quantity-control">

                                    <button
                                        type="button"
                                        onClick={
                                            decreaseQuantity
                                        }
                                        disabled={
                                            quantity <= 1
                                        }
                                        aria-label="Decrease quantity"
                                    >

                                        <i className="bi bi-dash"></i>

                                    </button>


                                    <span>
                                        {quantity}
                                    </span>


                                    <button
                                        type="button"
                                        onClick={
                                            increaseQuantity
                                        }
                                        aria-label="Increase quantity"
                                    >

                                        <i className="bi bi-plus"></i>

                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                                TOTAL
                            ================================================= */}

                            <div className="raise-request-total">

                                <span>
                                    Estimated Total
                                </span>


                                <strong>
                                    {
                                        formatPrice(
                                            totalPrice
                                        )
                                    }
                                </strong>

                            </div>


                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <div className="raise-request-field">

                                <label htmlFor="description">
                                    Description
                                </label>


                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Briefly describe why this item is required..."
                                    rows="4"
                                    maxLength={500}
                                    required
                                ></textarea>


                                <div className="description-counter">

                                    {description.length}/500

                                </div>

                            </div>


                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <div className="raise-request-actions">

                                <button
                                    type="button"
                                    className="raise-request-cancel"
                                    onClick={() =>
                                        navigate("/dashboard")
                                    }
                                    disabled={submitting}
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="raise-request-submit"
                                    disabled={
                                        submitting ||
                                        !selectedProduct
                                    }
                                >

                                    {submitting ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            ></span>

                                            Submitting...
                                        </>

                                    ) : (

                                        <>
                                            Submit Request

                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </>

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default RaiseRequest;
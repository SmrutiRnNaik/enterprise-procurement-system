import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import {
    completePayment
} from "../services/adminService";

import {
    showSuccess,
    showError,
    showConfirm
} from "../utils/notifications";


function PaymentPage() {

    const location = useLocation();
    const navigate = useNavigate();

    const product = location.state?.product;


    /* =========================================================
       STATE
       ========================================================= */

    const [paymentMethod, setPaymentMethod] = useState("");

    const [cardNumber, setCardNumber] = useState("");
    const [cardHolder, setCardHolder] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const [mpin, setMpin] = useState("");

    const [transactionReference, setTransactionReference] =
        useState("");

    const [processing, setProcessing] = useState(false);

    const [showQr, setShowQr] = useState(false);


    /* =========================================================
       ADMIN ID
       ========================================================= */

    const adminId =
        localStorage.getItem("userId");


    /* =========================================================
       NO PRODUCT
       ========================================================= */

    if (!product) {

        return (

            <div className="dashboard-page">

                <main className="dashboard-content">

                    <div className="container-fluid">

                        <div className="dashboard-header mb-4">

                            <span className="raise-request-label">
                                ADMINISTRATION
                            </span>

                            <h2>
                                Process Payment
                            </h2>

                        </div>


                        <div className="card border-0 shadow-sm">

                            <div className="card-body text-center py-5">

                                <i
                                    className="bi bi-exclamation-circle"
                                    style={{
                                        fontSize: "3rem"
                                    }}
                                ></i>

                                <h4 className="fw-bold mt-3">
                                    Payment Request Not Found
                                </h4>

                                <p className="text-muted">
                                    No approved procurement request was selected.
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-dark"
                                    onClick={() =>
                                        navigate(
                                            "/admin-request-history"
                                        )
                                    }
                                >

                                    <i className="bi bi-arrow-left me-2"></i>

                                    Back to Request History

                                </button>

                            </div>

                        </div>

                    </div>

                </main>

            </div>

        );

    }


    /* =========================================================
       PAYMENT AMOUNT
       ========================================================= */

    const amount =
        Number(product.totalPrice || 0);


    const formattedAmount =
        amount.toLocaleString("en-IN");


    /* =========================================================
       SUPPLIER PAYMENT DETAILS
       ========================================================= */

    const supplierUpiIds = {

        "Dell India":
            "dell-india@infypay",

        "HP India":
            "hp-india@infypay",

        "Furniture World":
            "furniture-world@infypay",

        "Cisco Distributor":
            "cisco-distributor@infypay",

        "Lenovo India":
            "lenovo-india@infypay",

        "Canon India":
            "canon-india@infypay",

        "Epson India":
            "epson-india@infypay",

        "Godrej Interio":
            "godrej-interio@infypay",

        "Classmate Office Supplies":
            "classmate-office-supplies@infypay",

        "JK Paper Office Solutions":
            "jk-paper-office-solutions@infypay",

        "TP-Link India":
            "tp-link-india@infypay",

        "Apple India":
            "apple-india@infypay",

        "Brother India":
            "brother-india@infypay",

        "Logitech India":
            "logitech-india@infypay",

        "D-Link India":
            "d-link-india@infypay"

    };


    const supplierMpins = {

        "Dell India":
            "1234",

        "HP India":
            "5678",

        "Furniture World":
            "9012",

        "Cisco Distributor":
            "3456",

        "Lenovo India":
            "2468",

        "Canon India":
            "1357",

        "Epson India":
            "7890",

        "Godrej Interio":
            "1122",

        "Classmate Office Supplies":
            "4455",

        "JK Paper Office Solutions":
            "7788",

        "TP-Link India":
            "9988",

        "Apple India":
            "2233",

        "Brother India":
            "5566",

        "Logitech India":
            "6677",

        "D-Link India":
            "8899"

    };


    const supplierUpiId =
        product.supplierUpiId ||
        supplierUpiIds[product.supplierName] ||
        "supplier@infypay";


    const supplierMpin =
        supplierMpins[product.supplierName] ||
        "1234";


    /* =========================================================
       PAYMENT METHOD
       ========================================================= */

    const handleMethodChange = (method) => {

        setPaymentMethod(method);

        setShowQr(false);

        /*
         * Clear card details when switching
         * to another payment method.
         */

        if (
            method !== "CREDIT_CARD" &&
            method !== "DEBIT_CARD"
        ) {

            setCardNumber("");
            setCardHolder("");
            setExpiryDate("");
            setCvv("");

        }

        /*
         * Clear MPIN when switching away
         * from UPI.
         */

        if (method !== "UPI") {

            setMpin("");

        }

    };


    /* =========================================================
       CARD NUMBER
       ========================================================= */

    const handleCardNumberChange = (event) => {

        let value =
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 16);


        value =
            value
                .replace(/(.{4})/g, "$1 ")
                .trim();


        setCardNumber(value);

    };


    /* =========================================================
       EXPIRY DATE
       ========================================================= */

    const handleExpiryChange = (event) => {

        let value =
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 4);


        if (value.length >= 3) {

            value =
                `${value.slice(0, 2)}/${value.slice(2)}`;

        }


        setExpiryDate(value);

    };


    /* =========================================================
       CVV
       ========================================================= */

    const handleCvvChange = (event) => {

        const value =
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 3);


        setCvv(value);

    };


    /* =========================================================
       MPIN
       ========================================================= */

    const handleMpinChange = (event) => {

        setMpin(
            event.target.value
                .replace(/\D/g, "")
                .slice(0, 6)
        );

    };


    /* =========================================================
       TRANSACTION REFERENCE
       ========================================================= */

    const generateTransactionReference = () => {

        const timestamp =
            Date.now()
                .toString()
                .slice(-8);

        const random =
            Math.floor(
                1000 +
                Math.random() * 9000
            );


        setTransactionReference(
            `TXN${timestamp}${random}`
        );

    };


    /* =========================================================
       CARD VALIDATION
       ========================================================= */

    const validateCard = () => {

        const rawCardNumber =
            cardNumber.replace(/\s/g, "");


        if (rawCardNumber.length !== 16) {

            showError(
                "Invalid Card Number",
                "Card number must contain 16 digits."
            );

            return false;

        }


        if (!cardHolder.trim()) {

            showError(
                "Card Holder Required",
                "Please enter the card holder name."
            );

            return false;

        }


        if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {

            showError(
                "Invalid Expiry Date",
                "Please enter the expiry date in MM/YY format."
            );

            return false;

        }


        const [month, year] =
            expiryDate.split("/").map(Number);


        if (month < 1 || month > 12) {

            showError(
                "Invalid Expiry Date",
                "Please enter a valid expiry month."
            );

            return false;

        }


        const currentDate =
            new Date();

        const currentYear =
            currentDate.getFullYear() % 100;

        const currentMonth =
            currentDate.getMonth() + 1;


        if (
            year < currentYear ||
            (
                year === currentYear &&
                month < currentMonth
            )
        ) {

            showError(
                "Card Expired",
                "Please enter a valid non-expired card."
            );

            return false;

        }


        if (cvv.length !== 3) {

            showError(
                "Invalid CVV",
                "CVV must contain exactly 3 digits."
            );

            return false;

        }


        return true;

    };


    /* =========================================================
       PAYMENT VALIDATION
       ========================================================= */

    const validatePayment = () => {

        if (!adminId) {

            showError(
                "Admin Not Found",
                "Admin information is missing. Please login again."
            );

            navigate("/login");

            return false;

        }


        if (!paymentMethod) {

            showError(
                "Payment Method Required",
                "Please select a payment method."
            );

            return false;

        }


        /* CARD */

        if (
            paymentMethod === "CREDIT_CARD" ||
            paymentMethod === "DEBIT_CARD"
        ) {

            if (!validateCard()) {

                return false;

            }

        }


        /* UPI */

        if (paymentMethod === "UPI") {

            if (!mpin) {

                showError(
                    "MPIN Required",
                    "Please enter your UPI MPIN."
                );

                return false;

            }


            if (
                !/^\d{4}$|^\d{6}$/.test(mpin)
            ) {

                showError(
                    "Invalid MPIN",
                    "MPIN must contain 4 or 6 digits."
                );

                return false;

            }


            if (mpin !== supplierMpin) {

                showError(
                    "Incorrect MPIN",
                    "The MPIN entered is incorrect. Please try again."
                );

                return false;

            }

        }


        /*
         * Scan & Pay does not require any
         * additional credentials in this
         * simulated payment flow.
         */


        if (!transactionReference.trim()) {

            generateTransactionReference();

        }


        return true;

    };


    /* =========================================================
       COMPLETE PAYMENT
       ========================================================= */

    const handlePayment = async () => {

        if (!validatePayment()) {

            return;

        }


        const reference =
            transactionReference.trim() ||
            `TXN${Date.now()}`;


        const result =
            await showConfirm(

                "Complete Payment?",

                `Confirm payment of ₹${formattedAmount} for ${product.productName}?`,

                "Pay Now"

            );


        if (!result.isConfirmed) {

            return;

        }


        try {

            setProcessing(true);


            const paymentData = {

                productId:
                    product.productId,

                adminId:
                    Number(adminId),

                paymentMode:
                    paymentMethod,

                transactionReference:
                    reference,

                mpin:
                    paymentMethod === "UPI"
                        ? mpin
                        : null

            };


            const response =
                await completePayment(
                    paymentData
                );


            showSuccess(

                "Payment Completed",

                response.data?.message ||
                "Payment completed successfully."

            );


            navigate(
                "/admin-payment-history"
            );


        } catch (error) {

            console.error(
                "Payment failed:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Payment could not be completed.";


            showError(
                "Payment Failed",
                message
            );

        } finally {

            setProcessing(false);

        }

    };


    /* =========================================================
       QR VALUE
       ========================================================= */

    const qrValue =
        `upi://pay?pa=${encodeURIComponent(
            supplierUpiId
        )}&pn=${encodeURIComponent(
            product.supplierName
        )}&am=${amount.toFixed(2)}&cu=INR`;


    /* =========================================================
       PAYMENT FORM
       ========================================================= */

    const renderPaymentForm = () => {


        /* =====================================================
           CREDIT / DEBIT CARD
           ===================================================== */

        if (
            paymentMethod === "CREDIT_CARD" ||
            paymentMethod === "DEBIT_CARD"
        ) {

            return (

                <div>

                    <div className="d-flex align-items-center mb-4">

                        <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: "45px",
                                height: "45px"
                            }}
                        >

                            <i className="bi bi-credit-card fs-5"></i>

                        </div>

                        <div>

                            <h5 className="fw-bold mb-1">

                                {paymentMethod === "CREDIT_CARD"
                                    ? "Credit Card"
                                    : "Debit Card"
                                }

                            </h5>

                            <small className="text-muted">
                                Enter your card details
                            </small>

                        </div>

                    </div>


                    {/* CARD NUMBER */}

                    <div className="mb-3">

                        <label
                            htmlFor="cardNumber"
                            className="form-label fw-semibold"
                        >
                            Card Number
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">

                                <i className="bi bi-credit-card"></i>

                            </span>

                            <input
                                id="cardNumber"
                                type="text"
                                className="form-control"
                                placeholder="1234 5678 9012 3456"
                                value={cardNumber}
                                onChange={
                                    handleCardNumberChange
                                }
                                disabled={processing}
                                autoComplete="off"
                            />

                        </div>

                    </div>


                    {/* CARD HOLDER */}

                    <div className="mb-3">

                        <label
                            htmlFor="cardHolder"
                            className="form-label fw-semibold"
                        >
                            Card Holder Name
                        </label>

                        <input
                            id="cardHolder"
                            type="text"
                            className="form-control"
                            placeholder="Enter card holder name"
                            value={cardHolder}
                            onChange={(event) =>
                                setCardHolder(
                                    event.target.value
                                )
                            }
                            disabled={processing}
                            autoComplete="off"
                        />

                    </div>


                    <div className="row g-3">

                        {/* EXPIRY */}

                        <div className="col-6">

                            <label
                                htmlFor="expiryDate"
                                className="form-label fw-semibold"
                            >
                                Expiry Date
                            </label>

                            <input
                                id="expiryDate"
                                type="text"
                                className="form-control"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={
                                    handleExpiryChange
                                }
                                disabled={processing}
                                autoComplete="off"
                            />

                        </div>


                        {/* CVV */}

                        <div className="col-6">

                            <label
                                htmlFor="cvv"
                                className="form-label fw-semibold"
                            >
                                CVV
                            </label>

                            <input
                                id="cvv"
                                type="password"
                                className="form-control"
                                placeholder="•••"
                                value={cvv}
                                onChange={
                                    handleCvvChange
                                }
                                disabled={processing}
                                autoComplete="off"
                            />

                        </div>

                    </div>


                    {/* SECURITY */}

                    <div className="alert alert-light border mt-4 mb-0">

                        <i className="bi bi-shield-check me-2"></i>

                        Card details are not stored.

                    </div>

                </div>

            );

        }


        /* =====================================================
           UPI
           ===================================================== */

        if (paymentMethod === "UPI") {

            return (

                <div>

                    <div className="d-flex align-items-center mb-4">

                        <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: "45px",
                                height: "45px"
                            }}
                        >

                            <i className="bi bi-phone fs-5"></i>

                        </div>

                        <div>

                            <h5 className="fw-bold mb-1">
                                UPI Payment
                            </h5>

                            <small className="text-muted">
                                Pay securely using UPI
                            </small>

                        </div>

                    </div>


                    {/* SUPPLIER UPI ID */}

                    <div className="mb-4">

                        <label
                            htmlFor="upiId"
                            className="form-label fw-semibold"
                        >
                            Supplier UPI ID
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">
                                @
                            </span>

                            <input
                                id="upiId"
                                type="text"
                                className="form-control"
                                value={supplierUpiId}
                                readOnly
                            />

                            <span className="input-group-text">

                                <i className="bi bi-lock-fill"></i>

                            </span>

                        </div>

                        <small className="text-muted">
                            UPI ID is automatically selected from the supplier.
                        </small>

                    </div>


                    {/* MPIN */}

                    <div className="mb-4">

                        <label
                            htmlFor="mpin"
                            className="form-label fw-semibold"
                        >
                            UPI MPIN
                        </label>

                        <div className="input-group">

                            <span className="input-group-text">

                                <i className="bi bi-shield-lock"></i>

                            </span>

                            <input
                                id="mpin"
                                type="password"
                                inputMode="numeric"
                                className="form-control"
                                placeholder="Enter UPI MPIN"
                                value={mpin}
                                onChange={
                                    handleMpinChange
                                }
                                disabled={processing}
                                autoComplete="off"
                            />

                        </div>

                        <small className="text-muted">
                            Enter the MPIN configured for this supplier.
                        </small>

                    </div>


                    {/* SECURITY */}

                    <div className="p-3 border rounded-3">

                        <div className="d-flex align-items-center">

                            <i className="bi bi-shield-check fs-4 me-3"></i>

                            <div>

                                <div className="fw-semibold">
                                    Secured UPI Payment
                                </div>

                                <small className="text-muted">
                                    Payment details are securely handled.
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

            );

        }


        /* =====================================================
           SCAN & PAY
           ===================================================== */

        if (paymentMethod === "SCANNER") {

            return (

                <div>

                    {/* HEADER */}

                    <div className="d-flex align-items-center mb-4">

                        <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                            style={{
                                width: "45px",
                                height: "45px"
                            }}
                        >

                            <i className="bi bi-qr-code fs-5"></i>

                        </div>

                        <div>

                            <h5 className="fw-bold mb-1">
                                Scan & Pay
                            </h5>

                            <small className="text-muted">
                                Scan this QR code using your UPI app
                            </small>

                        </div>

                    </div>


                    {/* QR AREA */}

                    <div className="d-flex justify-content-center mb-4">

                        <div
                            className="position-relative bg-white border rounded-4 shadow-sm d-flex align-items-center justify-content-center"
                            style={{
                                width: "280px",
                                height: "280px",
                                overflow: "hidden"
                            }}
                        >

                            {/* QR */}

                            <div
                                style={{
                                    filter: showQr
                                        ? "none"
                                        : "blur(8px)",
                                    transition:
                                        "filter 0.3s ease",
                                    opacity:
                                        showQr
                                            ? 1
                                            : 0.75
                                }}
                            >

                                <QRCodeCanvas
                                    value={qrValue}
                                    size={235}
                                    level="H"
                                    includeMargin={true}
                                    bgColor="#ffffff"
                                    fgColor="#111111"
                                />

                            </div>


                            {/* VIEW QR BUTTON */}

                            {!showQr && (

                                <div
                                    className="position-absolute top-50 start-50 translate-middle"
                                >

                                    <button
                                        type="button"
                                        className="btn btn-dark px-4 py-2 fw-semibold"
                                        onClick={() =>
                                            setShowQr(true)
                                        }
                                        disabled={processing}
                                    >

                                        View QR Code

                                    </button>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* AMOUNT */}

                    <div className="text-center">

                        <div className="text-muted fw-semibold mb-1">
                            Amount to Pay
                        </div>

                        <h2 className="fw-bold mb-3">
                            ₹{formattedAmount}
                        </h2>

                        <p className="text-muted mb-4">

                            Scan the QR code using your UPI
                            application and complete the payment.

                        </p>

                    </div>


                    {/* SECURITY */}

                    <div className="p-3 border rounded-3">

                        <div className="d-flex align-items-center justify-content-center">

                            <i className="bi bi-shield-check fs-5 me-2"></i>

                            <span>
                                Secured payment environment
                            </span>

                        </div>

                    </div>

                </div>

            );

        }


        /* =====================================================
           NO METHOD
           ===================================================== */

        return (

            <div className="text-center py-5">

                <i
                    className="bi bi-wallet2 text-muted"
                    style={{
                        fontSize: "3rem"
                    }}
                ></i>

                <h6 className="fw-bold mt-3">
                    Select a payment method
                </h6>

                <p className="text-muted mb-0">
                    Choose a payment method from the left.
                </p>

            </div>

        );

    };


    /* =========================================================
       MAIN UI
       ========================================================= */

    return (

        <div className="dashboard-page">

            <main className="dashboard-content">

                <div className="container-fluid">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="dashboard-header mb-4">

                        <div>

                            <span className="raise-request-label">
                                INFYPROCURE PAYMENT
                            </span>

                            <h2>
                                Secure Checkout
                            </h2>

                            <p className="text-muted mb-0">

                                Complete payment for the approved
                                procurement request.

                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        CHECKOUT
                    ================================================= */}

                    <div className="row g-4">


                        {/* =================================================
                            LEFT — ORDER SUMMARY
                        ================================================= */}

                        <div className="col-lg-4">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body">

                                    <div className="d-flex justify-content-between align-items-center mb-4">

                                        <h5 className="fw-bold mb-0">
                                            Order Summary
                                        </h5>

                                        <span className="badge bg-success">
                                            Approved
                                        </span>

                                    </div>


                                    <div className="mb-4">

                                        <small className="text-muted">
                                            Request ID
                                        </small>

                                        <div className="fw-semibold">
                                            #{product.productId}
                                        </div>

                                    </div>


                                    <div className="mb-4">

                                        <small className="text-muted">
                                            Product
                                        </small>

                                        <div className="fw-semibold">
                                            {product.productName}
                                        </div>

                                    </div>


                                    <div className="row g-3 mb-4">

                                        <div className="col-6">

                                            <small className="text-muted">
                                                Quantity
                                            </small>

                                            <div className="fw-semibold">
                                                {product.quantity}
                                            </div>

                                        </div>


                                        <div className="col-6">

                                            <small className="text-muted">
                                                Unit Price
                                            </small>

                                            <div className="fw-semibold">

                                                ₹
                                                {Number(
                                                    product.pricePerProduct
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </div>

                                        </div>

                                    </div>


                                    <div className="mb-4">

                                        <small className="text-muted">
                                            Supplier
                                        </small>

                                        <div className="fw-semibold">
                                            {product.supplierName}
                                        </div>

                                    </div>


                                    <hr />


                                    <div className="d-flex justify-content-between align-items-center mt-4">

                                        <span className="fw-semibold">
                                            Total
                                        </span>

                                        <span
                                            className="fw-bold"
                                            style={{
                                                fontSize: "1.5rem"
                                            }}
                                        >

                                            ₹{formattedAmount}

                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* SECURITY CARD */}

                            <div className="card border-0 shadow-sm mt-3">

                                <div className="card-body">

                                    <div className="d-flex align-items-center">

                                        <i className="bi bi-shield-check fs-4 me-3"></i>

                                        <div>

                                            <div className="fw-semibold">
                                                Secured Payment Environment
                                            </div>

                                            <small className="text-muted">
                                                Your payment information is protected.
                                            </small>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            RIGHT — PAYMENT
                        ================================================= */}

                        <div className="col-lg-8">

                            <div className="card border-0 shadow-sm">

                                <div className="card-body p-0">

                                    <div className="row g-0">


                                        {/* =================================================
                                            PAYMENT METHODS
                                        ================================================= */}

                                        <div className="col-md-4 border-end">

                                            <div className="p-4">

                                                <h6 className="fw-bold mb-4">
                                                    Payment Methods
                                                </h6>


                                                {/* CREDIT CARD */}

                                                <button
                                                    type="button"
                                                    className={`w-100 text-start btn mb-2 ${
                                                        paymentMethod === "CREDIT_CARD"
                                                            ? "btn-dark"
                                                            : "btn-light"
                                                    }`}
                                                    onClick={() =>
                                                        handleMethodChange(
                                                            "CREDIT_CARD"
                                                        )
                                                    }
                                                    disabled={processing}
                                                >

                                                    <i className="bi bi-credit-card me-2"></i>

                                                    Credit Card

                                                </button>


                                                {/* DEBIT CARD */}

                                                <button
                                                    type="button"
                                                    className={`w-100 text-start btn mb-2 ${
                                                        paymentMethod === "DEBIT_CARD"
                                                            ? "btn-dark"
                                                            : "btn-light"
                                                    }`}
                                                    onClick={() =>
                                                        handleMethodChange(
                                                            "DEBIT_CARD"
                                                        )
                                                    }
                                                    disabled={processing}
                                                >

                                                    <i className="bi bi-credit-card-2-front me-2"></i>

                                                    Debit Card

                                                </button>


                                                {/* UPI */}

                                                <button
                                                    type="button"
                                                    className={`w-100 text-start btn mb-2 ${
                                                        paymentMethod === "UPI"
                                                            ? "btn-dark"
                                                            : "btn-light"
                                                    }`}
                                                    onClick={() =>
                                                        handleMethodChange(
                                                            "UPI"
                                                        )
                                                    }
                                                    disabled={processing}
                                                >

                                                    <i className="bi bi-phone me-2"></i>

                                                    UPI

                                                </button>


                                                {/* SCAN & PAY */}

                                                <button
                                                    type="button"
                                                    className={`w-100 text-start btn ${
                                                        paymentMethod === "SCANNER"
                                                            ? "btn-dark"
                                                            : "btn-light"
                                                    }`}
                                                    onClick={() =>
                                                        handleMethodChange(
                                                            "SCANNER"
                                                        )
                                                    }
                                                    disabled={processing}
                                                >

                                                    <i className="bi bi-qr-code me-2"></i>

                                                    Scan & Pay

                                                </button>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            PAYMENT FORM
                                        ================================================= */}

                                        <div className="col-md-8">

                                            <div className="p-4">

                                                {renderPaymentForm()}


                                                {/* =================================================
                                                    TRANSACTION REFERENCE
                                                ================================================= */}

                                                {paymentMethod !== "" && (

                                                    <div className="mt-4">

                                                        <label
                                                            htmlFor="transactionReference"
                                                            className="form-label fw-semibold"
                                                        >

                                                            Transaction Reference

                                                        </label>


                                                        <div className="input-group">

                                                            <input
                                                                id="transactionReference"
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Enter or generate reference"
                                                                value={
                                                                    transactionReference
                                                                }
                                                                onChange={(event) =>
                                                                    setTransactionReference(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                                autoComplete="off"
                                                            />


                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-dark"
                                                                onClick={
                                                                    generateTransactionReference
                                                                }
                                                                disabled={
                                                                    processing
                                                                }
                                                            >

                                                                <i className="bi bi-shuffle me-1"></i>

                                                                Generate

                                                            </button>

                                                        </div>

                                                    </div>

                                                )}


                                                {/* =================================================
                                                    ACTIONS
                                                ================================================= */}

                                                <div className="d-flex justify-content-between align-items-center mt-5">

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-dark"
                                                        onClick={() =>
                                                            navigate(
                                                                "/admin-request-history"
                                                            )
                                                        }
                                                        disabled={
                                                            processing
                                                        }
                                                    >

                                                        <i className="bi bi-arrow-left me-2"></i>

                                                        Back

                                                    </button>


                                                    {paymentMethod !== "" && (

                                                        <button
                                                            type="button"
                                                            className="btn btn-dark px-4"
                                                            onClick={
                                                                handlePayment
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        >

                                                            {processing ? (

                                                                <>

                                                                    <span
                                                                        className="spinner-border spinner-border-sm me-2"
                                                                        role="status"
                                                                    ></span>

                                                                    Processing...

                                                                </>

                                                            ) : (

                                                                <>

                                                                    <i className="bi bi-lock-fill me-2"></i>

                                                                    Pay ₹{formattedAmount}

                                                                </>

                                                            )}

                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="text-center mt-4">

                        <small className="text-muted">

                            <i className="bi bi-shield-check me-1"></i>

                            Secured Payment • Your transaction is protected

                        </small>

                    </div>

                </div>

            </main>

        </div>

    );

}


export default PaymentPage;
import Swal from "sweetalert2";


/* =========================================================
   EXISTING TOAST NOTIFICATION
   ---------------------------------------------------------
   Used by existing User/Admin functionality.
   DO NOT CHANGE.
   ========================================================= */

const Toast = Swal.mixin({

    toast: true,

    position: "top",

    showConfirmButton: false,

    timer: 2200,

    timerProgressBar: true,

    background: "#ffffff",

    color: "#111111",

    width: "380px",

    customClass: {
        popup: "infy-toast"
    },

    didOpen: (toast) => {

        toast.addEventListener(
            "mouseenter",
            Swal.stopTimer
        );

        toast.addEventListener(
            "mouseleave",
            Swal.resumeTimer
        );

    }

});


/* =========================================================
   EXISTING SUCCESS
   ---------------------------------------------------------
   USER / ADMIN
   ---------------------------------------------------------
   DO NOT CHANGE.
   ========================================================= */

export const showSuccess = (
    title,
    text = ""
) => {

    return Toast.fire({

        icon: "success",

        title,

        text

    });

};


/* =========================================================
   EXISTING ERROR
   ---------------------------------------------------------
   USER / ADMIN
   ---------------------------------------------------------
   DO NOT CHANGE.
   ========================================================= */

export const showError = (
    title,
    text = ""
) => {

    return Toast.fire({

        icon: "error",

        title,

        text,

        timer: 3500

    });

};


/* =========================================================
   EXISTING INFO
   ---------------------------------------------------------
   USER / ADMIN
   ---------------------------------------------------------
   DO NOT CHANGE.
   ========================================================= */

export const showInfo = (
    title,
    text = ""
) => {

    return Toast.fire({

        icon: "info",

        title,

        text

    });

};


/* =========================================================
   EXISTING WARNING
   ---------------------------------------------------------
   USER / ADMIN
   ---------------------------------------------------------
   DO NOT CHANGE.
   ========================================================= */

export const showWarning = (
    title,
    text = ""
) => {

    return Toast.fire({

        icon: "warning",

        title,

        text,

        timer: 3000

    });

};


/* =========================================================
   EXISTING CONFIRMATION
   ---------------------------------------------------------
   USER / ADMIN
   ---------------------------------------------------------
   DO NOT CHANGE.

   Used for:
   - Logout
   - Approve Request
   - Reject Request
   - Complete Payment
   ========================================================= */

export const showConfirm = (
    title,
    text = "",
    confirmText = "Logout"
) => {

    return Swal.fire({

        title,

        text,

        icon: "question",

        showCancelButton: true,

        confirmButtonColor: "#111111",

        cancelButtonColor: "#e5e5e5",

        cancelButtonText: "Cancel",

        confirmButtonText: confirmText,

        background: "#ffffff",

        color: "#111111",

        customClass: {

            popup: "infy-confirm-popup",

            confirmButton: "infy-confirm-button",

            cancelButton: "infy-cancel-button"

        }

    });

};


/* =========================================================
   SUPPLIER TOAST NOTIFICATION
   ---------------------------------------------------------
   Used only by Supplier pages.

   IMPORTANT:
   This intentionally uses the SAME toast configuration
   as the existing User/Admin notification.

   User/Admin functions above remain untouched.
   ========================================================= */

const SupplierToast = Swal.mixin({

    toast: true,

    position: "top",

    showConfirmButton: false,

    timer: 2200,

    timerProgressBar: true,

    background: "#ffffff",

    color: "#111111",

    width: "380px",

    customClass: {

        popup: "infy-toast"

    },

    didOpen: (toast) => {

        toast.addEventListener(
            "mouseenter",
            Swal.stopTimer
        );

        toast.addEventListener(
            "mouseleave",
            Swal.resumeTimer
        );

    }

});


/* =========================================================
   SUPPLIER SUCCESS
   ========================================================= */

export const showSupplierSuccess = (
    title,
    text = ""
) => {

    return SupplierToast.fire({

        icon: "success",

        title,

        text

    });

};


/* =========================================================
   SUPPLIER ERROR
   ========================================================= */

export const showSupplierError = (
    title,
    text = ""
) => {

    return SupplierToast.fire({

        icon: "error",

        title,

        text,

        timer: 3500

    });

};


/* =========================================================
   SUPPLIER INFO
   ========================================================= */

export const showSupplierInfo = (
    title,
    text = ""
) => {

    return SupplierToast.fire({

        icon: "info",

        title,

        text

    });

};


/* =========================================================
   SUPPLIER WARNING
   ========================================================= */

export const showSupplierWarning = (
    title,
    text = ""
) => {

    return SupplierToast.fire({

        icon: "warning",

        title,

        text,

        timer: 3000

    });

};


/* =========================================================
   SUPPLIER CONFIRMATION
   ---------------------------------------------------------
   Minimal confirmation dialog used only by Supplier
   pages for order-status updates.
   ========================================================= */

export const showSupplierConfirm = (
    title,
    text = "",
    confirmText = "Update"
) => {

    return Swal.fire({

        title,

        text,

        /*
         * No large question-mark icon.
         * This keeps the confirmation minimal.
         */
        icon: false,

        showCancelButton: true,

        confirmButtonText: confirmText,

        cancelButtonText: "Cancel",

        confirmButtonColor: "#111111",

        cancelButtonColor: "#f1f1f1",

        background: "#ffffff",

        color: "#111111",

        width: "360px",

        padding: "22px",

        buttonsStyling: true,

        customClass: {

            popup:
                "infy-supplier-confirm-popup",

            title:
                "infy-supplier-confirm-title",

            htmlContainer:
                "infy-supplier-confirm-text",

            actions:
                "infy-supplier-confirm-actions",

            confirmButton:
                "infy-supplier-confirm-button",

            cancelButton:
                "infy-supplier-cancel-button"

        }

    });

};
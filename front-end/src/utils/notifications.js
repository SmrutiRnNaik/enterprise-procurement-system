import Swal from "sweetalert2";


/* =========================================================
   MINIMAL CENTERED NOTIFICATION
   ========================================================= */

const Toast = Swal.mixin({

    toast: true,

    /*
     * Top-center keeps the notification visible
     * without covering the payment form.
     */
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
   SUCCESS
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
   ERROR
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
   INFO
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
   WARNING
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
   CONFIRMATION
   =========================================================

   Used for actions such as:

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
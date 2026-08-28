import Swal from "sweetalert2";


const Toast = Swal.mixin({

    toast: true,

    position: "top-end",

    showConfirmButton: false,

    timer: 2200,

    timerProgressBar: true,

    background: "#ffffff",

    color: "#111111",

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

    Toast.fire({

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

    Toast.fire({

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

    Toast.fire({

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

    Toast.fire({

        icon: "warning",

        title,

        text,

        timer: 3000

    });

};


/* =========================================================
   CONFIRMATION
   =========================================================

   confirmText defaults to "Logout" so existing logout
   confirmation continues to work.

   Example:

   showConfirm(
       "Approve Request?",
       "Are you sure?",
       "Approve"
   );

   Example:

   showConfirm(
       "Reject Request?",
       "Are you sure?",
       "Reject"
   );

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
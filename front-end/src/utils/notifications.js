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


export const showSuccess = (title, text = "") => {

    Toast.fire({
        icon: "success",
        title,
        text
    });

};


export const showError = (title, text = "") => {

    Toast.fire({
        icon: "error",
        title,
        text,
        timer: 3500
    });

};


export const showInfo = (title, text = "") => {

    Toast.fire({
        icon: "info",
        title,
        text
    });

};


export const showWarning = (title, text = "") => {

    Toast.fire({
        icon: "warning",
        title,
        text,
        timer: 3000
    });

};


export const showConfirm = (title, text = "") => {

    return Swal.fire({
        title,
        text,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#111111",
        cancelButtonColor: "#e5e5e5",
        cancelButtonText: "Cancel",
        confirmButtonText: "Logout",
        background: "#ffffff",
        color: "#111111",
        customClass: {
            popup: "infy-confirm-popup",
            confirmButton: "infy-confirm-button",
            cancelButton: "infy-cancel-button"
        }
    });

};
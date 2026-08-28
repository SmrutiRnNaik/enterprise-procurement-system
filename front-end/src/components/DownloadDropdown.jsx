import { useState } from "react";

import { downloadHistory } from "../services/dashboardService";

import {
    showSuccess,
    showError
} from "../utils/notifications";


function DownloadDropdown() {

    const [downloading, setDownloading] = useState(false);


    const handleDownload = async (format) => {

        try {

            const userId =
                localStorage.getItem("userId");

            if (!userId) {

                showError(
                    "User Not Found",
                    "Please login again."
                );

                return;
            }


            setDownloading(true);


            const response =
                await downloadHistory(
                    userId,
                    format
                );


            const blob =
                new Blob(
                    [response.data],
                    {
                        type:
                            response.headers[
                                "content-type"
                            ] ||
                            "application/octet-stream"
                    }
                );


            const url =
                window.URL.createObjectURL(blob);


            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `InfyProcure_Request_History.${format}`;


            document.body.appendChild(link);

            link.click();

            link.remove();


            window.URL.revokeObjectURL(url);


            showSuccess(
                "Download Complete",
                `${format.toUpperCase()} report downloaded successfully.`
            );


        } catch (error) {

            console.error(
                "Download error:",
                error
            );


            showError(
                "Download Failed",
                "Unable to download the request history."
            );


        } finally {

            setDownloading(false);

        }

    };


    return (

        <div className="dropdown">

            <button
                type="button"
                className="btn btn-outline-dark dropdown-toggle"
                data-bs-toggle="dropdown"
                disabled={downloading}
            >

                {downloading ? (

                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                        ></span>

                        Downloading...
                    </>

                ) : (

                    <>
                        <i className="bi bi-download me-2"></i>

                        Download
                    </>

                )}

            </button>


            <ul className="dropdown-menu dropdown-menu-end">

                <li>

                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={() =>
                            handleDownload("pdf")
                        }
                    >

                        <i className="bi bi-file-earmark-pdf me-2"></i>

                        PDF

                    </button>

                </li>


                <li>

                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={() =>
                            handleDownload("csv")
                        }
                    >

                        <i className="bi bi-filetype-csv me-2"></i>

                        CSV

                    </button>

                </li>


                <li>

                    <button
                        type="button"
                        className="dropdown-item"
                        onClick={() =>
                            handleDownload("xlsx")
                        }
                    >

                        <i className="bi bi-file-earmark-excel me-2"></i>

                        Excel (.xlsx)

                    </button>

                </li>

            </ul>

        </div>

    );

}

export default DownloadDropdown;
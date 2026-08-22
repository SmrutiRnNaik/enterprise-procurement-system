import Swal from "sweetalert2";
import { downloadHistory } from "../services/dashboardService";

function DownloadDropdown() {

    const handleDownload = async (format) => {

        try {

            const response = await downloadHistory(1, format);

            const blob = new Blob([response.data]);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = `request-history.${format}`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            Swal.fire({
                icon: "success",
                title: "Download Started",
                text: `${format.toUpperCase()} file downloaded successfully.`,
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "Unable to download the file."
            });

        }

    };

    return (

        <div className="dropdown">

            <button
                className="btn btn-outline-primary dropdown-toggle"
                data-bs-toggle="dropdown"
            >

                <i className="bi bi-download me-2"></i>

                Download

            </button>

            <ul className="dropdown-menu dropdown-menu-end">

                <li>

                    <button
                        className="dropdown-item"
                        onClick={() => handleDownload("csv")}
                    >

                        <i className="bi bi-filetype-csv me-2 text-success"></i>

                        CSV

                    </button>

                </li>

                <li>

                    <button
                        className="dropdown-item"
                        onClick={() => handleDownload("pdf")}
                    >

                        <i className="bi bi-file-earmark-pdf me-2 text-danger"></i>

                        PDF

                    </button>

                </li>

                <li>

                    <button
                        className="dropdown-item"
                        onClick={() => handleDownload("xlsx")}
                    >

                        <i className="bi bi-file-earmark-excel me-2 text-success"></i>

                        Excel

                    </button>

                </li>

            </ul>

        </div>

    );

}

export default DownloadDropdown;
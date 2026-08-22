import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function StatusPieChart({ data }) {

    const chartData = {
        labels: ["Approved", "Pending", "Rejected"],
        datasets: [
            {
                data: [
                    data.approved,
                    data.pending,
                    data.rejected
                ],
                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#dc3545"
                ],
                borderColor: [
                    "#ffffff",
                    "#ffffff",
                    "#ffffff"
                ],
                borderWidth: 2
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.label}: ${context.raw} Requests`
                }
            }
        }
    };

    return (

        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                <h5 className="fw-bold mb-3">
                    Request Status
                </h5>

                <div style={{ height: "320px" }}>
                    <Pie data={chartData} options={options} />
                </div>

            </div>

        </div>

    );

}

export default StatusPieChart;
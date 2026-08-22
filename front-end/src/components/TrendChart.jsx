import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

function TrendChart() {

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Requests Raised",
                data: [3, 5, 8, 6, 10, 12],
                borderColor: "#0d6efd",
                backgroundColor: "rgba(13,110,253,0.15)",
                tension: 0.35,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top"
            }
        }
    };

    return (

        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                <h5 className="fw-bold mb-3">
                    Monthly Request Trend
                </h5>

                <div style={{ height: "320px" }}>
                    <Line data={data} options={options} />
                </div>

            </div>

        </div>

    );

}

export default TrendChart;
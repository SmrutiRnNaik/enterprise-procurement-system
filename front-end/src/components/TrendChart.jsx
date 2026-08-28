import { useEffect, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line } from "react-chartjs-2";

import { getRequestHistory } from "../services/dashboardService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

function TrendChart() {

    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {

        const fetchRequestHistory = async () => {

            try {

                const userId = localStorage.getItem("userId");

                if (!userId) {
                    setError(true);
                    return;
                }

                const response = await getRequestHistory(userId);

                const requests = response.data?.data || [];

                const monthlyCounts = {};

                requests.forEach((request) => {

                    if (!request.createdDate) {
                        return;
                    }

                    const date = new Date(request.createdDate);

                    const monthKey =
                        `${date.getFullYear()}-${String(
                            date.getMonth() + 1
                        ).padStart(2, "0")}`;

                    monthlyCounts[monthKey] =
                        (monthlyCounts[monthKey] || 0) + 1;

                });

                const sortedTrendData = Object.entries(monthlyCounts)
                    .sort(([monthA], [monthB]) =>
                        monthA.localeCompare(monthB)
                    )
                    .map(([month, count]) => {

                        const [year, monthNumber] = month.split("-");

                        const date = new Date(
                            Number(year),
                            Number(monthNumber) - 1
                        );

                        return {
                            month: date.toLocaleDateString("en-US", {
                                month: "short",
                                year: "numeric"
                            }),
                            requests: count
                        };

                    });

                setTrendData(sortedTrendData);

            } catch (error) {

                console.error(
                    "Error fetching request history:",
                    error
                );

                setError(true);

            } finally {

                setLoading(false);

            }

        };

        fetchRequestHistory();

    }, []);

    const data = {

        labels: trendData.map((item) => item.month),

        datasets: [
            {
                label: "Requests Raised",
                data: trendData.map((item) => item.requests),

                borderColor: "#0d6efd",
                backgroundColor: "rgba(13, 110, 253, 0.12)",

                tension: 0.35,
                fill: true,

                pointRadius: 5,
                pointHoverRadius: 8,

                borderWidth: 3
            }
        ]

    };

    const options = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            intersect: false,
            mode: "index"
        },

        plugins: {

            legend: {
                display: true,
                position: "top"
            },

            tooltip: {
                callbacks: {
                    label: (context) =>
                        ` Requests: ${context.parsed.y}`
                }
            }

        },

        scales: {

            y: {
                beginAtZero: true,

                ticks: {
                    precision: 0
                },

                title: {
                    display: true,
                    text: "Number of Requests"
                }

            },

            x: {

                title: {
                    display: true,
                    text: "Month"
                }

            }

        },

        animation: {
            duration: 1000,
            easing: "easeOutQuart"
        }

    };

    return (

        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                <h5 className="fw-bold mb-3">
                    Monthly Request Trend
                </h5>

                {loading ? (

                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "320px" }}
                    >

                        <div className="text-center">

                            <div
                                className="spinner-border text-primary mb-3"
                                role="status"
                            ></div>

                            <p className="text-muted mb-0">
                                Loading request activity...
                            </p>

                        </div>

                    </div>

                ) : error ? (

                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "320px" }}
                    >

                        <div className="text-center">

                            <i className="bi bi-exclamation-circle fs-1 text-danger"></i>

                            <p className="text-muted mt-3 mb-0">
                                Unable to load request activity.
                            </p>

                        </div>

                    </div>

                ) : trendData.length === 0 ? (

                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "320px" }}
                    >

                        <div className="text-center">

                            <i className="bi bi-bar-chart-line fs-1 text-muted"></i>

                            <h6 className="fw-semibold mt-3">
                                No Request Activity Yet
                            </h6>

                            <p className="text-muted mb-0">
                                Your monthly request activity will appear here.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div style={{ height: "320px" }}>

                        <Line
                            data={data}
                            options={options}
                        />

                    </div>

                )}

            </div>

        </div>

    );

}

export default TrendChart;
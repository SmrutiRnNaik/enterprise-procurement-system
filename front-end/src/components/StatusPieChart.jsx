import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function StatusPieChart({ data }) {

    const navigate = useNavigate();

    const approved = Number(data.approved) || 0;
    const pending = Number(data.pending) || 0;
    const rejected = Number(data.rejected) || 0;

    const total = approved + pending + rejected;

    const chartData = {

        labels: [
            "Approved",
            "Pending",
            "Rejected"
        ],

        datasets: [
            {
                data: [
                    approved,
                    pending,
                    rejected
                ],

                backgroundColor: [
                    "#159765",
                    "#e5a900",
                    "#df3d4f"
                ],

                hoverBackgroundColor: [
                    "#117a51",
                    "#c89000",
                    "#bd3040"
                ],

                borderColor: "#ffffff",

                borderWidth: 3,

                hoverOffset: 12
            }
        ]
    };


    const options = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: "68%",

        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 700
        },

        plugins: {

            legend: {

                position: "bottom",

                labels: {

                    usePointStyle: true,

                    pointStyle: "circle",

                    padding: 22,

                    font: {
                        size: 13
                    }
                }
            },

            tooltip: {

                padding: 12,

                displayColors: true,

                callbacks: {

                    label: (context) => {

                        const value = context.raw;

                        const percentage =
                            total > 0
                                ? ((value / total) * 100).toFixed(1)
                                : 0;

                        return `${context.label}: ${value} Requests (${percentage}%)`;
                    }
                }
            }
        },

        onClick: (_, elements) => {

            if (!elements.length) {
                return;
            }

            const index =
                elements[0].index;

            const statuses = [
                "APPROVED",
                "PENDING_APPROVAL",
                "REJECTED"
            ];

            navigate(
                `/request-history?status=${statuses[index]}`
            );
        }
    };


    /* =====================================================
       EMPTY STATE
       ===================================================== */

    if (total === 0) {

        return (

            <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <div>

                            <h5 className="fw-bold mb-1">
                                Request Status
                            </h5>

                            <p className="text-muted small mb-0">
                                Your procurement activity
                            </p>

                        </div>

                    </div>

                    <div className="request-status-empty">

                        <div className="status-empty-icon">

                            <i className="bi bi-pie-chart"></i>

                        </div>

                        <h6 className="fw-bold mt-3">
                            No request activity yet
                        </h6>

                        <p className="text-muted mb-3">
                            Raise a procurement request to see
                            your status distribution here.
                        </p>

                    </div>

                </div>

            </div>

        );

    }


    return (

        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                {/* Header */}

                <div className="d-flex justify-content-between align-items-center mb-2">

                    <div>

                        <h5 className="fw-bold mb-1">
                            Request Status
                        </h5>

                        <p className="text-muted small mb-0">
                            Click a status to view its requests
                        </p>

                    </div>

                </div>


                {/* Chart */}

                <div
                    className="status-chart-container"
                    style={{
                        height: "340px",
                        position: "relative"
                    }}
                >

                    <Doughnut
                        data={chartData}
                        options={options}
                    />


                    {/* Center Content */}

                    <div className="status-chart-center">

                        <span className="status-chart-total">
                            {total}
                        </span>

                        <span className="status-chart-label">
                            Total Requests
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StatusPieChart;
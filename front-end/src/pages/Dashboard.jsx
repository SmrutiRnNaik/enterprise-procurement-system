import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import StatusPieChart from "../components/StatusPieChart";
import RequestTable from "../components/RequestTable";

import { getDashboardCounts } from "../services/dashboardService";

function Dashboard() {

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
        totalRequests: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const userId = localStorage.getItem("userId");

                if (!userId) {
                    console.error("User ID not found.");
                    return;
                }

                const response = await getDashboardCounts(userId);

                setDashboardData(response.data);

            } catch (error) {

                console.error(
                    "Error fetching dashboard data:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchDashboardData();

    }, []);

    return (

        <div className="dashboard-page">

            <Sidebar />

            <main className="dashboard-content">

                <div className="dashboard-shell">

                    <div className="container-fluid">

                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <div className="dashboard-header">

                            <div>

                                <h2>
                                    Dashboard
                                </h2>

                                <p className="text-muted mb-0">
                                    Overview of your procurement activity
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <div className="row g-3 mb-4">

                            <div className="col-xl-3 col-md-6">

                                <StatsCard
                                    title="Total Requests"
                                    value={
                                        loading
                                            ? "—"
                                            : dashboardData.totalRequests
                                    }
                                    icon="clipboard-data"
                                    color="primary"
                                />

                            </div>


                            <div className="col-xl-3 col-md-6">

                                <StatsCard
                                    title="Pending"
                                    value={
                                        loading
                                            ? "—"
                                            : dashboardData.pending
                                    }
                                    icon="hourglass-split"
                                    color="warning"
                                />

                            </div>


                            <div className="col-xl-3 col-md-6">

                                <StatsCard
                                    title="Approved"
                                    value={
                                        loading
                                            ? "—"
                                            : dashboardData.approved
                                    }
                                    icon="check-circle"
                                    color="success"
                                />

                            </div>


                            <div className="col-xl-3 col-md-6">

                                <StatsCard
                                    title="Rejected"
                                    value={
                                        loading
                                            ? "—"
                                            : dashboardData.rejected
                                    }
                                    icon="x-circle"
                                    color="danger"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            REQUEST STATUS
                        ================================================= */}

                        <div className="mb-4">

                            <StatusPieChart
                                data={dashboardData}
                            />

                        </div>


                        {/* =================================================
                            RECENT REQUESTS HEADER
                        ================================================= */}

                        <div className="recent-requests-header">

                            <div>

                                <h5 className="fw-bold mb-1">
                                    Recent Requests
                                </h5>

                                <p className="text-muted small mb-0">
                                    Your latest procurement requests
                                </p>

                            </div>


                            <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                onClick={() =>
                                    navigate("/request-history")
                                }
                            >

                                View Full History

                                <i className="bi bi-arrow-right ms-2"></i>

                            </button>

                        </div>


                        {/* =================================================
                            RECENT REQUESTS TABLE
                        ================================================= */}

                        <RequestTable
                            limit={5}
                            showHeader={false}
                        />

                    </div>

                </div>

            </main>

        </div>

    );

}

export default Dashboard;
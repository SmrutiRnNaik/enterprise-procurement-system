import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import StatusPieChart from "../components/StatusPieChart";
import TrendChart from "../components/TrendChart";
import DownloadDropdown from "../components/DownloadDropdown";
import RequestTable from "../components/RequestTable";
import { getDashboardCounts } from "../services/dashboardService";

function Dashboard() {

    const [dashboardData, setDashboardData] = useState({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0
});

    useEffect(() => {

    const fetchDashboardData = async () => {

        try {

            const response = await getDashboardCounts(1);
            setDashboardData(response.data);

        } catch (error) {

            console.error("Error fetching dashboard data:", error);

        }

    };

    fetchDashboardData();

}, []);

    return (

        <div className="dashboard-page">

            <Navbar />

            <div className="container py-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            User Dashboard
                        </h2>

                        <p className="text-muted mb-0">
                            Enterprise Procurement System
                        </p>

                    </div>

                    <DownloadDropdown />

                </div>

                <div className="row g-3 mb-4">

                    <div className="col-md-3">
                        <StatsCard
                            title="Total Requests"
                            value={dashboardData.totalRequests}
                            icon="clipboard-data"
                            color="primary"
                        />
                    </div>

                    <div className="col-md-3">
                        <StatsCard
                            title="Pending"
                            value={dashboardData.pending}
                            icon="hourglass-split"
                            color="warning"
                        />
                    </div>

                    <div className="col-md-3">
                        <StatsCard
                            title="Approved"
                            value={dashboardData.approved}
                            icon="check-circle"
                            color="success"
                        />
                    </div>

                    <div className="col-md-3">
                        <StatsCard
                            title="Rejected"
                            value={dashboardData.rejected}
                            icon="x-circle"
                            color="danger"
                        />
                    </div>

                </div>

                <div className="row g-4 mb-4">

                    <div className="col-lg-5">
                        <StatusPieChart data={dashboardData} />
                    </div>

                    <div className="col-lg-7">
                        <TrendChart />
                    </div>

                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <button className="btn btn-primary">

                        <i className="bi bi-plus-circle me-2"></i>

                        Raise Request

                    </button>

                    <button className="btn btn-outline-secondary">

                        <i className="bi bi-clock-history me-2"></i>

                        View All

                    </button>

                </div>

                <RequestTable />

            </div>

        </div>

    );

}

export default Dashboard;
import { useEffect, useState } from "react";

import AdminSidebar from "../components/AdminSidebar";
import StatsCard from "../components/StatsCard";
import StatusPieChart from "../components/StatusPieChart";

import { getAdminRequests } from "../services/adminService";


function AdminDashboard() {

    const [requests, setRequests] = useState([]);

    const [loading, setLoading] = useState(true);


    /* =========================================================
       FETCH ADMIN REQUESTS
       ========================================================= */

    useEffect(() => {

        const fetchAdminRequests = async () => {

            try {

                const response =
                    await getAdminRequests();

                setRequests(
                    response.data?.data || []
                );

            } catch (error) {

                console.error(
                    "Error fetching admin requests:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchAdminRequests();

    }, []);


    /* =========================================================
       CALCULATE DASHBOARD COUNTS
       ========================================================= */

    const totalRequests =
        requests.length;


    const pending =
        requests.filter(
            request =>
                request.status === "PENDING_APPROVAL"
        ).length;


    const approved =
        requests.filter(
            request =>
                request.status === "APPROVED"
        ).length;


    const rejected =
        requests.filter(
            request =>
                request.status === "REJECTED"
        ).length;


    const dashboardData = {
        totalRequests,
        pending,
        approved,
        rejected
    };


    return (

        <div className="dashboard-page">

            <AdminSidebar />


            <main className="dashboard-content">

                <div className="container-fluid">


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="dashboard-header mb-4">

                        <div>

                            <span className="raise-request-label">
                                ADMINISTRATION
                            </span>

                            <h2>
                                Admin Dashboard
                            </h2>

                            <p className="text-muted mb-0">
                                Overview of procurement activity
                                across the organization.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div className="row g-3 mb-4">


                        {/* TOTAL */}

                        <div className="col-xl-3 col-md-6">

                            <StatsCard
                                title="Total Requests"
                                value={
                                    loading
                                        ? "—"
                                        : totalRequests
                                }
                                icon="clipboard-data"
                                color="primary"
                            />

                        </div>


                        {/* PENDING */}

                        <div className="col-xl-3 col-md-6">

                            <StatsCard
                                title="Pending Approval"
                                value={
                                    loading
                                        ? "—"
                                        : pending
                                }
                                icon="hourglass-split"
                                color="warning"
                            />

                        </div>


                        {/* APPROVED */}

                        <div className="col-xl-3 col-md-6">

                            <StatsCard
                                title="Approved"
                                value={
                                    loading
                                        ? "—"
                                        : approved
                                }
                                icon="check-circle"
                                color="success"
                            />

                        </div>


                        {/* REJECTED */}

                        <div className="col-xl-3 col-md-6">

                            <StatsCard
                                title="Rejected"
                                value={
                                    loading
                                        ? "—"
                                        : rejected
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


                </div>

            </main>

        </div>

    );

}


export default AdminDashboard;
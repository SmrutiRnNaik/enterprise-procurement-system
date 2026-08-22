function StatsCard({ title, value, icon, color }) {

    return (

        <div className="card border-0 shadow-sm h-100">

            <div className="card-body">

                <div className="d-flex justify-content-between align-items-center">

                    <div>

                        <p className="text-muted mb-1">{title}</p>

                        <h3 className="fw-bold mb-0">{value}</h3>

                    </div>

                    <i className={`bi bi-${icon} fs-1 text-${color}`}></i>

                </div>

            </div>

        </div>

    );

}

export default StatsCard;
function StatsCard({ title, value, icon, color }) {

    const colorClass = `stats-${color}`;

    const descriptions = {
        primary: "All procurement requests",
        warning: "Awaiting approval",
        success: "Successfully approved",
        danger: "Requests declined"
    };

    return (

        <div className={`stats-card ${colorClass}`}>

            <div className="stats-card-top">

                <div className="stats-card-icon">

                    <i className={`bi bi-${icon}`}></i>

                </div>

                <span className="stats-card-label">
                    {title}
                </span>

            </div>


            <div className="stats-card-value">

                {value}

            </div>


            <div className="stats-card-bottom">

                <span>
                    {descriptions[color] || "Procurement activity"}
                </span>

                <i className="bi bi-arrow-up-right"></i>

            </div>

        </div>

    );

}

export default StatsCard;
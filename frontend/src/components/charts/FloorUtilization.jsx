import "./FloorUtilization.css";

const FloorUtilization = ({ data = [] }) => {
  return (
    <div className="floor-util-card">
      <div className="floor-util-header">
        <h3>Floor Utilization</h3>

        <span>Occupancy %</span>
      </div>

      <div className="floor-util-list">
        {data.map((floor, index) => (
          <div key={index} className="floor-util-item">
            <div className="floor-util-row">
              <h4>
                Floor {floor.floor} — Sector {floor.sector}
              </h4>

              <p>
                <span className={`util-number`}>{floor.occupied}</span>

                <span className="util-total"> / 100</span>
              </p>
            </div>

            <div className="floor-progress">
              <div
                className={`floor-progress-fill ${floor.color}`}
                style={{
                  width: `${floor.occupied}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorUtilization;

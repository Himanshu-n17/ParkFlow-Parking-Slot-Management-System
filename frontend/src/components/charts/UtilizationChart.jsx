import {Card} from "../common/Card";
import "./Utilization.css";

const UtilizationChart = ({
  available = 27,
  occupied = 6,
  reserved = 7,
  total = 40,
}) => {
  const percent = (value) => Math.round((value / total) * 100);

  return (
    <Card>
      <h3 className="slot-title">Slot Distribution</h3>

      <div className="slot-progress-row">
        <div className="slot-label">
          Available
          <span>
            {available} / {total}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill available"
            style={{
              width: `${percent(available)}%`,
            }}
          />
        </div>
      </div>

      {/* Occupied */}
      <div className="slot-progress-row">
        <div className="slot-label">
          Occupied
          <span>
            {occupied} / {total}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill occupied"
            style={{
              width: `${percent(occupied)}%`,
            }}
          />
        </div>
      </div>

      {/* Reserved */}
      <div className="slot-progress-row">
        <div className="slot-label">
          Reserved
          <span>
            {reserved} / {total}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill reserved"
            style={{
              width: `${percent(reserved)}%`,
            }}
          />
        </div>
      </div>

      {/* MINI ANALYTICS */}

      <div className="mini-analytics-grid">
        <div className="mini-card">
          <div className="mini-icon trophy">🏆</div>
          <h4>P07</h4>
          <p>Top Slot</p>
          <span>34 bookings</span>
        </div>

        <div className="mini-card">
          <div className="mini-icon clock">⏱</div>
          <h4>2.4h</h4>
          <p>Avg Duration</p>
          <span>Per booking</span>
        </div>

        <div className="mini-card">
          <div className="mini-icon turnover">🔄</div>
          <h4>4.2x</h4>
          <p>Turnover</p>
          <span>Per slot/day</span>
        </div>

        <div className="mini-card">
          <div className="mini-icon accuracy">📡</div>
          <h4>99.8%</h4>
          <p>Accuracy</p>
          <span>Detection rate</span>
        </div>
      </div>
    </Card>
  );
};

export default UtilizationChart;

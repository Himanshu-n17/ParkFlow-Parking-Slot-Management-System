import { Card } from "../common/Card";
import "./Utilization.css";

const UtilizationChart = ({
  available,
  occupied,
  reserved,
  total,
  topSlot,
  topSlotBookings,
  avgDuration,
  turnover,
  accuracy,
}) => {
  const percent = (value) =>
    total > 0 ? Math.round((value / total) * 100) : 0;

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
            style={{ width: `${percent(available)}%` }}
          />
        </div>
      </div>

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
            style={{ width: `${percent(occupied)}%` }}
          />
        </div>
      </div>

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
            style={{ width: `${percent(reserved)}%` }}
          />
        </div>
      </div>

      <div className="mini-analytics-grid">
        <div className="mini-card">
          <div className="mini-icon trophy">🏆</div>
          <h4>{topSlot}</h4>
          <p>Top Slot</p>
          <span>{topSlotBookings} bookings</span>
        </div>

        <div className="mini-card">
          <div className="mini-icon clock">⏱</div>
          <h4>{avgDuration}h</h4>
          <p>Avg Duration</p>
          <span>Per booking</span>
        </div>

        <div className="mini-card">
          <div className="mini-icon turnover">🔄</div>
          <h4>{turnover}x</h4>
          <p>Turnover</p>
          <span>Per slot</span>
        </div>

        <div className="mini-card">
          <div className="mini-icon accuracy">📡</div>
          <h4>{accuracy}%</h4>
          <p>Accuracy</p>
          <span>Detection rate</span>
        </div>
      </div>
    </Card>
  );
};

export default UtilizationChart;

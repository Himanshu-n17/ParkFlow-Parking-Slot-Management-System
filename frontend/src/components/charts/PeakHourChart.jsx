import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { Card } from "../common/Card";
import "./PeakHourChart.css";

// color logic
const getColor = (value) => {
  if (value >= 70) return "#ef4444"; // red high
  if (value >= 50) return "#f59e0b"; // yellow medium
  return "#10b981"; // green low
};

const PeakHourChart = ({ data = [] }) => {
  return (
    <Card title="Peak Hours Analysis" subtitle="Occupancy % / hour">
      {data.length === 0 ? (
        <div style={{ color: "#9ca3af", textAlign: "center", padding: "40px" }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis
              dataKey="time"
              tickFormatter={(time, index) => (index % 2 === 0 ? time : "")}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(v) => [`${v} bookings`, "Traffic"]}
              contentStyle={{
                background: "#111827",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />

            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* legend */}

      <div className="chart-legend">
        <span>
          <div className="legend-dot low"></div> Low
        </span>

        <span>
          <div className="legend-dot medium"></div> Med
        </span>

        <span>
          <div className="legend-dot high"></div> High
        </span>
      </div>
    </Card>
  );
};

export default PeakHourChart;

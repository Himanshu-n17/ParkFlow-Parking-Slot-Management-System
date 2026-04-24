import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {Card} from "../common/Card";
import "./PeakHourChart.css";

const data = [
  { time: "6A", value: 20 },
  { time: "7A", value: 40 },
  { time: "8A", value: 75 },
  { time: "9A", value: 85 },
  { time: "10A", value: 60 },
  { time: "11A", value: 50 },
  { time: "12P", value: 55 },
  { time: "1P", value: 45 },
  { time: "2P", value: 40 },
  { time: "3P", value: 35 },
  { time: "4P", value: 55 },
  { time: "5P", value: 80 },
  { time: "6P", value: 90 },
  { time: "7P", value: 60 },
  { time: "8P", value: 30 },
];

// color logic

const getColor = (value) => {
  if (value >= 70) return "#ef4444"; // red high
  if (value >= 50) return "#f59e0b"; // yellow medium
  return "#10b981"; // green low
};

const PeakHourChart = () => {
  return (
    <Card title="Peak Hours Analysis" subtitle="Occupancy % / hour">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />

          <Tooltip
            cursor={{ fill: "transparent" }}
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

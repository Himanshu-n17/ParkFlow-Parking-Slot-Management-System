import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

import { Card } from "../common/Card";
import "./RevenueChart.css";

const RevenueChart = ({ data = [] }) => {
  const maxRevenue =
    data.length > 0 ? Math.max(...data.map((d) => d.revenue || 0)) : 0;

  return (
    <Card title="Weekly Revenue" subtitle="₹ earnings / day">
      {data.length === 0 ? (
        <div style={{ color: "#9ca3af", textAlign: "center", padding: "40px" }}>
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="92%" height={230}>
          <BarChart data={data}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              formatter={(value) => [`₹${value}`, "Revenue"]}
              contentStyle={{
                background: "#111827",
                borderRadius: "8px",
                border: "none",
                color: "#fff",
              }}
            />

            <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
              <LabelList
                dataKey="revenue"
                position="top"
                formatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
                }
                style={{ fill: "#9ca3af", fontSize: 12 }}
              />

              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.revenue === maxRevenue ? "#10b981" : "#6366f1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};

export default RevenueChart;

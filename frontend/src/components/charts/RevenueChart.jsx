import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

import {Card} from "../common/Card";
import "./RevenueChart.css";

const data = [
  { day: "Mon", revenue: 4200 },
  { day: "Tue", revenue: 3800 },
  { day: "Wed", revenue: 5100 },
  { day: "Thu", revenue: 4700 },
  { day: "Fri", revenue: 6200 },
  { day: "Sat", revenue: 7800 }, // highlighted bar
  { day: "Sun", revenue: 5500 },
];

// highlight highest value automatically

const maxRevenue = Math.max(...data.map((d) => d.revenue));

const RevenueChart = () => {
  return (
    <Card title="Weekly Revenue" subtitle="₹ earnings / day">
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
              formatter={(value) => `${(value / 1000).toFixed(1)}k`}
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
    </Card>
  );
};

export default RevenueChart;

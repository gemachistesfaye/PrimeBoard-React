import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { PieLabelRenderProps } from "recharts";

const data = [
  { name: "Students", value: 400 },
  { name: "Bookings", value: 300 },
  { name: "Analytics", value: 300 },
  { name: "Toolkit", value: 200 },
];

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: PieLabelRenderProps) => {
  const cxNum = Number(cx ?? 0);
  const cyNum = Number(cy ?? 0);
  const midAngleNum = Number(midAngle ?? 0);
  const innerRadiusNum = Number(innerRadius ?? 0);
  const outerRadiusNum = Number(outerRadius ?? 0);
  const percentNum = Number(percent ?? 0);

  const radius = innerRadiusNum + (outerRadiusNum - innerRadiusNum) * 0.5;
  const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN);
  const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percentNum * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChartCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Distribution
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={110}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

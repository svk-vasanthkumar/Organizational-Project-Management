import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function PerformanceChart({ data }) {

  const chartData = data.map(item => ({
    name: item.memberId?.name || "Unknown",
    score: item.score
  }));

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">

        <h5 className="mb-3">
          Member Performance
        </h5>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={chartData}>

            <CartesianGrid strokeDasharray="3 3"/>

            <XAxis dataKey="name"/>

            <YAxis/>

            <Tooltip/>

            <Bar
              dataKey="score"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>
    </div>
  );

}

export default PerformanceChart;
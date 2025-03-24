import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const SensorChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <p>⏳ Дані для відображення відсутні...</p>;
  }

  const chartData = data.map(entry => ({
    timestamp: entry.timestamp || "N/A",
    co2: entry.co2 ?? null,
    pm2_5: entry.pm2_5 ?? null,
    pm10: entry.pm10 ?? null,
    temperature: entry.temperature ?? null,
    humidity: entry.humidity ?? null
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`;
          }}
          angle={-45}
          textAnchor="end"
        />
        <YAxis />
        <Tooltip formatter={(value, name) => [`${value}`, `${name.toUpperCase()}`]} />
        <Legend />

        {chartData.some(entry => entry.co2 !== null) && (
          <Line type="monotone" dataKey="co2" stroke="#00C49F" strokeWidth={2} connectNulls={true} />
        )}
        {chartData.some(entry => entry.pm2_5 !== null) && (
          <Line type="monotone" dataKey="pm2_5" stroke="#FF6347" strokeWidth={2} connectNulls={true} />
        )}
        {chartData.some(entry => entry.pm10 !== null) && (
          <Line type="monotone" dataKey="pm10" stroke="#FFB6C1" strokeWidth={2} connectNulls={true} />
        )}
        {chartData.some(entry => entry.temperature !== null) && (
          <Line type="monotone" dataKey="temperature" stroke="#32CD32" strokeWidth={2} connectNulls={true} />
        )}
        {chartData.some(entry => entry.humidity !== null) && (
          <Line type="monotone" dataKey="humidity" stroke="#1E90FF" strokeWidth={2} connectNulls={true} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SensorChart;

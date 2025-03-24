import React from "react";

function SensorTable({ data }) {
  return (
    <table className="sensor-table">
      <thead>
        <tr>
          <th>Час</th>
          <th>Сенсор</th>
          <th>Температура</th>
          <th>Вологість</th>
          <th>CO2</th>
          <th>PM2.5</th>
          <th>PM10</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((entry, index) => (
            <tr key={index}>
              <td>{entry.timestamp}</td>
              <td>{entry.sensor_id}</td>
              <td>{entry.temperature}</td>
              <td>{entry.humidity}</td>
              <td>{entry.co2}</td>
              <td>{entry.pm2_5}</td>
              <td>{entry.pm10}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7">Дані відсутні</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default SensorTable;

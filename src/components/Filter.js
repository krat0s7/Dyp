import React from "react";
import './Filter.css';

const Filter = ({ onFilterChange }) => {
  return (
    <div className="filter-container">
      <h2>Фільтр сенсорів</h2>
      <label htmlFor="sensorType">Виберіть тип сенсора:</label>
      <select id="sensorType" onChange={onFilterChange}>
        <option value="">Всі</option>
        <option value="DHT22">DHT22</option>
        <option value="MQ-135">MQ-135</option>
        <option value="PMS5003">PMS5003</option>
      </select>
    </div>
  );
};

export default Filter;

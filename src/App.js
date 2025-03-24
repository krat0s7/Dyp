import React, { useEffect, useState } from "react";
import Map from "./components/Map";
import Filter from "./components/Filter";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SensorChart from "./components/SensorChart";
import HealthPrediction from "./components/HealthPrediction";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const App = () => {
  const [sensorData, setSensorData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/data");
        setSensorData(response.data);
        setFilteredData(response.data); // Ініціалізація фільтра
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = (e) => {
    const selectedType = e.target.value;
    setSelectedType(selectedType);
    setFilteredData(
      selectedType === "" ? sensorData : sensorData.filter((data) => data.sensor_type === selectedType)
    );
  };

  const handleMarkerClick = (sensorData) => {
    setSelectedSensor(sensorData); // Оновлюємо вибраний сенсор для прогнозу
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <Header />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "20px" }}>
        <div style={{ flex: 1 }}>
          <Filter onFilterChange={handleFilterChange} />
          {loading ? (
            <p>Loading sensor data...</p>
          ) : (
            <Map
              sensorData={filteredData}
              selectedType={selectedType}
              onMarkerClick={handleMarkerClick}
            />
          )}
        </div>
        <div style={{ flex: 1, marginLeft: "20px" }}>
          <h3>📈 Графік сенсорних даних</h3>
          <SensorChart data={filteredData} /> {/* Відображаємо дані після фільтру */}
          {selectedSensor && (
            <>
              <HealthPrediction sensorData={selectedSensor} />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;

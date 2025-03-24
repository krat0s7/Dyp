import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import './Map.css';

const Map = ({ sensorData, selectedType, onMarkerClick }) => {
  const [updatedData, setUpdatedData] = useState(sensorData);

  useEffect(() => {
    setUpdatedData(sensorData);
  }, [sensorData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setUpdatedData((prevData) =>
        prevData.map(sensor => {
          const updatedSensor = { ...sensor };
          if (sensor.sensor_type === "DHT22") {
            updatedSensor.temperature = parseFloat((Math.random() * (35 - 20) + 20).toFixed(2));
            updatedSensor.humidity = parseFloat((Math.random() * (70 - 30) + 30).toFixed(2));
          } else if (sensor.sensor_type === "MQ-135") {
            updatedSensor.co2 = parseFloat((Math.random() * (700 - 400) + 400).toFixed(2));
          } else if (sensor.sensor_type === "PMS5003") {
            updatedSensor.pm2_5 = parseFloat((Math.random() * (100 - 10) + 10).toFixed(2));
            updatedSensor.pm10 = parseFloat((Math.random() * (150 - 20) + 20).toFixed(2));
          }
          return updatedSensor;
        })
      );
    }, 60000);

    return () => clearInterval(intervalId);
  }, [sensorData]); // Оновлюємо за сенсорними даними

  const getMarkerIcon = (sensorType) => {
    let iconUrl = "";
    switch (sensorType) {
      case "DHT22":
        iconUrl = "/icons/DHT22.png";
        break;
      case "PMS5003":
        iconUrl = "/icons/PMS5003.png";
        break;
      case "MQ-135":
        iconUrl = "/icons/MQ-135.png";
        break;
      default:
        iconUrl = "/icons/default_icon.png";
    }
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [55, 49],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  if (!updatedData || updatedData.length === 0) {
    return <p>Немає доступних сенсорних даних</p>;
  }

  return (
    <MapContainer center={[50.7474, 25.3257]} zoom={13} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {updatedData
        .filter((data) => !selectedType || data.sensor_type === selectedType)
        .map((data, index) => {
          const sensorIcon = getMarkerIcon(data.sensor_type);
          if (data.latitude && data.longitude) {
            return (
              <Marker key={index} position={[data.latitude, data.longitude]} icon={sensorIcon} 
                eventHandlers={{ click: () => onMarkerClick(data) }}>
                <Popup>
                  <div>
                    <strong>📍 Сенсор:</strong> {data.sensor_type} <br />
                    <strong>🌍 Широта:</strong> {data.latitude.toFixed(5)} <br />
                    <strong>🌏 Довгота:</strong> {data.longitude.toFixed(5)} <br />
                    {data.temperature !== null && (
                      <>
                        <strong>🌡 Температура:</strong> {data.temperature} °C <br />
                      </>
                    )}
                    {data.humidity !== null && (
                      <>
                        <strong>💧 Вологість:</strong> {data.humidity} % <br />
                      </>
                    )}
                    {data.co2 !== null && (
                      <>
                        <strong>🌫 CO2:</strong> {data.co2} ppm <br />
                      </>
                    )}
                    {data.pm2_5 !== null && (
                      <>
                        <strong>🛑 PM2.5:</strong> {data.pm2_5} µg/m³ <br />
                      </>
                    )}
                    {data.pm10 !== null && (
                      <>
                        <strong>🚧 PM10:</strong> {data.pm10} µg/m³ <br />
                      </>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          } else {
            return null;
          }
        })}
    </MapContainer>
  );
};

export default Map;

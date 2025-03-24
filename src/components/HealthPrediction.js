import React, { useEffect, useState } from "react";
import axios from "axios";

const HealthPrediction = ({ sensorData }) => {
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const healthImpactMessages = {
        1: "✅ Низький ризик: Повітря чисте, ризик мінімальний.",
        2: "⚠️ Помірний ризик: Легкий вплив на чутливі групи людей.",
        3: "🌬️Високий ризик: Рекомендується обмежити активність на відкритому повітрі.",
        4: "🔴🚷 Дуже високий ризик: Може впливати на всіх. Варто уникати активностей на вулиці.",
        5: "⚠️🏥 Небезпечний рівень: Високий ризик для здоров'я. Термінові заходи необхідні!"
    };

    useEffect(() => {
        if (sensorData) {
            fetchPrediction(sensorData);
        }
    }, [sensorData]);

    const fetchPrediction = async (sensorData) => {
        setLoading(true);
        setError(null);
        try {
            console.log("📤 Відправлення даних:", sensorData);
            const response = await axios.post("http://127.0.0.1:5000/predict_health", sensorData, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("📥 Отриманий прогноз:", response.data.health_risk);
            setPrediction(response.data.health_risk);
        } catch (error) {
            console.error("❌ Помилка:", error);
            setError("Не вдалося отримати прогноз.");
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9", width: "100%" }}>
            <h3>📊 Прогноз ризику здоров'я</h3>

            {loading ? (
                <p>⏳ Завантаження...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : prediction !== null ? (
                <div>
                    <h2>Рівень ризику: {prediction}</h2>
                    <p>{healthImpactMessages[prediction]}</p>
                </div>
            ) : (
                <p>Виберіть сенсор для аналізу.</p>
            )}
        </div>
    );
};

export default HealthPrediction;

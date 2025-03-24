from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import joblib
import numpy as np
import logging
from flask_cors import CORS

# Налаштування логування
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

app = Flask(__name__)
CORS(app)

# Налаштування бази даних PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:555@localhost/air_quality'  
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Завантаження моделі машинного навчання та scaler
try:
    model = joblib.load("backend/health_risk_model.pkl")
    scaler = joblib.load("backend/scaler.pkl")
    logging.info("✅ Модель та Scaler успішно завантажені.")
except Exception as e:
    logging.error(f"❌ Помилка завантаження моделі: {e}")
    model, scaler = None, None

# Модель бази даних
class AirQuality(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.String(50))
    sensor_id = db.Column(db.Integer)
    sensor_type = db.Column(db.String(50))
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    temperature = db.Column(db.Float)
    humidity = db.Column(db.Float)
    co2 = db.Column(db.Float)
    pm2_5 = db.Column(db.Float)
    pm10 = db.Column(db.Float)

# Функція для прогнозу ризику здоров'я
def health_impact_model(data):
    try:
        logging.info(f"📥 Отримані вхідні дані: {data}")

        # Перевірка, чи модель завантажена
        if model is None or scaler is None:
            logging.error("❌ Модель не завантажена. Переконайтеся, що `train_model.py` було виконано.")
            return None

        # Формуємо вхідний масив
        new_data = np.array([[data.get("pm2_5", 0), data.get("co2", 0), data.get("temperature", 0), data.get("humidity", 0)]])
        new_data_scaled = scaler.transform(new_data)  # Масштабування

        prediction = model.predict(new_data_scaled)
        logging.info(f"🎯 Прогноз ризику здоров'я: {prediction[0]}")
        return int(prediction[0])

    except Exception as e:
        logging.error(f"❌ Помилка у моделі: {e}")
        return None

# Маршрут для отримання всіх даних
@app.route('/api/data', methods=['GET'])
def get_data():
    records = AirQuality.query.all()
    return jsonify([{
        "timestamp": record.timestamp,
        "sensor_id": record.sensor_id,
        "sensor_type": record.sensor_type,
        "latitude": record.latitude,
        "longitude": record.longitude,
        "temperature": record.temperature,
        "humidity": record.humidity,
        "co2": record.co2,
        "pm2_5": record.pm2_5,
        "pm10": record.pm10
    } for record in records])

# Маршрут для прогнозу ризику здоров'я
@app.route('/predict_health', methods=['POST'])
def predict_health():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "❌ No data received"}), 400

        logging.info(f"📤 Отриманий запит на прогноз: {data}")
        health_risk = health_impact_model(data)

        if health_risk is None:
            return jsonify({"error": "❌ Prediction failed"}), 500

        return jsonify({"health_risk": health_risk}), 200

    except Exception as e:
        logging.error(f"❌ Flask помилка: {e}")
        return jsonify({"error": str(e)}), 500

# Головна сторінка
@app.route('/')
def index():
    return "✅ Flask сервер працює!"

# Запуск сервера
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)

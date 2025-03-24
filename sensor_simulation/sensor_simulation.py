import random
import time
import requests
from threading import Thread

# Функція генерації випадкових координат для сенсора
def generate_random_coordinates():
    min_latitude = 50.7000
    max_latitude = 50.8000
    min_longitude = 25.2500
    max_longitude = 25.4500

    latitude = random.uniform(min_latitude, max_latitude)
    longitude = random.uniform(min_longitude, max_longitude)

    return latitude, longitude

# Генерація даних для сенсора
def generate_sensor_data(sensor_id):
    SENSOR_TYPES = {
        1: "DHT22",  # Температура та вологість
        2: "MQ-135",  # CO2
        3: "PMS5003"  # PM2.5, PM10
    }

    sensor_type = SENSOR_TYPES[sensor_id]
    latitude, longitude = generate_random_coordinates()

    data = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "sensor_id": sensor_id,
        "sensor_type": sensor_type,
        "latitude": latitude,
        "longitude": longitude,
        "temperature": None,
        "humidity": None,
        "co2": None,
        "pm2_5": None,
        "pm10": None,
    }

    # Генерація реалістичних значень
    if sensor_type == "PMS5003":
        data["pm2_5"] = round(random.uniform(10, 100), 2)
        data["pm10"] = round(random.uniform(20, 150), 2)
    elif sensor_type == "MQ-135":
        # Генерація CO2 в межах 400-700 ppm
        data["co2"] = round(random.uniform(400, 700), 2)
    elif sensor_type == "DHT22":
        # Температура між 20°C і 35°C
        data["temperature"] = round(random.uniform(20, 35), 2)
        # Вологість між 30% і 70%
        data["humidity"] = round(random.uniform(30, 70), 2)
    
    return data

# Надсилання даних на сервер кожні 5 секунд
def send_sensor_data(sensor_id, interval=5):
    url = "http://127.0.0.1:5000/sensor_data"  # URL Flask-сервера

    while True:
        data = generate_sensor_data(sensor_id)
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                print(f"Sensor {sensor_id}: Дані успішно надіслані.")
            else:
                print(f"Помилка при відправці даних для сенсора {sensor_id}")
        except Exception as e:
            print(f"Помилка: {e}")
        time.sleep(interval)

# Запуск потоків для кількох сенсорів
if __name__ == "__main__":
    threads = [Thread(target=send_sensor_data, args=(sensor_id,)) for sensor_id in range(1, 4)]
    for thread in threads:
        thread.start()

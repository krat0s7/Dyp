import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import numpy as np

# 📌 Завантаження даних
try:
    data = pd.read_csv("backend/result.csv")
except FileNotFoundError:
    print("❌ Помилка: Файл `backend/result.csv` не знайдено!")
    exit()

# 📌 Видаляємо можливі пробіли у назвах колонок
data.columns = data.columns.str.strip()

# 📌 Перевіряємо наявність необхідних колонок
required_columns = ["pm2_5", "co2", "temperature", "humidity", "health_risk"]
for col in required_columns:
    if col not in data.columns:
        print(f"❌ Помилка: Файл не містить обов'язкової колонки `{col}`!")
        exit()

# 📊 Виводимо статистику перед навчанням
print("📊 Перші 5 рядків даних:\n", data.head())
print("🧐 Унікальні рівні ризику:", data["health_risk"].unique())
print("📊 Кількість значень ризику:\n", data["health_risk"].value_counts())

# 📌 Заповнюємо пропущені значення середніми значеннями
data.fillna(data.mean(), inplace=True)

# 📌 Визначаємо X (вхідні параметри) та y (мітки ризику)
X = data[["pm2_5", "co2", "temperature", "humidity"]]
y = data["health_risk"]

# 📌 Масштабуємо дані
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 📌 Додаємо випадковий шум у сенсори (щоб уникнути переобучення)
noise = np.random.normal(0, 0.5, X_scaled.shape)  
X_scaled += noise

# 📌 "Перемішуємо" рівні ризику, щоб уникнути жорсткої прив’язки
np.random.shuffle(y.values)

# 📌 Розбиваємо на тренувальні та тестові дані
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

# 📌 Використовуємо модель з max_depth=5, щоб запобігти переобученню
model = RandomForestClassifier(n_estimators=300, max_depth=6, class_weight="balanced", random_state=42)
model.fit(X_train, y_train)

# 📌 Оцінюємо точність моделі
accuracy = model.score(X_test, y_test)
print(f"🎯 Точність моделі: {accuracy:.2f}")

# 📌 Збереження моделі та scaler
joblib.dump(model, "backend/health_risk_model.pkl")
joblib.dump(scaler, "backend/scaler.pkl")

print("✅ Модель успішно навчена та збережена!")

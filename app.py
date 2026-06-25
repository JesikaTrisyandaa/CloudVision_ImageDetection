import os

# Paksa TensorFlow hanya menggunakan CPU
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

import tensorflow as tf
import numpy as np

from PIL import Image
import io

from tensorflow.keras.applications.mobilenet import preprocess_input

# ============================
# FLASK
# ============================

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

# ============================
# LOAD MODEL
# ============================

print("Mulai load model...", flush=True)

model = tf.keras.models.load_model(
    "model_akurasi72.h5",
    compile=False
)

print("Model berhasil dimuat.", flush=True)

# ============================
# NAMA KELAS
# ============================

CLOUD_CLASSES = [
    "Altocumulus",
    "Altostratus",
    "Cumulonimbus",
    "Cirrocumulus",
    "Cirrus",
    "Cirrostratus",
    "Contrail",
    "Cumulus",
    "Nimbostratus",
    "Stratocumulus",
    "Stratus"
]

# ============================
# HOME
# ============================

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

# ============================
# PREDICT
# ============================

@app.route("/predict", methods=["POST"])
def predict():

    print("REQUEST MASUK KE /predict", flush=True)

    try:

        if "image" not in request.files:
            print("Tidak ada file image", flush=True)
            return jsonify({"error": "Image tidak ditemukan"}), 400

        file = request.files["image"]

        print("Nama file:", file.filename, flush=True)

        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize((224, 224))

        arr = np.array(img).astype(np.float32)

        arr = np.expand_dims(arr, axis=0)

        arr = preprocess_input(arr)

        print("Mulai prediksi...", flush=True)

        probs = model.predict(arr, verbose=0)[0]

        print("Prediksi selesai.", flush=True)

        predictions = []

        for i in range(len(CLOUD_CLASSES)):
            predictions.append({
                "class": CLOUD_CLASSES[i],
                "prob": float(probs[i])
            })

        predictions = sorted(
            predictions,
            key=lambda x: x["prob"],
            reverse=True
        )

        print("Top Prediction:", predictions[0], flush=True)

        return jsonify({
            "predictions": predictions
        })

    except Exception as e:

        print("ERROR :", str(e), flush=True)

        return jsonify({
            "error": str(e)
        }), 500

# ============================
# RUN
# ============================

if __name__ == "__main__":

    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port
    )

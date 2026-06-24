import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io

from tensorflow.keras.applications.mobilenet import preprocess_input

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

print("Mulai load model...")
model = tf.keras.models.load_model("model_akurasi72.h5", compile=False)
print("Model berhasil dimuat")

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

@app.route("/")
def home():
    return send_from_directory(".", "index.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        print("REQUEST MASUK KE /predict")

        if "image" not in request.files:
            return jsonify({"error": "File image tidak ditemukan"}), 400

        file = request.files["image"]
        print("File diterima:", file.filename)

        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize((224, 224))

        arr = np.array(img).astype("float32")
        arr = np.expand_dims(arr, axis=0)
        arr = preprocess_input(arr)

        probs = model.predict(arr)[0]

        predictions = [
            {"class": CLOUD_CLASSES[i], "prob": float(probs[i])}
            for i in range(len(CLOUD_CLASSES))
        ]

        predictions = sorted(predictions, key=lambda x: x["prob"], reverse=True)

        print("Prediksi selesai:", predictions[0])

        return jsonify({"predictions": predictions})

    except Exception as e:
        print("ERROR PREDICT:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

print("Mulai load model...", flush=True)
model = tf.keras.models.load_model("model_akurasi72.h5", compile=False)
print("Model berhasil dimuat", flush=True)

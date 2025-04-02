from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import re
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
try:
    model = load_model("model.h5", compile=False)
    model.compile(optimizer=tf.keras.optimizers.Adam(0.001), loss='categorical_crossentropy', metrics=['accuracy'])
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Define label mapping
class_labels = {
    0: "character_10_yna", 1: "character_11_taamatar", 2: "character_12_thaa",
    3: "character_13_daa", 4: "character_14_dhaa", 5: "character_15_adna",
    6: "character_16_tabala", 7: "character_17_tha", 8: "character_18_da",
    9: "character_19_dha", 10: "character_1_ka", 11: "character_20_na",
    12: "character_21_pa", 13: "character_22_pha", 14: "character_23_ba",
    15: "character_24_bha", 16: "character_25_ma", 17: "character_26_yaw",
    18: "character_27_ra", 19: "character_28_la", 20: "character_29_waw",
    21: "character_2_kha", 22: "character_30_motosaw", 23: "character_31_petchiryakha",
    24: "character_32_patalosaw", 25: "character_33_ha", 26: "character_34_chhya",
    27: "character_35_tra", 28: "character_36_gya", 29: "character_3_ga",
    30: "character_4_gha", 31: "character_5_kna", 32: "character_6_cha",
    33: "character_7_chha", 34: "character_8_ja", 35: "character_9_jha",
    36: "digit_0", 37: "digit_1", 38: "digit_2", 39: "digit_3",
    40: "digit_4", 41: "digit_5", 42: "digit_6", 43: "digit_7",
    44: "digit_8", 45: "digit_9"
}

# Preprocess Image
def preprocess_image(image_file):
    try:
        image = Image.open(image_file).convert("L")  # Convert to grayscale
        image = image.resize((32, 32))  # Resize
        image = np.array(image) / 255.0  # Normalize
        image = np.expand_dims(image, axis=(0, -1))  # Add batch and channel dimensions
        return image
    except Exception as e:
        print(f"Error processing image: {e}")
        return None

# Extract number from class label
def extract_number(character_string: str) -> int:
    match = re.search(r'_(\d+)', character_string)  # Extracts last number
    return int(match.group(1)) if match else -1  # Return -1 if no match found

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model failed to load"}), 500

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files["image"]
    image = preprocess_image(image_file)
    if image is None:
        return jsonify({"error": "Invalid image file"}), 400

    try:
        pred = model.predict(image)
        prediction_index = np.argmax(pred, axis=-1)[0]
        predicted_label = class_labels.get(prediction_index, "Unknown")
        extracted_number = extract_number(predicted_label)

        return jsonify({
            "prediction": predicted_label,
            "extracted_number": extracted_number
        })
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": "Failed to make prediction"}), 500

if __name__ == "__main__":
    app.run(debug=True,port = 5003)

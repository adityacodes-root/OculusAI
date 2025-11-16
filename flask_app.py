import os
os.environ["TRANSFORMERS_NO_TF"] = "1"

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np

app = Flask(__name__)

# Allow all frontend requests
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB limit

# ---------------- MODEL CONFIG ---------------- #
MODEL_PATH = r'C:\Users\adity\Desktop\VisionXAI\eye_disease_model.keras'
IMAGE_SIZE = (256, 256)
class_names = ['cataract', 'diabetic_retinopathy', 'glaucoma', 'normal']

# ---------------- DISEASE INFORMATION ---------------- #
disease_info = {
    'cataract': {
        'description': 'A clouding of the eye lens that affects vision.',
        'symptoms': 'Blurred vision, faded colors, glare sensitivity',
        'icon': '☁️',
        'color': '#FF6B6B'
    },
    'diabetic_retinopathy': {
        'description': 'Damage to blood vessels in the retina due to diabetes.',
        'symptoms': 'Floaters, blurred vision, dark areas',
        'icon': '🩸',
        'color': '#FFA500'
    },
    'glaucoma': {
        'description': 'A group of eye conditions damaging the optic nerve.',
        'symptoms': 'Peripheral vision loss, eye pain, nausea',
        'icon': '⚠️',
        'color': '#FF4500'
    },
    'normal': {
        'description': 'No signs of common eye diseases detected.',
        'symptoms': 'Healthy eye condition',
        'icon': '✅',
        'color': '#4CAF50'
    }
}

# ---------------- LOAD MODEL ---------------- #
@app.before_request
def load_model():
    """Lazy load model once."""
    if not hasattr(app, 'model'):
        try:
            app.model = tf.keras.models.load_model(MODEL_PATH)
            print("✅ Model loaded successfully")
        except Exception as e:
            print("❌ Error loading model:", str(e))
            app.model = None


# ---------------- PREDICTION ROUTE ---------------- #
@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        if app.model is None:
            return jsonify({'error': 'Model not loaded'}), 500

        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        image = Image.open(file.stream).convert('RGB')
        img_resized = image.resize(IMAGE_SIZE)

        img_array = tf.keras.utils.img_to_array(img_resized)
        img_array = np.expand_dims(img_array, axis=0)

        predictions = app.model.predict(img_array, verbose=0)
        probabilities = tf.nn.softmax(predictions[0]).numpy()

        predicted_class = class_names[int(np.argmax(probabilities))]
        confidence = float(np.max(probabilities)) * 100

        result = {
            'predicted_class': predicted_class,
            'confidence': round(confidence, 2),
            'icon': disease_info[predicted_class]['icon'],
            'description': disease_info[predicted_class]['description'],
            'symptoms': disease_info[predicted_class]['symptoms'],
            'color': disease_info[predicted_class]['color'],
            'all_predictions': {
                class_names[i]: round(float(probabilities[i]) * 100, 2)
                for i in range(len(class_names))
            }
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------------- SIMPLE OFFLINE CHATBOT ---------------- #
@app.route('/api/chat', methods=['POST'])
def chat():
    user_message = request.json.get("message", "").lower()

    if "cataract" in user_message:
        info = disease_info["cataract"]
        reply = f"Cataract: {info['description']}. Symptoms: {info['symptoms']}."

    elif "diabetic" in user_message or "retinopathy" in user_message:
        info = disease_info["diabetic_retinopathy"]
        reply = f"Diabetic Retinopathy: {info['description']}. Symptoms: {info['symptoms']}."

    elif "glaucoma" in user_message:
        info = disease_info["glaucoma"]
        reply = f"Glaucoma: {info['description']}. Symptoms: {info['symptoms']}."

    elif "normal" in user_message or "healthy" in user_message:
        info = disease_info["normal"]
        reply = f"Normal: {info['description']}."

    elif "symptom" in user_message:
        reply = (
            "Symptoms:\n"
            f"- Cataract: {disease_info['cataract']['symptoms']}\n"
            f"- Diabetic Retinopathy: {disease_info['diabetic_retinopathy']['symptoms']}\n"
            f"- Glaucoma: {disease_info['glaucoma']['symptoms']}"
        )

    else:
        reply = (
            "I’m not sure about that. Try asking:\n"
            "- What is glaucoma?\n"
            "- Symptoms of diabetic retinopathy\n"
            "- Explain cataract\n"
            "- Is my eye normal?"
        )

    return jsonify({"reply": reply})


# ---------------- RUN SERVER ---------------- #
if __name__ == '__main__':
    # Host = 0.0.0.0 allows Next.js to reach Flask
    app.run(debug=False, port=5000, host="0.0.0.0", use_reloader=False)

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Model configuration
MODEL_PATH = r'C:\Users\adity\OculusAI\eye_disease_model.keras'
IMAGE_SIZE = (256, 256)
class_names = ['cataract', 'diabetic_retinopathy', 'glaucoma', 'normal']

# Disease information
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

# Load model
@app.before_request
def load_model():
    if not hasattr(app, 'model'):
        try:
            app.model = tf.keras.models.load_model(MODEL_PATH)
            print("✅ Model loaded successfully")
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")
            app.model = None

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        # Check if model is loaded
        if app.model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get image from request
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Open and process image
        image = Image.open(file.stream).convert('RGB')
        
        # Resize to model input size
        img_resized = image.resize(IMAGE_SIZE)
        img_array = tf.keras.utils.img_to_array(img_resized)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = app.model.predict(img_array, verbose=0)
        probabilities = tf.nn.softmax(predictions[0]).numpy()
        
        predicted_class = class_names[int(np.argmax(probabilities))]
        confidence = float(np.max(probabilities)) * 100
        
        # Prepare response with all confidence scores
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

if __name__ == '__main__':
    app.run(debug=False, port=5000, use_reloader=False)

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tensorflow as tf
from PIL import Image
import numpy as np
import os
import random
import re
from collections import defaultdict

app = Flask(__name__)
CORS(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Model configuration
MODEL_PATH = r'C:\Users\adity\OculusAI\eye_disease_model.keras'
ISHIHARA_MODEL_PATH = r'C:\Users\adity\OculusAI\ishihara_digit_model.keras'
ISHIHARA_DATA_DIR = r'C:\Users\adity\OculusAI\CBTestImages'
IMAGE_SIZE = (256, 256)
ISHIHARA_IMAGE_SIZE = (128, 128)
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
            print("✅ Eye disease model loaded successfully")
        except Exception as e:
            print(f"❌ Error loading eye disease model: {str(e)}")
            app.model = None
    
    if not hasattr(app, 'ishihara_model'):
        try:
            app.ishihara_model = tf.keras.models.load_model(ISHIHARA_MODEL_PATH)
            print("✅ Ishihara digit model loaded successfully")
        except Exception as e:
            print(f"❌ Error loading Ishihara model: {str(e)}")
            app.ishihara_model = None

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

# ==================== Ishihara Colour Blindness Test Endpoints ====================

def parse_ishihara_filename(filename):
    """Parse Ishihara image filename to extract digit, font, and color type."""
    match = re.match(r'(\d)_(.+?)theme_\d+ type_(\d)', filename)
    if match:
        return {
            'digit': int(match.group(1)),
            'font': match.group(2),
            'type': int(match.group(3))
        }
    return None

@app.route('/api/colorblindness/start-test', methods=['GET'])
def start_colorblindness_test():
    """
    Start a new colour blindness test.
    Selects 15-20 random images from the Ishihara dataset.
    """
    try:
        # Get number of images (default 20, min 15, max 30)
        num_images = min(30, max(15, int(request.args.get('count', 20))))
        
        # Get all available images
        all_files = [f for f in os.listdir(ISHIHARA_DATA_DIR) if f.endswith('.png')]
        
        if not all_files:
            return jsonify({'error': 'No Ishihara images found'}), 404
        
        # Parse all files
        image_data = []
        for filename in all_files:
            parsed = parse_ishihara_filename(filename)
            if parsed:
                image_data.append({
                    'filename': filename,
                    **parsed
                })
        
        # Randomly select images
        selected_images = random.sample(image_data, min(num_images, len(image_data)))
        
        # Prepare test session
        test_session = {
            'test_id': os.urandom(8).hex(),
            'total_images': len(selected_images),
            'images': [
                {
                    'id': i + 1,
                    'filename': img['filename'],
                    'type': img['type']
                }
                for i, img in enumerate(selected_images)
            ]
        }
        
        return jsonify(test_session)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/colorblindness/image/<path:filename>', methods=['GET'])
def get_ishihara_image(filename):
    """Serve an Ishihara test image."""
    try:
        image_path = os.path.join(ISHIHARA_DATA_DIR, filename)
        if not os.path.exists(image_path):
            return jsonify({'error': 'Image not found'}), 404
        return send_file(image_path, mimetype='image/png')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/colorblindness/predict-digit', methods=['POST'])
def predict_digit():
    """
    Predict the digit in an Ishihara image using the ML model.
    This provides the ground truth for comparison.
    """
    try:
        if app.ishihara_model is None:
            return jsonify({'error': 'Ishihara model not loaded'}), 500
        
        data = request.json
        filename = data.get('filename')
        
        if not filename:
            return jsonify({'error': 'No filename provided'}), 400
        
        # Load and preprocess image
        image_path = os.path.join(ISHIHARA_DATA_DIR, filename)
        if not os.path.exists(image_path):
            return jsonify({'error': 'Image not found'}), 404
        
        image = Image.open(image_path).convert('RGB')
        img_resized = image.resize(ISHIHARA_IMAGE_SIZE)
        img_array = np.array(img_resized) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = app.ishihara_model.predict(img_array, verbose=0)
        probabilities = tf.nn.softmax(predictions[0]).numpy()
        
        predicted_digit = int(np.argmax(probabilities))
        confidence = float(np.max(probabilities)) * 100
        
        result = {
            'predicted_digit': predicted_digit,
            'confidence': round(confidence, 2),
            'all_probabilities': {
                str(i): round(float(probabilities[i]) * 100, 2)
                for i in range(10)
            }
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/colorblindness/evaluate', methods=['POST'])
def evaluate_colorblindness_test():
    """
    Evaluate the user's responses and provide a diagnosis.
    Calculates probability-based diagnosis for each color type.
    """
    try:
        if app.ishihara_model is None:
            return jsonify({'error': 'Ishihara model not loaded'}), 500
        
        data = request.json
        responses = data.get('responses', [])
        
        if not responses:
            return jsonify({'error': 'No responses provided'}), 400
        
        # Statistics by color type
        type_stats = {
            1: {'total': 0, 'mistakes': 0},  # Greens vs Oranges (Deutan)
            2: {'total': 0, 'mistakes': 0},  # Oranges vs Greens (Protan)
            3: {'total': 0, 'mistakes': 0},  # Gray/Black vs Red/Pink (Protan)
            4: {'total': 0, 'mistakes': 0}   # Yellow/Orange vs Greens (Deutan)
        }
        
        total_correct = 0
        total_questions = len(responses)
        detailed_results = []
        
        # Process each response
        for response in responses:
            filename = response.get('filename')
            user_answer = response.get('user_answer')
            
            if filename is None or user_answer is None:
                continue
            
            # Get color type from filename
            parsed = parse_ishihara_filename(filename)
            if not parsed:
                continue
            
            color_type = parsed['type']
            
            # Get model prediction (ground truth)
            image_path = os.path.join(ISHIHARA_DATA_DIR, filename)
            image = Image.open(image_path).convert('RGB')
            img_resized = image.resize(ISHIHARA_IMAGE_SIZE)
            img_array = np.array(img_resized) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            
            predictions = app.ishihara_model.predict(img_array, verbose=0)
            correct_digit = int(np.argmax(predictions[0]))
            
            # Compare with user answer
            is_correct = (user_answer == correct_digit)
            
            if is_correct:
                total_correct += 1
            else:
                type_stats[color_type]['mistakes'] += 1
            
            type_stats[color_type]['total'] += 1
            
            detailed_results.append({
                'filename': filename,
                'correct_digit': correct_digit,
                'user_answer': user_answer,
                'is_correct': is_correct,
                'color_type': color_type
            })
        
        # Calculate probabilities for each type
        type_probabilities = {}
        for color_type, stats in type_stats.items():
            if stats['total'] > 0:
                error_rate = (stats['mistakes'] / stats['total']) * 100
                normal_rate = 100 - error_rate
                type_probabilities[color_type] = {
                    'error_percentage': round(error_rate, 1),
                    'normal_percentage': round(normal_rate, 1),
                    'mistakes': stats['mistakes'],
                    'total': stats['total']
                }
            else:
                type_probabilities[color_type] = {
                    'error_percentage': 0,
                    'normal_percentage': 100,
                    'mistakes': 0,
                    'total': 0
                }
        
        # Generate diagnosis
        diagnosis = generate_diagnosis(type_probabilities)
        
        # Overall accuracy
        overall_accuracy = (total_correct / total_questions) * 100 if total_questions > 0 else 0
        
        result = {
            'overall_accuracy': round(overall_accuracy, 1),
            'total_correct': total_correct,
            'total_questions': total_questions,
            'type_analysis': type_probabilities,
            'diagnosis': diagnosis,
            'detailed_results': detailed_results
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_diagnosis(type_probabilities):
    """
    Generate a comprehensive diagnosis based on error patterns.
    
    Type 1: Greens (bg) vs Oranges (digit) → Deutan (green-weak)
    Type 2: Oranges (bg) vs Greens (digit) → Protan (red-weak)
    Type 3: Gray/Black (bg) vs Red/Pink (digit) → Protan
    Type 4: Yellow/Orange (bg) vs Greens (digit) → Deutan
    """
    
    type1_error = type_probabilities[1]['error_percentage']
    type2_error = type_probabilities[2]['error_percentage']
    type3_error = type_probabilities[3]['error_percentage']
    type4_error = type_probabilities[4]['error_percentage']
    
    # Calculate Deutan likelihood (Type 1 + Type 4)
    deutan_indicators = []
    if type_probabilities[1]['total'] > 0:
        deutan_indicators.append(type1_error)
    if type_probabilities[4]['total'] > 0:
        deutan_indicators.append(type4_error)
    deutan_likelihood = np.mean(deutan_indicators) if deutan_indicators else 0
    
    # Calculate Protan likelihood (Type 2 + Type 3)
    protan_indicators = []
    if type_probabilities[2]['total'] > 0:
        protan_indicators.append(type2_error)
    if type_probabilities[3]['total'] > 0:
        protan_indicators.append(type3_error)
    protan_likelihood = np.mean(protan_indicators) if protan_indicators else 0
    
    # Overall error rate
    total_errors = sum(tp['mistakes'] for tp in type_probabilities.values())
    total_tests = sum(tp['total'] for tp in type_probabilities.values())
    overall_error = (total_errors / total_tests * 100) if total_tests > 0 else 0
    
    # Determine diagnosis
    diagnosis = {
        'status': 'normal',
        'severity': 'none',
        'type': None,
        'confidence': 'high',
        'deutan_likelihood': round(deutan_likelihood, 1),
        'protan_likelihood': round(protan_likelihood, 1),
        'summary': '',
        'recommendation': '',
        'details': []
    }
    
    # Classification thresholds
    THRESHOLD_LOW = 10
    THRESHOLD_MODERATE = 30
    THRESHOLD_HIGH = 50
    
    if overall_error < THRESHOLD_LOW:
        diagnosis['status'] = 'normal'
        diagnosis['severity'] = 'none'
        diagnosis['summary'] = 'Normal colour vision detected. No significant colour vision deficiency.'
        diagnosis['recommendation'] = 'No further action required. Your colour vision appears normal.'
        diagnosis['details'].append('All colour types were perceived correctly with minimal errors.')
    
    elif deutan_likelihood > protan_likelihood:
        # Deutan pattern (green-weak/green-blind)
        if deutan_likelihood >= THRESHOLD_HIGH:
            diagnosis['status'] = 'colour_blind'
            diagnosis['type'] = 'Deuteranopia'
            diagnosis['severity'] = 'strong'
            diagnosis['confidence'] = 'high'
            diagnosis['summary'] = f'Strong indication of Deuteranopia (green-blindness). Error rate: {deutan_likelihood:.1f}%'
            diagnosis['recommendation'] = 'Please consult an eye care professional for a comprehensive colour vision examination.'
        elif deutan_likelihood >= THRESHOLD_MODERATE:
            diagnosis['status'] = 'colour_weak'
            diagnosis['type'] = 'Deuteranomaly'
            diagnosis['severity'] = 'moderate'
            diagnosis['confidence'] = 'moderate'
            diagnosis['summary'] = f'Moderate signs of Deuteranomaly (green-weakness). Error rate: {deutan_likelihood:.1f}%'
            diagnosis['recommendation'] = 'Consider seeing an eye care professional for further evaluation.'
        else:
            diagnosis['status'] = 'possible_weakness'
            diagnosis['type'] = 'Deuteranomaly'
            diagnosis['severity'] = 'mild'
            diagnosis['confidence'] = 'low'
            diagnosis['summary'] = f'Mild signs of green colour weakness. Error rate: {deutan_likelihood:.1f}%'
            diagnosis['recommendation'] = 'Monitor your colour vision. If symptoms persist, consult an eye care professional.'
        
        diagnosis['details'].append(f'Type 1 errors (green vs orange): {type1_error:.1f}%')
        diagnosis['details'].append(f'Type 4 errors (green vs yellow): {type4_error:.1f}%')
    
    elif protan_likelihood > deutan_likelihood:
        # Protan pattern (red-weak/red-blind)
        if protan_likelihood >= THRESHOLD_HIGH:
            diagnosis['status'] = 'colour_blind'
            diagnosis['type'] = 'Protanopia'
            diagnosis['severity'] = 'strong'
            diagnosis['confidence'] = 'high'
            diagnosis['summary'] = f'Strong indication of Protanopia (red-blindness). Error rate: {protan_likelihood:.1f}%'
            diagnosis['recommendation'] = 'Please consult an eye care professional for a comprehensive colour vision examination.'
        elif protan_likelihood >= THRESHOLD_MODERATE:
            diagnosis['status'] = 'colour_weak'
            diagnosis['type'] = 'Protanomaly'
            diagnosis['severity'] = 'moderate'
            diagnosis['confidence'] = 'moderate'
            diagnosis['summary'] = f'Moderate signs of Protanomaly (red-weakness). Error rate: {protan_likelihood:.1f}%'
            diagnosis['recommendation'] = 'Consider seeing an eye care professional for further evaluation.'
        else:
            diagnosis['status'] = 'possible_weakness'
            diagnosis['type'] = 'Protanomaly'
            diagnosis['severity'] = 'mild'
            diagnosis['confidence'] = 'low'
            diagnosis['summary'] = f'Mild signs of red colour weakness. Error rate: {protan_likelihood:.1f}%'
            diagnosis['recommendation'] = 'Monitor your colour vision. If symptoms persist, consult an eye care professional.'
        
        diagnosis['details'].append(f'Type 2 errors (red vs green): {type2_error:.1f}%')
        diagnosis['details'].append(f'Type 3 errors (red vs gray): {type3_error:.1f}%')
    
    else:
        # Mixed or inconclusive pattern
        if overall_error >= THRESHOLD_MODERATE:
            diagnosis['status'] = 'inconclusive'
            diagnosis['severity'] = 'varied'
            diagnosis['confidence'] = 'low'
            diagnosis['summary'] = 'Inconsistent error pattern detected. Results are inconclusive.'
            diagnosis['recommendation'] = 'This test shows mixed results. Please consult an eye care professional for a thorough examination.'
            diagnosis['details'].append('Errors distributed across multiple colour types.')
        else:
            diagnosis['status'] = 'normal'
            diagnosis['severity'] = 'none'
            diagnosis['summary'] = 'Normal colour vision with minor inconsistencies.'
            diagnosis['recommendation'] = 'Your colour vision appears mostly normal. Retest if concerned.'
    
    return diagnosis

if __name__ == '__main__':
    app.run(debug=False, port=5000, use_reloader=False)

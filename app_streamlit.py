import streamlit as st
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os

# --- Page Configuration --- #
st.set_page_config(
    page_title="VisionXAI - Eye Disease Detection",
    page_icon="👁️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Custom CSS --- #
st.markdown("""
    <style>
    .main {
        background: #ffffff;
    }
    .upload-box {
        border: 2px dashed #667eea;
        border-radius: 15px;
        padding: 40px;
        text-align: center;
        background: white;
        margin: 20px 0;
    }
    .prediction-card {
        background: white;
        border-radius: 15px;
        padding: 25px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        margin: 15px 0;
        border: 1px solid #e0e0e0;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .info-box {
        background: #f0f7ff;
        border-left: 4px solid #667eea;
        border-radius: 8px;
        padding: 15px;
        margin: 15px 0;
    }
    .header-section {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 30px;
        border-radius: 12px;
        margin-bottom: 30px;
        text-align: center;
    }
    .header-section h1 {
        color: white;
        font-size: 2.8em;
        font-weight: 700;
        margin: 0;
    }
    .header-section .subtitle {
        color: rgba(255,255,255,0.95);
        font-size: 1.1em;
        margin-top: 10px;
    }
    </style>
""", unsafe_allow_html=True)

# --- Configuration --- #
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'eye_disease_model.keras')
IMAGE_SIZE = (256, 256)
class_names = ['cataract', 'diabetic_retinopathy', 'glaucoma', 'normal']

# Disease information
disease_info = {
    'cataract': {
        'description': 'A clouding of the eye lens that affects vision.',
        'symptoms': 'Blurred vision, faded colors, glare sensitivity',
        'emoji': '☁️'
    },
    'diabetic_retinopathy': {
        'description': 'Damage to blood vessels in the retina due to diabetes.',
        'symptoms': 'Floaters, blurred vision, dark areas',
        'emoji': '🩸'
    },
    'glaucoma': {
        'description': 'A group of eye conditions damaging the optic nerve.',
        'symptoms': 'Peripheral vision loss, eye pain, nausea',
        'emoji': '⚠️'
    },
    'normal': {
        'description': 'No signs of common eye diseases detected.',
        'symptoms': 'Healthy eye condition',
        'emoji': '✅'
    }
}

# --- Load Model --- #
@st.cache_resource
def load_model():
    try:
        model = tf.keras.models.load_model(MODEL_PATH)
        return model
    except Exception as e:
        st.error(f"Error loading model: {str(e)}")
        return None

# --- Prediction Function --- #
def predict(model, img):
    if isinstance(img, Image.Image):
        img_array = tf.keras.utils.img_to_array(img)
    else:
        img_array = img

    img_resized = Image.fromarray(img_array.astype('uint8')).resize(IMAGE_SIZE)
    img_resized_array = tf.keras.utils.img_to_array(img_resized)
    img_array_expanded = tf.expand_dims(img_resized_array, 0)

    predictions = model.predict(img_array_expanded)
    probabilities = tf.nn.softmax(predictions[0]).numpy()

    predicted_class = class_names[int(np.argmax(probabilities))]
    confidence = round(100 * float(np.max(probabilities)), 2)
    
    return predicted_class, confidence, probabilities, img_resized

# --- Main UI --- #
st.markdown("<div class='header-section'><h1>👁️ VisionXAI</h1><p class='subtitle'>Advanced Eye Disease Detection powered by AI</p></div>", unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.markdown("### 📋 About")
    st.info("""
    This application uses deep learning to detect:
    - **Cataract**
    - **Diabetic Retinopathy**
    - **Glaucoma**
    - **Normal** (Healthy Eyes)
    """)
    
    st.markdown("### ⚙️ Model Information")
    model = load_model()
    if model:
        st.success("✅ Model Loaded Successfully")
        st.metric("Input Size", f"{IMAGE_SIZE[0]}×{IMAGE_SIZE[1]}")
        st.metric("Classes", len(class_names))
    else:
        st.error("❌ Model Failed to Load")
    
    st.markdown("### ⚠️ Disclaimer")
    st.warning("""
    This tool is for educational purposes only. 
    Always consult a healthcare professional for medical advice.
    """)

# Main content area
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 📤 Upload Image")
    uploaded_file = st.file_uploader(
        "Choose an eye fundus image...",
        type=["jpg", "jpeg", "png"],
        help="Upload a clear retinal/fundus image for analysis"
    )
    
    if uploaded_file is not None:
        image = Image.open(uploaded_file)
        st.image(image, caption='📷 Uploaded Image', use_column_width=True)

with col2:
    if uploaded_file is not None and model is not None:
        st.markdown("### 🔍 Analysis Results")
        
        with st.spinner('🔄 Analyzing image...'):
            predicted_class, confidence, probabilities, processed_image = predict(model, image)
        
        # Display main prediction
        emoji = disease_info[predicted_class]['emoji']
        st.markdown(f"""
        <div class='prediction-card'>
            <h2 style='text-align: center; color: #667eea;'>{emoji} {predicted_class.replace('_', ' ').title()}</h2>
            <h1 style='text-align: center; color: #764ba2;'>{confidence}%</h1>
            <p style='text-align: center; color: #666;'>Confidence Score</p>
        </div>
        """, unsafe_allow_html=True)
        
        # Disease information
        st.markdown(f"""
        <div class='info-box'>
            <h4>ℹ️ About {predicted_class.replace('_', ' ').title()}</h4>
            <p><strong>Description:</strong> {disease_info[predicted_class]['description']}</p>
            <p><strong>Common Symptoms:</strong> {disease_info[predicted_class]['symptoms']}</p>
        </div>
        """, unsafe_allow_html=True)

# Full-width confidence chart
if uploaded_file is not None and model is not None:
    st.markdown("---")
    st.markdown("### 📊 Detailed Confidence Analysis")
    
    col1, col2, col3, col4 = st.columns(4)
    
    for idx, (col, class_name) in enumerate(zip([col1, col2, col3, col4], class_names)):
        with col:
            st.markdown(f"""
            <div class='metric-card'>
                <h4>{disease_info[class_name]['emoji']}</h4>
                <h3>{class_name.replace('_', ' ').title()}</h3>
                <h2>{probabilities[idx]*100:.1f}%</h2>
            </div>
            """, unsafe_allow_html=True)
    
    # Display confidence as a simple bar chart
    st.markdown("### 📊 Confidence Scores")
    confidence_data = {class_name.replace('_', ' ').title(): prob*100 for class_name, prob in zip(class_names, probabilities)}
    st.bar_chart(confidence_data)

# Footer
st.markdown("---")
st.markdown("""
<div style='text-align: center; color: white; padding: 20px;'>
    <p>🏥 Early detection saves sight. Regular eye checkups are important.</p>
    <p style='font-size: 0.9em; opacity: 0.8;'>Made with ❤️ using Streamlit & TensorFlow</p>
</div>
""", unsafe_allow_html=True)
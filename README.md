# OculusAI - Eye Disease Detection System

An AI-powered eye disease detection platform that uses deep learning to identify common eye conditions from retinal images. The system provides real-time analysis with detailed confidence scores and medical information.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-orange.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black.svg)
![Flask](https://img.shields.io/badge/Flask-3.1.2-lightgrey.svg)

## 🎯 Purpose

VisionXAI addresses the critical need for accessible and rapid eye disease screening. By leveraging artificial intelligence, the platform enables:

- **Early Detection**: Identify eye diseases before symptoms become severe
- **Accessibility**: Provide diagnostic assistance in areas with limited ophthalmologist access
- **Education**: Help patients understand their eye health with detailed disease information
- **Efficiency**: Reduce screening time from hours to seconds

## ✨ Key Features

### 1. **Multi-Disease Detection**
Detects four major eye conditions:
- **Cataract**: Clouding of the eye lens affecting vision
- **Diabetic Retinopathy**: Diabetes-related damage to retinal blood vessels
- **Glaucoma**: Optic nerve damage leading to vision loss
- **Normal**: Healthy eye condition

### 2. **Deep Learning Model**
- Pre-trained Keras neural network (256×256 input)
- 4-class classification with softmax output
- Real-time inference with confidence scores
- Optimized for CPU performance

### 3. **Multiple User Interfaces**
- **Next.js Web App**: Modern, responsive React-based interface
- **Streamlit Dashboard**: Interactive Python-based UI for rapid prototyping
- **REST API**: Programmatic access for integration with other systems

### 4. **Comprehensive Results**
- Primary diagnosis with confidence percentage
- All disease probabilities displayed
- Disease descriptions and symptoms
- Visual confidence indicators with color coding
- Medical recommendations based on severity

### 5. **Professional Design**
- Dark/Light theme support
- Mobile-responsive layout
- Drag-and-drop image upload
- Real-time image preview
- Accessible UI components

## 🏗️ Project Structure

```
VisionXAI/
├── frontend/                      # Next.js React Application
│   ├── app/
│   │   ├── page.tsx              # Landing page
│   │   ├── analyze/page.tsx      # Image upload & analysis
│   │   ├── about/page.tsx        # About page
│   │   └── layout.tsx            # Root layout with theme
│   ├── components/
│   │   ├── ui/                   # Reusable UI components (shadcn)
│   │   ├── header.tsx            # Navigation header
│   │   ├── footer.tsx            # Footer component
│   │   ├── upload-section.tsx   # Image upload widget
│   │   ├── results-display.tsx  # Analysis results display
│   │   └── theme-toggle.tsx     # Dark/light mode switch
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── public/                   # Static assets
│   ├── .env.local               # Environment variables
│   ├── package.json             # Node dependencies
│   ├── tsconfig.json            # TypeScript config
│   └── next.config.mjs          # Next.js configuration
│
├── app_streamlit.py             # Streamlit UI Application
├── flask_app.py                 # Flask REST API Backend
├── eye_disease_model.keras      # Trained neural network model
├── .gitignore                   # Git ignore rules
├── .venv/                       # Python virtual environment
└── README.md                    # This file
```

## 🔧 Technical Architecture

### Backend Layer

#### Flask REST API (`flask_app.py`)
- **Framework**: Flask 3.1.2 with CORS enabled
- **Endpoint**: `POST /api/predict`
- **Input**: Multipart form data with image file
- **Processing**:
  1. Receives image upload
  2. Resizes to 256×256 pixels
  3. Converts to numpy array
  4. Runs model inference
  5. Applies softmax to get probabilities
- **Output**: JSON with predicted class, confidence, disease info, and all probabilities
- **Port**: 5000

```python
# Example API Response
{
  "predicted_class": "diabetic_retinopathy",
  "confidence": 87.45,
  "icon": "🩸",
  "description": "Damage to blood vessels in the retina due to diabetes.",
  "symptoms": "Floaters, blurred vision, dark areas",
  "color": "#FFA500",
  "all_predictions": {
    "cataract": 5.23,
    "diabetic_retinopathy": 87.45,
    "glaucoma": 2.15,
    "normal": 5.17
  }
}
```

#### Streamlit Dashboard (`app_streamlit.py`)
- **Framework**: Streamlit 1.51.0
- **Features**:
  - Direct model integration (no API calls)
  - File uploader widget
  - Two-column layout for image and results
  - Custom CSS styling with gradient header
  - Bar chart visualization of confidence scores
  - Cached model loading with `@st.cache_resource`
- **Port**: 8501

### Frontend Layer

#### Next.js Application
- **Framework**: Next.js 16.0.3 with React 19.2.0 and TypeScript
- **Build Tool**: Turbopack for fast development
- **Styling**: Tailwind CSS with custom theme
- **UI Library**: shadcn/ui components
- **Key Pages**:
  - `/`: Landing page with features overview
  - `/analyze`: Image upload and analysis interface
  - `/about`: Project information

**Analysis Flow** (`app/analyze/page.tsx`):
1. User uploads retinal image
2. Image preview displayed
3. FormData created with image file
4. POST request to Flask API
5. Response transformed to UI format
6. Results rendered with color-coded cards

#### Theme System
- Next-themes for dark/light mode
- Persistent theme preference
- System theme detection
- Smooth transitions

### AI Model Layer

#### Keras Neural Network
- **Architecture**: Convolutional Neural Network (CNN)
- **Input**: 256×256×3 RGB images
- **Output**: 4-class softmax predictions
- **Format**: `.keras` file (TensorFlow 2.x)
- **Optimization**: CPU-optimized with oneDNN
- **Classes**: [cataract, diabetic_retinopathy, glaucoma, normal]

**Model Loading**:
```python
model = tf.keras.models.load_model('eye_disease_model.keras')
```

**Inference Pipeline**:
```python
1. Load image with PIL
2. Resize to (256, 256)
3. Convert to array: img_to_array()
4. Add batch dimension: expand_dims()
5. Predict: model.predict(img_array)
6. Apply softmax: tf.nn.softmax()
7. Extract class and confidence
```

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Git**: For version control

### Installation

#### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd VisionXAI
```

#### 2. Backend Setup (Python)

**Create Virtual Environment:**
```bash
python -m venv .venv
```

**Activate Virtual Environment:**
```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Windows Command Prompt
.venv\Scripts\activate.bat

# Linux/Mac
source .venv/bin/activate
```

**Install Dependencies:**
```bash
pip install tensorflow==2.20.0 flask==3.1.2 flask-cors==6.0.1 pillow streamlit==1.51.0
```

#### 3. Frontend Setup (Next.js)

**Navigate to Frontend:**
```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install --legacy-peer-deps
```

**Configure Environment:**
Create `.env.local` if it doesn't exist:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Return to Project Root:**
```bash
cd ..
```

### Running the Application

#### Option 1: Run All Services (Recommended for Full Experience)

**Terminal 1 - Flask API:**
```bash
# From project root with venv activated
python flask_app.py
```
Access API at: http://localhost:5000

**Terminal 2 - Next.js Frontend:**
```bash
cd frontend
npm run dev
```
Access web app at: http://localhost:3000

**Terminal 3 - Streamlit (Optional):**
```bash
# From project root with venv activated
streamlit run app_streamlit.py
```
Access dashboard at: http://localhost:8501

#### Option 2: Run Individual Services

**Flask API Only:**
```bash
python flask_app.py
```

**Streamlit Only:**
```bash
streamlit run app_streamlit.py
```

**Next.js Only (requires Flask running):**
```bash
cd frontend
npm run dev
```

## 📊 How It Works

### 1. Image Upload
- User selects retinal image (JPG, PNG, JPEG formats)
- File size limit: 16MB maximum
- Drag-and-drop or click-to-browse interface
- Instant preview displayed

### 2. Preprocessing
- Image converted to RGB format
- Resized to 256×256 pixels
- Normalized to [0, 1] range (implicit in model)
- Batch dimension added for inference

### 3. Model Inference
- Preprocessed image fed to CNN
- Forward pass through convolutional layers
- Feature extraction and classification
- Softmax applied to get probabilities
- Execution time: ~100-300ms on CPU

### 4. Result Interpretation
- Highest probability determines predicted class
- Confidence score = max probability × 100
- All class probabilities returned for transparency
- Color-coded severity indicators:
  - Red (#FF4500): Glaucoma
  - Orange (#FFA500): Diabetic Retinopathy
  - Light Red (#FF6B6B): Cataract
  - Green (#4CAF50): Normal

### 5. Display Results
- Primary diagnosis with confidence percentage
- Disease icon and description
- Symptom list
- All disease probabilities in bar chart
- Medical recommendations

## 🎨 User Interface

### Next.js Web Application

**Landing Page:**
- Hero section with call-to-action
- Feature highlights
- Technology stack showcase
- Responsive grid layout

**Analyze Page:**
- Centered upload card
- Image preview on selection
- Loading state during analysis
- Results card with:
  - Disease name and confidence
  - Colored severity indicator
  - Symptoms list
  - All findings with percentages
  - Recommendation message

**Theme Toggle:**
- Light mode: White backgrounds, dark text
- Dark mode: Dark backgrounds, light text
- System preference detection

### Streamlit Dashboard

**Layout:**
- Header with gradient styling
- Sidebar with file uploader
- Main content area split:
  - Left: Uploaded image display
  - Right: Prediction results and charts

**Features:**
- Real-time file upload
- Automatic image processing
- Horizontal bar chart for probabilities
- Color-coded confidence cards
- Disease information expandable sections

## 🔒 Security & Privacy

- **No Data Storage**: Images are processed in-memory and not saved
- **CORS Protection**: Configured for localhost development
- **File Size Limits**: 16MB maximum to prevent abuse
- **Input Validation**: File type and format validation
- **Error Handling**: Graceful error messages without exposing internals

## 🧪 Model Performance

The Keras model was trained on retinal image datasets and achieves:
- **Multi-class classification** across 4 disease categories
- **Real-time inference** suitable for production use
- **CPU-optimized** for deployment without GPU requirements

*Note: This model is for educational/research purposes. Always consult qualified medical professionals for actual diagnosis.*

## 🛠️ Technology Stack

### Backend
- **Python 3.10+**: Core programming language
- **TensorFlow 2.20.0**: Deep learning framework
- **Keras 3.12.0**: High-level neural networks API
- **Flask 3.1.2**: Lightweight web framework
- **Flask-CORS 6.0.1**: Cross-origin resource sharing
- **Pillow (PIL)**: Image processing library
- **NumPy**: Numerical computing

### Frontend
- **Next.js 16.0.3**: React framework with SSR
- **React 19.2.0**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Accessible component library
- **next-themes**: Theme management
- **Lucide React**: Icon library

### Alternative UI
- **Streamlit 1.51.0**: Rapid web app framework

## 📈 Future Enhancements

- [ ] Add more eye diseases (AMD, retinal detachment, etc.)
- [ ] Implement user authentication and history
- [ ] Generate downloadable PDF reports
- [ ] Add batch image processing
- [ ] Integrate with DICOM medical imaging format
- [ ] Implement explainable AI (Grad-CAM visualizations)
- [ ] Deploy to cloud platform (AWS/GCP/Azure)
- [ ] Add mobile app (React Native)
- [ ] Multi-language support
- [ ] Integration with electronic health records (EHR)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer

**IMPORTANT**: This application is for educational and research purposes only. It is **NOT** a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with questions regarding medical conditions.

## 📄 License

This project is available for educational purposes. Please ensure you have appropriate rights for the trained model and comply with medical software regulations in your jurisdiction.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- TensorFlow team for the deep learning framework
- Vercel for Next.js and hosting platform
- shadcn for the beautiful UI components
- Streamlit team for the rapid prototyping tool
- Medical imaging research community for datasets and methodologies

---

**For questions or support, please open an issue on GitHub.**

*Built with ❤️ for better eye health accessibility*

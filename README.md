# OculusAI

A vision science and ophthalmic screening platform. OculusAI integrates deep transfer learning convolutional neural networks, interactive optometric simulation, and chromatic discrimination diagnostics into a sleek web application.

![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-FF6F00.svg?style=flat&logo=tensorflow&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black.svg?style=flat&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?style=flat&logo=react&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-3.1.2-000000.svg?style=flat&logo=flask&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)

---

## Key Modules & Capabilities

### 1. Retinal Fundus Pathology Screening (`/analyze`)
- **4-Class Deep Learning Classification**: Automated screening for Cataracts, Diabetic Retinopathy, Glaucoma, and Normal physiological fundus.
- **Biometric Quality Verification**: Pre-inference heuristics validate circular fundus presence, edge contrast, and luminosity distribution before model execution.
- **Bilateral Scan Comparison (OD/OS)**: Side-by-side comparative examination of right and left eyes (Oculus Dexter / Oculus Sinister) computing structural symmetry, diagnostic concordance, and confidence deltas.
- **Clinical Report Generator**: Archival multi-page PDF summary export including multi-class probability vectors, clinical recommendations, and embedded scan attachments.

### 2. Pseudoisochromatic Ishihara Color Test (`/colorblindness`)
- **Neural Ground-Truth Verification**: Interactive calibrated plate examination paired with an auxiliary CNN digit recognition model (99.5% accuracy) for automated validation.
- **Differential Deficiency Diagnosis**:
  - **Deutan (Types 1 & 4)**: Evaluates M-cone (green photopigment) anomalies across green-orange and yellow confusion axes.
  - **Protan (Types 2 & 3)**: Evaluates L-cone (red photopigment) anomalies across red-green and neutral gray confusion axes.
- **Streamlined Inputs**: Desktop single-digit typing (0–9), global keyboard shortcuts (<kbd>0</kbd>–<kbd>9</kbd>, <kbd>Enter</kbd>), and on-screen keypad.
- **Diagnostic PDF Generation**: Detailed chromatic performance metrics and inheritance context.

### 3. Vision Deficiency Simulator (`/simulator`)
- **Real-Time Matrix Filtering**: SVG color matrix transformations and optical convolution filters simulating human chromatic and refractive anomalies:
  - **Protanopia** (L-cone absent)
  - **Deuteranopia** (M-cone absent)
  - **Tritanopia** (S-cone absent)
  - **Achromatopsia** (Complete rod monochromacy)
  - **Cataracts** (Optical photon scattering and yellowing)
- **Interactive Split Comparison**: Dynamic split-screen slider for direct before/after visual inspection.
- **Severity Control & Custom Uploads**: Variable intensity (0–100%) with built-in presets (including high-altitude mountain landscapes) and custom image upload support.

### 4. Visual Acuity Screener (`/acuity`)
- **ISO 8596 Tumbling E Standard**: Standardized optotype screener testing spatial visual resolution across progressive size steps.
- **Physical Calibration**: Reference card sizing tool calibrating on-screen pixels to physical millimeters based on viewing distance.
- **Clinical Rating Calculation**: Automatic calculation of decimal acuity, Snellen fraction (20/200 down to 20/15), and LogMAR rating.

### 5. Architectural Evaluation & Benchmarks (`/evaluation`)
- **Model Metrics**: Receiver Operating Characteristic (ROC) curves, Precision-Recall curves, multi-class confusion matrices, and training history loss/accuracy trajectories.
- **Computational Efficiency**: Sub-120ms inference pipeline optimized for commodity CPU environments.

### 6. Ophthalmic Condition Compendium (`/diseases`)
- Comprehensive clinical guide detailing etiology, clinical signs, diagnostic biomarkers, and intervention pathways for major retinal conditions.

---

## System Architecture

```
OculusAI/
├── frontend/                     # Next.js 16 + React 19 Frontend
│   ├── app/
│   │   ├── acuity/              # Visual Acuity Screener (ISO 8596)
│   │   ├── analyze/             # Retinal Pathology & Bilateral Comparison
│   │   ├── colorblindness/      # Ishihara Color Vision Screener
│   │   ├── diseases/            # Pathology Compendium
│   │   ├── evaluation/          # Model Benchmarks & ROC Curves
│   │   ├── simulator/           # Vision Deficiency Simulation Suite
│   │   └── about/               # Specifications & Overview
│   ├── components/              # UI components, PDF generators, layout
│   └── public/samples/          # Preloaded evaluation fundus & test images
├── CBTestImages/                # 40 calibrated Ishihara test plates
├── Sample_Retinal_Images/       # Reference fundus photographs
├── flask_app.py                 # REST API with TensorFlow inference & validation
├── app_streamlit.py             # Alternative lightweight Python dashboard
├── eye_disease_model.keras      # Deep Transfer Learning Eye Disease Classifier
├── ishihara_digit_model.keras   # Custom CNN Ishihara Digit Classifier
└── README.md
```

---

## Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16, React 19, TypeScript | Server and client rendering with Turbopack |
| **Styling** | Vanilla CSS, Tailwind CSS, Lucide Icons|
| **Backend** | Python 3.11, Flask 3.1, Flask-CORS | REST API with UTF-8 stdout encoding |
| **Machine Learning** | TensorFlow 2.20, Keras, NumPy, Pillow | Deep transfer learning & custom CNN architectures |
| **Reporting** | jsPDF, html2canvas | Client-side clinical PDF document generation |

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- Model weights (`eye_disease_model.keras` and `ishihara_digit_model.keras`) located in the root project folder

### 1. Backend Setup

```bash
# Navigate to repository root
git clone https://github.com/adityacodes-root/OculusAI.git
cd OculusAI

# Create and activate Python virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
# or: source .venv/bin/activate # Linux / macOS

# Install backend dependencies
pip install tensorflow flask flask-cors pillow numpy
```
### 2. Download Pretrained Models

Download the pretrained model files from the [Google Drive folder](https://drive.google.com/drive/folders/1prXHKGD3OP6Id8HLwVTMNhYDwVlZBCHH?usp=sharing).

Place both files directly in the root directory of the project:
- `eye_disease_model.keras`
- `ishihara_digit_model.keras`

Start the Flask backend:
```bash
python flask_app.py
```
*The backend starts on `http://127.0.0.1:5000` with CORS enabled for frontend communication.*

### 3. Frontend Setup

```bash
# In a second terminal:
cd frontend

# Install dependencies
npm install --legacy-peer-deps

# Start Next.js development server
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

## API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/predict` | `POST` | Multipart form upload of fundus image; returns primary diagnosis, confidence, and multi-class distribution |
| `/api/colorblindness/start-test` | `GET` | Generates a randomized session of calibrated Ishihara plates (`count` parameter) |
| `/api/colorblindness/image/<filename>` | `GET` | Serves calibrated Ishihara plate PNG images |
| `/api/colorblindness/evaluate` | `POST` | Evaluates submitted digit answers and computes Deutan/Protan likelihood |
| `/api/colorblindness/predict-digit` | `POST` | Inference on a single Ishihara plate with the digit classifier model |

---

## Datasets & Acknowledgements

- **Eye Diseases Classification Dataset**: Gunavenkat Doddi ([Kaggle](https://www.kaggle.com/datasets/gunavenkatdoddi/eye-diseases-classification))
- **Ishihara Blind Test Cards**: Dušan Peljan ([Kaggle](https://www.kaggle.com/datasets/dupeljan/ishihara-blind-test-cards))
- **ISO 8596**: International Organization for Standardization — Visual Acuity Test Optotypes

---

## Disclaimer

OculusAI is developed as an educational and portfolio demonstration project in computational ophthalmology and computer vision. The system is **not** certified as a medical device and is not intended for formal clinical diagnosis or patient triage. Always consult qualified ophthalmologists and eyecare professionals for clinical evaluations.

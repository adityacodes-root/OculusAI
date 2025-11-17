# OculusAI

A web platform that uses AI to analyze vision health. Built with two deep learning models - one detects retinal diseases, the other tests for color blindness using Ishihara plates.

![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.20.0-orange.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black.svg)
![Flask](https://img.shields.io/badge/Flask-3.1.2-lightgrey.svg)

## What It Does

**Retina Analysis** - Upload a retinal image and get instant analysis for cataracts, diabetic retinopathy, glaucoma, or normal eyes. The model achieved 89% accuracy and generates a detailed PDF report.

**Color Vision Test** - Take an interactive 40-plate Ishihara test. The AI recognizes digits with 99.5% accuracy and diagnoses color blindness type (Deutan/Protan) and severity.

<!-- Add screenshots here -->
- Real-time inference on both models
- Optimized for CPU performance

### 4. **Multiple User Interfaces**
- **Next.js Web App**: Modern, responsive React-based interface with dark/light themes
- **Streamlit Dashboard**: Interactive Python-based UI for retina analysis
- **REST API**: Programmatic access for both models

### 5. **Comprehensive PDF Reports**
- **Retina Report**: Executive summary, test metrics, disease information, risk factors, treatment options
- **Color Vision Report**: Test performance, color type analysis, deficiency likelihood, genetic information, management strategies
- Professional formatting with multi-page support
- Downloadable reports for medical records

### 6. **Professional Design**
- Dark/Light theme support across all pages
- Mobile-responsive layout
- Drag-and-drop image upload
- Real-time image preview and analysis
- Interactive test interface for color vision assessment


## Project Structure

```
OculusAI/
├── frontend/                  # Next.js app
│   ├── app/                  # Pages (analyze, colorblindness, diseases, etc.)
│   ├── components/           # UI components and PDF generators
│   ├── public/samples/       # Sample retinal images for testing
│   └── .env.local           # API URL configuration
├── CBTestImages/             # Ishihara test images (40 plates)
├── Sample_Retinal_Images/    # Source sample images
├── flask_app.py              # Main API server with image validation
├── app_streamlit.py          # Alternative UI for retina test
├── train_ishihara_model.py   # Model training script
└── *.keras                   # Model files (not in repo)
```

## Tech Stack

**Backend**
- Python + Flask for the API
- TensorFlow/Keras for both models
- Model files excluded from repo (too large for GitHub)

**Frontend**
- Next.js 16 with React and TypeScript
- Tailwind CSS + shadcn/ui components
- Dark/light theme support
- jsPDF for generating reports

**Models**
- Eye Disease: CNN trained on retinal images (256×256 input)
- Color Vision: Custom CNN for Ishihara digits (128×128 input, 1,400 training images)

<!-- Add architecture diagram here -->

## Quick Start

### You'll Need
- Python 3.11+
- Node.js 18+
- The model files (download separately - see below)

### Setup

1. **Clone and install backend**
```bash
git clone https://github.com/adityacodes-root/OculusAI.git
cd OculusAI
python -m venv .venv
.\.venv\Scripts\Activate.ps1  # Windows
pip install tensorflow flask flask-cors pillow numpy streamlit
```

2. **Get the models**
Download these files and put them in the root folder:
- `eye_disease_model.keras`
- `ishihara_digit_model.keras`

The Ishihara test images should be in the `CBTestImages/` folder in the project root.

3. **Install frontend**
```bash
cd frontend
npm install
cd ..
```

4. **Configure Network Access (for mobile testing)**
- Update `frontend/.env.local` with your local IP address:
```bash
NEXT_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```
- Find your IP: Run `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- The Flask server runs on `0.0.0.0:5000` to allow network access

### Run It

Open three terminals:

```bash
# Terminal 1 - Backend
python flask_app.py

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Streamlit (optional)
streamlit run app_streamlit.py
```

Then visit:
- **Main app (desktop)**: http://localhost:3000
- **Main app (mobile)**: http://YOUR_LOCAL_IP:3000
- **API**: http://localhost:5000
- **Streamlit**: http://localhost:8501

**Note**: For mobile access, ensure both devices are on the same WiFi network.

## How the Color Test Works

The Ishihara model doesn't just check if you got the digit right - it actually reads the plate itself.

The test uses 4 different color combinations that target specific types of color blindness:
- **Type 1 & 4**: Test for Deutan (green weakness)
- **Type 2 & 3**: Test for Protan (red weakness)

Based on which types you struggle with, it calculates the likelihood of each deficiency type and generates a diagnosis.

### Mobile-Friendly Testing
- **Number Pad Interface**: Tap numbers 0-9 instead of using keyboard
- **Desktop Input**: Traditional text input with keyboard shortcuts
- **Automatic Detection**: Interface adapts to screen size
- **Progress Tracking**: Visual progress bar throughout the test


## Features

### Image Validation
- **Smart Upload Filtering**: Automatically detects and rejects non-retinal images
- **Circular Fundus Detection**: Validates presence of characteristic retinal patterns
- **Color Profile Analysis**: Ensures images match retinal scan characteristics
- **Edge Brightness Check**: Verifies typical dark background of fundus photographs
- **User-Friendly Errors**: Clear error messages guide users to upload correct image types

### Sample Images
- **8 Test Images**: Pre-loaded sample retinal images for model testing
- **Collapsible Section**: Hidden by default with content warning for medical imagery
- **One-Click Testing**: Instantly analyze samples without uploading
- **Disease Variety**: Covers normal, cataract, diabetic retinopathy, and glaucoma cases

### Mobile Optimization
- **Responsive Design**: Full functionality on phones and tablets
- **Touch-Friendly Input**: Number pad interface for color vision test on mobile
- **Network Configuration**: Supports local network access for cross-device testing
- **Mobile Navigation**: Slide-in drawer menu with all site sections
- **Adaptive Layouts**: Components automatically adjust for screen size

### User Interface
- Upload retinal images or take the interactive color vision test
- Real-time AI analysis (both models run in under a second)
- Download professional PDF reports with medical information
- Dark/light theme throughout the app
- Works on desktop and mobile
- Drag-and-drop image upload
- Interactive test interface with progress tracking

<!-- Add feature screenshots here -->

## Notes

**About the Models**: The `.keras` files aren't in the repo because they're too big for GitHub (111MB and 37MB). You'll need to download them separately to run the project.

**Training**: The Ishihara model was trained from scratch on 1,400 custom Ishihara-style images with 4 different color types. Training script is included if you want to retrain it.

**Disclaimer**: This is an educational project. Don't use it for actual medical decisions - always see a real doctor for eye health concerns.

## Datasets

This project uses the following datasets:

- **Eye Diseases Classification Dataset** by Gunavenkat Doddi  
  https://www.kaggle.com/datasets/gunavenkatdoddi/eye-diseases-classification
  
- **Ishihara Blind Test Cards** by Dušan Peljan  
  https://www.kaggle.com/datasets/dupeljan/ishihara-blind-test-cards

Thanks to the dataset creators for making these resources available!

## Contributing

Found a bug? Have an idea? Open an issue or submit a pull request.



**Activate Virtual Environment:**
```bash
# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# Windows Command Prompt
.venv\Scripts\activate.bat

# Linux/Mac
source .venv/bin/activate


#!/bin/bash

# OculusAI EC2 Deployment Script
# Run this script on your EC2 instance after connecting via SSH

set -e  # Exit on error

echo "============================================"
echo "OculusAI EC2 Deployment Script"
echo "============================================"
echo ""

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Python 3.11
echo "Installing Python 3.11..."
sudo apt install -y python3.11 python3.11-venv python3-pip git

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Clone repository
echo "Cloning OculusAI repository..."
cd ~
if [ -d "OculusAI" ]; then
    echo "OculusAI directory already exists, pulling latest changes..."
    cd OculusAI
    git pull
else
    git clone https://github.com/adityacodes-root/OculusAI.git
    cd OculusAI
fi

# Create virtual environment
echo "Creating Python virtual environment..."
python3.11 -m venv .venv
source .venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install tensorflow flask flask-cors pillow numpy

echo ""
echo "============================================"
echo "IMPORTANT: Manual Steps Required"
echo "============================================"
echo ""
echo "1. Upload your model files to this directory:"
echo "   scp -i \"your-key.pem\" eye_disease_model.keras ubuntu@$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):~/OculusAI/"
echo "   scp -i \"your-key.pem\" ishihara_digit_model.keras ubuntu@$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):~/OculusAI/"
echo ""
echo "2. Upload CBTestImages folder:"
echo "   scp -i \"your-key.pem\" -r CBTestImages ubuntu@$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):~/OculusAI/"
echo ""
echo "After uploading files, run: sudo bash ~/OculusAI/deployment/scripts/setup-services.sh"
echo ""

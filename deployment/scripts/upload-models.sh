#!/bin/bash

# Upload models and test images to EC2
# Run this from your LOCAL machine (Windows PowerShell or Git Bash)

# Usage: ./upload-models.sh your-key.pem ec2-public-ip

if [ $# -ne 2 ]; then
    echo "Usage: $0 <path-to-key.pem> <ec2-public-ip>"
    echo "Example: $0 ./my-key.pem 3.15.123.456"
    exit 1
fi

KEY_FILE=$1
EC2_IP=$2

echo "Uploading model files to EC2..."

# Upload eye disease model
echo "Uploading eye_disease_model.keras..."
scp -i "$KEY_FILE" eye_disease_model.keras ubuntu@$EC2_IP:~/OculusAI/

# Upload Ishihara model
echo "Uploading ishihara_digit_model.keras..."
scp -i "$KEY_FILE" ishihara_digit_model.keras ubuntu@$EC2_IP:~/OculusAI/

# Upload test images
echo "Uploading CBTestImages folder..."
scp -i "$KEY_FILE" -r CBTestImages ubuntu@$EC2_IP:~/OculusAI/

# Upload sample images (optional)
if [ -d "Sample_Retinal_Images" ]; then
    echo "Uploading Sample_Retinal_Images folder..."
    scp -i "$KEY_FILE" -r Sample_Retinal_Images ubuntu@$EC2_IP:~/OculusAI/
fi

echo ""
echo "Upload complete!"
echo ""
echo "Next steps:"
echo "1. SSH into EC2: ssh -i $KEY_FILE ubuntu@$EC2_IP"
echo "2. Run setup: cd OculusAI && sudo bash deployment/scripts/setup-services.sh"
echo ""

#!/bin/bash

# Setup systemd service and Nginx
# Run this AFTER uploading model files

set -e

echo "Setting up systemd service..."

# Copy systemd service file (handle both root and ubuntu user)
if [ -d "/home/ubuntu/OculusAI" ]; then
    sudo cp /home/ubuntu/OculusAI/deployment/systemd/oculusai.service /etc/systemd/system/
else
    sudo cp ~/OculusAI/deployment/systemd/oculusai.service /etc/systemd/system/
fi

# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable oculusai
sudo systemctl start oculusai

# Check status
echo "Service status:"
sudo systemctl status oculusai --no-pager

echo ""
echo "Setting up Nginx..."

# Copy Nginx configuration
if [ -d "/home/ubuntu/OculusAI" ]; then
    sudo cp /home/ubuntu/OculusAI/deployment/nginx/oculusai.conf /etc/nginx/sites-available/oculusai
else
    sudo cp ~/OculusAI/deployment/nginx/oculusai.conf /etc/nginx/sites-available/oculusai
fi

# Get EC2 public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Update Nginx config with actual IP
sudo sed -i "s/YOUR_DOMAIN_OR_IP/$PUBLIC_IP/" /etc/nginx/sites-available/oculusai

# Enable site
sudo ln -sf /etc/nginx/sites-available/oculusai /etc/nginx/sites-enabled/

# Remove default site
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

echo ""
echo "============================================"
echo "Deployment Complete!"
echo "============================================"
echo ""
echo "Backend API: http://$PUBLIC_IP"
echo ""
echo "Test the API:"
echo "curl http://$PUBLIC_IP"
echo ""
echo "View logs:"
echo "sudo journalctl -u oculusai -f"
echo ""

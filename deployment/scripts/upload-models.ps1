# Upload models and test images to EC2 from Windows PowerShell
# Run this from your LOCAL machine

param(
    [Parameter(Mandatory=$true)]
    [string]$KeyFile,
    
    [Parameter(Mandatory=$true)]
    [string]$EC2_IP
)

Write-Host "Uploading model files to EC2..." -ForegroundColor Green
Write-Host ""

# Upload eye disease model
Write-Host "Uploading eye_disease_model.keras..." -ForegroundColor Yellow
scp -i $KeyFile eye_disease_model.keras ubuntu@${EC2_IP}:~/OculusAI/

# Upload Ishihara model
Write-Host "Uploading ishihara_digit_model.keras..." -ForegroundColor Yellow
scp -i $KeyFile ishihara_digit_model.keras ubuntu@${EC2_IP}:~/OculusAI/

# Upload test images
Write-Host "Uploading CBTestImages folder..." -ForegroundColor Yellow
scp -i $KeyFile -r CBTestImages ubuntu@${EC2_IP}:~/OculusAI/

# Upload sample images (optional)
if (Test-Path "Sample_Retinal_Images") {
    Write-Host "Uploading Sample_Retinal_Images folder..." -ForegroundColor Yellow
    scp -i $KeyFile -r Sample_Retinal_Images ubuntu@${EC2_IP}:~/OculusAI/
}

Write-Host ""
Write-Host "Upload complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. SSH into EC2: ssh -i $KeyFile ubuntu@$EC2_IP"
Write-Host "2. Run setup: cd OculusAI && sudo bash deployment/scripts/setup-services.sh"
Write-Host ""

'use client'

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PDFReportGeneratorProps {
  result: {
    primaryDiagnosis: string
    confidence: number
    severity: string
    findings: Array<{
      condition: string
      severity: string
      confidence: number
    }>
    recommendation: string
    description?: string
    symptoms?: string[]
  }
  imageUrl?: string
}

// Comprehensive medical information for each condition
const medicalInfo: Record<string, {
  fullName: string
  overview: string
  causes: string[]
  riskFactors: string[]
  progression: string
  treatment: string[]
  prevention: string[]
  followUp: string
}> = {
  'Cataract': {
    fullName: 'Cataract',
    overview: 'A clouding of the normally clear lens of the eye, leading to decreased vision. Cataracts are the leading cause of blindness worldwide but are treatable with surgery.',
    causes: [
      'Age-related protein breakdown and clumping in the lens',
      'Oxidative stress from UV exposure and free radicals',
      'Trauma or injury to the eye',
      'Certain medications (especially long-term corticosteroids)',
      'Radiation exposure'
    ],
    riskFactors: ['Age over 60 years', 'Diabetes mellitus', 'Excessive UV light exposure', 'Smoking and alcohol use', 'High blood pressure', 'Obesity', 'Previous eye injury or surgery', 'Prolonged corticosteroid use', 'Family history of cataracts'],
    progression: 'Cataracts typically develop slowly over years. Early stages may not affect vision significantly, but as the cataract matures, it causes progressive vision loss that cannot be corrected with glasses.',
    treatment: [
      'Phacoemulsification cataract surgery (gold standard)',
      'Intraocular lens (IOL) implantation after cataract removal',
      'Updated eyeglass prescription in early stages',
      'Improved lighting and magnification for reading',
      'Surgery is indicated when vision loss interferes with daily activities'
    ],
    prevention: ['Wear UV-protective sunglasses', 'Quit smoking', 'Manage diabetes and blood pressure', 'Maintain healthy diet rich in antioxidants', 'Regular eye examinations', 'Limit alcohol consumption'],
    followUp: 'Schedule comprehensive eye exam every 1-2 years if early cataract detected. If vision significantly impaired, consult ophthalmologist for surgical evaluation.'
  },
  'Glaucoma': {
    fullName: 'Glaucoma',
    overview: 'A group of eye diseases causing progressive damage to the optic nerve, often associated with elevated intraocular pressure. Leading cause of irreversible blindness worldwide.',
    causes: [
      'Elevated intraocular pressure damaging optic nerve fibers',
      'Poor blood flow to the optic nerve',
      'Genetic predisposition affecting aqueous humor drainage',
      'Structural abnormalities in the drainage angle'
    ],
    riskFactors: ['Age over 60 years', 'Family history of glaucoma', 'High intraocular pressure', 'African, Hispanic, or Asian ancestry', 'Thin corneas', 'Diabetes', 'Hypertension', 'Severe myopia (nearsightedness)', 'Previous eye injury or surgery', 'Long-term corticosteroid use'],
    progression: 'Often called "silent thief of sight" as vision loss is gradual and painless. Peripheral vision is lost first, progressing to tunnel vision and eventual blindness if untreated.',
    treatment: [
      'Prescription eye drops to lower intraocular pressure (prostaglandin analogs, beta-blockers, alpha agonists)',
      'Laser trabeculoplasty to improve drainage',
      'Minimally invasive glaucoma surgery (MIGS)',
      'Trabeculectomy or drainage device implantation for advanced cases',
      'Lifelong treatment and monitoring required'
    ],
    prevention: ['Regular comprehensive eye exams with tonometry', 'Early detection through screening', 'Exercise regularly to lower eye pressure', 'Protective eyewear to prevent trauma', 'Manage systemic conditions'],
    followUp: 'Urgent ophthalmology referral within 1 week. Regular follow-up every 3-6 months with visual field testing and OCT to monitor optic nerve.'
  },
  'Diabetic Retinopathy': {
    fullName: 'Diabetic Retinopathy',
    overview: 'A diabetes complication affecting the blood vessels in the retina, potentially leading to vision loss if untreated.',
    causes: [
      'Chronic high blood sugar levels damage retinal blood vessels',
      'Long duration of diabetes increases risk',
      'Poor blood sugar control accelerates progression'
    ],
    riskFactors: ['Type 1 or Type 2 diabetes', 'Poor glycemic control (high HbA1c)', 'High blood pressure', 'High cholesterol', 'Pregnancy', 'Tobacco use'],
    progression: 'Typically progresses through stages: mild non-proliferative, moderate non-proliferative, severe non-proliferative, and proliferative diabetic retinopathy.',
    treatment: [
      'Strict blood sugar control (target HbA1c < 7%)',
      'Anti-VEGF injections for macular edema',
      'Laser photocoagulation therapy',
      'Vitrectomy surgery in advanced cases',
      'Blood pressure and cholesterol management'
    ],
    prevention: ['Maintain optimal blood glucose levels', 'Regular HbA1c monitoring', 'Annual dilated eye exams', 'Control blood pressure (<140/90 mmHg)', 'Healthy diet and exercise'],
    followUp: 'Schedule comprehensive dilated eye exam every 6-12 months, or more frequently if proliferative changes detected.'
  },
  'Microaneurysms': {
    fullName: 'Retinal Microaneurysms',
    overview: 'Small balloon-like outpouchings of retinal capillaries, often the earliest clinical sign of diabetic retinopathy.',
    causes: [
      'Weakening of capillary walls due to hyperglycemia',
      'Pericyte loss in retinal blood vessels',
      'Chronic diabetes-related vascular damage'
    ],
    riskFactors: ['Diabetes duration > 5 years', 'Poor glycemic control', 'Hypertension', 'Dyslipidemia'],
    progression: 'May remain stable or progress to more severe retinopathy with hemorrhages and exudates.',
    treatment: [
      'Optimize diabetes management',
      'Regular monitoring without immediate intervention if isolated',
      'Address underlying metabolic factors',
      'Consider laser treatment if progressing'
    ],
    prevention: ['Intensive diabetes management', 'Regular ophthalmologic screening', 'Lifestyle modifications'],
    followUp: 'Follow-up examination in 6-12 months to monitor for progression.'
  },
  'Hard Exudates': {
    fullName: 'Retinal Hard Exudates',
    overview: 'Yellowish lipid deposits in the retina resulting from leakage of lipoproteins through damaged blood vessels.',
    causes: [
      'Breakdown of blood-retinal barrier',
      'Leakage from damaged microaneurysms',
      'Accumulation of lipids and proteins in retinal layers'
    ],
    riskFactors: ['Diabetic retinopathy', 'Hypertensive retinopathy', 'Hyperlipidemia', 'Macular edema'],
    progression: 'Can cause permanent vision loss if located in or near the macula (center of vision).',
    treatment: [
      'Control underlying systemic conditions',
      'Manage dyslipidemia with statins',
      'Anti-VEGF therapy for associated macular edema',
      'Focal laser photocoagulation for clinically significant macular edema',
      'Monitor and treat diabetic retinopathy'
    ],
    prevention: ['Lipid management (LDL < 100 mg/dL)', 'Blood sugar control', 'Regular retinal examinations'],
    followUp: 'Reassess in 3-6 months; more frequent if macular involvement or vision changes.'
  },
  'Retinal Thickening': {
    fullName: 'Diabetic Macular Edema (DME)',
    overview: 'Swelling of the macula caused by fluid accumulation, leading to blurred central vision.',
    causes: [
      'Breakdown of blood-retinal barrier',
      'Fluid leakage from damaged retinal vessels',
      'Inflammatory mediators (VEGF) increase permeability'
    ],
    riskFactors: ['Advanced diabetic retinopathy', 'Poorly controlled diabetes', 'Hypertension', 'Hyperlipidemia', 'Pregnancy'],
    progression: 'Leading cause of vision loss in diabetic patients; can become chronic without treatment.',
    treatment: [
      'Intravitreal anti-VEGF injections (first-line)',
      'Intravitreal corticosteroid implants',
      'Focal/grid laser photocoagulation',
      'Vitrectomy in refractory cases',
      'Optimize systemic glycemic and blood pressure control'
    ],
    prevention: ['Strict diabetes control', 'Early detection through OCT imaging', 'Prompt treatment initiation'],
    followUp: 'Monthly follow-up during active treatment; OCT monitoring to assess response.'
  },
  'Optic Disc Abnormality': {
    fullName: 'Optic Disc Pathology',
    overview: 'Structural or vascular changes to the optic nerve head, potentially indicating various ocular or systemic conditions.',
    causes: [
      'Glaucomatous damage',
      'Ischemic optic neuropathy',
      'Papilledema (increased intracranial pressure)',
      'Optic neuritis or inflammation'
    ],
    riskFactors: ['Glaucoma', 'Cardiovascular disease', 'Diabetes', 'Hypertension', 'Neurological conditions'],
    progression: 'Depends on underlying cause; may lead to irreversible vision loss if untreated.',
    treatment: [
      'Identify underlying etiology through comprehensive evaluation',
      'Intraocular pressure management for glaucoma',
      'Neuroimaging if papilledema suspected',
      'Treat underlying systemic conditions',
      'Consider neuroprotective strategies'
    ],
    prevention: ['Regular comprehensive eye exams', 'Glaucoma screening', 'Cardiovascular risk management'],
    followUp: 'Urgent ophthalmology referral within 1-2 weeks for detailed assessment and visual field testing.'
  },
  'Normal': {
    fullName: 'Normal Retinal Examination',
    overview: 'No significant abnormalities detected. Retinal vasculature, optic disc, and macula appear healthy.',
    causes: [],
    riskFactors: [],
    progression: 'Maintain current healthy status through preventive care.',
    treatment: [],
    prevention: ['Continue regular eye exams', 'Maintain healthy lifestyle', 'Protect eyes from UV exposure', 'Manage systemic health conditions'],
    followUp: 'Routine eye examination annually, or as recommended by your eye care provider.'
  }
}

export function PDFReportGenerator({ result, imageUrl }: PDFReportGeneratorProps) {
  const generatePDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    let yPosition = margin
    let pageNumber = 1

    // Get medical info for the diagnosis
    const info = medicalInfo[result.primaryDiagnosis] || {
      fullName: result.primaryDiagnosis,
      overview: result.description || 'An eye condition requiring professional medical evaluation.',
      causes: ['Various factors may contribute to this condition'],
      riskFactors: ['Age', 'Family history', 'Lifestyle factors', 'Underlying health conditions'],
      progression: 'Progression varies by individual. Professional monitoring recommended.',
      treatment: ['Consult with an ophthalmologist for personalized treatment plan'],
      prevention: ['Regular eye examinations', 'Healthy lifestyle', 'UV protection'],
      followUp: 'Schedule comprehensive eye examination with an ophthalmologist within 2-4 weeks.'
    }

    // Helper function to add text with word wrap
    const addText = (text: string, size: number, bold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
      pdf.setFontSize(size)
      pdf.setFont('helvetica', bold ? 'bold' : 'normal')
      pdf.setTextColor(...color)
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      pdf.text(lines, margin, yPosition)
      yPosition += (lines.length * size * 0.35) + 3
    }

    const addBulletPoint = (text: string, size: number = 9, indent: number = 5) => {
      pdf.setFontSize(size)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin - indent)
      pdf.text('•', margin + 2, yPosition)
      pdf.text(lines, margin + indent, yPosition)
      yPosition += (lines.length * size * 0.35) + 2
    }

    const addSectionHeader = (title: string, icon: string = '') => {
      checkPageBreak(20)
      pdf.setFillColor(245, 245, 250)
      pdf.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 12, 'F')
      
      // Draw a colored circle for visual interest instead of emoji
      if (icon) {
        pdf.setFillColor(90, 70, 170)
        pdf.circle(margin + 2, yPosition, 1.5, 'F')
      }
      
      pdf.setFontSize(13)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(90, 70, 170)
      pdf.text(title, margin + (icon ? 6 : 0), yPosition + 2)
      yPosition += 12
    }

    const addFooter = () => {
      const footerY = pageHeight - 10
      pdf.setFontSize(7)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`OculusAI Retinal Analysis Report - Confidential Medical Document`, margin, footerY)
      pdf.text(`Page ${pageNumber}`, pageWidth - margin - 15, footerY)
    }

    const checkPageBreak = (requiredSpace: number) => {
      if (yPosition + requiredSpace > pageHeight - 20) {
        addFooter()
        pdf.addPage()
        pageNumber++
        yPosition = margin + 10
      }
    }

    // Header
    pdf.setFillColor(90, 70, 170)
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(26)
    pdf.setFont('helvetica', 'bold')
    pdf.text('OculusAI', margin, 18)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Comprehensive Retinal Analysis Report', margin, 28)
    
    // Date and Report ID
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    const reportId = `OAI-${Date.now().toString().slice(-8)}`
    pdf.setFontSize(8)
    pdf.text(date, pageWidth - margin - pdf.getTextWidth(date), 24)
    pdf.text(`Report ID: ${reportId}`, pageWidth - margin - pdf.getTextWidth(`Report ID: ${reportId}`), 32)
    
    yPosition = 50

    // Executive Summary Box
    checkPageBreak(45)
    pdf.setFillColor(250, 250, 255)
    pdf.setDrawColor(90, 70, 170)
    pdf.setLineWidth(0.5)
    pdf.rect(margin - 3, yPosition - 3, pageWidth - 2 * margin + 6, 40, 'FD')
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(90, 70, 170)
    pdf.text('EXECUTIVE SUMMARY', margin, yPosition + 3)
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 60)
    const summaryText = `AI Analysis has identified: ${result.primaryDiagnosis} with ${result.confidence}% confidence level. Severity: ${result.severity}. ${result.findings.length} key findings documented.`
    const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - 2 * margin - 6)
    pdf.text(summaryLines, margin, yPosition + 12)
    yPosition += 45

    // Patient Image Section (if available)
    if (imageUrl) {
      try {
        checkPageBreak(85)
        addSectionHeader('Retinal Fundus Image', '•')
        
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = imageUrl
        
        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = reject
        })
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
        
        const imgData = canvas.toDataURL('image/jpeg', 0.85)
        const imgWidth = 85
        const imgHeight = (img.height / img.width) * imgWidth
        
        // Center the image
        const imgX = (pageWidth - imgWidth) / 2
        pdf.addImage(imgData, 'JPEG', imgX, yPosition, imgWidth, imgHeight)
        
        // Add border around image
        pdf.setDrawColor(200, 200, 200)
        pdf.setLineWidth(0.5)
        pdf.rect(imgX, yPosition, imgWidth, imgHeight, 'S')
        
        yPosition += imgHeight + 8
        
        pdf.setFontSize(8)
        pdf.setTextColor(120, 120, 120)
        pdf.text('Image analyzed using deep learning convolutional neural networks', margin, yPosition)
        yPosition += 10
      } catch (error) {
        console.error('Error adding image to PDF:', error)
      }
    }

    // Primary Diagnosis Section
    checkPageBreak(50)
    addSectionHeader('Primary Diagnosis', '•')
    
    pdf.setFillColor(240, 245, 255)
    pdf.rect(margin - 3, yPosition - 3, pageWidth - 2 * margin + 6, 42, 'F')
    
    pdf.setFontSize(15)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(40, 40, 40)
    pdf.text(info.fullName, margin, yPosition + 4)
    
    yPosition += 12
    
    // Confidence meter visualization
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(80, 80, 80)
    pdf.text(`Confidence Level: ${result.confidence}%`, margin, yPosition)
    pdf.text(`Severity: ${result.severity}`, margin + 60, yPosition)
    
    yPosition += 6
    
    // Draw confidence bar
    const barWidth = 100
    const barHeight = 6
    pdf.setFillColor(230, 230, 230)
    pdf.rect(margin, yPosition, barWidth, barHeight, 'F')
    
    let barColor: [number, number, number] = [76, 175, 80] // Green
    if (result.confidence >= 60 && result.confidence < 80) {
      barColor = [255, 152, 0] // Orange
    } else if (result.confidence < 60) {
      barColor = [244, 67, 54] // Red
    }
    
    pdf.setFillColor(...barColor)
    pdf.rect(margin, yPosition, (barWidth * result.confidence) / 100, barHeight, 'F')
    
    yPosition += 12
    
    if (info.overview) {
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const overviewLines = pdf.splitTextToSize(info.overview, pageWidth - 2 * margin - 6)
      pdf.text(overviewLines, margin, yPosition)
      yPosition += overviewLines.length * 3.5 + 8
    } else if (result.description) {
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const descLines = pdf.splitTextToSize(result.description, pageWidth - 2 * margin - 6)
      pdf.text(descLines, margin, yPosition)
      yPosition += descLines.length * 3.5 + 8
    }
    
    yPosition += 3

    // Clinical Findings Section
    checkPageBreak(40)
    addSectionHeader('Detailed Clinical Findings', '•')
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(80, 80, 80)
    pdf.text(`${result.findings.length} findings identified and analyzed:`, margin, yPosition)
    yPosition += 8
    
    result.findings.forEach((finding, index) => {
      checkPageBreak(28)
      
      // Color-coded based on severity
      let severityColor: [number, number, number] = [76, 175, 80] // Green
      let bgColor: [number, number, number] = [232, 245, 233]
      if (finding.severity === 'Present' || finding.severity === 'Moderate') {
        severityColor = [255, 152, 0] // Orange
        bgColor = [255, 243, 224]
      } else if (finding.severity === 'Severe' || finding.severity === 'High') {
        severityColor = [244, 67, 54] // Red
        bgColor = [255, 235, 238]
      }
      
      pdf.setFillColor(...bgColor)
      pdf.rect(margin - 2, yPosition - 4, pageWidth - 2 * margin + 4, 20, 'F')
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(40, 40, 40)
      pdf.text(`${index + 1}. ${finding.condition}`, margin, yPosition)
      
      yPosition += 6
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(...severityColor)
      pdf.text(`Severity: ${finding.severity}`, margin + 5, yPosition)
      pdf.text(`|`, margin + 35, yPosition)
      pdf.text(`Confidence: ${finding.confidence}%`, margin + 40, yPosition)
      
      // Mini confidence bar
      const miniBarWidth = 30
      const miniBarHeight = 2.5 
      yPosition += 4
      pdf.setFillColor(220, 220, 220)
      pdf.rect(margin + 5, yPosition, miniBarWidth, miniBarHeight, 'F')
      pdf.setFillColor(...severityColor)
      pdf.rect(margin + 5, yPosition, (miniBarWidth * finding.confidence) / 100, miniBarHeight, 'F')
      
      yPosition += 9
    })
    
    yPosition += 5

    // Medical Context Section
    if (info.causes && info.causes.length > 0) {
      checkPageBreak(45)
      addSectionHeader('Pathophysiology & Causes', '•')
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text('Understanding the underlying mechanisms:', margin, yPosition)
      yPosition += 6
      
      info.causes.forEach(cause => {
        checkPageBreak(10)
        addBulletPoint(cause, 9)
      })
      yPosition += 3
    }

    // Risk Factors Section
    if (info.riskFactors && info.riskFactors.length > 0) {
      checkPageBreak(40)
      addSectionHeader('Risk Factors', '•')
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text('Key factors that may contribute to this condition:', margin, yPosition)
      yPosition += 6
      
      info.riskFactors.forEach(factor => {
        checkPageBreak(10)
        addBulletPoint(factor, 9)
      })
      yPosition += 3
    }

    // Progression Information
    if (info.progression) {
      checkPageBreak(30)
      addSectionHeader('Disease Progression', '•')
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const progLines = pdf.splitTextToSize(info.progression, pageWidth - 2 * margin)
      pdf.text(progLines, margin, yPosition)
      yPosition += progLines.length * 3.5 + 8
    }

    // Treatment Options Section
    if (info.treatment && info.treatment.length > 0) {
      checkPageBreak(50)
      addSectionHeader('Treatment Options', '•')
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text('Evidence-based treatment approaches:', margin, yPosition)
      yPosition += 6
      
      info.treatment.forEach(treatment => {
        checkPageBreak(10)
        addBulletPoint(treatment, 9)
      })
      yPosition += 3
    }

    // Prevention Strategies
    if (info.prevention && info.prevention.length > 0) {
      checkPageBreak(40)
      addSectionHeader('Prevention & Management', '•')
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text('Proactive measures to maintain eye health:', margin, yPosition)
      yPosition += 6
      
      info.prevention.forEach(prevention => {
        checkPageBreak(10)
        addBulletPoint(prevention, 9)
      })
      yPosition += 3
    }

    // Symptoms Section
    if (result.symptoms && Array.isArray(result.symptoms) && result.symptoms.length > 0) {
      checkPageBreak(35)
      addSectionHeader('Common Symptoms', '•')
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text('Watch for these signs and symptoms:', margin, yPosition)
      yPosition += 6
      
      result.symptoms.forEach(symptom => {
        checkPageBreak(10)
        addBulletPoint(symptom, 9)
      })
      yPosition += 3
    }

    // Recommendation Section
    checkPageBreak(45)
    addSectionHeader('Clinical Recommendations', '•')
    
    pdf.setFillColor(255, 248, 225)
    pdf.setDrawColor(255, 193, 7)
    pdf.setLineWidth(0.8)
    pdf.rect(margin - 3, yPosition - 3, pageWidth - 2 * margin + 6, 35, 'FD')
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(230, 81, 0)
    pdf.text('Immediate Action Required:', margin, yPosition + 3)
    
    yPosition += 9
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 60)
    const recLines = pdf.splitTextToSize(result.recommendation, pageWidth - 2 * margin - 6)
    pdf.text(recLines, margin, yPosition)
    yPosition += recLines.length * 3.5 + 12
    
    // Follow-up Information
    if (info.followUp) {
      checkPageBreak(25)
      pdf.setFillColor(232, 245, 233)
      pdf.setDrawColor(76, 175, 80)
      pdf.setLineWidth(0.5)
      pdf.rect(margin - 3, yPosition - 3, pageWidth - 2 * margin + 6, 20, 'FD')
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(56, 142, 60)
      pdf.text('Follow-Up Schedule:', margin, yPosition + 3)
      
      yPosition += 9
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const followUpLines = pdf.splitTextToSize(info.followUp, pageWidth - 2 * margin - 6)
      pdf.text(followUpLines, margin, yPosition)
      yPosition += followUpLines.length * 3.5 + 12
    }

    // Next Steps Section
    checkPageBreak(45)
    addSectionHeader('Next Steps', '•')
    
    const nextSteps = [
      'Schedule an appointment with an ophthalmologist for comprehensive examination',
      'Bring this report and any previous eye exam records to your appointment',
      'Document any changes in vision or new symptoms before your visit',
      'Continue any prescribed medications and follow current treatment plans',
      'Avoid self-medication and over-the-counter treatments without professional guidance'
    ]
    
    nextSteps.forEach((step, idx) => {
      checkPageBreak(12)
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text(`${idx + 1}.`, margin, yPosition)
      const stepLines = pdf.splitTextToSize(step, pageWidth - 2 * margin - 8)
      pdf.text(stepLines, margin + 6, yPosition)
      yPosition += stepLines.length * 3.5 + 3
    })
    
    yPosition += 5
    
    // Important Notes
    checkPageBreak(40)
    addSectionHeader('Important Notes', '•')
    
    pdf.setFillColor(227, 242, 253)
    pdf.rect(margin - 3, yPosition - 3, pageWidth - 2 * margin + 6, 35, 'F')
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(70, 70, 70)
    const notes = [
      '• This AI analysis uses advanced machine learning trained on thousands of clinical images',
      '• Results should be confirmed by a qualified ophthalmologist through clinical examination',
      '• Early detection significantly improves treatment outcomes',
      '• Keep a copy of this report for your medical records'
    ]
    
    notes.forEach(note => {
      const noteLines = pdf.splitTextToSize(note, pageWidth - 2 * margin - 6)
      pdf.text(noteLines, margin, yPosition)
      yPosition += noteLines.length * 3 + 2
    })
    
    yPosition += 10
    
    // Disclaimer Section
    checkPageBreak(45)
    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 8
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(120, 120, 120)
    pdf.text('Medical Disclaimer', margin, yPosition)
    yPosition += 6
    
    pdf.setFontSize(8)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(130, 130, 130)
    const disclaimer = 'This report is generated by an AI-powered system and is intended for informational purposes only. It should not be considered as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay seeking it because of information provided in this report. The AI analysis has been trained on clinical data but requires validation by a licensed healthcare professional. OculusAI and its developers are not responsible for any actions taken based on this report without proper medical consultation.'
    const disclaimerLines = pdf.splitTextToSize(disclaimer, pageWidth - 2 * margin)
    pdf.text(disclaimerLines, margin, yPosition)
    yPosition += disclaimerLines.length * 3 + 8
    
    // Add footer to last page
    addFooter()

    // Save the PDF
    const fileName = `OculusAI_Report_${result.primaryDiagnosis.replace(/\s+/g, '_')}_${date.replace(/\s+/g, '_')}.pdf`
    pdf.save(fileName)
  }

  return (
    <Button 
      onClick={generatePDF}
      className="bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth flex items-center gap-2"
    >
      <Download className="w-4 h-4" />
      <span>Download PDF Report</span>
    </Button>
  )
}

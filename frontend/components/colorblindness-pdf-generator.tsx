'use client'

import { jsPDF } from 'jspdf'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TypeAnalysis {
  error_percentage: number
  normal_percentage: number
  mistakes: number
  total: number
}

interface Diagnosis {
  status: string
  severity: string
  type: string | null
  confidence: string
  deutan_likelihood: number
  protan_likelihood: number
  summary: string
  recommendation: string
  details: string[]
}

interface ColorBlindnessPDFProps {
  result: {
    overall_accuracy: number
    total_correct: number
    total_questions: number
    type_analysis: Record<number, TypeAnalysis>
    diagnosis: Diagnosis
  }
}

const colorTypeInfo: Record<number, { name: string; description: string; fullDescription: string }> = {
  1: { 
    name: 'Type 1 - Green/Orange Background',
    description: 'Tests for Deuteranomaly (green weakness)',
    fullDescription: 'This color type uses green backgrounds with orange digits to specifically test for deuteranomaly, the most common form of color vision deficiency affecting the green cone cells in the retina.'
  },
  2: { 
    name: 'Type 2 - Orange/Green Background',
    description: 'Tests for Protanomaly (red weakness)',
    fullDescription: 'This color type uses orange backgrounds with green digits to test for protanomaly, a condition where red cone cells have reduced sensitivity, making it difficult to distinguish red from green hues.'
  },
  3: { 
    name: 'Type 3 - Gray/Red Background',
    description: 'Tests for Protanopia (red blindness)',
    fullDescription: 'This color type uses grayscale backgrounds with red or pink digits to detect protanopia, a more severe form where red cone cells are absent, causing complete inability to perceive red wavelengths.'
  },
  4: { 
    name: 'Type 4 - Yellow/Green Background',
    description: 'Tests for Deuteranopia (green blindness)',
    fullDescription: 'This color type uses yellow-orange backgrounds with green digits to identify deuteranopia, where green cone cells are completely absent, resulting in inability to distinguish green from red and reduced overall color perception.'
  }
}

const deficiencyInfo: Record<string, {
  fullName: string
  overview: string
  types: string[]
  inheritance: string
  prevalence: string
  symptoms: string[]
  impact: string[]
  management: string[]
  resources: string[]
}> = {
  'Deutan': {
    fullName: 'Deuteranomaly/Deuteranopia (Green Color Deficiency)',
    overview: 'Deutan color vision deficiencies affect the green (medium-wavelength) cone cells in the retina. This is the most common form of color blindness, affecting approximately 5% of males and 0.4% of females.',
    types: [
      'Deuteranomaly (Mild): Reduced green sensitivity, can still perceive green but with difficulty',
      'Deuteranopia (Severe): Complete absence of green cone cells, cannot distinguish red from green'
    ],
    inheritance: 'X-linked recessive inheritance pattern. Males are more commonly affected as they have only one X chromosome. Females can be carriers and may have mild symptoms.',
    prevalence: 'Affects 1 in 20 males (5%) and 1 in 250 females (0.4%) of European descent. Prevalence varies by ethnicity.',
    symptoms: [
      'Difficulty distinguishing between red, green, orange, and brown',
      'Confusion between green and brown or green and gray',
      'Problems identifying ripe fruit or traffic lights',
      'Difficulty with color-coded information (maps, charts)',
      'Colors may appear less vibrant or "washed out"'
    ],
    impact: [
      'Career limitations in fields requiring accurate color perception (aviation, electrical work, design)',
      'Educational challenges with color-coded learning materials',
      'Daily life inconveniences (clothing coordination, cooking)',
      'Reduced ability to interpret digital displays and signals'
    ],
    management: [
      'Color-correcting glasses or contact lenses (EnChroma, Pilestone)',
      'Digital assistive apps for color identification',
      'Use of patterns and textures instead of color alone',
      'Proper lighting and contrast enhancement',
      'Informing employers and educators about the condition',
      'Learning alternative cues (position of traffic lights, labeling)'
    ],
    resources: [
      'Consult an optometrist or ophthalmologist for confirmation',
      'Color blindness support organizations and communities',
      'Accessibility features in digital devices and software',
      'Professional career counseling if needed'
    ]
  },
  'Protan': {
    fullName: 'Protanomaly/Protanopia (Red Color Deficiency)',
    overview: 'Protan color vision deficiencies affect the red (long-wavelength) cone cells in the retina. This is the second most common form of color blindness, affecting approximately 1% of males.',
    types: [
      'Protanomaly (Mild): Reduced red sensitivity, perceives red as darker and less vibrant',
      'Protanopia (Severe): Complete absence of red cone cells, cannot perceive red wavelengths'
    ],
    inheritance: 'X-linked recessive inheritance pattern. Predominantly affects males due to the single X chromosome. Female carriers typically have normal or near-normal vision.',
    prevalence: 'Affects 1 in 100 males (1%) and 1 in 10,000 females (0.01%). Less common than deutan deficiencies.',
    symptoms: [
      'Difficulty distinguishing between red, orange, yellow, and green',
      'Red appears dark or black, may confuse with brown or green',
      'Problems seeing red text on black backgrounds',
      'Difficulty with brake lights and traffic signals',
      'Reduced brightness perception in the red spectrum'
    ],
    impact: [
      'Safety concerns in driving (red brake lights less visible)',
      'Occupational restrictions in transportation, military, and emergency services',
      'Challenges in medical fields (interpreting blood tests, skin conditions)',
      'Difficulty with electronic device indicators (red LEDs)',
      'Art and design career limitations'
    ],
    management: [
      'Specialized color-filtering lenses for enhanced red perception',
      'High-contrast displays and brightness adjustments',
      'Reliance on luminance cues rather than hue',
      'Use of color identifier apps and tools',
      'Home and workplace accommodations',
      'Education about condition for family and colleagues'
    ],
    resources: [
      'Comprehensive eye examination for accurate diagnosis',
      'Genetic counseling for family planning',
      'Assistive technology and accessibility tools',
      'Support groups and online communities'
    ]
  },
  'Red-Green': {
    fullName: 'Red-Green Colorblindness (Combined Protan-Deutan Deficiency)',
    overview: 'Red-Green colorblindness is a combined color vision deficiency affecting both red (long-wavelength) and green (medium-wavelength) cone cells. This represents a more comprehensive color perception challenge, as individuals experience difficulty with both the red and green portions of the visible spectrum. This combined deficiency affects approximately 1-2% of males who show signs of both types.',
    types: [
      'Combined Protanomaly-Deuteranomaly (Moderate): Reduced sensitivity in both red and green cone cells, making color discrimination very challenging',
      'Combined Protanopia-Deuteranopia (Severe): Absence or severe dysfunction of both red and green cone cells, resulting in very limited color perception',
      'Asymmetric Pattern: One deficiency may be stronger than the other, but both are present above clinical thresholds'
    ],
    inheritance: 'X-linked recessive inheritance for both conditions. Having both deficiencies is rare but possible, especially if inherited from both parents or through compound genetic variations. This can occur when an individual inherits different mutations affecting both the OPN1LW (red) and OPN1MW (green) genes.',
    prevalence: 'Rare - affects approximately 1-2% of males with colorblindness (about 0.05-0.1% of total male population). Extremely rare in females. More common in populations with higher rates of consanguinity or in isolated genetic populations.',
    symptoms: [
      'Severe difficulty distinguishing between red, green, orange, yellow, and brown',
      'World appears primarily in shades of blue, yellow, and gray',
      'Extreme difficulty with traffic lights (may rely entirely on position)',
      'Cannot distinguish most colored objects without non-color cues',
      'Significant challenges with color-coded systems and interfaces',
      'Difficulty identifying ripe fruit, cooked meat, or safety signals',
      'May confuse blue and purple, yellow and white in certain lighting'
    ],
    impact: [
      'Major career restrictions in fields requiring color discrimination (aviation, military, electrical work, graphic design, medical diagnostics)',
      'Significant safety concerns in driving and navigation',
      'Educational barriers with color-coded materials and visual learning',
      'Social challenges (clothing coordination, art appreciation, games)',
      'Difficulty with digital interfaces and modern technology',
      'Challenges in emergency situations recognizing warning colors',
      'Limited independence in tasks requiring color identification'
    ],
    management: [
      'Specialized color-correcting glasses (EnChroma, Pilestone) - effectiveness varies',
      'High-contrast displays and accessibility features on all devices',
      'Mobile apps for real-time color identification (Color Blind Pal, Seeing AI)',
      'Reliance on brightness, texture, pattern, and position instead of color',
      'Label makers and organizational systems using text/symbols',
      'Smart home devices with non-color notifications (vibration, sound)',
      'Workplace accommodations and assistive technologies',
      'Family and friends education about the condition',
      'Professional orientation and mobility training if needed'
    ],
    resources: [
      'Comprehensive genetic testing and counseling',
      'Low vision specialist consultation',
      'Occupational therapy for adaptive strategies',
      'Accessibility technology specialists',
      'Colorblindness advocacy organizations',
      'Educational support services and accommodations',
      'Regular monitoring by ophthalmologist'
    ]
  }
}

export function ColorBlindnessPDFGenerator({ result }: ColorBlindnessPDFProps) {
  const generatePDF = () => {
    const pdf = new jsPDF()
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    let yPosition = margin + 10
    let pageNumber = 1

    // Helper functions
    const addText = (text: string, size: number, bold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
      pdf.setFontSize(size)
      pdf.setFont('helvetica', bold ? 'bold' : 'normal')
      pdf.setTextColor(color[0], color[1], color[2])
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin)
      pdf.text(lines, margin, yPosition)
      yPosition += (lines.length * size * 0.35) + 3
    }

    const addBulletPoint = (text: string, size: number = 9, indent: number = 5) => {
      checkPageBreak(10)
      pdf.setFontSize(size)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin - indent)
      pdf.circle(margin + 2, yPosition - 1, 0.8, 'F')
      pdf.text(lines, margin + indent, yPosition)
      yPosition += (lines.length * size * 0.35) + 2
    }

    const addSectionHeader = (title: string) => {
      checkPageBreak(20)
      pdf.setFillColor(245, 245, 250)
      pdf.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 12, 'F')
      
      pdf.setFillColor(99, 102, 241)
      pdf.circle(margin + 2, yPosition, 1.5, 'F')
      
      pdf.setFontSize(13)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(99, 102, 241)
      pdf.text(title, margin + 6, yPosition + 2)
      yPosition += 12
    }

    const addFooter = () => {
      const footerY = pageHeight - 10
      pdf.setFontSize(7)
      pdf.setTextColor(150, 150, 150)
      pdf.text(`OculusAI Colour Vision Assessment Report - Confidential Document`, margin, footerY)
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

    // ========== PAGE 1: HEADER AND DIAGNOSIS ==========
    // Header Background
    pdf.setFillColor(99, 102, 241)
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(26)
    pdf.setFont('helvetica', 'bold')
    pdf.text('OculusAI', margin, 18)
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Comprehensive Colour Vision Assessment Report', margin, 28)
    
    // Date and Report ID
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    const reportId = `CVT-${Date.now().toString().slice(-8)}`
    pdf.setFontSize(8)
    pdf.text(date, pageWidth - margin - pdf.getTextWidth(date), 24)
    pdf.text(`Report ID: ${reportId}`, pageWidth - margin - pdf.getTextWidth(`Report ID: ${reportId}`), 32)
    
    yPosition = 50

    // Executive Summary Box
    checkPageBreak(45)
    pdf.setFillColor(250, 250, 255)
    pdf.setDrawColor(99, 102, 241)
    pdf.setLineWidth(0.5)
    pdf.rect(margin - 3, yPosition - 3, pageWidth - 2 * margin + 6, 40, 'FD')
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(99, 102, 241)
    pdf.text('TEST RESULT SUMMARY', margin, yPosition + 5)
    
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(0, 0, 0)
    pdf.text(result.diagnosis.status, margin, yPosition + 18)
    
    if (result.diagnosis.type) {
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      pdf.text(`${result.diagnosis.type} - ${result.diagnosis.severity} Severity`, margin, yPosition + 28)
    }
    
    pdf.setFontSize(10)
    const confidenceColor: [number, number, number] = result.diagnosis.confidence === 'High' ? [34, 197, 94] : 
                           result.diagnosis.confidence === 'Medium' ? [251, 191, 36] : [239, 68, 68]
    pdf.setTextColor(confidenceColor[0], confidenceColor[1], confidenceColor[2])
    pdf.text(`Confidence Level: ${result.diagnosis.confidence}`, margin, yPosition + 35)
    
    yPosition += 50

    // Test Performance Metrics
    addSectionHeader('Test Performance Metrics')
    checkPageBreak(35)
    
    const boxWidth = (pageWidth - 2 * margin - 10) / 3
    const metricsY = yPosition

    // Box 1: Overall Accuracy
    pdf.setFillColor(240, 240, 255)
    pdf.roundedRect(margin, metricsY, boxWidth, 25, 2, 2, 'F')
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Overall Accuracy', margin + boxWidth / 2, metricsY + 8, { align: 'center' })
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(99, 102, 241)
    pdf.text(`${result.overall_accuracy.toFixed(1)}%`, margin + boxWidth / 2, metricsY + 20, { align: 'center' })

    // Box 2: Correct Answers
    pdf.setFillColor(240, 255, 240)
    pdf.roundedRect(margin + boxWidth + 5, metricsY, boxWidth, 25, 2, 2, 'F')
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Correct Answers', margin + boxWidth + 5 + boxWidth / 2, metricsY + 8, { align: 'center' })
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(34, 197, 94)
    pdf.text(`${result.total_correct}/${result.total_questions}`, margin + boxWidth + 5 + boxWidth / 2, metricsY + 20, { align: 'center' })

    // Box 3: Test Questions
    pdf.setFillColor(255, 250, 240)
    pdf.roundedRect(margin + 2 * boxWidth + 10, metricsY, boxWidth, 25, 2, 2, 'F')
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    pdf.text('Total Questions', margin + 2 * boxWidth + 10 + boxWidth / 2, metricsY + 8, { align: 'center' })
    pdf.setFontSize(18)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(245, 158, 11)
    pdf.text(`${result.total_questions}`, margin + 2 * boxWidth + 10 + boxWidth / 2, metricsY + 20, { align: 'center' })

    yPosition += 35

    // Detailed Color Type Analysis
    addSectionHeader('Color Type Performance Analysis')
    checkPageBreak(15)
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'italic')
    pdf.setTextColor(100, 100, 100)
    const introLines = pdf.splitTextToSize('The Ishihara test uses four different color combinations to isolate specific types of color vision deficiencies. Below is your performance on each type:', pageWidth - 2 * margin)
    pdf.text(introLines, margin, yPosition)
    yPosition += (introLines.length * 9 * 0.35) + 8

    Object.entries(result.type_analysis).forEach(([typeNum, analysis]) => {
      checkPageBreak(30)
      const typeInfo = colorTypeInfo[parseInt(typeNum)]
      
      // Type box with gradient effect
      pdf.setFillColor(250, 250, 250)
      pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 28, 2, 2, 'F')
      
      // Colored indicator bar
      const colorMap: Record<number, [number, number, number]> = {
        1: [16, 185, 129],
        2: [249, 115, 22],
        3: [239, 68, 68],
        4: [234, 179, 8]
      }
      pdf.setFillColor(colorMap[parseInt(typeNum)][0], colorMap[parseInt(typeNum)][1], colorMap[parseInt(typeNum)][2])
      pdf.rect(margin, yPosition, 3, 28, 'F')
      
      // Type name and description
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text(typeInfo.name, margin + 8, yPosition + 8)
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      const descLines = pdf.splitTextToSize(typeInfo.description, pageWidth - 2 * margin - 85)
      pdf.text(descLines, margin + 8, yPosition + 15)
      
      // Error statistics
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      const errorColor: [number, number, number] = analysis.error_percentage > 50 ? [239, 68, 68] : 
                         analysis.error_percentage > 30 ? [251, 191, 36] : 
                         [34, 197, 94]
      pdf.setTextColor(errorColor[0], errorColor[1], errorColor[2])
      pdf.text(`${analysis.error_percentage.toFixed(1)}% errors`, pageWidth - margin - 45, yPosition + 11, { align: 'right' })
      
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(100, 100, 100)
      pdf.text(`(${analysis.mistakes}/${analysis.total} incorrect)`, pageWidth - margin - 45, yPosition + 18, { align: 'right' })
      
      // Progress bar
      const barWidth = 35
      const barHeight = 4
      const barX = pageWidth - margin - 45
      const barY = yPosition + 22
      
      pdf.setFillColor(230, 230, 230)
      pdf.roundedRect(barX, barY, barWidth, barHeight, 1, 1, 'F')
      
      pdf.setFillColor(errorColor[0], errorColor[1], errorColor[2])
      pdf.roundedRect(barX, barY, barWidth * (analysis.error_percentage / 100), barHeight, 1, 1, 'F')
      
      yPosition += 33
    })

    // Deficiency Likelihood Analysis
    if (result.diagnosis.deutan_likelihood > 0 || result.diagnosis.protan_likelihood > 0) {
      checkPageBreak(45)
      addSectionHeader('Color Vision Deficiency Likelihood')
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const likelihoodIntro = pdf.splitTextToSize('Based on your error patterns across different color types, the AI has calculated the likelihood of specific color vision deficiencies:', pageWidth - 2 * margin)
      pdf.text(likelihoodIntro, margin, yPosition)
      yPosition += (likelihoodIntro.length * 9 * 0.35) + 8
      
      const barWidth = (pageWidth - 2 * margin) - 60
      const barHeight = 18
      
      // Deutan likelihood
      checkPageBreak(25)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Deutan (Green Deficiency)', margin, yPosition + 6)
      
      pdf.setFillColor(16, 185, 129, 30)
      pdf.roundedRect(margin + 60, yPosition, barWidth, barHeight, 2, 2, 'F')
      
      pdf.setFillColor(16, 185, 129)
      pdf.roundedRect(margin + 60, yPosition, barWidth * (result.diagnosis.deutan_likelihood / 100), barHeight, 2, 2, 'F')
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255)
      pdf.text(`${result.diagnosis.deutan_likelihood.toFixed(1)}%`, margin + 60 + barWidth / 2, yPosition + 12, { align: 'center' })
      
      yPosition += 25
      
      // Protan likelihood
      checkPageBreak(25)
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Protan (Red Deficiency)', margin, yPosition + 6)
      
      pdf.setFillColor(239, 68, 68, 30)
      pdf.roundedRect(margin + 60, yPosition, barWidth, barHeight, 2, 2, 'F')
      
      pdf.setFillColor(239, 68, 68)
      pdf.roundedRect(margin + 60, yPosition, barWidth * (result.diagnosis.protan_likelihood / 100), barHeight, 2, 2, 'F')
      
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(255, 255, 255)
      pdf.text(`${result.diagnosis.protan_likelihood.toFixed(1)}%`, margin + 60 + barWidth / 2, yPosition + 12, { align: 'center' })
      
      yPosition += 30
    }

    // AI Analysis Summary
    addSectionHeader('AI Analysis Summary')
    checkPageBreak(20)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 60)
    const summaryLines = pdf.splitTextToSize(result.diagnosis.summary, pageWidth - 2 * margin)
    pdf.text(summaryLines, margin, yPosition)
    yPosition += (summaryLines.length * 10 * 0.35) + 10

    // Recommendations
    addSectionHeader('Recommendations')
    checkPageBreak(20)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 60)
    const recommendationLines = pdf.splitTextToSize(result.diagnosis.recommendation, pageWidth - 2 * margin)
    pdf.text(recommendationLines, margin, yPosition)
    yPosition += (recommendationLines.length * 10 * 0.35) + 10

    // ========== PAGE 2: COMPREHENSIVE INFORMATION ==========
    // Add detailed information about the detected deficiency
    let deficiencyType: string
    
    // Check if both deficiencies are present (Red-Green colorblindness)
    if (result.diagnosis.deutan_likelihood >= 50 && result.diagnosis.protan_likelihood >= 50) {
      deficiencyType = 'Red-Green'
    } else {
      deficiencyType = result.diagnosis.deutan_likelihood > result.diagnosis.protan_likelihood ? 'Deutan' : 'Protan'
    }
    
    if (result.diagnosis.status.toLowerCase() !== 'normal' && deficiencyInfo[deficiencyType]) {
      const info = deficiencyInfo[deficiencyType]
      
      // Start new page for detailed information
      checkPageBreak(250) // Force new page
      
      addSectionHeader('Understanding Your Color Vision Deficiency')
      checkPageBreak(15)
      
      // Full Name
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(99, 102, 241)
      pdf.text(info.fullName, margin, yPosition)
      yPosition += 10
      
      // Overview
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const overviewLines = pdf.splitTextToSize(info.overview, pageWidth - 2 * margin)
      pdf.text(overviewLines, margin, yPosition)
      yPosition += (overviewLines.length * 10 * 0.35) + 10
      
      // Types
      checkPageBreak(30)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Types and Severity:', margin, yPosition)
      yPosition += 7
      
      info.types.forEach((type) => {
        addBulletPoint(type, 9, 6)
      })
      yPosition += 5
      
      // Inheritance
      checkPageBreak(25)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Genetic Inheritance:', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const inheritanceLines = pdf.splitTextToSize(info.inheritance, pageWidth - 2 * margin)
      pdf.text(inheritanceLines, margin, yPosition)
      yPosition += (inheritanceLines.length * 9 * 0.35) + 8
      
      // Prevalence
      checkPageBreak(20)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Prevalence:', margin, yPosition)
      yPosition += 7
      
      pdf.setFontSize(9)
      pdf.setFont('helvetica', 'normal')
      pdf.setTextColor(60, 60, 60)
      const prevalenceLines = pdf.splitTextToSize(info.prevalence, pageWidth - 2 * margin)
      pdf.text(prevalenceLines, margin, yPosition)
      yPosition += (prevalenceLines.length * 9 * 0.35) + 8
      
      // Symptoms
      checkPageBreak(40)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Common Symptoms and Challenges:', margin, yPosition)
      yPosition += 7
      
      info.symptoms.forEach((symptom) => {
        addBulletPoint(symptom, 9, 6)
      })
      yPosition += 5
      
      // Impact on Daily Life
      checkPageBreak(40)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Impact on Daily Life and Career:', margin, yPosition)
      yPosition += 7
      
      info.impact.forEach((impact) => {
        addBulletPoint(impact, 9, 6)
      })
      yPosition += 5
      
      // Management Strategies
      checkPageBreak(50)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Management and Adaptation Strategies:', margin, yPosition)
      yPosition += 7
      
      info.management.forEach((strategy) => {
        addBulletPoint(strategy, 9, 6)
      })
      yPosition += 5
      
      // Resources
      checkPageBreak(30)
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(0, 0, 0)
      pdf.text('Next Steps and Resources:', margin, yPosition)
      yPosition += 7
      
      info.resources.forEach((resource) => {
        addBulletPoint(resource, 9, 6)
      })
      yPosition += 10
    }

    // Important Medical Disclaimer
    checkPageBreak(40)
    pdf.setFillColor(255, 250, 240)
    pdf.setDrawColor(245, 158, 11)
    pdf.setLineWidth(1)
    pdf.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 35, 'FD')
    
    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(245, 158, 11)
    pdf.text('Important Medical Disclaimer', margin, yPosition + 5)
    
    pdf.setFontSize(9)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 60)
    const disclaimerText = 'This is an AI-powered screening tool designed for educational and preliminary assessment purposes only. It is NOT a substitute for professional medical diagnosis. For accurate diagnosis, comprehensive testing, and personalized treatment recommendations, please consult a qualified optometrist or ophthalmologist. Color vision deficiencies can only be definitively diagnosed through professional clinical examination.'
    const disclaimerLines = pdf.splitTextToSize(disclaimerText, pageWidth - 2 * margin - 10)
    pdf.text(disclaimerLines, margin, yPosition + 13)
    
    yPosition += 45

    // Footer on last page
    addFooter()

    // Save the PDF
    const filename = `ColorVision_Report_${reportId}.pdf`
    pdf.save(filename)
  }

  return (
    <Button onClick={generatePDF} className="flex-1 gap-2">
      <Download className="w-4 h-4" />
      Download PDF Report
    </Button>
  )
}

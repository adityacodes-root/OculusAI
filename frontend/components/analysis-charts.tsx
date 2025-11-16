'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

interface AnalysisChartsProps {
  result: {
    primaryDiagnosis: string
    confidence: number
    findings: Array<{
      condition: string
      severity: string
      confidence: number
    }>
  }
}

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export function AnalysisCharts({ result }: AnalysisChartsProps) {
  // Prepare data for charts
  const barChartData = result.findings.map((finding) => ({
    name: finding.condition.length > 20 ? finding.condition.substring(0, 20) + '...' : finding.condition,
    confidence: finding.confidence,
    fullName: finding.condition
  }))

  const pieChartData = result.findings.map((finding) => ({
    name: finding.condition,
    value: finding.confidence
  }))

  const radarChartData = result.findings.map((finding) => ({
    condition: finding.condition.length > 15 ? finding.condition.substring(0, 15) + '...' : finding.condition,
    confidence: finding.confidence,
    fullName: finding.condition
  }))

  return (
    <div className="space-y-6">
      {/* Bar Chart - Confidence Levels */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Confidence Levels by Condition</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              labelFormatter={(value, payload) => {
                const item = payload[0]?.payload
                return item?.fullName || value
              }}
              formatter={(value: any) => [`${value}%`, 'Confidence']}
            />
            <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
            <Bar dataKey="confidence" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Findings Distribution */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Findings Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieChartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name.substring(0, 12)}... ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: any) => [`${value}%`, 'Confidence']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Radar Chart - Comprehensive View */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Comprehensive Analysis Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarChartData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="condition" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Radar 
              name="Confidence" 
              dataKey="confidence" 
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary))" 
              fillOpacity={0.6} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              labelFormatter={(value, payload) => {
                const item = payload[0]?.payload
                return item?.fullName || value
              }}
              formatter={(value: any) => [`${value}%`, 'Confidence']}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

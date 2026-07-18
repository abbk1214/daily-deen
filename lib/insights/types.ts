export interface Insight {
  id: string
  type: InsightType
  title: string
  description: string
  icon: string
  color: string
  priority: 'high' | 'medium' | 'low'
  metadata?: Record<string, unknown>
}

export type InsightType =
  | 'correlation'
  | 'pattern'
  | 'streak'
  | 'milestone'
  | 'report'
  | 'suggestion'
  | 'anomaly'

export interface CorrelationInsight extends Insight {
  type: 'correlation'
  metadata: {
    factor1: string
    factor2: string
    strength: number
    direction: 'positive' | 'negative'
    sampleSize: number
  }
}

export interface PatternInsight extends Insight {
  type: 'pattern'
  metadata: {
    pattern: string
    frequency: string
    confidence: number
  }
}

export interface ReportInsight extends Insight {
  type: 'report'
  metadata: {
    period: 'weekly' | 'monthly' | 'yearly'
    startDate: string
    endDate: string
    stats: Record<string, number>
  }
}

export interface InsightsData {
  insights: Insight[]
  weeklyReport: ReportInsight | null
  monthlyReport: ReportInsight | null
  hasMore: boolean
}

export interface InsightFilters {
  types: InsightType[]
  minPriority: 'high' | 'medium' | 'low'
}

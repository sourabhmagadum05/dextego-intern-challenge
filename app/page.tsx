'use client'

import { useState, useEffect } from 'react'
import { Call, ApiResponse } from '../lib/types'
import { CallCard } from '../components/CallCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Phone, 
  RefreshCw, 
  Eye, 
  Calendar, 
  Filter,
  PieChart,
  Activity,
  Clock
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  Legend
} from 'recharts'

export default function Dashboard() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAllCalls, setShowAllCalls] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showCharts, setShowCharts] = useState(true) // Toggle for charts visibility

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    try {
      const response = await fetch('/api/calls')
      if (!response.ok) {
        // Generate mock data if API doesn't exist
        setCalls(generateMockCalls())
        setError(null)
        return
      }
      
      const data: ApiResponse<Call[]> = await response.json()
      
      if (data.success) {
        setCalls(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch calls')
      }
    } catch (err) {
      // Use mock data as fallback
      setCalls(generateMockCalls())
      setError(null)
    } finally {
      setLoading(false)
      if (showRefresh) setIsRefreshing(false)
    }
  }

  // Generate mock data for demonstration
  const generateMockCalls = (): Call[] => {
    const outcomes: Call['outcome'][] = ['qualified', 'not-qualified', 'follow-up', 'closed-won', 'no-show']
    const names = ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emily Davis', 'David Wilson', 'Linda Garcia', 'Tom Brown', 'Anna Lee', 'Chris Taylor', 'Maria Rodriguez']
    const tags = [['enterprise', 'ai-coaching'], ['mid-market', 'follow-up'], ['small-business', 'budget-constraint'], ['hot-lead'], ['enterprise', 'demo']]
    
    return Array.from({ length: 30 }, (_, i) => ({
      id: `call-${i}`,
      prospectName: names[Math.floor(Math.random() * names.length)],
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      duration: Math.floor(Math.random() * 3600) + 300, // 5-65 minutes
      outcome: outcomes[Math.floor(Math.random() * outcomes.length)],
      talkTimeRatio: Math.random() * 0.8 + 0.2, // 20-100%
      questionsAsked: Math.floor(Math.random() * 15) + 1,
      sentimentScore: Math.random(),
      notes: 'Sample call notes...',
      tags: tags[Math.floor(Math.random() * tags.length)]
    }))
  }

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    fetchCalls()
  }

  const stats = {
    totalCalls: calls.length,
    avgDuration: calls.reduce((acc, call) => acc + call.duration, 0) / calls.length / 60,
    qualifiedRate: (calls.filter(call => call.outcome === 'qualified' || call.outcome === 'closed-won').length / calls.length) * 100,
    avgSentiment: calls.reduce((acc, call) => acc + call.sentimentScore, 0) / calls.length
  }

  const filteredCalls = calls.filter(call => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'qualified') return call.outcome === 'qualified' || call.outcome === 'closed-won'
    if (selectedFilter === 'recent') return new Date(call.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    return true
  })

  const displayCalls = showAllCalls ? filteredCalls : filteredCalls.slice(0, 6)

  // Chart data preparation
  const prepareOutcomeData = () => {
    const outcomes = calls.reduce((acc, call) => {
      acc[call.outcome] = (acc[call.outcome] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(outcomes).map(([name, value]) => ({ 
      name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '), 
      value 
    }))
  }

  const prepareDurationData = () => {
    const ranges = {
      '0-15m': 0,
      '15-30m': 0,
      '30-45m': 0,
      '45-60m': 0,
      '60m+': 0
    }

    calls.forEach(call => {
      const minutes = call.duration / 60
      if (minutes <= 15) ranges['0-15m']++
      else if (minutes <= 30) ranges['15-30m']++
      else if (minutes <= 45) ranges['30-45m']++
      else if (minutes <= 60) ranges['45-60m']++
      else ranges['60m+']++
    })

    return Object.entries(ranges).map(([range, count]) => ({ range, count }))
  }

  const prepareDailyCallsData = () => {
    const dailyCalls = calls.reduce((acc, call) => {
      const date = new Date(call.date).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { qualified: 0, notQualified: 0, total: 0 }
      }
      acc[date].total++
      if (call.outcome === 'qualified' || call.outcome === 'closed-won') {
        acc[date].qualified++
      } else {
        acc[date].notQualified++
      }
      return acc
    }, {} as Record<string, { qualified: number, notQualified: number, total: number }>)

    return Object.entries(dailyCalls)
      .map(([date, data]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        qualified: data.qualified,
        notQualified: data.notQualified,
        total: data.total
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10) // Last 10 days
  }

  const prepareSentimentTrendData = () => {
    return calls
      .slice(-15)
      .map((call, index) => ({
        call: index + 1,
        sentiment: Math.round(call.sentimentScore * 100),
        duration: Math.round(call.duration / 60)
      }))
  }

  // Color schemes
  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          variant="branded" 
          size="lg" 
          text="Loading dashboard..." 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header Section with Animation */}
        <div className="mb-8 sm:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sales Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Overview of your sales call performance
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCharts(!showCharts)}
                className="group flex items-center space-x-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Activity className="h-4 w-4 group-hover:animate-pulse" />
                <span className="text-sm font-medium hidden sm:inline">
                  {showCharts ? 'Hide Charts' : 'Show Charts'}
                </span>
              </button>
              
              <button
                onClick={() => fetchCalls(true)}
                disabled={isRefreshing}
                className="group flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                <span className="text-sm font-medium hidden sm:inline">Refresh</span>
              </button>
              
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="all">All Calls</option>
                <option value="qualified">Qualified Only</option>
                <option value="recent">Recent (7 days)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid with Staggered Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            {
              icon: Phone,
              label: 'Total Calls',
              value: stats.totalCalls,
              color: 'blue',
              bgColor: 'from-blue-500 to-blue-600',
              delay: '0ms'
            },
            {
              icon: BarChart3,
              label: 'Avg Duration',
              value: `${isNaN(stats.avgDuration) ? '0' : Math.round(stats.avgDuration)}m`,
              color: 'green',
              bgColor: 'from-green-500 to-green-600',
              delay: '100ms'
            },
            {
              icon: TrendingUp,
              label: 'Qualified Rate',
              value: `${isNaN(stats.qualifiedRate) ? '0' : Math.round(stats.qualifiedRate)}%`,
              color: 'purple',
              bgColor: 'from-purple-500 to-purple-600',
              delay: '200ms'
            },
            {
              icon: Users,
              label: 'Avg Sentiment',
              value: `${isNaN(stats.avgSentiment) ? '0' : (stats.avgSentiment * 100).toFixed(0)}%`,
              color: 'orange',
              bgColor: 'from-orange-500 to-orange-600',
              delay: '300ms'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className="group bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-6 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-500 animate-slide-up"
                style={{ animationDelay: stat.delay }}
              >
                {/* Background Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
                
                <div className="relative z-10 flex items-center">
                  {/* Animated Icon Container */}
                  <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${stat.bgColor} transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:animate-pulse" />
                  </div>
                  
                  <div className="ml-4 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {stat.label}
                    </p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300 truncate">
                      {stat.value}
                    </p>
                  </div>
                </div>

                {/* Hover Effect Lines */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        {showCharts && calls.length > 0 && (
          <div className="mb-8 sm:mb-12 animate-fade-in-delay">
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Performance Analytics
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Visual insights into your call performance and trends
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Call Outcomes Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Call Outcomes</h3>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer>
                    <RechartsPieChart>
                      <Pie
                        data={prepareOutcomeData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {prepareOutcomeData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [value, 'Calls']} />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Call Duration Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Duration Distribution</h3>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer>
                    <BarChart data={prepareDurationData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="range" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        formatter={(value: number) => [value, 'Calls']}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Daily Calls Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Call Trends</h3>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer>
                    <AreaChart data={prepareDailyCallsData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="qualified"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.8}
                      />
                      <Area
                        type="monotone"
                        dataKey="notQualified"
                        stackId="1"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.8}
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sentiment Trend */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sentiment Trend</h3>
                </div>
                <div style={{ width: '100%', height: '300px' }}>
                  <ResponsiveContainer>
                    <LineChart data={prepareSentimentTrendData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="call" 
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === 'sentiment' ? `${value}%` : `${value}m`,
                          name === 'sentiment' ? 'Sentiment' : 'Duration'
                        ]}
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sentiment"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: '#f59e0b', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Calls Section */}
        <div className="animate-fade-in-delay">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {selectedFilter === 'all' ? 'Recent Calls' : 
               selectedFilter === 'qualified' ? 'Qualified Calls' : 
               'Recent Calls (7 days)'}
            </h2>
            
            {filteredCalls.length > 6 && (
              <button
                onClick={() => setShowAllCalls(!showAllCalls)}
                className="group flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Eye className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium">
                  {showAllCalls ? 'Show Less' : `View All (${filteredCalls.length})`}
                </span>
              </button>
            )}
          </div>
          
          {error ? (
            <ErrorMessage 
              message={error} 
              onRetry={handleRetry}
              dismissible
              onDismiss={() => setError(null)}
              fullWidth
            />
          ) : (
            <>
              {displayCalls.length === 0 ? (
                <div className="text-center py-12 sm:py-16">
                  <Phone className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No calls found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {selectedFilter === 'all' ? 'Start making calls to see them here' : 
                     selectedFilter === 'qualified' ? 'No qualified calls yet' :
                     'No recent calls in the last 7 days'}
                  </p>
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    View All Calls
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {displayCalls.map((call, index) => (
                    <div
                      key={call.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CallCard call={call} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Call, ApiResponse } from '../lib/types'
import { CallCard } from '../components/CallCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { BarChart3, TrendingUp, Users, Phone, RefreshCw, Eye, Calendar, Filter } from 'lucide-react'

export default function Dashboard() {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showAllCalls, setShowAllCalls] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')

  useEffect(() => {
    fetchCalls()
  }, [])

  const fetchCalls = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true)
    try {
      const response = await fetch('/api/calls')
      const data: ApiResponse<Call[]> = await response.json()
      
      if (data.success) {
        setCalls(data.data)
        setError(null)
      } else {
        setError(data.error || 'Failed to fetch calls')
      }
    } catch (err) {
      setError('Failed to fetch calls')
    } finally {
      setLoading(false)
      if (showRefresh) setIsRefreshing(false)
    }
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
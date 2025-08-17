'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, SlidersHorizontal, RefreshCw, Grid3X3, LayoutList, Phone, TrendingUp, Calendar, X } from 'lucide-react'
import { Call, ApiResponse } from '../../lib/types'
import { CallCard } from '../../components/CallCard'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { ErrorMessage } from '../../components/ErrorMessage'

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [filteredCalls, setFilteredCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    fetchCalls()
  }, [])

  useEffect(() => {
    filterAndSortCalls()
  }, [calls, searchTerm, statusFilter, sortBy])

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

  const filterAndSortCalls = () => {
    let filtered = [...calls]

    // Search filtering
    if (searchTerm) {
      filtered = filtered.filter(call =>
        call.prospectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        call.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Status filtering
    if (statusFilter !== 'all') {
      filtered = filtered.filter(call => call.outcome === statusFilter)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'name':
          return a.prospectName.localeCompare(b.prospectName)
        case 'duration':
          return b.duration - a.duration
        case 'sentiment':
          return b.sentimentScore - a.sentimentScore
        default:
          return 0
      }
    })

    setFilteredCalls(filtered)
  }

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    fetchCalls()
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setSortBy('date')
  }

  const getStats = () => {
    return {
      total: calls.length,
      qualified: calls.filter(c => c.outcome === 'qualified' || c.outcome === 'closed-won').length,
      avgDuration: calls.reduce((acc, c) => acc + c.duration, 0) / calls.length / 60 || 0,
      filtered: filteredCalls.length
    }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          variant="branded" 
          size="lg" 
          text="Loading calls..." 
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Animated Header */}
        <div className="mb-8 sm:mb-12 animate-slide-in-down">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All Calls
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                Manage and review your sales calls
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => fetchCalls(true)}
                disabled={isRefreshing}
                className="group flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-300`} />
                <span className="text-sm font-medium hidden sm:inline">Refresh</span>
              </button>
              
              <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 sm:p-2.5 transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 sm:p-2.5 transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <LayoutList className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {[
            { 
              icon: Phone, 
              label: 'Total Calls', 
              value: stats.total, 
              color: 'blue',
              bgColor: 'from-blue-500 to-blue-600',
              delay: '0ms'
            },
            { 
              icon: TrendingUp, 
              label: 'Qualified', 
              value: stats.qualified, 
              color: 'green',
              bgColor: 'from-green-500 to-green-600',
              delay: '100ms'
            },
            { 
              icon: Calendar, 
              label: 'Avg Duration', 
              value: `${Math.round(stats.avgDuration)}m`, 
              color: 'purple',
              bgColor: 'from-purple-500 to-purple-600',
              delay: '200ms'
            },
            { 
              icon: Filter, 
              label: 'Filtered', 
              value: stats.filtered, 
              color: 'orange',
              bgColor: 'from-orange-500 to-orange-600',
              delay: '300ms'
            }
          ].map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={stat.label}
                className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/50 p-3 sm:p-4 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 hover:border-blue-300 dark:hover:border-blue-500 animate-slide-in-up"
                style={{ animationDelay: stat.delay }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.bgColor} transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-white group-hover:animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                      {stat.label}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 animate-slide-in-right">
          <div className="flex flex-col gap-4">
            {/* Search Bar */}
            <div className={`relative flex-1 transition-all duration-300 ${
              searchFocused ? 'transform scale-102' : ''
            }`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200 ${
                searchFocused ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search calls by name, notes, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-10 pr-12 py-3 sm:py-3.5 border rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:shadow-md ${
                  searchFocused 
                    ? 'border-blue-300 dark:border-blue-600 shadow-lg shadow-blue-500/10' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1 sm:flex-initial">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                >
                  <option value="all">All Outcomes</option>
                  <option value="qualified">Qualified</option>
                  <option value="not-qualified">Not Qualified</option>
                  <option value="follow-up">Follow Up</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                </select>
              </div>

              <div className="relative flex-1 sm:flex-initial">
                <SlidersHorizontal className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto pl-10 pr-8 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="duration">Sort by Duration</option>
                  <option value="sentiment">Sort by Sentiment</option>
                </select>
              </div>

              {(searchTerm || statusFilter !== 'all' || sortBy !== 'date') && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {error ? (
          <div className="animate-slide-in-up">
            <ErrorMessage 
              message={error} 
              onRetry={handleRetry}
              dismissible
              onDismiss={() => setError(null)}
              fullWidth
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Results Summary */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slide-in-left">
              <div className="flex items-center space-x-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{filteredCalls.length}</span> of <span className="font-semibold">{calls.length}</span> calls
                </p>
                {filteredCalls.length !== calls.length && (
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                    Filtered
                  </span>
                )}
              </div>
            </div>
            
            {/* Calls Grid/List */}
            {filteredCalls.length === 0 ? (
              <div className="text-center py-16 sm:py-24 animate-scale-in">
                <div className="mb-6">
                  <Phone className="h-16 w-16 sm:h-20 sm:w-20 text-gray-400 mx-auto animate-float" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  {searchTerm || statusFilter !== 'all' ? 'No matching calls found' : 'No calls yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                    : 'Start making calls to see them appear here.'
                  }
                </p>
                {(searchTerm || statusFilter !== 'all') && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid gap-4 sm:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredCalls.map((call, index) => (
                  <div
                    key={call.id}
                    className="animate-slide-in-up hover-lift"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CallCard call={call} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
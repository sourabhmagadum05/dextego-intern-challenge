'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, TrendingUp, MessageSquare, User } from 'lucide-react'
import { Call, ApiResponse } from '../../../lib/types'
import { LoadingSpinner } from '../../../components/LoadingSpinner'
import { ErrorMessage } from '../../../components/ErrorMessage'
import { formatDuration, formatDate, getOutcomeColor, cn } from '../../../lib/utils'

export default function CallDetailsPage() {
  const params = useParams()
  const [call, setCall] = useState<Call | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchCall(params.id as string)
    }
  }, [params.id])

  useEffect(() => {
    if (!loading && !error) {
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
  }, [loading, error])

  const fetchCall = async (id: string) => {
    try {
      const response = await fetch(`/api/calls/${id}`)
      const data: ApiResponse<Call> = await response.json()
      
      if (data.success) {
        setCall(data.data)
      } else {
        setError(data.error || 'Call not found')
      }
    } catch (err) {
      setError('Failed to fetch call details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!call) return <ErrorMessage message="Call not found" />

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
      {/* Animated Header */}
      <div className={cn(
        "mb-6 sm:mb-8 transition-all duration-700 transform",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}>
        <Link 
          href="/calls" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-4 transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Calls
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400">
              {call.prospectName}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
              {formatDate(call.date)}
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className={cn(
              "inline-block px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg",
              getOutcomeColor(call.outcome)
            )}>
              {call.outcome.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Call Metrics Card */}
          <div className={cn(
            "bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-500 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )} style={{ transitionDelay: '200ms' }}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Call Metrics</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Duration Metric */}
              <div className="text-center group hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:scale-105">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {formatDuration(call.duration)}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Duration</p>
              </div>
              
              {/* Talk Time Metric */}
              <div className="text-center group hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:scale-105">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-green-600 dark:group-hover:text-green-400">
                  {Math.round(call.talkTimeRatio * 100)}%
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Talk Time</p>
              </div>
              
              {/* Questions Metric */}
              <div className="text-center group hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:scale-105">
                <MessageSquare className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {call.questionsAsked}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Questions</p>
              </div>
              
              {/* Sentiment Metric */}
              <div className="text-center group hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:scale-105">
                <User className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2 transition-transform duration-300 group-hover:scale-110" />
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                  {Math.round(call.sentimentScore * 100)}%
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Sentiment</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {call.notes && (
            <div className={cn(
              "bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-500 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )} style={{ transitionDelay: '400ms' }}>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                Notes
              </h2>
              <div className="relative">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base transition-colors duration-300 hover:text-gray-900 dark:hover:text-gray-100">
                  {call.notes}
                </p>
                <div className="absolute -left-2 top-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 h-full rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags Section */}
          {call.tags.length > 0 && (
            <div className={cn(
              "bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-500 transform",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )} style={{ transitionDelay: '300ms' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {call.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-blue-200 dark:hover:bg-blue-800 cursor-default"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: isVisible ? 'fadeInUp 0.5s ease-out forwards' : 'none'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Call Status Section */}
          <div className={cn(
            "bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-500 transform",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )} style={{ transitionDelay: '500ms' }}>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">
              Call Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Status:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                  {call.status}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <span className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Outcome:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize transition-colors duration-300 hover:text-blue-600 dark:hover:text-blue-400">
                  {call.outcome.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
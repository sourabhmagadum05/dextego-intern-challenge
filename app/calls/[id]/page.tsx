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

  useEffect(() => {
    if (params.id) {
      fetchCall(params.id as string)
    }
  }, [params.id])

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/calls" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Calls
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {call.prospectName}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {formatDate(call.date)}
            </p>
          </div>
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            getOutcomeColor(call.outcome)
          )}>
            {call.outcome.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Call Metrics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(call.duration)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Duration</p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(call.talkTimeRatio * 100)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Talk Time</p>
              </div>
              
              <div className="text-center">
                <MessageSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {call.questionsAsked}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Questions</p>
              </div>
              
              <div className="text-center">
                <User className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(call.sentimentScore * 100)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Sentiment</p>
              </div>
            </div>
          </div>

          {call.notes && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Notes</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {call.notes}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {call.tags.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {call.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Call Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Status:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {call.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Outcome:</span>
                <span className="font-medium text-gray-900 dark:text-white capitalize">
                  {call.outcome.replace('-', ' ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { Clock, TrendingUp, MessageSquare, ArrowRight, User } from 'lucide-react'
import { Call } from '../lib/types'
import { formatDuration, formatDate, getOutcomeColor, cn } from '../lib/utils'

interface CallCardProps {
  call: Call
}

export function CallCard({ call }: CallCardProps) {
  return (
    <Link href={`/calls/${call.id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500 relative overflow-hidden">
        
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
        
        {/* Content wrapper */}
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors duration-300">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {call.prospectName}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                  {formatDate(call.date)}
                </p>
              </div>
            </div>
            
            {/* Outcome Badge with Animation */}
            <div className="flex items-center space-x-2">
              <span className={cn(
                "px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium transition-all duration-300 group-hover:scale-105",
                getOutcomeColor(call.outcome)
              )}>
                {call.outcome.replace('-', ' ')}
              </span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300 opacity-0 group-hover:opacity-100" />
            </div>
          </div>

          {/* Stats Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
            <div className="group/stat flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
              <Clock className="h-4 w-4 text-gray-400 group-hover/stat:text-blue-500 group-hover/stat:animate-pulse transition-colors duration-300" />
              <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/stat:text-gray-800 dark:group-hover/stat:text-gray-100 transition-colors duration-300">
                {formatDuration(call.duration)}
              </span>
            </div>
            
            <div className="group/stat flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
              <TrendingUp className="h-4 w-4 text-gray-400 group-hover/stat:text-green-500 group-hover/stat:animate-bounce transition-colors duration-300" />
              <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/stat:text-gray-800 dark:group-hover/stat:text-gray-100 transition-colors duration-300">
                <span className="font-medium">{Math.round(call.talkTimeRatio * 100)}%</span> talk
              </span>
            </div>
            
            <div className="group/stat flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200">
              <MessageSquare className="h-4 w-4 text-gray-400 group-hover/stat:text-purple-500 group-hover/stat:animate-pulse transition-colors duration-300" />
              <span className="text-sm text-gray-600 dark:text-gray-300 group-hover/stat:text-gray-800 dark:group-hover/stat:text-gray-100 transition-colors duration-300">
                <span className="font-medium">{call.questionsAsked}</span> questions
              </span>
            </div>
          </div>

          {/* Notes Section */}
          {call.notes && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                {call.notes}
              </p>
            </div>
          )}

          {/* Tags Section - Enhanced Responsiveness */}
          {call.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {call.tags.slice(0, 4).map((tag, index) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-all duration-300 transform hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  {tag}
                </span>
              ))}
              {call.tags.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{call.tags.length - 4} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Loading shimmer effect on hover */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-out opacity-0 group-hover:opacity-100"></div>
      </div>
    </Link>
  )
}
'use client'

import { Loader2, Phone } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'dots' | 'pulse' | 'bounce' | 'gradient' | 'branded'
  text?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center p-4 sm:p-8'

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizeClasses[size]} bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        )

      case 'pulse':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} bg-blue-600 dark:bg-blue-400 rounded-full animate-ping absolute`} />
            <div className={`${sizeClasses[size]} bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse`} />
          </div>
        )

      case 'bounce':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 sm:w-3 ${size === 'sm' ? 'h-4' : size === 'lg' ? 'h-8' : size === 'xl' ? 'h-12' : 'h-6'} bg-gradient-to-t from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s`, animationDuration: '1s' }}
              />
            ))}
          </div>
        )

      case 'gradient':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-spin`} 
                 style={{ background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)' }}>
              <div className={`absolute inset-1 rounded-full bg-white dark:bg-gray-900`} />
            </div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
          </div>
        )

      case 'branded':
        return (
          <div className="relative">
            <div className={`${sizeClasses[size]} relative`}>
              <Phone className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400 animate-bounce`} />
              <div className="absolute -inset-2 border-2 border-blue-300 dark:border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute -inset-4 border border-blue-200 dark:border-blue-700 border-t-transparent rounded-full animate-spin animate-reverse" 
                   style={{ animationDuration: '2s' }} />
            </div>
          </div>
        )

      default:
        return (
          <div className="relative">
            <Loader2 className={`${sizeClasses[size]} text-blue-600 dark:text-blue-400 animate-spin`} />
            {/* Subtle glow effect */}
            <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-pulse blur-sm`} />
          </div>
        )
    }
  }

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-3 sm:space-y-4">
        {/* Spinner container with hover effects */}
        <div className="group relative p-2 sm:p-4 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300">
          {/* Background pulse */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full animate-pulse group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20 transition-all duration-300" />
          
          {/* Main spinner */}
          <div className="relative z-10">
            {renderSpinner()}
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-75" />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping opacity-75" 
               style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Loading text */}
        {text && (
          <div className="text-center animate-pulse">
            <p className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 mb-1">
              {text}
            </p>
            <div className="flex space-x-1 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS animations */}
      <style jsx>{`
        @keyframes reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
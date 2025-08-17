'use client'

import { AlertTriangle, X, RefreshCw, Info, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface ErrorMessageProps {
  message: string
  variant?: 'error' | 'warning' | 'info' | 'critical'
  dismissible?: boolean
  onDismiss?: () => void
  onRetry?: () => void
  retryText?: string
  showIcon?: boolean
  fullWidth?: boolean
}

export function ErrorMessage({ 
  message, 
  variant = 'error',
  dismissible = false,
  onDismiss,
  onRetry,
  retryText = 'Try Again',
  showIcon = true,
  fullWidth = false
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isShaking, setIsShaking] = useState(false)

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => onDismiss?.(), 300)
  }

  const handleRetry = () => {
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 600)
    onRetry?.()
  }

  const variants = {
    error: {
      container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700',
      text: 'text-red-800 dark:text-red-200',
      icon: 'text-red-600 dark:text-red-400',
      button: 'bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:hover:bg-red-700/50 text-red-700 dark:text-red-300',
      iconComponent: AlertCircle
    },
    warning: {
      container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: 'text-yellow-600 dark:text-yellow-400',
      button: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-800/50 dark:hover:bg-yellow-700/50 text-yellow-700 dark:text-yellow-300',
      iconComponent: AlertTriangle
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700',
      text: 'text-blue-800 dark:text-blue-200',
      icon: 'text-blue-600 dark:text-blue-400',
      button: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-800/50 dark:hover:bg-blue-700/50 text-blue-700 dark:text-blue-300',
      iconComponent: Info
    },
    critical: {
      container: 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 hover:border-red-400 dark:hover:border-red-600 shadow-lg',
      text: 'text-red-900 dark:text-red-100 font-medium',
      icon: 'text-red-700 dark:text-red-300',
      button: 'bg-red-200 hover:bg-red-300 dark:bg-red-700/70 dark:hover:bg-red-600/70 text-red-800 dark:text-red-200',
      iconComponent: AlertTriangle
    }
  }

  const currentVariant = variants[variant]
  const IconComponent = currentVariant.iconComponent

  if (!isVisible) return null

  return (
    <div className={`group relative overflow-hidden transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    } ${fullWidth ? 'w-full' : 'max-w-2xl mx-auto'}`}>
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      
      <div className={`relative border rounded-xl p-4 sm:p-6 transition-all duration-300 ${currentVariant.container} ${
        isShaking ? 'animate-shake' : ''
      }`}>
        {/* Pulse effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-5 animate-pulse rounded-xl"></div>
        
        <div className="relative z-10 flex items-start space-x-3">
          {/* Animated Icon */}
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              <div className={`p-1 rounded-full transition-all duration-300 group-hover:scale-110 ${
                variant === 'critical' ? 'animate-pulse' : ''
              }`}>
                <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${currentVariant.icon} ${
                  variant === 'error' ? 'animate-bounce' : 
                  variant === 'warning' ? 'animate-pulse' : ''
                }`} />
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm sm:text-base ${currentVariant.text} leading-relaxed animate-fade-in`}>
              {message}
            </p>
            
            {/* Action buttons */}
            {(onRetry || dismissible) && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {onRetry && (
                  <button
                    onClick={handleRetry}
                    className={`group/btn inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${currentVariant.button}`}
                  >
                    <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-200 ${
                      isShaking ? 'animate-spin' : 'group-hover/btn:rotate-180'
                    }`} />
                    <span>{retryText}</span>
                  </button>
                )}
                
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="group/close p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 hover:scale-110"
                    aria-label="Dismiss"
                  >
                    <X className="h-3 w-3 sm:h-4 sm:w-4 text-current opacity-60 group-hover/close:opacity-100 transition-opacity duration-200" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Close button (top-right) */}
          {dismissible && !onRetry && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200 hover:scale-110 group-hover:rotate-90"
              aria-label="Dismiss error"
            >
              <X className="h-4 w-4 text-current opacity-60 hover:opacity-100 transition-opacity duration-200" />
            </button>
          )}
        </div>

        {/* Progress bar for critical errors */}
        {variant === 'critical' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-200 dark:bg-red-800 overflow-hidden rounded-b-xl">
            <div className="h-full bg-red-500 dark:bg-red-400 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
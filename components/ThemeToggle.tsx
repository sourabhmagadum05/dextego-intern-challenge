'use client'

import { Sun, Moon, Sparkles } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = async () => {
    setIsAnimating(true)
    toggleTheme()
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  return (
    <div className="relative">
      {/* Animated background glow */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r transition-all duration-500 blur-sm opacity-0 hover:opacity-30 ${
        theme === 'light' 
          ? 'from-yellow-200 via-orange-200 to-pink-200' 
          : 'from-blue-400 via-purple-400 to-indigo-400'
      }`}></div>
      
      <button
        onClick={handleToggle}
        className={`relative group p-2 sm:p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          theme === 'light'
            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 hover:border-yellow-300 shadow-md hover:shadow-lg'
            : 'bg-gradient-to-br from-slate-800 to-gray-800 hover:from-slate-700 hover:to-gray-700 border border-slate-600 hover:border-slate-500 shadow-md hover:shadow-xl'
        } ${isAnimating ? 'animate-pulse' : ''}`}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {/* Icon container with rotation animation */}
        <div className="relative w-4 h-4 sm:w-5 sm:h-5">
          {/* Sun icon */}
          <Sun 
            className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 transform ${
              theme === 'light' 
                ? 'rotate-0 opacity-100 scale-100 text-yellow-600' 
                : 'rotate-180 opacity-0 scale-50 text-yellow-400'
            } group-hover:drop-shadow-sm`}
          />
          
          {/* Moon icon */}
          <Moon 
            className={`absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 transition-all duration-500 transform ${
              theme === 'dark' 
                ? 'rotate-0 opacity-100 scale-100 text-slate-300' 
                : '-rotate-180 opacity-0 scale-50 text-slate-400'
            } group-hover:drop-shadow-sm`}
          />
        </div>

        {/* Sparkle effects */}
        <div className={`absolute -top-1 -right-1 transition-all duration-300 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}>
          <Sparkles className="w-3 h-3 text-yellow-400 animate-spin" />
        </div>
        
        <div className={`absolute -bottom-1 -left-1 transition-all duration-300 delay-100 ${
          isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}>
          <Sparkles className="w-2 h-2 text-blue-400 animate-ping" />
        </div>

        {/* Ripple effect on click */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
          isAnimating 
            ? 'bg-white/20 scale-150 opacity-0' 
            : 'bg-transparent scale-100 opacity-0'
        }`}></div>
      </button>

      {/* Theme label for larger screens */}
      <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <span className={`text-xs font-medium transition-all duration-300 ${
          theme === 'light' ? 'text-gray-600' : 'text-gray-400'
        } opacity-0 group-hover:opacity-100`}>
          {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
        </span>
      </div>

      {/* Tooltip for mobile */}
      <div className="lg:hidden absolute -top-10 left-1/2 transform -translate-x-1/2 pointer-events-none">
        <div className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
          theme === 'light' 
            ? 'bg-gray-800 text-white' 
            : 'bg-white text-gray-800'
        } opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 whitespace-nowrap`}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes rotate-sun {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes moon-glow {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(148, 163, 184, 0.3)); }
          50% { filter: drop-shadow(0 0 10px rgba(148, 163, 184, 0.6)); }
        }
        
        .group:hover .sun-icon {
          animation: rotate-sun 2s linear infinite;
        }
        
        .group:hover .moon-icon {
          animation: moon-glow 2s ease-in-out infinite;
        }
        
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
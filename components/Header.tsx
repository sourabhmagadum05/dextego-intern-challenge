'use client'

import Link from 'next/link'
import { Phone, BarChart3, Menu, X, Sun, Moon, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className="border-b bg-white dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 group">
            <Phone className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 transform group-hover:rotate-12 transition-transform duration-300" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white animate-fade-in">
              <span className="hidden sm:inline">Dextego Sales Dashboard</span>
              <span className="sm:hidden">Dextego</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="group flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <BarChart3 className="h-4 w-4 group-hover:animate-pulse" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/calls"
              className="group flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Phone className="h-4 w-4 group-hover:animate-bounce" />
              <span className="font-medium">Calls</span>
            </Link>
            
            {/* Theme Toggle - Desktop */}
            <ThemeToggle />
          </nav>

          {/* Mobile Controls - Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-5 h-5">
                <Menu 
                  className={`absolute inset-0 h-5 w-5 transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'
                  }`} 
                />
                <X 
                  className={`absolute inset-0 h-5 w-5 transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'
                  }`} 
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-48 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col space-y-2 py-2 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:translate-x-2"
            >
              <BarChart3 className="h-5 w-5 group-hover:animate-pulse" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/calls"
              onClick={() => setIsMobileMenuOpen(false)}
              className="group flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 transform hover:translate-x-2"
            >
              <Phone className="h-5 w-5 group-hover:animate-bounce" />
              <span className="font-medium">Calls</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Custom CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </header>
  )
}

// Theme Toggle Component
function ThemeToggle() {
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
    </div>
  )
}
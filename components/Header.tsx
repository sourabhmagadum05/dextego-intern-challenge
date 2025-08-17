'use client'

import Link from 'next/link'
import { Phone, BarChart3, Menu, X } from 'lucide-react'
import { useState } from 'react'

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
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
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
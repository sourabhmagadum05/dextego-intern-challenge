# Dextego Sales Dashboard - Intern Assignment

## Expected Features

## 1.Fixed all critical bugs that were preventing the application from running. 
- Fixed invalid JSON format.  
- Added missing commas.  
- Removed trailing commas.  
- Ensured all values are valid (e.g., `"duration": 900` as a number, not a string).

**Bug:**  
The issue was that `totalCalls` was undefined.  

**Fix:**  
```<p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCalls}</p> ```

### Screenshot 📸  

Web dashboard displaying call statistics including total calls, call duration, and user activity. The interface uses a clean, modern design with a white and gray color scheme. Text on the dashboard includes Total Calls, Call Duration, and Active Users, each accompanied by numerical values. The overall tone is professional and organized, supporting efficient data review in a business environment.

![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/dashboard.png?raw=true)

## 2.“Ensured all pages load without errors. Verified the Dashboard and Calls pages, both reloading and working properly.” 

## 3.Detailed call views

![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/dashboardcall.png?raw=true)
![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/dashboardcall.png?raw=true)
**API Route (POST handler in app/api/calls/route.ts)**
- Before:
```import { NextRequest, NextResponse } from 'next/server'
import { Call, ApiResponse } from '../../../lib/types'
import callsData from '../../../data/calls.json'

export async function POST(): Promise<NextResponse<ApiResponse<Call[]>>> {
  try {
    const calls = callsData.calls as Call[]
    
    return NextResponse.json({
      data: calls,
      success: true
    })
  } catch (error) {
    return NextResponse.json({
      data: [],
      success: false,
      error: 'Failed to fetch calls'
    }, { status: 500 })
  }
}
```
- After:
```export async function POST(): Promise<NextResponse<ApiResponse<Call[]>>> {
  try {
    const calls = callsData.calls as Call[]
    return NextResponse.json({
      data: calls,
      success: true
    })
  } catch (error) {
    return NextResponse.json({
      data: [],
      success: false,
      error: 'Failed to fetch calls'
    }, { status: 500 })
  }
}
```
**Change Summary:**

- Removed the unused request: NextRequest parameter.

- Simplified the function signature since the request object was not required.
**CallCard Component (components/CallCard.tsx)**
- Before:
```<p className="text-sm text-gray-500 dark:text-gray-400">
  {formatDate(callDate)}
</p>
```
After:
```<p className="text-sm text-gray-500 dark:text-gray-400">
  {formatDate(call.date)}
</p>
```
**Change Summary:**

- Fixed a bug where callDate was undefined.
- Correctly used call.date from the Call object.

## 4.Dataset Update: Added 25 More Calls

- Added 25 additional call records to data/calls.json.
- To provide richer test data that covers multiple real-world scenarios (completed, no-show, cancelled, follow-up, interested, not-interested) for UI states, analytics, and QA.
![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/addedcalls.png?raw=true)

## 5.Responsive design Error handling Loading states and animations

## Header Component Enhancement

- **Added Animations**: Hover effects, icon animations, and smooth transitions
- **Mobile Responsiveness**: Collapsible navigation menu for mobile devices
- **Sticky Header**: Header stays fixed at top with backdrop blur effect
- **Interactive Elements**: Enhanced hover states and micro-interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation support

### Features:
- Responsive design that works on all screen sizes
- Smooth animations and transitions
- Mobile hamburger menu with slide animation
- Icon hover effects (rotation, bounce, pulse)
- Modern backdrop blur effect

## CallCard Component Enhancement

### Changes Made:
- **Advanced Animations**: Multi-layer hover effects with background gradients and shimmer
- **Responsive Design**: Mobile-first approach with adaptive layouts and text sizes
- **Interactive Elements**: Individual hover states for stats and enhanced visual feedback
- **Performance Optimized**: CSS transform-based animations for smooth performance
- **Accessibility Enhanced**: Better contrast ratios and touch targets

### Features:
- Smooth card lift animation on hover
- Animated background gradient overlay
- Individual stat hover effects with icon animations
- Responsive grid layout (stacked on mobile, grid on desktop)
- Tag management with overflow handling
- Loading shimmer effect
- Enhanced dark mode support

## ThemeToggle Component Enhancement

### Changes Made:
- **Advanced Animations**: Multi-layered animations with icons, sparkles, and ripple effects
- **Responsive Design**: Adaptive sizing and tooltip positioning for all screen sizes
- **Theme-Aware Styling**: Dynamic colors and gradients that respond to current theme
- **Enhanced Interactivity**: Improved hover states, click feedback, and animation states
- **Performance Optimized**: Smooth CSS transitions with proper timing

### Features:
- Smooth icon rotation and scaling transitions
- Dynamic gradient backgrounds with hover glow
- Sparkle animation effects during theme switching
- Responsive tooltips (mobile above, desktop below)
- Click ripple effect animation
- Theme-aware color schemes
- Enhanced accessibility with proper ARIA labels
- Animation state management to prevent rapid clicking

## LoadingSpinner Component Enhancement

### Changes Made:
- **Multiple Variants**: 6 different animation styles (default, dots, pulse, bounce, gradient, branded)
- **Responsive Design**: Size variants and adaptive spacing for all screen sizes
- **Advanced Animations**: Multi-layered effects with sparkles and background pulses
- **Customizable**: Optional text, sizes, and full-screen overlay support
- **Performance Optimized**: CSS-based animations for smooth performance

### Features:
- 6 unique loading animation variants
- Responsive sizing (sm, md, lg, xl)
- Optional loading text with animated dots
- Full-screen overlay capability
- Hover effects and interactive states
- Dark mode optimized
- Branded variant with company theming
- Sparkle and glow effects
- Staggered animation timing

## ErrorMessage Component Enhancement

### Changes Made:
- **Multiple Variants**: 4 different error types (error, warning, info, critical)
- **Advanced Animations**: Shake, bounce, pulse, and fade effects
- **Interactive Features**: Dismissible messages with retry functionality
- **Responsive Design**: Adaptive sizing and spacing for all screen sizes
- **Enhanced Accessibility**: Proper ARIA labels and keyboard navigation

### Features:
- 4 themed variants with appropriate colors and icons
- Shake animation on retry attempts
- Smooth entrance and exit transitions
- Optional dismiss and retry buttons
- Responsive text and icon sizing
- Custom retry button text
- Full-width layout option
- Progress bar for critical errors
- Hover effects and micro-interactions
- Dark mode optimized

## Dashboard Component Enhancement

### Changes Made:
- **Advanced Animations**: Staggered entrance effects, hover animations, and smooth transitions
- **Responsive Design**: Mobile-first approach with adaptive grids and spacing
- **Interactive Features**: Filtering system, view toggle, and refresh functionality
- **Visual Enhancements**: Gradient backgrounds, modern card designs, and hover effects
- **Enhanced UX**: Loading states, empty states, and improved error handling

### Features:
- Staggered animation entrance for stats cards
- Responsive grid layouts (1-2-3-4 column adaptive)
- Interactive filter system (All/Qualified/Recent)
- Manual refresh with loading animation
- View toggle for showing more/fewer calls
- Gradient text effects and backgrounds
- Enhanced hover states with lift animations
- Mobile-optimized touch targets
- Beautiful empty states with call-to-action
- Improved error handling with retry functionality

## Root Layout Enhancement

### Changes Made:
- **Immersive Background**: Mouse-tracking gradients with floating orbs and particles
- **Advanced Loading**: Smooth page load animations with loading overlay
- **Scroll Animations**: Header effects and scroll progress indicator
- **Interactive Effects**: Mouse-responsive backgrounds and scroll-based animations
- **Performance Optimized**: Hardware-accelerated CSS animations

### Features:
- Dynamic background that follows mouse movement
- Floating gradient orbs with rotation animations
- Floating particle system
- Smooth page load transitions
- Staggered content entrance animations
- Scroll-based header scaling
- Gradient scroll progress bar
- Custom animated loading overlay
- Enhanced scrollbar styling
- Global smooth transitions
- Mobile-optimized animations
- Hardware-accelerated performance

## Global CSS Enhancement

### Changes Made:
- **Animation Library**: 20+ custom animations for various use cases
- **Enhanced Background**: Multi-layered animated gradients
- **Interaction Effects**: Hover, focus, and button animations
- **Visual Enhancements**: Glassmorphism, gradient text, custom scrollbars
- **Responsive Design**: Motion-reduced support and mobile optimization

### Features:
- Comprehensive animation utility classes
- Staggered animation system with built-in delays
- Enhanced hover and focus states
- Glassmorphism and backdrop blur effects
- Gradient text utilities
- Custom animated scrollbars
- Loading and shimmer effects
- Scroll-triggered animations
- Reduced motion support
- Print-friendly styles
- Touch-optimized interactions

## Calls Page Enhancement

### Changes Made:
- **Advanced Animations**: Staggered entrance effects, interactive search, and hover animations
- **Enhanced Responsiveness**: Mobile-first design with adaptive layouts and touch optimization
- **Glassmorphism UI**: Backdrop blur effects and modern styling throughout
- **Interactive Features**: View mode toggle, advanced search, enhanced sorting
- **Real-time Stats**: Dynamic statistics that update with filtering

### Features:
- Staggered animation entrance for all elements
- Interactive search with focus animations
- Advanced filtering (search by name, notes, tags)
- Enhanced sorting options (date, name, duration, sentiment)
- Grid/List view toggle with smooth transitions
- Real-time statistics with filter awareness
- Clear filters functionality
- Beautiful empty states with call-to-action
- Glassmorphism design with backdrop blur
- Mobile-optimized touch targets
- Hover lift animations for all cards
- Enhanced loading states with smooth transitions
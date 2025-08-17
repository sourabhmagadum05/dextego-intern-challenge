# Dextego Intern Challenge

## Fixes Implemented ✅

### 1. JSON File (calls.json)  
- Fixed invalid JSON format.  
- Added missing commas.  
- Removed trailing commas.  
- Ensured all values are valid (e.g., `"duration": 900` as a number, not a string).  

### 2. React Code (Dashboard Component)  
**Bug:**  
```jsx
<p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCalls}</p>
Changed it to use
<p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCalls}</p>


Dashboard interface for Dextego Sales Dashboard showing sales call performance metrics. The main section displays four statistics: Total Calls 0, Avg Duration 0m, Qualified Rate 0 percent, and Avg Sentiment 0 percent. Below, a red error message reads Failed to fetch calls under the Recent Calls heading. The environment uses a dark theme with white and colored text, and the overall tone is neutral and professional.

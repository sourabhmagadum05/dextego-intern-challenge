# Dextego Intern Challenge

## Fixes Implemented ✅

### 1.Fixed all critical bugs that were preventing the application from running. 
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

### 2.“Ensured all pages load without errors. Verified the Dashboard and Calls pages, both reloading and working properly.” ✅


### 3.Detailed call views
![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/dashboard.png?raw=true)
![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/dashboardcall.png?raw=true)
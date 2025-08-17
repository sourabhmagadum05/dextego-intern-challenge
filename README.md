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
![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/dashboardcall.png?raw=true)
![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/dashboardcall.png?raw=true)
**API Route (POST handler in app/api/calls/route.ts)**
- Before:
```export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Call[]>>> {
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

### 3.Dataset Update: Added 25 More Calls
- Added 25 additional call records to data/calls.json.
- To provide richer test data that covers multiple real-world scenarios (completed, no-show, cancelled, follow-up, interested, not-interested) for UI states, analytics, and QA.
![Dashboard Screenshot](https://github.com/sourabhmagadum05/dextego-intern-challenge/blob/main/screenshots/addedcalls.png?raw=true)
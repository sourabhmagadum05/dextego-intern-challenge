import { NextRequest, NextResponse } from 'next/server'
import { Call, ApiResponse } from '../../../lib/types'
import callsData from '../../../data/calls.json'


export async function GET(): Promise<NextResponse<ApiResponse<Call[]>>> {
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


export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<Call[]>>> {
  try {
    const body = await req.json()
    console.log('Received new call data:', body)

    // right now just return existing calls (extend to push into DB or JSON file later)
    const calls = callsData.calls as Call[]

    return NextResponse.json({
      data: calls,
      success: true
    })
  } catch (error) {
    return NextResponse.json({
      data: [],
      success: false,
      error: 'Failed to process POST request'
    }, { status: 500 })
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { Call, ApiResponse } from '../../../../lib/types'
import callsData from '../../../../data/calls.json'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse<Call>>> {
  try {
    const calls = callsData.calls as Call[]
    const call = calls.find(c => c.id === params.id)
    
    if (!call) {
      return NextResponse.json({
        data: {} as Call,
        success: false,
        error: 'Call not found'
      }, { status: 404 })
    }
    
    return NextResponse.json({
      data: call,
      success: true
    })
  } catch (error) {
    return NextResponse.json({
      data: {} as Call,
      success: false,
      error: 'Failed to fetch call'
    }, { status: 500 })
  }
}

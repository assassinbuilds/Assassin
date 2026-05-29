import { NextRequest, NextResponse } from 'next/server'
import { handleApiError } from '@/lib/errors'
import { trackUniqueVisitor } from '@/lib/services/visitors'

export const runtime = 'nodejs'

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const forwardedIp = forwardedFor?.split(',')[0]?.trim()

  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    forwardedIp ||
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  try {
    const stats = await trackUniqueVisitor(
      getClientIp(request),
      request.headers.get('user-agent')
    )

    return NextResponse.json(stats)
  } catch (error) {
    return handleApiError(error)
  }
}

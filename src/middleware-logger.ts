import { NextRequest, NextResponse } from 'next/server'
import { logger } from './lib/logger'

export function logRequest(request: NextRequest, response: NextResponse) {
  const start = Date.now()
  const method = request.method
  const path = request.nextUrl.pathname
  const status = response.status

  response.headers.set('X-Response-Time', `${Date.now() - start}ms`)

  logger.info(
    {
      type: 'http_request',
      method,
      path,
      status,
      duration: Date.now() - start,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    },
    `${method} ${path} ${status}`
  )

  return response
}

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Env {
  IMAGES?: R2Bucket
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    // @ts-ignore - Cloudflare env
    const env = process.env as unknown as Env
    
    if (!env.IMAGES) {
      return new NextResponse('R2 not configured', { status: 500 })
    }

    const object = await env.IMAGES.get(filename)

    if (!object) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    headers.set('cache-control', 'public, max-age=31536000, immutable')

    return new NextResponse(object.body, {
      headers,
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    return new NextResponse('Error fetching image', { status: 500 })
  }
}


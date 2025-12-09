import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

interface Env {
  IMAGES?: R2Bucket
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // @ts-ignore - Cloudflare env
    const env = process.env as unknown as Env
    
    if (!env.IMAGES) {
      return NextResponse.json(
        { error: 'R2 storage not configured' },
        { status: 500 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    // Upload to R2
    const arrayBuffer = await file.arrayBuffer()
    await env.IMAGES.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    })

    // Return the URL (you'll need to set up public access or custom domain)
    const imageUrl = `/api/images/${filename}`

    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      filename 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}


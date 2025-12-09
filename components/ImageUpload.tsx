'use client'

import { useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (url: string) => void
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || '')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to R2
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      onImageChange(url)
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Product Image
      </label>

      {/* Preview */}
      {preview && (
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            onClick={() => {
              setPreview('')
              onImageChange('')
            }}
            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {uploading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                {preview ? 'Change Image' : 'Upload Image'}
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>

        {!preview && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <ImageIcon size={16} />
            JPG, PNG, WebP (max 5MB)
          </div>
        )}
      </div>

      {/* Or paste URL */}
      <div>
        <label className="block text-sm text-gray-600 mb-2">
          Or paste image URL:
        </label>
        <input
          type="text"
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value)
            onImageChange(e.target.value)
          }}
          placeholder="/products/image.jpg or R2 URL"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  )
}


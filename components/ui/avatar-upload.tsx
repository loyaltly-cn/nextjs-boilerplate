'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { toast } from '@/components/ui/toast'
import { getDefaultAvatar } from './avatar'

interface AvatarUploadProps {
  currentAvatar?: string | null
  email?: string | null
  onUpload: (file: File) => Promise<void>
}

export function AvatarUpload({ currentAvatar, email, onUpload }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型和大小
    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file', 'error')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('Image size should be less than 5MB', 'error')
      return
    }

    // 创建预览
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      setIsLoading(true)
      await onUpload(file)
    } catch (error) {
      toast('Failed to upload avatar', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#D0BCFF]">
          <Image
            src={preview || currentAvatar || getDefaultAvatar(email)}
            alt="Avatar"
            fill
            className="object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full"
          aria-label="Upload avatar"
        >
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="avatar-upload"
        aria-label="Upload avatar image"
      />
      <label htmlFor="avatar-upload" className="mt-2 text-sm text-[#CAC4D0]">
        Click to upload new avatar
      </label>
    </div>
  )
} 
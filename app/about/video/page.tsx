'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { AboutVideo } from '@/demo_model'
import { useSession } from 'next-auth/react'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Loading } from '@/components/ui/loading'
import { toast } from '@/components/ui/toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function AboutVideoPage() {
  const { data: session } = useSession()
  const [videos, setVideos] = useState<AboutVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    itemId: string | null
  }>({
    open: false,
    itemId: null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAdmin = session?.user?.isAdmin

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch('/server/api/about-video')
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setVideos(data || [])
    } catch (error) {
      console.error('Failed to fetch videos:', error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (uploading || !selectedFile) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/server/api/upload/video', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include'
      })

      let uploadData
      try {
        uploadData = await res.json()
      } catch (error) {
        throw new Error('Invalid server response')
      }

      if (!res.ok) {
        throw new Error(uploadData.error || `HTTP error! status: ${res.status}`)
      }

      const { url } = uploadData
      
      // 创建新的视频记录
      const createRes = await fetch('/server/api/about-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url, userId: session?.user?.id })
      })

      let createData
      try {
        createData = await createRes.json()
      } catch (error) {
        throw new Error('Invalid server response while creating video record')
      }

      if (!createRes.ok) {
        throw new Error(createData.error || 'Failed to create video record')
      }

      await fetchVideos()
      setShowUploadModal(false)
      setSelectedFile(null)
      setPreviewUrl('')
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      toast('Video uploaded successfully', 'success')
    } catch (error) {
      console.error('Failed to upload video:', error)
      toast(
        error instanceof Error ? error.message : 'Failed to upload video',
        'error'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('video/')) {
        toast('Please select a video file', 'error')
        e.target.value = ''
        setSelectedFile(null)
        setPreviewUrl('')
        return
      }

      // // 验证文件大小
      // const maxSize = 100 * 1024 * 1024 // 100MB
      // if (file.size > maxSize) {
      //   toast('File too large. Maximum size is 100MB.', 'error')
      //   e.target.value = ''
      //   setSelectedFile(null)
      //   setPreviewUrl('')
      //   return
      // }

      setSelectedFile(file)
      // 创建临时预览 URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  // 清理预览 URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleDelete = async () => {
    const id = deleteDialog.itemId
    if (!id) return

    setDeleting(id)
    try {
      const res = await fetch(`/server/api/about-video?id=${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      await fetchVideos()
      setDeleteDialog({ open: false, itemId: null })
    } catch (error) {
      console.error('Failed to delete video:', error)
      alert('Failed to delete video')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#E6E1E5]">About Video</h1>
        {isAdmin ? (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors"
          >
            Add New
          </button>
        ) : (
          <div className="text-sm text-[#F2B8B5] bg-[#8C1D18] px-3 py-1 rounded-lg">
            Admin access required
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdmin && showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => {
                setShowUploadModal(false)
                setSelectedFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{
                type: "spring",
                duration: 0.5,
                bounce: 0.3
              }}
              className="relative z-50 w-full max-w-xl"
            >
              <div className="bg-[#2B2930] rounded-xl p-8 w-full max-w-xl relative">
                <button
                  type="button"
                  title="Close modal"
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="absolute top-4 right-4 p-2 text-[#CAC4D0] hover:text-[#E6E1E5] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-[#E6E1E5] mb-6">Upload Video</h2>
                <div className="relative">
                  <form onSubmit={async (e) => {
                    await handleUpload(e)
                    setShowUploadModal(false)
                    setPreviewUrl('')
                  }} className="space-y-6">
                    <div className={`
                      flex flex-col items-center justify-center 
                      border-2 border-dashed rounded-xl p-8 bg-[#1C1B1F] 
                      transition-colors
                      ${selectedFile 
                        ? 'border-[#D0BCFF] bg-[#D0BCFF]/5' 
                        : 'border-[#48464C]/50 hover:border-[#D0BCFF]/50'
                      }
                    `}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        aria-label="Upload video file"
                        className="hidden"
                        onChange={handleFileChange}
                        required
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full cursor-pointer"
                      >
                        {previewUrl ? (
                          <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden bg-black">
                            <video
                              src={previewUrl}
                              controls
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-center">
                            <div className={`
                              w-12 h-12 mb-4 rounded-full flex items-center justify-center
                              ${selectedFile 
                                ? 'bg-[#D0BCFF] text-[#381E72]' 
                                : 'bg-[#D0BCFF]/10 text-[#D0BCFF]'
                              }
                            `}>
                              {selectedFile ? (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                              )}
                            </div>
                            <p className="text-[#E6E1E5] font-medium mb-1">
                              {selectedFile?.name || 'Drop video here or click to upload'}
                            </p>
                            <p className="text-sm text-[#CAC4D0]">
                              MP4, WebM or Ogg (max. 100MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadModal(false)
                          setSelectedFile(null)
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ''
                          }
                        }}
                        className="px-6 py-2 text-[#E6E1E5] rounded-xl hover:bg-[#48464C]/30 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={uploading || !selectedFile}
                        className={`
                          px-6 py-2 rounded-xl font-medium transition-all duration-200
                          ${uploading || !selectedFile
                            ? 'bg-[#D0BCFF]/50 text-[#381E72]/50 cursor-not-allowed'
                            : 'bg-[#D0BCFF] text-[#381E72] hover:bg-[#E8DEF8]'
                          }
                        `}
                      >
                        {uploading ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-[#381E72] border-t-transparent rounded-full animate-spin mr-2" />
                            Uploading...
                          </div>
                        ) : (
                          selectedFile ? 'Upload Video' : 'Select Video'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {loading ? (
        <Loading />
      ) : videos.length === 0 ? (
        <div className="text-center text-[#CAC4D0] py-8 bg-[#2B2930] rounded-xl">
          No videos found. {isAdmin && 'Upload one using the form above.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-[#2B2930] rounded-xl overflow-hidden group relative"
            >
              <div className="aspect-video">
                <video
                  src={video.url}
                  controls
                  className="w-full h-full"
                />
              </div>
              {isAdmin && (
                <button
                  onClick={() => setDeleteDialog({ 
                    open: true, 
                    itemId: video.id 
                  })}
                  disabled={deleting === video.id}
                  className="absolute top-2 right-2 p-2 bg-[#1C1B1F]/80 text-[#E6E1E5] rounded-lg hover:bg-[#48464C] transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete video"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <div className="p-4">
                <div className="text-xs text-[#CAC4D0]">
                  Added {new Date(video.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, itemId: null })}
        loading={deleting === deleteDialog.itemId}
      />
    </div>
  )
} 
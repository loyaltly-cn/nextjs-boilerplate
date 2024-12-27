'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { Loading } from '@/components/ui/loading'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import type { View } from '@/demo_model'

export default function ViewsPage() {
  const [views, setViews] = useState<View[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    background: '',
    order: 0,
    isActive: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean
    itemId: string | null
  }>({
    open: false,
    itemId: null
  })

  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  const fetchViews = async () => {
    try {
      const res = await fetch('/server/api/view')
      const data = await res.json()
      setViews(data.items || [])
    } catch (error) {
      console.error('Failed to fetch views:', error)
      setViews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchViews()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/server/api/upload/image', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) {
        throw new Error('Failed to upload image')
      }

      const { url } = await res.json()
      setFormData(prev => ({ ...prev, background: url }))
    } catch (error) {
      console.error('Failed to upload image:', error)
      toast('Failed to upload image', 'error')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    setSubmitting(true)
    try {
      const res = await fetch('/server/api/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error('Failed to create view')
      }

      await fetchViews()
      setShowModal(false)
      setFormData({
        title: '',
        desc: '',
        background: '',
        order: 0,
        isActive: true
      })
      toast('View created successfully', 'success')
    } catch (error) {
      console.error('Failed to create view:', error)
      toast('Failed to create view', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    const id = deleteDialog.itemId
    if (!id) return

    setDeleting(id)
    try {
      const res = await fetch(`/server/api/view/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete view')
      }

      await fetchViews()
      setDeleteDialog({ open: false, itemId: null })
      toast('View deleted successfully', 'success')
    } catch (error) {
      console.error('Failed to delete view:', error)
      toast('Failed to delete view', 'error')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#E6E1E5]">Views</h1>
        {isAdmin ? (
          <button
            onClick={() => setShowModal(true)}
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

      {loading ? (
        <Loading />
      ) : views.length === 0 ? (
        <div className="text-center text-[#CAC4D0] py-8 bg-[#2B2930] rounded-xl">
          No views found. {isAdmin && 'Add one using the button above.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {views.map((view) => (
            <div
              key={view.id}
              className="bg-[#2B2930] rounded-xl overflow-hidden group relative"
            >
              <img
                src={view.background}
                alt={view.title}
                className="w-full h-48 object-cover"
              />
              {isAdmin && (
                <button
                  onClick={() => setDeleteDialog({ 
                    open: true, 
                    itemId: view.id 
                  })}
                  disabled={deleting === view.id}
                  className="absolute top-2 right-2 p-2 bg-[#1C1B1F]/80 text-[#E6E1E5] rounded-lg hover:bg-[#48464C] transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete view"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-[#E6E1E5] mb-2">{view.title}</h3>
                <p className="text-[#CAC4D0] text-sm mb-4">{view.desc}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#CAC4D0]">Order: {view.order}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    view.isActive 
                      ? 'bg-[#D0BCFF]/20 text-[#D0BCFF]' 
                      : 'bg-[#F2B8B5]/20 text-[#F2B8B5]'
                  }`}>
                    {view.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
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
              <div className="bg-[#2B2930] rounded-xl p-8 w-full relative">
                <button
                  onClick={() => setShowModal(false)}
                  title="Close modal"
                  className="absolute top-4 right-4 p-2 text-[#CAC4D0] hover:text-[#E6E1E5] rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-xl font-semibold text-[#E6E1E5] mb-6">Add New View</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      aria-label="Title"
                      placeholder="Enter title"
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.desc}
                      aria-label="Description"
                      placeholder="Enter description"
                      onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
                      required
                      rows={3}
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Background Image
                    </label>
                    <div 
                      className={`
                        flex flex-col items-center justify-center 
                        border-2 border-dashed rounded-xl p-8 
                        bg-[#1C1B1F] transition-colors
                        ${formData.background 
                          ? 'border-[#D0BCFF] bg-[#D0BCFF]/5' 
                          : dragOver
                            ? 'border-[#D0BCFF] bg-[#D0BCFF]/5'
                            : 'border-[#48464C]/50 hover:border-[#D0BCFF]/50'
                        }
                      `}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOver(true)
                      }}
                      onDragLeave={() => setDragOver(false)}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        aria-label="Upload background image"
                        onChange={handleImageUpload}
                        className="hidden"
                        required={!formData.background}
                      />
                      {formData.background ? (
                        <div className="space-y-4 w-full">
                          <img 
                            src={formData.background} 
                            alt="Preview" 
                            className="w-full rounded-lg"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, background: '' }))}
                              className="px-4 py-2 text-[#E6E1E5] rounded-lg hover:bg-[#48464C]/30 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                          className="flex flex-col items-center text-center cursor-pointer"
                        >
                          <div className="w-12 h-12 mb-4 rounded-full bg-[#D0BCFF]/10 flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#D0BCFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          {imageUploading ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-[#D0BCFF] border-t-transparent rounded-full animate-spin" />
                              <span className="text-[#CAC4D0]">Uploading...</span>
                            </div>
                          ) : (
                            <>
                              <p className="text-[#E6E1E5] font-medium mb-1">
                                Drop image here or click to upload
                              </p>
                              <p className="text-sm text-[#CAC4D0]">
                                PNG, JPG or GIF (max. 5MB)
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      aria-label="Order"
                      placeholder="Enter order number"
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Active
                    </label>
                    <select
                      value={formData.isActive.toString()}
                      aria-label="Status"
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-2 text-[#E6E1E5] rounded-xl hover:bg-[#48464C]/30 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors disabled:opacity-50"
                    >
                      {submitting ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={deleteDialog.open}
        title="Delete View"
        description="Are you sure you want to delete this view? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, itemId: null })}
        loading={deleting === deleteDialog.itemId}
      />
    </div>
  )
} 
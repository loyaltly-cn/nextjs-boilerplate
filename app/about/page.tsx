'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/ui/dashboard-layout'
import { AboutItem } from '@/demo_model'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { Loading } from '@/components/ui/loading'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AboutPage() {
  const [items, setItems] = useState<AboutItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin

  const fetchItems = async () => {
    try {
      const res = await fetch('/server/api/about')
      const data = await res.json()
      setItems(data.items || [])
    } catch (error) {
      console.error('Failed to fetch about items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
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
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }
    
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.')
      return
    }
    
    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await fetch('/server/api/upload/image', {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) throw new Error('Failed to upload image')
      
      const { url } = await res.json()
      setFormData(prev => ({ ...prev, imageUrl: url }))
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('Failed to upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return

    if (!formData.imageUrl || !formData.title || !formData.description || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/server/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        throw new Error('Failed to create item')
      }

      await fetchItems()
      setShowModal(false)
      setFormData({
        title: '',
        description: '',
        content: '',
        imageUrl: '',
        order: 0,
        isActive: true
      })
    } catch (error) {
      console.error('Failed to create item:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    const id = deleteDialog.itemId
    if (!id) return

    setDeleting(id)
    try {
      const res = await fetch(`/server/api/about/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete item')
      }

      await fetchItems()
      setDeleteDialog({ open: false, itemId: null })
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Failed to delete item')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#E6E1E5]">About</h1>
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
      ) : items.length === 0 ? (
        <div className="text-center text-[#CAC4D0] py-8">
          No items found. Click "Add New" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-[#2B2930] rounded-xl overflow-hidden group relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto object-contain"
              />
              <button
                onClick={() => setDeleteDialog({ 
                  open: true, 
                  itemId: item.id 
                })}
                disabled={deleting === item.id}
                className="absolute top-2 right-2 p-2 bg-[#1C1B1F]/80 text-[#E6E1E5] rounded-lg hover:bg-[#48464C] transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                title="Delete item"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-[#E6E1E5]">
                  {item.title}
                </h3>
                <p className="text-[#CAC4D0]">{item.description}</p>
                <div className={`overflow-hidden transition-all duration-300 ${expandedId === item.id ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="mt-2 text-[#CAC4D0] whitespace-pre-wrap">
                    {item.content}
                  </div>
                </div>
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="text-sm text-[#D0BCFF] hover:text-[#E8DEF8] transition-colors"
                >
                  {expandedId === item.id ? 'Show less' : 'Show more'}
                </button>
                <div className="flex justify-between items-center text-sm text-[#CAC4D0]">
                  <span>
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                      locale: enUS
                    })}
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
                <h2 className="text-xl font-semibold text-[#E6E1E5] mb-6">Add New Item</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      aria-label="Title"
                      placeholder="Enter title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      required
                      aria-label="Description"
                      placeholder="Enter description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Content
                    </label>
                    <textarea
                      name="content"
                      required
                      aria-label="Content"
                      placeholder="Enter content"
                      rows={5}
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Image
                    </label>
                    <div 
                      className={`
                        flex flex-col items-center justify-center 
                        border-2 border-dashed rounded-xl p-8 
                        bg-[#1C1B1F] transition-colors
                        ${formData.imageUrl 
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
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        aria-label="Upload image"
                        onChange={handleImageUpload}
                        className="hidden"
                        required={!formData.imageUrl}
                      />
                      {formData.imageUrl ? (
                        <div className="space-y-4 w-full">
                          <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            className="w-full rounded-lg"
                          />
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
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
                      name="order"
                      aria-label="Number"
                      defaultValue={0}
                      className="w-full px-4 py-2 bg-[#1C1B1F] text-[#E6E1E5] rounded-xl border border-[#48464C]/30 focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                      Active
                    </label>
                    <select
                      name="isActive"
                      defaultValue="true"
                      aria-label="Active status"
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
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ open: false, itemId: null })}
        loading={deleting === deleteDialog.itemId}
      />
    </div>
  )
} 
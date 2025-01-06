'use client'

import { AnimatePresence, motion } from 'framer-motion'

interface DialogFormProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onSubmit: () => void
  submitText?: string
  cancelText?: string
}

export function DialogForm({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitText = 'Submit',
  cancelText = 'Cancel'
}: DialogFormProps) {
  if (!open) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md transform rounded-3xl bg-[#2B2930] p-6 shadow-xl"
          >
            <h2 className="text-xl font-semibold text-[#E6E1E5] mb-6">
              {title}
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}>
              {children}

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-full text-[#E6E1E5] hover:bg-[#48464C] transition-colors duration-200"
                >
                  {cancelText}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full text-[#381E72] bg-[#D0BCFF] hover:bg-[#E8DEF8] transition-colors duration-200"
                >
                  {submitText}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  )
} 
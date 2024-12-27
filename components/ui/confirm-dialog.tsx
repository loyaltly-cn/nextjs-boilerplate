'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
  confirmText?: string
  cancelText?: string
}

export function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ConfirmDialogProps) {
  // 处理 ESC 键关闭
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      onCancel()
    }
  }, [open, onCancel])

  // 监听 ESC 键
  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  // 当对话框打开时禁止背景滚动
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onCancel}
            aria-hidden="true"
          />

          {/* 对话框容器 */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ 
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1]
              }}
              className="w-full max-w-sm relative"
            >
              {/* 对话框内容 */}
              <div 
                className="relative bg-[#2B2930] rounded-2xl p-6 shadow-xl border border-[#48464C]/30"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 标题 */}
                <h2 className="text-xl font-semibold text-[#E6E1E5] mb-2">
                  {title}
                </h2>

                {/* 描述 */}
                <p className="text-[#CAC4D0] mb-6">
                  {description}
                </p>

                {/* 按钮组 */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-[#E6E1E5] rounded-xl hover:bg-[#48464C]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D0BCFF] focus:ring-offset-2 focus:ring-offset-[#2B2930]"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="px-4 py-2 bg-[#B3261E] text-white rounded-xl font-medium hover:bg-[#B3261E]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#B3261E] focus:ring-offset-2 focus:ring-offset-[#2B2930]"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
} 
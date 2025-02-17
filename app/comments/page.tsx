'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    en_content: '',
    zn_content: '',
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/server/api/comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/server/api/comments?id=${formData.id}` : '/server/api/comments';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          content: JSON.stringify({ en: formData.en_content, zn: formData.zn_content }),
        }),
      });

      if (response.ok) {
        fetchComments();
        setShowModal(false);
        setFormData({
          id: null,
          name: '',
          en_content: '',
          zn_content: '',
        });
      }
    } catch (error) {
      console.error('Failed to create or update comment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/server/api/comments?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const openEditModal = (comment: any) => {
    setFormData({
      id: comment.id,
      name: comment.name,
      en_content: JSON.parse(comment.content).en,
      zn_content: JSON.parse(comment.content).zn,
    });
    setShowModal(true);
  };

  return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#E6E1E5]">Comments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors"
        >
          Add New
        </button>
      </div>

      {loading ? (
        <div className="min-h-screen bg-[#1C1B1F] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D0BCFF]"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-[#CAC4D0] py-8">
          No comments found. Click "Add New" to create one.
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment: any) => (
            <li key={comment.id} className="p-4 bg-[#2B2930] rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{comment.name}</h2>
              <p>{JSON.parse(comment.content).en}</p>
              <p>{JSON.parse(comment.content).zn}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => openEditModal(comment)}
                  className="px-3 py-1 bg-[#BB86FC] text-[#121212] rounded-lg hover:bg-[#9A67EA] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
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
                type: 'spring',
                duration: 0.5,
                bounce: 0.3,
              }}
              className="relative z-50 w-full max-w-xl bg-[#2B2930] rounded-xl p-8"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-[#CAC4D0] hover:text-[#E6E1E5] rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-xl font-semibold text-[#E6E1E5] mb-6">{formData.id ? 'Edit Comment' : 'Add New Comment'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    English Content
                  </label>
                  <textarea
                    placeholder="Enter English content"
                    value={formData.en_content}
                    onChange={(e) => setFormData(prev => ({ ...prev, en_content: e.target.value }))}
                    className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    Chinese Content
                  </label>
                  <textarea
                    placeholder="Enter Chinese content"
                    value={formData.zn_content}
                    onChange={(e) => setFormData(prev => ({ ...prev, zn_content: e.target.value }))}
                    className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
                  />
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
                    className="px-6 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors"
                  >
                    {formData.id ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
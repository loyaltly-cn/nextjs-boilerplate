'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Information() {
  const [information, setInformation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    en_title: '',
    zn_title: '',
    en_content: '',
    zn_content: '',
    imageUrl: '',
    type: 'INTENDED_PARENT',
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchInformation();
  }, []);

  const fetchInformation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/server/api/information');
      const data = await response.json();
      setInformation(data.data);
    } catch (error) {
      console.error('Failed to fetch information:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  // Upload image
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      setImageUploading(true);
      const response = await fetch('/server/api/upload/image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUploading) return;

    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/server/api/information/${formData.id}` : '/server/api/information';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: JSON.stringify({ en: formData.en_title, zn: formData.zn_title }),
          content: JSON.stringify({ en: formData.en_content, zn: formData.zn_content }),
          url: [formData.imageUrl],
          type: formData.type,
        }),
      });

      if (response.ok) {
        fetchInformation();
        setShowModal(false);
        setFormData({
          id: null,
          title: '',
          en_title: '',
          zn_title: '',
          en_content: '',
          zn_content: '',
          imageUrl: '',
          type: 'INTENDED_PARENT',
        });
      }
    } catch (error) {
      console.error('Failed to create or update information:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/server/api/information?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchInformation();
      }
    } catch (error) {
      console.error('Failed to delete information:', error);
    }
  };

  const openEditModal = (info: any) => {
    setFormData({
      id: info.id,
      title: info.title,
      en_title: info.en_title,
      zn_title: info.zn_title,
      en_content: JSON.parse(info.content).en,
      zn_content: JSON.parse(info.content).zn,
      imageUrl: info.url,
      type: info.type,
    });
    setShowModal(true);
  };

    return (
    <div className="space-y-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#E6E1E5]">Information</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors"
        >
          Add New
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : information.length === 0 ? (
        <div className="text-center text-[#CAC4D0] py-8">
          No items found. Click "Add New" to create one.
        </div>
      ) : (
        <ul className="space-y-4">
          {information.map((info: any) => (
            <li key={info.id} className="p-4 bg-[#1E1E1E] rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{info.title}</h2>
              <p>{info.content}</p>
              <a href={info.url} className="text-blue-500 hover:underline">
                {info.url}
              </a>
              <p>Type: {info.type}</p>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => openEditModal(info)}
                  className="px-3 py-1 bg-[#BB86FC] text-[#121212] rounded-lg hover:bg-[#9A67EA] transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(info.id)}
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
              <h2 className="text-xl font-semibold text-[#E6E1E5] mb-6">{formData.id ? 'Edit Information' : 'Add New Information'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter title"
                    value={formData.en_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, en_title: e.target.value }))}
                    className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="中文标题"
                    value={formData.zn_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, zn_title: e.target.value }))}
                    className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    en Content
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
                    中文内容
                  </label>
                  <textarea
                    placeholder="Enter Chinese content"
                    value={formData.zn_content}
                    onChange={(e) => setFormData(prev => ({ ...prev, zn_content: e.target.value }))}
                    className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    Image
                  </label>
                  <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 bg-[#1C1B1F] transition-colors ${
                      formData.imageUrl
                        ? 'border-[#D0BCFF] bg-[#D0BCFF]/5'
                        : dragOver
                        ? 'border-[#D0BCFF] bg-[#D0BCFF]/5'
                        : 'border-[#48464C]/50 hover:border-[#D0BCFF]/50'
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required={!formData.imageUrl}
                    />
                    {formData.imageUrl ? (
                      <div className="space-y-4 w-full">
                        <img src={formData.imageUrl} alt="Preview" className="w-full rounded-lg" />
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
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        {imageUploading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-[#D0BCFF] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[#CAC4D0]">Uploading...</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-[#E6E1E5] font-medium mb-1">Drop image here or click to upload</p>
                            <p className="text-sm text-[#CAC4D0]">PNG, JPG or GIF (max. 5MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="type-select" className="block text-sm font-medium text-[#CAC4D0] mb-1">
                    Type
                  </label>
                  <select
                    id="type-select"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full p-3 bg-[#1E1E1E] border border-[#333] rounded-lg focus:outline-none focus:border-[#BB86FC]"
                  >
                    <option value="INTENDED_PARENT">Intended Parent</option>
                    <option value="SURROGATE_MOTHER">Surrogate Mother</option>
                    <option value="Other">Other</option>
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
                    disabled={imageUploading}
                    className="px-6 py-2 bg-[#D0BCFF] text-[#381E72] rounded-xl hover:bg-[#E8DEF8] transition-colors disabled:opacity-50"
                  >
                    {imageUploading ? 'Uploading...' : formData.id ? 'Update' : 'Create'}
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
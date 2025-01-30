'use client'

import React, { useState, useEffect } from 'react';

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [en_content, set_en_Content] = useState('');
  const [zn_content, set_zn_Content] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleCreateComment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/server/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, content:JSON.stringify({en:en_content,zn:zn_content}) }),
      });
      if (response.ok) {
        fetchComments();
        setName('');
        set_en_Content('');
        set_zn_Content('');
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComment = async (id: string, updatedContent: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/server/api/comments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, content: updatedContent }),
      });
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to update comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/server/api/comments?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchComments();
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-[#121212] text-[#E0E0E0] rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Comments</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-2 bg-[#1E1E1E] border border-[#333] rounded-md focus:outline-none focus:border-[#BB86FC]"
        />
        <textarea
          placeholder="en content"
          value={en_content}
          onChange={(e) => set_en_Content(e.target.value)}
          className="w-full p-2 mb-2 bg-[#1E1E1E] border border-[#333] rounded-md focus:outline-none focus:border-[#BB86FC]"
        />
        <textarea
          placeholder="中文内容"
          value={zn_content}
          onChange={(e) => set_zn_Content(e.target.value)}
          className="w-full p-2 mb-2 bg-[#1E1E1E] border border-[#333] rounded-md focus:outline-none focus:border-[#BB86FC]"
        />
        <button
          onClick={handleCreateComment}
          disabled={loading}
          className="w-full p-2 bg-[#BB86FC] text-[#121212] rounded-md hover:bg-[#9A67EA] transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Add Comment'}
        </button>
      </div>
      <ul className="space-y-4">
        {comments.map((comment: any) => (
          <li key={comment.id} className="p-4 bg-[#1E1E1E] rounded-md shadow-sm">
            <strong className="block text-lg">{comment.name}</strong>
            <p className="mb-2">{JSON.parse(comment.content).en}</p>
            <p className="mb-2">{JSON.parse(comment.content).zn}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="p-1 bg-[#CF6679] text-[#121212] rounded-md hover:bg-[#B00020] transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => handleUpdateComment(comment.id, prompt('Update content:', comment.content) || comment.content)}
                className="p-1 bg-[#03DAC6] text-[#121212] rounded-md hover:bg-[#018786] transition-colors"
              >
                Update
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
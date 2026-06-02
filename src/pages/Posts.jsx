import React, { useState, useEffect } from 'react';
import { PenTool, Save, X, Edit, Trash2 } from 'lucide-react';
import { mockPosts } from '../data/mockPosts';
// Simple utility to generate a unique id (timestamp‑based)
const generateId = () => Date.now().toString();

export default function Posts() {
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState(() => { const stored = localStorage.getItem('primeboard_posts'); return stored ? JSON.parse(stored) : mockPosts; });
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // Load persisted posts
  useEffect(() => {
    const stored = localStorage.getItem('primeboard_posts');
    if (stored) setPosts(JSON.parse(stored));
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem('primeboard_posts', JSON.stringify(posts));
  }, [posts]);

  // generateId defined earlier – no need to redeclare

  const handleAdd = () => {
    if (!message.trim()) return;
    const newPost = {
      id: generateId(),
      text: message.trim(),
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
    setMessage('');
  };

  const startEdit = (post) => {
    setEditId(post.id);
    setEditText(post.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const handleUpdate = (id) => {
    if (!editText.trim()) return;
    setPosts(posts.map(p => p.id === id ? { ...p, text: editText.trim(), editedAt: new Date().toISOString() } : p));
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const clearAll = () => {
    if (window.confirm('Clear all posts?')) {
      setPosts([]);
    }
  };

  return (
    <div className="w-full space-y-8 py-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <PenTool size={24} className="text-indigo-600 dark:text-indigo-300" />
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">Posts</h1>
      </div>

      {/* Input area */}
      <div className="glass-card p-4 flex flex-col gap-3">
        <textarea
          rows={3}
          placeholder="Write something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all active:scale-95"
          >
            Post
          </button>
          {posts.length > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Clear All
          </button>
        )}
        </div>
      </div>

      {/* List of posts */}
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="glass-card p-4">
            {editId === p.id ? (
              <div className="flex flex-col gap-2">
                <textarea
                  rows={3}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200"
                />
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleUpdate(p.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    <Save size={14} /> Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{p.text}</p>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(p.createdAt).toLocaleString()}
                  {p.editedAt && ' (edited)'}
                </span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <Edit size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts yet. Start the conversation!</p>
        )}
      </div>
    </div>
  );
}

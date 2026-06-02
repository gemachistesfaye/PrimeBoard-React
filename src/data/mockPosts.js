// Mock posts for the Posts page
// Each post mimics the shape used in Posts.jsx
export const mockPosts = [
  {
    id: '1',
    text: 'Welcome to PrimeBoard! 🎉 This is a mock post to showcase the UI.',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    text: 'Remember to check the dashboard for real‑time enrollment stats.',
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: '3',
    text: 'Feel free to edit or delete any of these mock posts.',
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(), // 1 day ago
  },
];

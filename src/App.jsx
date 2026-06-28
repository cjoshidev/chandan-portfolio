import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from './theme';
import Header from './components/Header';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';

const NotFound = () => (
  <div style={{ padding: 'var(--spacing-xl) 0', maxWidth: '480px' }}>
    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)', marginBottom: 'var(--spacing-sm)' }}>404</p>
    <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2rem)', marginBottom: 'var(--spacing-md)' }}>Page not found</h1>
    <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
      This path doesn't exist. It may have moved or never existed.
    </p>
    <Link to="/" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)', paddingBottom: '1px', fontSize: '0.95rem' }}>
      ← back to home
    </Link>
  </div>
);

function App() {
  return (
    <>
      <ThemeProvider>
        <Router>
          <CommandPalette />
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
      <Analytics />
    </>
  );
}

export default App;

import React from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';

const Blog = () => {
    // Eager load posts at build time
    const modules = import.meta.glob('../content/*.md', { as: 'raw', eager: true });

    const posts = Object.entries(modules).map(([path, content]) => {
        const { attributes } = fm(content);
        const slug = path.split('/').pop().replace('.md', '');
        return {
            slug,
            ...attributes
        };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div style={{ paddingTop: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Blog</h1>

            <div className="post-list">
                {posts.map(post => (
                    <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                        <div style={{
                            fontSize: '0.9rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '4px'
                        }}>
                            {new Date(post.date).toLocaleDateString('en-GB', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                        <h2 style={{
                            fontSize: '1.2rem',
                            marginBottom: 'var(--spacing-sm)',
                            lineHeight: 1.4,
                            color: 'var(--text-primary)'
                        }}>
                            {post.title}
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '1rem',
                            lineHeight: 1.5
                        }}>
                            {post.description}
                        </p>
                    </Link>
                ))}

                {posts.length === 0 && (
                    <p>No posts found.</p>
                )}
            </div>
        </div>
    );
};

export default Blog;

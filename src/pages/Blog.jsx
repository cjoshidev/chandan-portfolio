import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';

const readTime = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 200));

const Blog = () => {
    const [activeTag, setActiveTag] = useState(null);

    const modules = import.meta.glob('../content/*.md', { as: 'raw', eager: true });

    const posts = Object.entries(modules).map(([path, content]) => {
        const { attributes, body } = fm(content);
        const slug = path.split('/').pop().replace('.md', '');
        return { slug, ...attributes, body };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const allTags = [...new Set(posts.flatMap(p => p.tags || []))];

    const visible = activeTag
        ? posts.filter(p => (p.tags || []).includes(activeTag))
        : posts;

    return (
        <div style={{ paddingTop: 'var(--spacing-xl)', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: allTags.length ? 'var(--spacing-md)' : 'var(--spacing-lg)', fontSize: '1.8rem', letterSpacing: '-0.02em' }}>
                Writing
            </h1>

            {allTags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--spacing-lg)' }}>
                    <button
                        onClick={() => setActiveTag(null)}
                        style={{
                            background: 'none',
                            border: `1px solid ${activeTag === null ? 'var(--text-primary)' : 'var(--border)'}`,
                            color: activeTag === null ? 'var(--text-primary)' : 'var(--text-secondary)',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                        }}
                    >
                        All
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                            style={{
                                background: 'none',
                                border: `1px solid ${activeTag === tag ? 'var(--text-primary)' : 'var(--border)'}`,
                                color: activeTag === tag ? 'var(--text-primary)' : 'var(--text-secondary)',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                cursor: 'pointer'
                            }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}

            <div>
                {visible.map(post => (
                    <Link key={post.slug} to={`/blog/${post.slug}`} className="blog-card">
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', gap: '12px' }}>
                            <span>
                                {new Date(post.date).toLocaleDateString('en-GB', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                })}
                            </span>
                            <span>{readTime(post.body)} min read</span>
                            {(post.tags || []).map(tag => (
                                <span key={tag} style={{ color: 'var(--accent)' }}>{tag}</span>
                            ))}
                        </div>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '6px', lineHeight: 1.4, color: 'var(--text-primary)', fontWeight: 600 }}>
                            {post.title}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                            {post.description}
                        </p>
                    </Link>
                ))}

                {visible.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No posts for this tag yet.</p>
                )}
            </div>
        </div>
    );
};

export default Blog;

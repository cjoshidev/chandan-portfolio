import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import fm from 'front-matter';
import { useMeta } from '../hooks/useMeta';

const readTime = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 200));

const TYPE_LABELS = {
    postmortem: 'postmortem',
    note: 'note',
    opinion: 'opinion',
    rfc: 'rfc',
    til: 'til'
};

const TypeBadge = ({ type }) => {
    if (!type) return null;
    return (
        <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            padding: '2px 7px'
        }}>
            {TYPE_LABELS[type] || type}
        </span>
    );
};

const Blog = () => {
    const [activeTag, setActiveTag] = useState(null);

    useMeta({
        title: 'Logs — Chandan Joshi',
        description: 'Postmortems, engineering notes, and the occasional opinion — what I learned building and running things.',
        path: '/blog',
    });

    const modules = import.meta.glob('../content/*.md', { query: '?raw', import: 'default', eager: true });

    const posts = Object.entries(modules).map(([path, content]) => {
        const { attributes, body } = fm(content);
        const slug = path.split('/').pop().replace('.md', '');
        return { slug, ...attributes, body };
    }).filter(p => !p.draft).sort((a, b) => new Date(b.date) - new Date(a.date));

    const allTags = [...new Set(posts.flatMap(p => p.tags || []))];

    const visible = activeTag
        ? posts.filter(p => (p.tags || []).includes(activeTag))
        : posts;

    return (
        <div className="blog-listing-page" style={{ paddingTop: 'var(--spacing-xl)', maxWidth: '640px' }}>
            <header style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.03em', marginBottom: 'var(--spacing-sm)' }}>
                    Logs
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '520px' }}>
                    Postmortems, engineering notes, and the occasional opinion — what I learned building and running things.
                </p>
            </header>

            {allTags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: 'var(--spacing-lg)' }}>
                    <button
                        onClick={() => setActiveTag(null)}
                        style={{
                            background: 'none',
                            fontFamily: 'var(--font-mono)',
                            border: `1px solid ${activeTag === null ? 'var(--text-primary)' : 'var(--border)'}`,
                            color: activeTag === null ? 'var(--text-primary)' : 'var(--text-secondary)',
                            padding: '4px 12px',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            cursor: 'pointer'
                        }}
                    >
                        all
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                            style={{
                                background: 'none',
                                fontFamily: 'var(--font-mono)',
                                border: `1px solid ${activeTag === tag ? 'var(--text-primary)' : 'var(--border)'}`,
                                color: activeTag === tag ? 'var(--text-primary)' : 'var(--text-secondary)',
                                padding: '4px 12px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
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
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <TypeBadge type={post.type} />
                            <span style={{ fontFamily: 'var(--font-mono)' }}>
                                {new Date(post.date).toLocaleDateString('en-GB', {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                })}
                            </span>
                            <span style={{ fontFamily: 'var(--font-mono)' }}>{readTime(post.body)} min read</span>
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

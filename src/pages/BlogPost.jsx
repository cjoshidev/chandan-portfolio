import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import fm from 'front-matter';

const readTime = (body) => Math.max(1, Math.round(body.split(/\s+/).length / 200));

const BlogPost = () => {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({});
    const [mins, setMins] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const modules = import.meta.glob('../content/*.md', { as: 'raw', eager: true });
        const postData = modules[`../content/${slug}.md`];

        if (!postData) {
            setError(true);
            return;
        }

        const { attributes, body } = fm(postData);
        setMeta(attributes);
        setContent(body);
        setMins(readTime(body));
        document.title = `${attributes.title} — Chandan Joshi`;

        return () => { document.title = 'Chandan Joshi'; };
    }, [slug]);

    if (error) {
        return (
            <div style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
                <h2>Post not found</h2>
                <Link to="/blog" style={{ color: 'var(--accent)' }}>Back to writing</Link>
            </div>
        );
    }

    if (!content) return null;

    return (
        <article style={{ padding: 'var(--spacing-xl) 0', maxWidth: '680px' }}>
            <header style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Link to="/blog" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
                    &larr; Writing
                </Link>
                <h1 style={{
                    fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                    marginTop: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-sm)',
                    lineHeight: 1.25,
                    letterSpacing: '-0.02em'
                }}>
                    {meta.title}
                </h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <span>
                        {new Date(meta.date).toLocaleDateString('en-GB', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </span>
                    {mins && <span>{mins} min read</span>}
                    {(meta.tags || []).map(tag => (
                        <span key={tag} style={{ color: 'var(--accent)' }}>{tag}</span>
                    ))}
                </div>
            </header>

            <div className="markdown-content">
                <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                        img: ({ ...props }) => <img style={{ maxWidth: '100%', borderRadius: '6px', margin: '24px 0' }} {...props} />,
                        h2: ({ ...props }) => <h2 style={{ margin: '36px 0 14px', fontSize: '1.35rem', letterSpacing: '-0.01em' }} {...props} />,
                        h3: ({ ...props }) => <h3 style={{ margin: '28px 0 10px', fontSize: '1.1rem' }} {...props} />,
                        p: ({ ...props }) => <p style={{ marginBottom: '1.4em', color: 'var(--text-primary)', lineHeight: 1.75 }} {...props} />,
                        blockquote: ({ ...props }) => (
                            <blockquote style={{
                                borderLeft: '3px solid var(--accent)',
                                paddingLeft: '16px',
                                margin: '24px 0',
                                color: 'var(--text-secondary)',
                                fontStyle: 'italic'
                            }} {...props} />
                        ),
                        li: ({ ...props }) => <li style={{ marginBottom: '6px', marginLeft: '20px', lineHeight: 1.65, color: 'var(--text-primary)' }} {...props} />,
                        a: ({ ...props }) => <a style={{ color: 'var(--accent)', textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: '3px' }} {...props} />,
                        strong: ({ ...props }) => <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }} {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    );
};

export default BlogPost;

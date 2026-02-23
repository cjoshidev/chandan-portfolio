import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import fm from 'front-matter';

const BlogPost = () => {
    const { slug } = useParams();
    const [content, setContent] = useState('');
    const [meta, setMeta] = useState({});
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadPost = async () => {
            try {
                // Dynamic import logic for Vite
                // import.meta.glob is eager by default usually, but we need dynamic import for specific files
                // OR we can use the same glob strategy as Blog.jsx but find the specific one.
                // For simplicity and avoiding complex async/await with dynamic import paths which Vite handles strictly:
                const modules = import.meta.glob('../content/*.md', { as: 'raw', eager: true });

                const path = `../content/${slug}.md`;
                const postData = modules[path];

                if (!postData) {
                    throw new Error('Post not found');
                }

                const { attributes, body } = fm(postData);
                setMeta(attributes);
                setContent(body);
            } catch (err) {
                console.error(err);
                setError(true);
            }
        };

        loadPost();
    }, [slug]);

    if (error) {
        return (
            <div style={{ padding: 'var(--spacing-xl) 0', textAlign: 'center' }}>
                <h2>Post not found</h2>
                <Link to="/blog">Back to Blog</Link>
            </div>
        );
    }

    if (!content) return <div>Loading...</div>;

    return (
        <article className="blog-post" style={{ padding: 'var(--spacing-xl) 0' }}>
            <header style={{ marginBottom: 'var(--spacing-lg)' }}>
                <Link to="/blog" style={{ fontSize: '0.9rem', color: 'var(--accent)', textDecoration: 'none' }}>
                    &larr; Back
                </Link>
                <h1 style={{
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                    marginTop: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-sm)',
                    lineHeight: 1.2
                }}>
                    {meta.title}
                </h1>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {new Date(meta.date).toLocaleDateString()}
                </div>
            </header>

            <div className="markdown-content" style={{ lineHeight: 1.7, fontSize: '1.05rem' }}>
                <ReactMarkdown
                    components={{
                        img: ({ ...props }) => <img style={{ maxWidth: '100%', borderRadius: '8px', margin: '20px 0' }} {...props} />,
                        h2: ({ ...props }) => <h2 style={{ margin: '32px 0 16px', fontSize: '1.5rem' }} {...props} />,
                        h3: ({ ...props }) => <h3 style={{ margin: '24px 0 12px', fontSize: '1.2rem' }} {...props} />,
                        p: ({ ...props }) => <p style={{ marginBottom: '1.5em', color: 'var(--text-primary)' }} {...props} />,
                        blockquote: ({ ...props }) => (
                            <blockquote style={{
                                borderLeft: '4px solid var(--accent)',
                                paddingLeft: '16px',
                                margin: '20px 0',
                                color: 'var(--text-secondary)',
                                fontStyle: 'italic'
                            }} {...props} />
                        ),
                        li: ({ ...props }) => <li style={{ marginBottom: '8px', marginLeft: '20px' }} {...props} />,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </article>
    );
};

export default BlogPost;

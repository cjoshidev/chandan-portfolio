import React from 'react';

const Hero = () => {
    return (
        <section className="hero" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-lg)' }}>
            <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-sm)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
            }}>
                Software Engineer
            </p>
            <h1 style={{
                fontSize: 'clamp(2.2rem, 5vw, 3rem)',
                marginBottom: 'var(--spacing-md)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em'
            }}>
                Chandan Joshi
            </h1>
            <p style={{
                fontSize: '1.05rem',
                color: 'var(--text-secondary)',
                maxWidth: '540px',
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.65
            }}>
                Software engineer who turns ideas into shipped products.
                Five years across React, Node.js, and AWS —
                building UIs that scale and systems that hold.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-lg)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span style={{ width: '7px', height: '7px', backgroundColor: 'var(--accent)', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}></span>
                    <span>Full Stack Engineer at ClearRoute</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <span>Pune, India</span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                <a
                    href="https://www.linkedin.com/in/chandan015/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        fontSize: '0.9rem',
                        color: 'var(--accent)',
                        fontWeight: 500,
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--accent)',
                        paddingBottom: '1px'
                    }}
                >
                    LinkedIn
                </a>
                <a
                    href="mailto:chandanjoshi.dev@gmail.com"
                    style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        borderBottom: '1px solid var(--text-secondary)',
                        paddingBottom: '1px'
                    }}
                >
                    Email
                </a>
            </div>
        </section>
    );
};

export default Hero;

import React from 'react';

const Hero = () => {
    return (
        <section className="hero" style={{ padding: 'var(--spacing-xl) 0' }}>
            <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                marginBottom: 'var(--spacing-md)',
                lineHeight: 1.1
            }}>
                Hey, I'm Chandan! 👋
            </h1>
            <p style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                maxWidth: '600px',
                marginBottom: 'var(--spacing-md)'
            }}>
                I'm a developer passionate about building clean, minimal, and performant web applications.
                Currently exploring the intersection of design and engineering.
            </p>
            {/* Optional: Add status or location here */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent)', borderRadius: '50%', display: 'inline-block' }}></span>
                <span>Open to new opportunities</span>
            </div>
        </section>
    );
};

export default Hero;

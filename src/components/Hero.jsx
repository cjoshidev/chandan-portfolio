import React from 'react';

const metrics = [
    { value: '5+ yrs', label: 'shipping production software' },
    { value: '+35%', label: 'conversion from a feature I built', good: true },
    { value: '−45%', label: 'regression QA effort', good: true },
    { value: '2m → 20s', label: 'build pipeline I rebuilt' }
];

const openPalette = () => window.dispatchEvent(new CustomEvent('cmdk:toggle'));

const Hero = () => {
    return (
        <section className="hero reveal" style={{ padding: 'var(--spacing-xl) 0 var(--spacing-lg)' }}>
            {/* Status line */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>chandan.joshi</span>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '7px',
                        fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                        color: 'var(--accent)', border: '1px solid var(--border)',
                        padding: '4px 10px', borderRadius: '999px'
                    }}>
                        <span className="status-dot" style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'inline-block' }}></span>
                        all systems operational
                    </span>
                </div>
                <button
                    onClick={openPalette}
                    style={{
                        background: 'none', cursor: 'pointer',
                        fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                        color: 'var(--text-secondary)', border: '1px solid var(--border)',
                        padding: '5px 10px', borderRadius: '6px'
                    }}
                    aria-label="Open command palette"
                >
                    ⌘K to navigate
                </button>
            </div>

            <p style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)'
            }}>
                Full Stack Engineer · frontend · backend · infrastructure
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
                maxWidth: '560px',
                marginBottom: 'var(--spacing-lg)',
                lineHeight: 1.65
            }}>
                I build and run software end to end — interfaces that scale, services that hold,
                and the infrastructure underneath them. And yes, this site reports its own status.
            </p>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', marginBottom: 'var(--spacing-xl)' }}>
                <a
                    href="https://www.linkedin.com/in/chandan015/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 500, borderBottom: '1px solid var(--accent)', paddingBottom: '1px' }}
                >
                    LinkedIn
                </a>
                <a
                    href="https://github.com/cjoshidev"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--text-secondary)', paddingBottom: '1px' }}
                >
                    GitHub
                </a>
                <a
                    href="mailto:chandanjoshi.dev@gmail.com"
                    style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--text-secondary)', paddingBottom: '1px' }}
                >
                    Email
                </a>
            </div>

            {/* Metric strip */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 'var(--spacing-md)'
            }}>
                {metrics.map((m, i) => (
                    <div key={i} style={{
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: 'var(--spacing-md)'
                    }}>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            color: m.good ? 'var(--accent)' : 'var(--text-primary)'
                        }}>
                            {m.value}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginTop: '4px' }}>
                            {m.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;

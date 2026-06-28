import React, { useState, useCallback } from 'react';

const SubscribeForm = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');
        setErrorMsg('');

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
            });

            const body = await res.json();

            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                setStatus('error');
                setErrorMsg(body.error || 'Something went wrong.');
            }
        } catch {
            setStatus('error');
            setErrorMsg('Network error. Please try again.');
        }
    }, [email]);

    if (status === 'success') {
        return (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-lg)', marginTop: 'var(--spacing-lg)' }}>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent)' }}>
                    subscribed. new posts will land in your inbox.
                </p>
            </div>
        );
    }

    return (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-lg)', marginTop: 'var(--spacing-lg)' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)', letterSpacing: '0.02em' }}>
                new posts to your inbox.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={status === 'loading'}
                    style={{
                        flex: '1 1 200px',
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.875rem',
                        padding: '6px 10px',
                        outline: 'none',
                        minWidth: 0,
                    }}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                        background: 'none',
                        border: '1px solid var(--border)',
                        borderRadius: '4px',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        letterSpacing: '0.04em',
                        padding: '6px 14px',
                        cursor: status === 'loading' ? 'default' : 'pointer',
                        opacity: status === 'loading' ? 0.6 : 1,
                        transition: 'opacity 0.2s ease',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {status === 'loading' ? 'subscribing...' : 'subscribe'}
                </button>
            </form>
            {status === 'error' && (
                <p style={{ marginTop: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#e05252' }}>
                    {errorMsg}
                </p>
            )}
        </div>
    );
};

export default SubscribeForm;

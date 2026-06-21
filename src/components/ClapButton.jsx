import React, { useState, useEffect, useCallback } from 'react';

const ClapButton = ({ slug }) => {
    const storageKey = `clapped-${slug}`;
    const [count, setCount] = useState(null);
    const [hasClapped, setHasClapped] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setHasClapped(!!localStorage.getItem(storageKey));

        fetch(`/api/clap?slug=${encodeURIComponent(slug)}`)
            .then((r) => r.json())
            .then(({ count: c }) => setCount(c ?? 0))
            .catch(() => setCount(0));
    }, [slug, storageKey]);

    const handleClap = useCallback(async () => {
        if (hasClapped) return;

        setHasClapped(true);
        setCount((c) => (c ?? 0) + 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);
        localStorage.setItem(storageKey, '1');

        try {
            const res = await fetch(`/api/clap?slug=${encodeURIComponent(slug)}`, { method: 'POST' });
            const { count: confirmed } = await res.json();
            if (res.ok && confirmed != null) {
                setCount(confirmed);
            } else {
                throw new Error('clap failed');
            }
        } catch {
            setHasClapped(false);
            setCount((c) => Math.max(0, (c ?? 1) - 1));
            localStorage.removeItem(storageKey);
        }
    }, [hasClapped, slug, storageKey]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', margin: 'var(--spacing-lg) 0' }}>
            <button
                onClick={handleClap}
                disabled={hasClapped}
                aria-label={hasClapped ? 'Already clapped' : 'Clap for this post'}
                style={{
                    background: 'none',
                    border: `1px solid ${hasClapped ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: '50%',
                    width: '52px',
                    height: '52px',
                    fontSize: '1.5rem',
                    cursor: hasClapped ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'border-color 0.2s ease, transform 0.15s ease',
                    transform: isAnimating ? 'scale(1.2)' : 'scale(1)',
                    opacity: hasClapped ? 0.7 : 1,
                }}
            >
                👏
            </button>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', minWidth: '24px', textAlign: 'center' }}>
                {count === null ? '—' : count}
            </span>
        </div>
    );
};

export default ClapButton;

import React, { useState, useCallback } from 'react';

const ShareIcon = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const ShareButton = ({ title, slug }) => {
    const [copied, setCopied] = useState(false);

    const url = `${import.meta.env.VITE_SITE_URL || window.location.origin}/blog/${slug}`;

    const handleShare = useCallback(async () => {
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // user cancelled — no-op
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard blocked (non-HTTPS) — silent fail
        }
    }, [title, url]);

    return (
        <button
            onClick={handleShare}
            aria-label="Share this post"
            style={{
                background: 'none',
                border: `1px solid ${copied ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: '4px',
                color: copied ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                padding: '2px 8px',
                marginLeft: 'auto',
                transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
        >
            {copied ? 'copied!' : <><ShareIcon /> share</>}
        </button>
    );
};

export default ShareButton;

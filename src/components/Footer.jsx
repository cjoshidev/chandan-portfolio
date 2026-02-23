import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            marginTop: 'var(--spacing-xl)',
            padding: 'var(--spacing-lg) 0',
            borderTop: '1px solid #222',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem'
        }}>
            <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: 'var (--spacing-md)' }}>GitHub</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: 'var(--spacing-md)' }}>Twitter</a>
                <a href="mailto:email@example.com">Email</a>
            </div>
            <p>&copy; {new Date().getFullYear()} Chandan Joshi. All rights reserved.</p>
        </footer>
    );
};

export default Footer;

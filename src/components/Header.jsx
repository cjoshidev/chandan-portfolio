import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <header style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--spacing-md)',
            maxWidth: 'var(--max-width)',
            margin: '0 auto',
            position: 'sticky',
            top: 0,
            backgroundColor: 'var(--bg-primary)',
            zIndex: 100,
            borderBottom: '1px solid var(--border)'
        }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>chandan.</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <nav>
                    <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none', margin: 0, padding: 0, fontSize: '0.9rem' }}>
                        {isHome ? (
                            <>
                                <li><a href="#work" style={{ color: 'var(--text-secondary)' }}>Work</a></li>
                                <li><a href="#skills" style={{ color: 'var(--text-secondary)' }}>Skills</a></li>
                                <li><a href="#contact" style={{ color: 'var(--text-secondary)' }}>Contact</a></li>
                            </>
                        ) : null}
                        <li><Link to="/blog" style={{ color: 'var(--text-secondary)' }}>Blog</Link></li>
                    </ul>
                </nav>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;

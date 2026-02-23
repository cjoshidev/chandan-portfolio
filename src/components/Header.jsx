import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = () => {
    return (
        <header className="header" style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--spacing-md)',
            maxWidth: 'var(--max-width)',
            margin: '0 auto'
        }}>
            <div className="logo" style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>chandan.</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <nav>
                    <ul style={{ display: 'flex', gap: 'var(--spacing-md)', listStyle: 'none', margin: 0, padding: 0 }}>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;

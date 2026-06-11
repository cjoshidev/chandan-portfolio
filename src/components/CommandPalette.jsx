import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../theme';

// Small inline icons (stroke inherits currentColor)
const Icon = ({ d, children }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {d ? <path d={d} /> : children}
    </svg>
);

const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [active, setActive] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const goToSection = useCallback((id) => {
        const scroll = () => {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(scroll, 80);
        } else {
            scroll();
        }
    }, [location.pathname, navigate]);

    const commands = useMemo(() => [
        { id: 'projects', group: 'Navigate', label: 'Selected work', hint: 'projects portfolio repos', icon: <Icon><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></Icon>, run: () => goToSection('projects') },
        { id: 'systems', group: 'Navigate', label: 'Systems', hint: 'stack frontend backend infra skills', icon: <Icon d="M3 12h4l3 8 4-16 3 8h4" />, run: () => goToSection('systems') },
        { id: 'work', group: 'Navigate', label: 'Deploy log', hint: 'experience history jobs work', icon: <Icon d="M12 8v4l3 3M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />, run: () => goToSection('work') },
        { id: 'contact', group: 'Navigate', label: 'Contact', hint: 'reach out hire', icon: <Icon d="M4 4h16v16H4zM4 7l8 6 8-6" />, run: () => goToSection('contact') },
        { id: 'blog', group: 'Navigate', label: 'Logs', hint: 'blog posts articles writing postmortem notes', icon: <Icon d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />, run: () => navigate('/blog') },
        { id: 'email', group: 'Links', label: 'Email me', hint: 'mail contact', icon: <Icon d="M4 4h16v16H4zM4 7l8 6 8-6" />, run: () => { window.location.href = 'mailto:chandanjoshi.dev@gmail.com'; } },
        { id: 'github', group: 'Links', label: 'GitHub', hint: 'code repos source', icon: <Icon d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />, run: () => window.open('https://github.com/cjoshidev', '_blank', 'noopener') },
        { id: 'linkedin', group: 'Links', label: 'LinkedIn', hint: 'profile network', icon: <Icon><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></Icon>, run: () => window.open('https://www.linkedin.com/in/chandan015/', '_blank', 'noopener') },
        { id: 'theme', group: 'Actions', label: theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme', hint: 'toggle dark light mode appearance', icon: <Icon d="M12 3a9 9 0 1 0 9 9c-2 2-7 2-9 0s-2-7 0-9z" />, run: () => toggleTheme() },
    ], [goToSection, navigate, toggleTheme, theme]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return commands;
        return commands.filter(c =>
            (c.label + ' ' + c.hint + ' ' + c.group).toLowerCase().includes(q)
        );
    }, [query, commands]);

    // Keep a ref of `open` so the (once-registered) key listener reads fresh state
    const openRef = useRef(open);
    useEffect(() => { openRef.current = open; }, [open]);

    const show = useCallback(() => {
        setQuery('');
        setActive(0);
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    }, []);
    const hide = useCallback(() => setOpen(false), []);

    // Global open/close shortcuts
    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                openRef.current ? hide() : show();
            } else if (e.key === 'Escape') {
                hide();
            }
        };
        const onToggle = () => (openRef.current ? hide() : show());
        window.addEventListener('keydown', onKey);
        window.addEventListener('cmdk:toggle', onToggle);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('cmdk:toggle', onToggle);
        };
    }, [show, hide]);

    const runActive = () => {
        const cmd = filtered[active];
        if (cmd) {
            cmd.run();
            hide();
        }
    };

    const onListKey = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, filtered.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            runActive();
        }
    };

    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    if (!open) return null;

    return (
        <div
            className="cmdk-overlay"
            role="presentation"
            onMouseDown={(e) => { if (e.target === e.currentTarget) hide(); }}
        >
            <div
                className="cmdk-panel"
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
            >
                <div className="cmdk-input-row">
                    <span aria-hidden="true" style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>&gt;</span>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setActive(0); }}
                        onKeyDown={onListKey}
                        placeholder="Type a command or search…"
                        aria-label="Search commands"
                        aria-controls="cmdk-list"
                        aria-activedescendant={filtered[active] ? `cmdk-opt-${filtered[active].id}` : undefined}
                        spellCheck="false"
                        autoComplete="off"
                    />
                    <kbd className="cmdk-kbd">esc</kbd>
                </div>
                <ul id="cmdk-list" ref={listRef} className="cmdk-list" role="listbox" aria-label="Commands">
                    {filtered.length === 0 && (
                        <li className="cmdk-empty">No matching commands.</li>
                    )}
                    {filtered.map((cmd, i) => (
                        <li
                            key={cmd.id}
                            id={`cmdk-opt-${cmd.id}`}
                            data-idx={i}
                            role="option"
                            aria-selected={i === active}
                            className={`cmdk-item${i === active ? ' is-active' : ''}`}
                            onMouseEnter={() => setActive(i)}
                            onMouseDown={(e) => { e.preventDefault(); cmd.run(); hide(); }}
                        >
                            <span className="cmdk-item-icon">{cmd.icon}</span>
                            <span className="cmdk-item-label">{cmd.label}</span>
                            <span className="cmdk-item-group">{cmd.group}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CommandPalette;

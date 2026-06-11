import React from 'react';

const services = [
    {
        name: 'Frontend',
        summary: 'Interfaces that scale — component systems, state, and performance.',
        tech: ['React', 'TypeScript', 'Redux', 'GraphQL', 'HTML & CSS', 'Vite']
    },
    {
        name: 'Backend',
        summary: 'Services and APIs that hold under load.',
        tech: ['Node.js', 'GraphQL', 'REST APIs', 'Spring Boot']
    },
    {
        name: 'Infrastructure',
        summary: 'Cloud, pipelines, and observability — shipping and watching it run.',
        tech: ['AWS', 'Terraform', 'CI/CD', 'Datadog']
    }
];

const Dot = () => (
    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'inline-block', flexShrink: 0 }} />
);

const Tag = ({ children }) => (
    <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
        padding: '3px 8px',
        borderRadius: '4px'
    }}>
        {children}
    </span>
);

const Systems = () => {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--spacing-md)'
        }}>
            {services.map((s, i) => (
                <div key={i} style={{
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: 'var(--spacing-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--spacing-sm)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.98rem' }}>{s.name}</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent)' }}>
                            <Dot /> operational
                        </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
                        {s.summary}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {s.tech.map((t, j) => <Tag key={j}>{t}</Tag>)}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Systems;

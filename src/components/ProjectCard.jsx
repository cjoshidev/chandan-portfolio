import React from 'react';

const ProjectCard = ({ title, description, techStack = [], link, live }) => {
    return (
        <div className="project-card" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            transition: 'transform 0.2s ease, border-color 0.2s ease'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: 'var(--spacing-sm)' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{title}</h3>
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', flexShrink: 0 }}>
                    {link && (
                        <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>
                            Code
                        </a>
                    )}
                    {live && (
                        <a href={live} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}>
                            Live
                        </a>
                    )}
                </div>
            </div>
            <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-md)',
                lineHeight: 1.55,
                flex: 1
            }}>
                {description}
            </p>
            <div className="tech-stack" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {techStack.map((tech, index) => (
                    <span key={index} style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        padding: '3px 8px',
                        borderRadius: '4px'
                    }}>
                        {tech}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default ProjectCard;

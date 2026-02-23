import React from 'react';

const ProjectCard = ({ title, description, techStack, link }) => {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-card" style={{
            display: 'block',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '8px',
            transition: 'transform 0.2s ease, background-color 0.2s ease',
            textDecoration: 'none'
        }}>
            <div className="card-content">
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{title}</h3>
                <p style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-md)',
                    lineHeight: 1.5
                }}>
                    {description}
                </p>
                <div className="tech-stack" style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
                    {techStack.map((tech, index) => (
                        <span key={index} style={{
                            fontSize: '0.8rem',
                            color: 'var(--text-primary)',
                            backgroundColor: 'var(--bg-primary)',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            opacity: 0.8
                        }}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </a>
    );
};

export default ProjectCard;

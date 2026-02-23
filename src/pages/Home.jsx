import React from 'react';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';

const Home = () => {
    const projects = [
        {
            title: "Portfolio V1",
            description: "A minimal portfolio website built with React and Vite. Focused on typography and clean design.",
            techStack: ["React", "Vite", "CSS"],
            link: "#"
        },
        {
            title: "Backend API Service",
            description: "High-performance Node.js API with GraphQL and MongoDB integration.",
            techStack: ["Node.js", "GraphQL", "MongoDB"],
            link: "#"
        },
        {
            title: "K6 Performance Tests",
            description: "Comprehensive load testing suite for microservices using K6.",
            techStack: ["JavaScript", "K6", "CI/CD"],
            link: "#"
        }
    ];

    return (
        <main>
            <Hero />

            <section id="projects" style={{ paddingTop: 'var(--spacing-lg)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Selected Projects</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    {projects.map((project, index) => (
                        <ProjectCard key={index} {...project} />
                    ))}
                </div>
            </section>

            <section id="contact" style={{ paddingTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-lg)' }}>
                <h2 style={{ marginBottom: 'var(--spacing-md)' }}>Get in Touch</h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Whether you have a question or just want to say hi, I'll try my best to get back to you!
                </p>
                <a href="mailto:chandan.joshi@example.com" style={{
                    display: 'inline-block',
                    marginTop: 'var(--spacing-md)',
                    color: 'var(--accent)',
                    fontWeight: 500
                }}>
                    Say Hello -&gt;
                </a>
            </section>
        </main>
    );
};

export default Home;

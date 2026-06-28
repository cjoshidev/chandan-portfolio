import React from 'react';
import Hero from '../components/Hero';
import ProjectCard from '../components/ProjectCard';
import Systems from '../components/Systems';

const SectionDivider = () => (
    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 'var(--spacing-xl) 0 0' }} />
);

const SectionLabel = ({ children }) => (
    <p style={{
        fontSize: '0.75rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-secondary)',
        marginBottom: 'var(--spacing-lg)',
        marginTop: 'var(--spacing-lg)'
    }}>
        {children}
    </p>
);

const SkillTag = ({ children }) => (
    <span style={{
        fontSize: '0.8rem',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
        padding: '4px 10px',
        borderRadius: '4px',
        display: 'inline-block'
    }}>
        {children}
    </span>
);

const experience = [
    {
        company: 'ClearRoute',
        role: 'Full Stack Engineer',
        period: 'Jul 2024 – Present',
        location: 'Pune, India',
        highlights: [
            'Owned the architecture, delivery, and operations of a customer migration platform enabling the seamless migration of 5M+ loyalty members across enterprise systems.',
            'Architected a serverless integration platform on AWS Lambda and API Gateway, unifying REST and GraphQL ecosystems through a single customer-facing API layer.',
            'Built Infrastructure as Code using Terraform to provision and manage cloud resources, improving deployment consistency and operational efficiency across environments.',
            'Developed event-driven integrations using Kafka and AWS Lambda, enabling near real-time synchronization of customer and membership data across distributed systems.',
            'Established production-grade observability with Datadog SLOs, dashboards, and alerting, improving reliability and accelerating incident detection and resolution.',
            'Designed scalable membership reconciliation and migration workflows supporting millions of customer records while maintaining data integrity and zero-downtime releases.'
        ],
        tags: ['TypeScript', 'Node.js', 'React', 'GraphQL', 'DynamoDB', 'AWS', 'Terraform', 'CI/CD', 'Datadog']
    },
    {
        company: 'Zeals Co., Ltd.',
        role: 'Software Engineer',
        period: 'Oct 2021 – Jun 2024',
        location: 'Remote',
        highlights: [
            'Built a collaborative canvas using Yjs, scaling to 100+ concurrent editors.',
            'Cut build time from 2 min to 20 sec by introducing Vite and Nx.',
            'Designed and built a condition-based user segmentation UI independently.',
            'Smart offer feature contributed to a 35% increase in conversions.',
            'Reduced regression QA effort by 45% through unit and E2E test coverage.'
        ],
        tags: ['React.js', 'TypeScript', 'Redux', 'GraphQL', 'JavaScript']
    },
    {
        company: 'Vibrent Health',
        role: 'Software Engineer',
        period: 'Oct 2020 – Sep 2021',
        location: 'Pune, India',
        highlights: [
            'Developed a condition engine for dynamic form rendering.',
            'Reduced regression bugs by 20% with integration and E2E tests.'
        ],
        tags: ['React.js', 'AngularJS', 'Spring Boot', 'HTML5']
    }
];

// Projects pulled from github.com/cjoshidev (public repos).
// NOTE (Chandan): none of these repos had real READMEs, so the descriptions below are
// honest placeholders based on the repo name + stack. Replace each `description` with a
// real one-liner (the problem it solves + the outcome), and add a `live` URL where deployed.
const projects = [
    {
        title: 'Open Interview Prep',
        description: '[REPLACE] A technical-interview preparation app. Add what it does and who it helps.',
        techStack: ['React', 'TypeScript', 'Vite'],
        link: 'https://github.com/cjoshidev/openInterviewPrep',
        live: ''
    },
    {
        title: 'Help IT Dashboard',
        description: '[REPLACE] An IT support / operations dashboard. Add the core problem it solves.',
        techStack: ['Next.js', 'TypeScript'],
        link: 'https://github.com/cjoshidev/help-it-dashboard',
        live: ''
    },
    {
        title: 'Blick Game',
        description: '[REPLACE] A browser game. Add the concept and anything notable about how you built it.',
        techStack: ['JavaScript'],
        link: 'https://github.com/cjoshidev/BlickGame',
        live: ''
    }
];

const certifications = [
    {
        name: 'Claude Certified Architect — Foundation',
        issuer: 'Anthropic',
        period: 'Jun 2026',
        // TODO (Chandan): add your credential/verification URL when available.
        url: ''
    },
    {
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        period: 'Sep 2025 – Sep 2028',
        url: 'https://www.credly.com/badges/af78a42a-6754-4ed4-8abe-8679a3014723/linked_in_profile'
    }
];

const awards = [
    {
        title: 'Winner – Smart India Hackathon 2019',
        subtitle: 'Software Edition, Complex Category',
        issuer: 'Ministry of Human Resource Development'
    },
    {
        title: 'Amdocs Hackfest Finalist',
        subtitle: 'Apr 2019',
        issuer: 'Amdocs India'
    },
    {
        title: 'We Are Opportunity Seekers Award',
        subtitle: '2024',
        issuer: 'ClearRoute'
    }
];

const Home = () => {
    return (
        <main>
            <Hero />

            <SectionDivider />

            {/* Projects — hidden for now */}
            {/* <section id="projects">
                <SectionLabel>Selected Work</SectionLabel>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: 'var(--spacing-md)'
                }}>
                    {projects.map((project, i) => (
                        <ProjectCard key={i} {...project} />
                    ))}
                </div>
            </section>

            <SectionDivider />

            {/* Experience — styled as a deploy log */}
            <section id="work">
                <SectionLabel>Deploy Log</SectionLabel>
                <div className="deploy-log-list" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
                    {experience.map((job, i) => {
                        const current = i === 0;
                        const version = `v${experience.length - i}.0`;
                        return (
                        <div key={i} style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '6px' }}>
                                <span style={{
                                    width: '9px', height: '9px', borderRadius: '50%',
                                    backgroundColor: current ? 'var(--accent)' : 'var(--border)',
                                    border: current ? 'none' : '1px solid var(--text-secondary)'
                                }} />
                                {i < experience.length - 1 && (
                                    <span style={{ width: '1px', flex: 1, backgroundColor: 'var(--border)', marginTop: '6px' }} />
                                )}
                            </div>
                            <div style={{ flex: 1, paddingBottom: i < experience.length - 1 ? 'var(--spacing-md)' : 0 }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flexWrap: 'wrap',
                                gap: '4px',
                                marginBottom: 'var(--spacing-sm)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent)' }}>{version}</span>
                                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{job.company}</span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{job.role}</span>
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                                    {current ? 'live · ' : ''}{job.period}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: job.highlights.length ? 'var(--spacing-md)' : 'var(--spacing-sm)' }}>
                                {job.location}
                            </p>
                            {job.highlights.length > 0 && (
                                <ul style={{
                                    margin: '0 0 var(--spacing-md)',
                                    padding: 0,
                                    listStyle: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    {job.highlights.map((h, j) => (
                                        <li key={j} style={{
                                            fontSize: '0.9rem',
                                            color: 'var(--text-secondary)',
                                            lineHeight: 1.6,
                                            paddingLeft: '16px',
                                            position: 'relative'
                                        }}>
                                            <span style={{
                                                position: 'absolute',
                                                left: 0,
                                                color: 'var(--accent)',
                                                lineHeight: 1.6
                                            }}>—</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {job.tags.map((tag, k) => (
                                    <SkillTag key={k}>{tag}</SkillTag>
                                ))}
                            </div>
                            </div>
                        </div>
                    );})}
                </div>
            </section>

            <SectionDivider />

            {/* Systems — full-stack breadth as services */}
            <section id="systems">
                <SectionLabel>Systems · Stack</SectionLabel>
                <Systems />
            </section>

            <SectionDivider />

            {/* Certifications + Awards */}
            <section>
                <SectionLabel>Certifications & Awards</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                    {certifications.map((cert, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                            <div>
                                {cert.url ? (
                                    <a
                                        href={cert.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)' }}
                                    >
                                        {cert.name}
                                    </a>
                                ) : (
                                    <span style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{cert.name}</span>
                                )}
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{cert.issuer}</p>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cert.period}</span>
                        </div>
                    ))}
                    {awards.map((award, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '4px' }}>
                            <div>
                                <p style={{ fontWeight: 500, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{award.title}</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{award.issuer}</p>
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{award.subtitle}</span>
                        </div>
                    ))}
                </div>
            </section>

            <SectionDivider />

            {/* Contact */}
            <section id="contact" style={{ paddingBottom: 'var(--spacing-xl)' }}>
                <SectionLabel>Contact</SectionLabel>
                <p style={{
                    fontSize: '1.6rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    maxWidth: '480px',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    Got something interesting? I'd love to hear about it.
                </p>
                <div className="contact-links" style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                    <a
                        href="mailto:chandanjoshi.dev@gmail.com"
                        style={{
                            fontSize: '0.95rem',
                            color: 'var(--accent)',
                            fontWeight: 500,
                            borderBottom: '1px solid var(--accent)',
                            paddingBottom: '2px'
                        }}
                    >
                        chandanjoshi.dev@gmail.com
                    </a>
                    <a
                        href="https://www.linkedin.com/in/chandan015/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            fontSize: '0.95rem',
                            color: 'var(--text-secondary)',
                            borderBottom: '1px solid var(--border)',
                            paddingBottom: '2px'
                        }}
                    >
                        linkedin.com/in/chandan015
                    </a>
                </div>
            </section>
        </main>
    );
};

export default Home;

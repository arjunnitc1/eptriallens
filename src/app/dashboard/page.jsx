'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/projects')
            .then((res) => res.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            <div style={s.header}>
                <div>
                    <h1 style={s.title}>Projects</h1>
                    <p style={s.subtitle}>Manage your clinical trial information projects</p>
                </div>
                <Link href="/dashboard/projects/new" className="btn btn-primary">
                    + Create project
                </Link>
            </div>

            {loading ? (
                <div style={s.loadingGrid}>
                    {[1, 2].map((i) => (
                        <div key={i} className="card" style={{ padding: 'var(--space-8)' }}>
                            <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: 'var(--space-4)' }} />
                            <div className="skeleton" style={{ height: '14px', width: '40%', marginBottom: 'var(--space-6)' }} />
                            <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-state-icon">📋</div>
                    <h3>No projects yet</h3>
                    <p>Create your first project to get started</p>
                    <Link href="/dashboard/projects/new" className="btn btn-primary">
                        Create project
                    </Link>
                </div>
            ) : (
                <div style={s.projectGrid}>
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/dashboard/projects/${project.id}`}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <div className="card" style={s.projectCard}>
                                <div style={s.cardHeader}>
                                    <div style={s.cardStatus}>
                                        <span className={`badge ${project.status === 'ACTIVE' ? 'badge-success' : project.status === 'DRAFT' ? 'badge-neutral' : 'badge-warning'}`}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <span style={s.phase}>{project.trialPhase}</span>
                                </div>

                                <h3 style={s.projectName}>{project.name}</h3>
                                <p style={s.sponsor}>{project.sponsor}</p>
                                {project.projectLead && (
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: -12, marginBottom: 'var(--space-4)' }}>
                                        👤 Lead: {project.projectLead}
                                    </p>
                                )}

                                <div style={s.cardMeta}>
                                    <span style={s.metaBadge}>{project.therapeuticArea}</span>
                                </div>

                                <div style={s.cardStats}>
                                    <div style={s.stat}>
                                        <span style={s.statNum}>{project.patientsInvited}</span>
                                        <span style={s.statLabel}>Invited</span>
                                    </div>
                                    <div style={s.stat}>
                                        <span style={s.statNum}>{project.patientsConsented}</span>
                                        <span style={s.statLabel}>Consented</span>
                                    </div>
                                    <div style={s.stat}>
                                        <span style={s.statDate}>
                                            {new Date(project.updatedAt).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                        <span style={s.statLabel}>Updated</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

const s = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-8)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
    },
    title: {
        fontSize: 'var(--text-3xl)',
        color: 'var(--color-primary)',
        marginBottom: 'var(--space-1)',
    },
    subtitle: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-muted)',
    },
    loadingGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
        gap: 'var(--space-6)',
    },
    projectGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
        gap: 'var(--space-6)',
    },
    projectCard: {
        padding: 'var(--space-6)',
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        borderLeft: '4px solid var(--color-secondary)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-4)',
    },
    cardStatus: {},
    phase: {
        fontSize: 'var(--text-xs)',
        color: 'var(--color-muted)',
        fontWeight: 600,
    },
    projectName: {
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginBottom: 'var(--space-1)',
    },
    sponsor: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--space-4)',
    },
    cardMeta: {
        marginBottom: 'var(--space-4)',
    },
    metaBadge: {
        display: 'inline-block',
        fontSize: 'var(--text-xs)',
        fontWeight: 500,
        padding: '2px 10px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(0,180,216,0.08)',
        color: 'var(--color-secondary-dark)',
    },
    cardStats: {
        display: 'flex',
        gap: 'var(--space-6)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)',
    },
    stat: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
    },
    statNum: {
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-primary)',
    },
    statDate: {
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    statLabel: {
        fontSize: 'var(--text-xs)',
        color: 'var(--color-muted)',
    },
};

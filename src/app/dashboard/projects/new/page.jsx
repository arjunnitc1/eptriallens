'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';

export default function NewProjectPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        therapeuticArea: '',
        trialPhase: '',
        sponsor: '',
        description: '',
        languages: 'English',
    });
    const [saving, setSaving] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            const project = await res.json();
            router.push(`/dashboard/projects/${project.id}`);
        } else {
            setSaving(false);
            alert('Failed to create project');
        }
    }

    const phases = ['Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Observational'];
    const areas = ['Oncology', 'Cardiology', 'Neurology', 'Immunology', 'Endocrinology', 'Pulmonology', 'Rheumatology', 'Rare Diseases', 'Other'];

    return (
        <div style={{ maxWidth: '640px' }}>
            <button
                onClick={() => router.back()}
                style={s.backBtn}
            >
                ← Back to projects
            </button>

            <h1 style={s.title}>Create new project</h1>
            <p style={s.subtitle}>Set up a new clinical trial information project</p>

            <form onSubmit={handleSubmit} style={s.form}>
                <div className="form-group">
                    <label className="form-label" htmlFor="name">Project name *</label>
                    <input
                        id="name"
                        name="name"
                        className="form-input"
                        placeholder="e.g. OncoVision Phase II"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div style={s.row}>
                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="therapeuticArea">Therapeutic area</label>
                        <select
                            id="therapeuticArea"
                            name="therapeuticArea"
                            className="form-select"
                            value={form.therapeuticArea}
                            onChange={handleChange}
                        >
                            <option value="">Select area</option>
                            {areas.map((a) => (
                                <option key={a} value={a}>{a}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group" style={{ flex: 1 }}>
                        <label className="form-label" htmlFor="trialPhase">Trial phase</label>
                        <select
                            id="trialPhase"
                            name="trialPhase"
                            className="form-select"
                            value={form.trialPhase}
                            onChange={handleChange}
                        >
                            <option value="">Select phase</option>
                            {phases.map((p) => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="sponsor">Sponsor or organisation</label>
                    <input
                        id="sponsor"
                        name="sponsor"
                        className="form-input"
                        placeholder="e.g. Acme Therapeutics Ltd"
                        value={form.sponsor}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="description">Short description</label>
                    <textarea
                        id="description"
                        name="description"
                        className="form-textarea"
                        placeholder="Brief description of the clinical trial…"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="languages">Languages offered</label>
                    <input
                        id="languages"
                        name="languages"
                        className="form-input"
                        placeholder="English, Spanish, French…"
                        value={form.languages}
                        onChange={handleChange}
                    />
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                        Comma-separated. Additional languages can be added later.
                    </span>
                </div>

                <div style={s.actions}>
                    <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={saving || !form.name}
                    >
                        {saving ? 'Creating…' : 'Create project'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const s = {
    backBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-muted)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        padding: 0,
        marginBottom: 'var(--space-6)',
        fontFamily: 'var(--font-sans)',
    },
    title: {
        fontSize: 'var(--text-3xl)',
        color: 'var(--color-primary)',
        marginBottom: 'var(--space-2)',
    },
    subtitle: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-muted)',
        marginBottom: 'var(--space-8)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
    },
    row: {
        display: 'flex',
        gap: 'var(--space-4)',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--space-3)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)',
    },
};

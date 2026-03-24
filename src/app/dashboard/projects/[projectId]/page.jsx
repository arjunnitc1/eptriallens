'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

/* ═══════════════════════════════════════════
   PROJECT DETAIL PAGE WITH 5 TABS
   ═══════════════════════════════════════════ */

export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    function fetchProject() {
        fetch(`/api/projects/${projectId}`)
            .then((r) => r.json())
            .then((data) => { setProject(data); setLoading(false); })
            .catch(() => setLoading(false));
    }

    useEffect(() => { fetchProject(); }, [projectId]);

    if (loading) return <div style={{ padding: 'var(--space-8)' }}><div className="skeleton" style={{ height: 32, width: '40%', marginBottom: 16 }} /><div className="skeleton" style={{ height: 16, width: '60%' }} /></div>;
    if (!project) return <div className="card empty-state"><h3>Project not found</h3></div>;

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'documents', label: 'Documents' },
        { key: 'video', label: 'Video & Summaries' },
        { key: 'patients', label: 'Patients' },
        { key: 'escalations', label: 'Questions' },
    ];

    return (
        <div>
            <button onClick={() => router.push('/dashboard')} style={s.backBtn}>← Back to projects</button>

            <div style={s.header}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                        <h1 style={s.title}>{project.name}</h1>
                        <span className={`badge ${project.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>{project.status}</span>
                    </div>
                    <p style={s.subtitle}>{project.sponsor} · {project.therapeuticArea} · {project.trialPhase}{project.createdBy ? ` · Lead: ${project.createdBy.name}` : ''}</p>
                </div>
                <Link href={`/dashboard/projects/${projectId}/preview`} className="btn btn-accent btn-sm">
                    👁 Patient preview
                </Link>
            </div>

            <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
                {tabs.map((t) => (
                    <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && <OverviewTab project={project} projectId={projectId} onRefresh={fetchProject} />}
            {activeTab === 'documents' && <DocumentsTab projectId={projectId} onRefresh={fetchProject} />}
            {activeTab === 'video' && <VideoSummaryTab projectId={projectId} project={project} onRefresh={fetchProject} />}
            {activeTab === 'patients' && <PatientsTab projectId={projectId} onRefresh={fetchProject} />}
            {activeTab === 'escalations' && <EscalationsTab projectId={projectId} />}
        </div>
    );
}

/* ═══ TAB 1: OVERVIEW ═══ */
function OverviewTab({ project, projectId, onRefresh }) {
    const patientsInvited = project.patients?.length || 0;
    const patientsConsented = project.patients?.filter(p => p.consentStatus === 'CONSENTED').length || 0;
    const questionsAsked = project._count?.chatMessages || 0;

    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: project.name || '',
        sponsor: project.sponsor || '',
        therapeuticArea: project.therapeuticArea || '',
        trialPhase: project.trialPhase || '',
        languages: project.languages || 'English',
        status: project.status || 'DRAFT',
        description: project.description || '',
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function startEditing() {
        setForm({
            name: project.name || '',
            sponsor: project.sponsor || '',
            therapeuticArea: project.therapeuticArea || '',
            trialPhase: project.trialPhase || '',
            languages: project.languages || 'English',
            status: project.status || 'DRAFT',
            description: project.description || '',
        });
        setEditing(true);
    }

    async function handleSave() {
        setSaving(true);
        const res = await fetch(`/api/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        if (res.ok) {
            setEditing(false);
            onRefresh();
        } else {
            alert('Failed to save changes. Please try again.');
        }
        setSaving(false);
    }

    const phases = ['Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Observational'];
    const areas = ['Oncology', 'Cardiology', 'Neurology', 'Immunology', 'Endocrinology', 'Pulmonology', 'Rheumatology', 'Rare Diseases', 'Other'];
    const statuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Metadata */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)' }}>Project details</h3>
                    {!editing ? (
                        <button className="btn btn-ghost btn-sm" onClick={startEditing}>✏️ Edit details</button>
                    ) : (
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving || !form.name}>
                                {saving ? 'Saving…' : 'Save changes'}
                            </button>
                        </div>
                    )}
                </div>

                {editing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Project name *</label>
                            <input className="form-input" name="name" value={form.name} onChange={handleChange} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label">Sponsor</label>
                                <input className="form-input" name="sponsor" value={form.sponsor} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Therapeutic area</label>
                                <select className="form-select" name="therapeuticArea" value={form.therapeuticArea} onChange={handleChange}>
                                    <option value="">Select area</option>
                                    {areas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Trial phase</label>
                                <select className="form-select" name="trialPhase" value={form.trialPhase} onChange={handleChange}>
                                    <option value="">Select phase</option>
                                    {phases.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                                    {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Languages</label>
                            <input className="form-input" name="languages" value={form.languages} onChange={handleChange} placeholder="e.g. English, Spanish" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of the trial…" />
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={s.metaGrid}>
                            <div><span style={s.metaLabel}>Name</span><span style={s.metaValue}>{project.name}</span></div>
                            <div><span style={s.metaLabel}>Sponsor</span><span style={s.metaValue}>{project.sponsor || '—'}</span></div>
                            <div><span style={s.metaLabel}>Therapeutic area</span><span style={s.metaValue}>{project.therapeuticArea || '—'}</span></div>
                            <div><span style={s.metaLabel}>Trial phase</span><span style={s.metaValue}>{project.trialPhase || '—'}</span></div>
                            <div><span style={s.metaLabel}>Languages</span><span style={s.metaValue}>{project.languages || 'English'}</span></div>
                            <div><span style={s.metaLabel}>Status</span><span style={s.metaValue}>{project.status}</span></div>
                            <div><span style={s.metaLabel}>Project lead</span><span style={s.metaValue}>{project.createdBy?.name || '—'}</span></div>
                        </div>
                        {project.description && <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{project.description}</p>}
                    </>
                )}
            </div>

            {/* Progress widgets */}
            <div style={s.widgetGrid}>
                <div className="card stat-card">
                    <div className="stat-value">{patientsInvited}</div>
                    <div className="stat-label">Invites sent</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{questionsAsked}</div>
                    <div className="stat-label">Questions asked</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">{patientsConsented}</div>
                    <div className="stat-label">Consents captured</div>
                </div>
                <div className="card stat-card">
                    <div className="stat-value">—</div>
                    <div className="stat-label">Page views (coming soon)</div>
                </div>
            </div>

            {/* Patient page link */}
            <div className="card" style={{ background: 'rgba(0,180,216,0.04)', borderColor: 'rgba(0,180,216,0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: 'var(--space-1)' }}>Patient page preview</h4>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>See what patients will experience when they visit their invite link.</p>
                    </div>
                    <Link href={`/dashboard/projects/${project.id}/preview`} className="btn btn-accent btn-sm">Open preview →</Link>
                </div>
            </div>
        </div>
    );
}

/* ═══ TAB 2: DOCUMENTS ═══ */
function DocumentsTab({ projectId, onRefresh }) {
    const [docs, setDocs] = useState([]);
    const [uploading, setUploading] = useState({});

    useEffect(() => {
        fetch(`/api/projects/${projectId}/documents`).then(r => r.json()).then(setDocs);
    }, [projectId]);

    async function handleUpload(type, file) {
        setUploading(u => ({ ...u, [type]: true }));
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);

        const res = await fetch(`/api/projects/${projectId}/documents`, { method: 'POST', body: formData });
        if (res.ok) {
            const newDoc = await res.json();
            setDocs(d => [newDoc, ...d]);
            onRefresh();
        }
        setUploading(u => ({ ...u, [type]: false }));
    }

    const docTypes = [
        { type: 'PI_SHEET', label: 'Participant Information Sheet', icon: '📄' },
        { type: 'PROTOCOL', label: 'Trial Protocol (optional)', icon: '📋' },
        { type: 'PATIENT_CONTRACT', label: 'Patient Contract', icon: '📝' },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {docTypes.map(({ type, label, icon }) => {
                const typeDocs = docs.filter(d => d.type === type);
                return (
                    <div key={type} className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                            <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                            <h3 style={{ fontSize: 'var(--text-lg)' }}>{label}</h3>
                        </div>

                        <div style={s.uploadArea}>
                            <input
                                type="file"
                                accept=".pdf"
                                id={`upload-${type}`}
                                style={{ display: 'none' }}
                                onChange={(e) => { if (e.target.files[0]) handleUpload(type, e.target.files[0]); }}
                            />
                            <label htmlFor={`upload-${type}`} className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>
                                {uploading[type] ? 'Uploading…' : '+ Upload PDF'}
                            </label>
                        </div>

                        {typeDocs.length > 0 && (
                            <div style={{ marginTop: 'var(--space-4)' }}>
                                {typeDocs.map((doc) => (
                                    <div key={doc.id} style={s.docItem}>
                                        <div>
                                            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{doc.filename}</span>
                                            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginLeft: 'var(--space-2)' }}>v{doc.version}</span>
                                        </div>
                                        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                                            {new Date(doc.uploadedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/* ═══ TAB 3: VIDEO & SUMMARIES ═══ */
function VideoSummaryTab({ projectId, project, onRefresh }) {
    const [summary, setSummary] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [saving, setSaving] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
    const [showAddFaq, setShowAddFaq] = useState(false);

    useEffect(() => {
        fetch(`/api/projects/${projectId}/summary`).then(r => r.json()).then(d => {
            const sections = typeof d.sections === 'string' ? JSON.parse(d.sections) : d.sections;
            setSummary(sections);
        });
        fetch(`/api/projects/${projectId}/faqs`).then(r => r.json()).then(setFaqs);
    }, [projectId]);

    async function saveSummary() {
        setSaving(true);
        await fetch(`/api/projects/${projectId}/summary`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sections: summary }),
        });
        setSaving(false);
    }

    async function addFaq() {
        const res = await fetch(`/api/projects/${projectId}/faqs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFaq),
        });
        if (res.ok) {
            const faq = await res.json();
            setFaqs([...faqs, faq]);
            setNewFaq({ question: '', answer: '' });
            setShowAddFaq(false);
        }
    }

    async function updateFaq(faq) {
        await fetch(`/api/projects/${projectId}/faqs`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(faq),
        });
        setEditingFaq(null);
        setFaqs(faqs.map(f => f.id === faq.id ? faq : f));
    }

    async function deleteFaq(id) {
        await fetch(`/api/projects/${projectId}/faqs?id=${id}`, { method: 'DELETE' });
        setFaqs(faqs.filter(f => f.id !== id));
    }

    const sectionLabels = {
        why: 'Why this trial',
        what: 'What participation involves',
        risks: 'Risks and benefits',
        timeline: 'Timeline and visits',
        next: 'What happens next',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Video source */}
            <div className="card">
                <h3 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>📹 Video source</h3>
                {project.videos && project.videos.length > 0 ? (
                    <div>
                        {project.videos.map(v => (
                            <div key={v.id} style={s.docItem}>
                                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                    {v.title || (v.sourceType === 'UPLOADED' ? v.filepath : v.url)}
                                </span>
                                <span className="badge badge-primary">{v.sourceType}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>No video configured. Upload a video or add an external URL.</p>
                )}

                {/* Video generation feature */}
                <div style={s.comingSoon}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <span style={{ opacity: 0.5 }}>🤖</span>
                        <div>
                            <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>Generate video from documents</span>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-sm">Enable</button>
                </div>
            </div>

            {/* Summary editor */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)' }}>📝 Plain-language summary</h3>
                    <button className="btn btn-primary btn-sm" onClick={saveSummary} disabled={saving}>
                        {saving ? 'Saving…' : 'Save summary'}
                    </button>
                </div>

                {summary && Object.entries(sectionLabels).map(([key, label]) => (
                    <div key={key} className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="form-label">{label}</label>
                        <textarea
                            className="form-textarea"
                            rows={4}
                            value={summary[key] || ''}
                            onChange={(e) => setSummary({ ...summary, [key]: e.target.value })}
                            placeholder={`Enter ${label.toLowerCase()} content…`}
                        />
                    </div>
                ))}
            </div>

            {/* FAQs */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)' }}>❓ FAQs ({faqs.length})</h3>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm" disabled title="Generate FAQs from documents (coming soon)">
                            🤖 Auto-generate
                        </button>
                        <button className="btn btn-primary btn-sm" onClick={() => setShowAddFaq(true)}>+ Add FAQ</button>
                    </div>
                </div>

                {showAddFaq && (
                    <div style={s.faqForm}>
                        <div className="form-group">
                            <input className="form-input" placeholder="Question" value={newFaq.question} onChange={e => setNewFaq({ ...newFaq, question: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <textarea className="form-textarea" placeholder="Answer" rows={3} value={newFaq.answer} onChange={e => setNewFaq({ ...newFaq, answer: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowAddFaq(false)}>Cancel</button>
                            <button className="btn btn-primary btn-sm" onClick={addFaq} disabled={!newFaq.question || !newFaq.answer}>Add</button>
                        </div>
                    </div>
                )}

                {faqs.map((faq, i) => (
                    <div key={faq.id} style={s.faqItem}>
                        {editingFaq === faq.id ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                <input className="form-input" value={faq.question} onChange={e => setFaqs(faqs.map(f => f.id === faq.id ? { ...f, question: e.target.value } : f))} />
                                <textarea className="form-textarea" rows={2} value={faq.answer} onChange={e => setFaqs(faqs.map(f => f.id === faq.id ? { ...f, answer: e.target.value } : f))} />
                                <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingFaq(null)}>Cancel</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => updateFaq(faq)}>Save</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 'var(--space-1)' }}>{i + 1}. {faq.question}</div>
                                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{faq.answer}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--space-1)', flexShrink: 0 }}>
                                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingFaq(faq.id)}>Edit</button>
                                    <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error)' }} onClick={() => deleteFaq(faq.id)}>×</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ═══ TAB 4: PATIENTS ═══ */
function PatientsTab({ projectId, onRefresh }) {
    const [patients, setPatients] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', patientExternalId: '',
        privacyMode: 'NON_ANONYMOUS', outreachMethod: 'DIRECT_OUTREACH',
    });
    const [showEmail, setShowEmail] = useState(null);
    const [copied, setCopied] = useState(null);

    const isAnonymous = form.privacyMode === 'ANONYMOUS';

    useEffect(() => {
        fetch(`/api/projects/${projectId}/patients`).then(r => r.json()).then(setPatients);
    }, [projectId]);

    async function addPatient() {
        const res = await fetch(`/api/projects/${projectId}/patients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...form, generateToken: true }),
        });
        if (res.ok) {
            const patient = await res.json();
            setPatients([patient, ...patients]);
            setForm({
                firstName: '', lastName: '', email: '', phone: '', patientExternalId: '',
                privacyMode: 'NON_ANONYMOUS', outreachMethod: 'DIRECT_OUTREACH',
            });
            setShowAdd(false);
            onRefresh();
        }
    }

    async function generateInvite(patientId) {
        const res = await fetch(`/api/projects/${projectId}/patients/${patientId}/invite`, { method: 'POST' });
        if (res.ok) {
            const { token } = await res.json();
            setPatients(patients.map(p => p.id === patientId ? { ...p, inviteToken: token, inviteStatus: 'SENT' } : p));
        }
    }

    function copyLink(token) {
        navigator.clipboard.writeText(`${window.location.origin}/p/${token}`);
        setCopied(token);
        setTimeout(() => setCopied(null), 2000);
    }

    function getPatientDisplayName(p) {
        if (p.privacyMode === 'ANONYMOUS' || (!p.firstName && !p.lastName)) {
            return <span style={{ color: 'var(--color-muted)', fontStyle: 'italic' }}>Anonymous</span>;
        }
        return `${p.firstName} ${p.lastName}`;
    }

    const canAdd = isAnonymous || (form.firstName && form.lastName && form.email);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}>+ Add patient</button>
            </div>

            {showAdd && (
                <div className="card" style={{ borderColor: 'var(--color-secondary)', borderWidth: 2 }}>
                    <h4 style={{ marginBottom: 'var(--space-4)' }}>Add new patient</h4>

                    {/* Privacy mode toggle */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="form-label">Patient privacy</label>
                        <div style={{ display: 'flex', gap: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)', width: 'fit-content' }}>
                            {[{ val: 'NON_ANONYMOUS', label: '👤 Non-anonymous' }, { val: 'ANONYMOUS', label: '🔒 Anonymous' }].map(opt => (
                                <button
                                    key={opt.val}
                                    type="button"
                                    onClick={() => setForm({ ...form, privacyMode: opt.val, ...(opt.val === 'ANONYMOUS' ? { firstName: '', lastName: '', email: '' } : {}) })}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        background: form.privacyMode === opt.val ? 'var(--color-primary)' : 'var(--color-bg-alt)',
                                        color: form.privacyMode === opt.val ? '#fff' : 'var(--color-text-secondary)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        {isAnonymous && (
                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 6 }}>
                                Anonymous mode: name and email are optional. A randomised Patient ID will be generated automatically.
                            </p>
                        )}
                    </div>

                    {/* Outreach method */}
                    <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="form-label">Outreach method</label>
                        <select
                            className="form-select"
                            value={form.outreachMethod}
                            onChange={e => setForm({ ...form, outreachMethod: e.target.value })}
                            style={{ maxWidth: 280 }}
                        >
                            <option value="DIRECT_OUTREACH">📩 Direct Outreach</option>
                            <option value="NHS_DIGITRIALS">🏥 NHS Digitrials</option>
                        </select>
                    </div>

                    {/* Name / email fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                        <div className="form-group">
                            <label className="form-label">First name {!isAnonymous && '*'}</label>
                            <input
                                className="form-input"
                                value={form.firstName}
                                onChange={e => setForm({ ...form, firstName: e.target.value })}
                                placeholder={isAnonymous ? 'Optional' : 'Required'}
                                disabled={false}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last name {!isAnonymous && '*'}</label>
                            <input
                                className="form-input"
                                value={form.lastName}
                                onChange={e => setForm({ ...form, lastName: e.target.value })}
                                placeholder={isAnonymous ? 'Optional' : 'Required'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Email {!isAnonymous && '*'}</label>
                            <input
                                type="email"
                                className="form-input"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder={isAnonymous ? 'Optional' : 'Required'}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Phone</label>
                            <input className="form-input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">External ID</label>
                            <input className="form-input" value={form.patientExternalId} onChange={e => setForm({ ...form, patientExternalId: e.target.value })} placeholder="Hospital / study ID" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={addPatient} disabled={!canAdd}>Add & generate invite</button>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Patient ID</th>
                            <th>Name</th>
                            <th>Privacy</th>
                            <th>Outreach</th>
                            <th>Invite status</th>
                            <th>Consent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((p) => (
                            <tr key={p.id}>
                                <td><code style={{ fontSize: 'var(--text-xs)', background: 'var(--color-bg-alt)', padding: '2px 6px', borderRadius: 4 }}>{p.patientDisplayId || '—'}</code></td>
                                <td style={{ fontWeight: 600 }}>{getPatientDisplayName(p)}</td>
                                <td>
                                    <span className={`badge ${p.privacyMode === 'ANONYMOUS' ? 'badge-warning' : 'badge-neutral'}`} style={{ fontSize: '0.65rem' }}>
                                        {p.privacyMode === 'ANONYMOUS' ? '🔒 Anon' : '👤 Named'}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                                        {p.outreachMethod === 'NHS_DIGITRIALS' ? '🏥 NHS' : '📩 Direct'}
                                    </span>
                                </td>
                                <td><span className={`badge ${p.inviteStatus === 'SENT' ? 'badge-success' : 'badge-neutral'}`}>{p.inviteStatus}</span></td>
                                <td><span className={`badge ${p.consentStatus === 'CONSENTED' ? 'badge-success' : p.consentStatus === 'IN_PROGRESS' ? 'badge-warning' : 'badge-neutral'}`}>{p.consentStatus.replace('_', ' ')}</span></td>
                                <td>
                                    <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                                        {!p.inviteToken && (
                                            <button className="btn btn-ghost btn-sm" onClick={() => generateInvite(p.id)}>Generate link</button>
                                        )}
                                        {p.inviteToken && (
                                            <>
                                                <button className="btn btn-ghost btn-sm" onClick={() => copyLink(p.inviteToken)}>
                                                    {copied === p.inviteToken ? '✓ Copied' : '📋 Copy link'}
                                                </button>
                                                {p.email && <button className="btn btn-ghost btn-sm" onClick={() => setShowEmail(p)}>📧 Send email</button>}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {patients.length === 0 && (
                            <tr><td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-muted)' }}>No patients yet. Add a patient to get started.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Email modal */}
            {showEmail && (
                <div className="modal-overlay" onClick={() => setShowEmail(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontSize: 'var(--text-lg)' }}>Send invite email</h3>
                            <button className="btn btn-ghost btn-sm" onClick={() => setShowEmail(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ background: 'var(--color-bg-alt)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', lineHeight: 'var(--leading-relaxed)' }}>
                                <p><strong>To:</strong> {showEmail.email}</p>
                                <p style={{ marginTop: 'var(--space-3)' }}><strong>Subject:</strong> Your trial information is ready</p>
                                <hr style={{ margin: 'var(--space-3) 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
                                <p>Dear {showEmail.firstName || 'Participant'},</p>
                                <p style={{ marginTop: 'var(--space-2)' }}>Thank you for your interest in participating in our clinical trial. We have prepared an information page tailored to you with everything you need to know about the study.</p>
                                <p style={{ marginTop: 'var(--space-2)' }}>Please visit the following link to access your personalised information page:</p>
                                <p style={{ marginTop: 'var(--space-2)', color: 'var(--color-secondary)', fontWeight: 600 }}>{typeof window !== 'undefined' ? window.location.origin : ''}/p/{showEmail.inviteToken}</p>
                                <p style={{ marginTop: 'var(--space-2)' }}>If you have any questions, our team is here to help.</p>
                                <p style={{ marginTop: 'var(--space-2)' }}>Kind regards,<br />The Clinical Research Team</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-ghost" onClick={() => setShowEmail(null)}>Close</button>
                            <button className="btn btn-primary" onClick={() => { alert('Email sent (simulated)'); setShowEmail(null); }}>Send email (simulated)</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ═══ TAB 5: ESCALATIONS ═══ */
function EscalationsTab({ projectId }) {
    const [escalations, setEscalations] = useState([]);
    const [responding, setResponding] = useState(null);
    const [response, setResponse] = useState('');

    useEffect(() => {
        fetch(`/api/projects/${projectId}/escalations`).then(r => r.json()).then(setEscalations);
    }, [projectId]);

    async function submitResponse(escId) {
        await fetch(`/api/projects/${projectId}/escalations`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: escId, staffResponse: response, status: 'RESOLVED' }),
        });
        setEscalations(escalations.map(e => e.id === escId ? { ...e, staffResponse: response, status: 'RESOLVED', resolvedAt: new Date().toISOString() } : e));
        setResponding(null);
        setResponse('');
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {escalations.length === 0 ? (
                <div className="card empty-state">
                    <div className="empty-state-icon">💬</div>
                    <h3>No escalations yet</h3>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>Patient questions that need attention will appear here.</p>
                </div>
            ) : (
                escalations.map((esc) => (
                    <div key={esc.id} className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                            <div>
                                <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>
                                    {esc.patient?.firstName} {esc.patient?.lastName}
                                </span>
                                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginLeft: 'var(--space-2)' }}>
                                    {new Date(esc.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <span className={`badge ${esc.status === 'RESOLVED' ? 'badge-success' : esc.status === 'IN_PROGRESS' ? 'badge-warning' : 'badge-error'}`}>
                                {esc.status}
                            </span>
                        </div>

                        <div style={{ background: 'var(--color-bg-alt)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                            {esc.message}
                        </div>

                        {esc.staffResponse && (
                            <div style={{ padding: 'var(--space-3)', borderLeft: '3px solid var(--color-success)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                                <strong>Staff response:</strong> {esc.staffResponse}
                            </div>
                        )}

                        {esc.status !== 'RESOLVED' && (
                            responding === esc.id ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    <textarea className="form-textarea" rows={3} placeholder="Type your response…" value={response} onChange={e => setResponse(e.target.value)} />
                                    <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
                                        <button className="btn btn-ghost btn-sm" onClick={() => setResponding(null)}>Cancel</button>
                                        <button className="btn btn-primary btn-sm" onClick={() => submitResponse(esc.id)} disabled={!response}>Send & resolve</button>
                                    </div>
                                </div>
                            ) : (
                                <button className="btn btn-ghost btn-sm" onClick={() => { setResponding(esc.id); setResponse(''); }}>Respond</button>
                            )
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

/* ═══ STYLES ═══ */
const s = {
    backBtn: {
        background: 'none',
        border: 'none',
        color: 'var(--color-muted)',
        fontSize: 'var(--text-sm)',
        cursor: 'pointer',
        padding: 0,
        marginBottom: 'var(--space-4)',
        fontFamily: 'var(--font-sans)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)',
    },
    title: {
        fontSize: 'var(--text-3xl)',
        color: 'var(--color-primary)',
    },
    subtitle: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-muted)',
    },
    metaGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
    },
    metaLabel: {
        display: 'block',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginBottom: '2px',
    },
    metaValue: {
        display: 'block',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--color-text)',
    },
    widgetGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 'var(--space-4)',
    },
    uploadArea: {
        border: '2px dashed var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        textAlign: 'center',
    },
    docItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-bg-alt)',
        marginBottom: 'var(--space-2)',
    },
    comingSoon: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-bg-alt)',
        marginTop: 'var(--space-4)',
        border: '1px dashed var(--color-border)',
    },
    faqForm: {
        background: 'var(--color-bg-alt)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
    },
    faqItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-3)',
        borderBottom: '1px solid var(--color-border)',
    },
};

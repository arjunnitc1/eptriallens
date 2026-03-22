'use client';
import { useParams } from 'next/navigation';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function PreviewPage() {
    const { projectId } = useParams();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
            <div style={{
                background: 'var(--color-card)',
                borderBottom: '1px solid var(--color-border)',
                padding: 'var(--space-3) var(--space-6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Logo size="sm" />
                    <span className="badge badge-primary">Preview mode</span>
                </div>
                <Link href={`/dashboard/projects/${projectId}`} className="btn btn-ghost btn-sm">
                    ← Back to project
                </Link>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-4)' }}>
                <div className="alert alert-info" style={{ marginBottom: 'var(--space-4)' }}>
                    This is a preview of the patient experience. To see the full page, use a patient invite link from the Patients tab.
                </div>
                <iframe
                    src={`/p/demo-token-onco-emily`}
                    style={{
                        width: '100%',
                        height: 'calc(100vh - 140px)',
                        border: '2px solid var(--color-border)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'white',
                    }}
                />
            </div>
        </div>
    );
}

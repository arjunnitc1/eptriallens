'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

function SignInForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError('Invalid email or password. Please try again.');
            setLoading(false);
        } else {
            router.push(callbackUrl);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="you@organisation.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
            </div>

            <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
            </div>

            {error && (
                <div className="alert alert-error" role="alert">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 15A7 7 0 108 1a7 7 0 000 14zm0-9.5a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3A.75.75 0 018 5.5zm0 7a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                    </svg>
                    {error}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%' }}
            >
                {loading ? 'Signing in…' : 'Sign in'}
            </button>
        </form>
    );
}

export default function SignInPage() {
    return (
        <div style={styles.wrapper}>
            <div style={styles.bgGlow} />
            <div style={styles.card}>
                <div style={styles.logoSection}>
                    <Logo size="lg" />
                    <p style={styles.subtitle}>Researcher Portal</p>
                </div>

                <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Loading…</div>}>
                    <SignInForm />
                </Suspense>

                <div style={styles.demoNote}>
                    <p style={styles.demoTitle}>Demo credentials</p>
                    <p style={styles.demoText}>Admin: admin@triallens.io / admin123</p>
                    <p style={styles.demoText}>Staff: staff@triallens.io / staff123</p>
                </div>

                <a href="/" style={styles.backLink}>← Back to homepage</a>
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        position: 'relative',
        overflow: 'hidden',
        padding: 'var(--space-4)',
    },
    bgGlow: {
        position: 'absolute',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
    },
    card: {
        background: 'var(--color-card)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        padding: 'var(--space-10)',
        width: '100%',
        maxWidth: '440px',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        animation: 'slideUp 500ms ease',
        border: '1px solid var(--color-border)',
        position: 'relative',
        zIndex: 1,
    },
    logoSection: {
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-muted)',
        marginTop: 'var(--space-2)',
        fontWeight: 500,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
    },
    demoNote: {
        background: 'var(--color-bg-alt)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        textAlign: 'center',
    },
    demoTitle: {
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 'var(--space-2)',
    },
    demoText: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
        fontFamily: 'var(--font-mono)',
        lineHeight: 1.6,
    },
    backLink: {
        textAlign: 'center',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-muted)',
        display: 'block',
    },
};

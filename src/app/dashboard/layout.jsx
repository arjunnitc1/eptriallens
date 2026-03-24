'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export const viewport = {
    width: 1024,
    initialScale: 0.1,
    maximumScale: 5,
    userScalable: true,
};

export default function DashboardLayout({ children }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    const navItems = [
        { href: '/dashboard', label: 'Projects', icon: '📋' },
    ];

    return (
        <div style={s.layout}>
            {/* Sidebar */}
            <aside style={s.sidebar} className="dashboard-sidebar">
                <div style={s.sidebarHeader} className="dashboard-sidebar-header">
                    <Link href="/dashboard" style={{ textDecoration: 'none' }}>
                        <Logo size="sm" />
                    </Link>
                    <span style={s.portalBadge}>Portal</span>
                </div>

                <nav style={s.nav} className="dashboard-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                ...s.navItem,
                                ...(pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? s.navItemActive : {}),
                            }}
                            className="dashboard-nav-item"
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div style={s.sidebarFooter} className="dashboard-footer">
                    {session?.user && (
                        <div style={s.userInfo}>
                            <div style={s.avatar}>
                                {session.user.name?.charAt(0) || 'U'}
                            </div>
                            <div style={s.userMeta}>
                                <div style={s.userName}>{session.user.name}</div>
                                <div style={s.userRole}>
                                    {session.user.role === 'RESEARCHER_ADMIN' ? 'Admin' : 'Staff'}
                                </div>
                            </div>
                        </div>
                    )}
                    <button onClick={() => signOut({ callbackUrl: '/' })} style={s.signOutBtn}>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={s.main} className="dashboard-main">
                {children}
            </main>
        </div>
    );
}

const s = {
    layout: {
        display: 'flex',
        minHeight: '100vh',
    },
    sidebar: {
        width: 'var(--sidebar-width)',
        background: 'var(--color-card)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
    },
    sidebarHeader: {
        padding: 'var(--space-5) var(--space-5)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
    },
    portalBadge: {
        fontSize: 'var(--text-xs)',
        fontWeight: 600,
        color: 'var(--color-secondary)',
        background: 'rgba(0,180,216,0.08)',
        padding: '2px 8px',
        borderRadius: 'var(--radius-full)',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    nav: {
        flex: 1,
        padding: 'var(--space-4) var(--space-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-3) var(--space-4)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text-secondary)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        textDecoration: 'none',
        transition: 'all var(--transition-fast)',
        minHeight: '44px',
    },
    navItemActive: {
        background: 'rgba(0,180,216,0.08)',
        color: 'var(--color-secondary-dark)',
        fontWeight: 600,
    },
    sidebarFooter: {
        padding: 'var(--space-4)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
    },
    userInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
    },
    avatar: {
        width: '36px',
        height: '36px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--gradient-primary)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'var(--text-sm)',
        fontWeight: 700,
        flexShrink: 0,
    },
    userMeta: {
        flex: 1,
        minWidth: 0,
    },
    userName: {
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--color-text)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    userRole: {
        fontSize: 'var(--text-xs)',
        color: 'var(--color-muted)',
    },
    signOutBtn: {
        background: 'none',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-2) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-muted)',
        cursor: 'pointer',
        fontFamily: 'var(--font-sans)',
        transition: 'all var(--transition-fast)',
        minHeight: '36px',
    },
    main: {
        flex: 1,
        marginLeft: 'var(--sidebar-width)',
        padding: 'var(--space-8)',
        background: 'var(--color-bg)',
        minHeight: '100vh',
    },
};

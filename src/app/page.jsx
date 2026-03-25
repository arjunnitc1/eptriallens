import Logo from '@/components/Logo';
import Link from 'next/link';

/* ─── Icon helpers (inline SVG) ─── */
function IconDoc() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
}
function IconVideo() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
}
function IconChat() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
}
function IconShield() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function IconUsers() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>;
}
function IconGlobe() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>;
}
function IconCheck() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
}
function IconClipboard() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></svg>;
}
function IconUpload() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>;
}
function IconZap() {
    return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function IconChevronRight() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}

export default function LandingPage() {
    return (
        <div>
            {/* ─── Navigation ─── */}
            <nav style={s.nav} className="nav-container">
                <div style={s.navInner} className="container nav-inner">
                    <Logo size="md" />
                    <div style={s.navLinks} className="nav-links">
                        <Link href="/auth/sign-in" className="btn btn-ghost btn-sm nav-hide-mobile">Sign in</Link>
                        <Link href="#demo" className="btn btn-primary btn-sm">Request a demo</Link>
                    </div>
                </div>
            </nav>

            {/* ─── Hero ─── */}
            <section style={s.hero} className="hero-section" id="hero">
                <div style={s.heroGlow} />
                <div style={s.heroContent} className="container">
                    <div style={s.heroBadge}>
                        <span style={s.heroBadgeDot} />
                        Making clinical trials accessible
                    </div>
                    <h1 style={s.heroH1}>Make trial information<br /><span style={s.heroGradientText}>easy to understand</span></h1>
                    <p style={s.heroSub}>
                        Trial Lens turns long Participant Information documents into a patient-friendly digital journey with video, summaries, FAQs and a trial-trained assistant.
                    </p>
                    <div style={s.heroCtas}>
                        <a href="#demo" className="btn btn-primary btn-lg">Request a demo <IconChevronRight /></a>
                        <Link href="/auth/sign-in" className="btn btn-secondary btn-lg">Sign in</Link>
                    </div>
                    <div style={s.heroTrust}>
                        <span style={s.heroTrustIcon}><IconShield /></span>
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                            Aligned with HRA participant information quality standards
                        </span>
                    </div>
                </div>
            </section>

            {/* ─── The Problem ─── */}
            <section className="section" style={s.problemSection}>
                <div className="container">
                    <div className="section-header">
                        <h2>The problem we solve</h2>
                        <p>Current Participant Information sheets leave patients overwhelmed and clinicians stretched</p>
                    </div>
                    <div style={s.problemGrid}>
                        {[
                            { icon: <IconDoc />, title: 'Long & technical documents', desc: 'PI sheets can run to 20+ pages of complex medical and legal language that patients find difficult to absorb.' },
                            { icon: <IconUsers />, title: 'Patients feel overwhelmed', desc: 'Faced with dense information, patients may disengage or decline participation — not because they object, but because they don\'t understand.' },
                            { icon: <IconZap />, title: 'Clinicians lack time', desc: 'Research nurses and investigators don\'t always have the time to walk every patient through every detail of the PI documentation.' },
                            { icon: <IconShield />, title: 'Comprehension gap', desc: 'There is a gap between what is written in the PI sheet and what patients actually understand — misaligned with HRA design principles for quality participant information.' },
                        ].map((item, i) => (
                            <div key={i} className="card" style={s.problemCard}>
                                <div style={s.problemIcon}>{item.icon}</div>
                                <h4 style={{ marginBottom: 'var(--space-2)' }}>{item.title}</h4>
                                <p style={{ fontSize: 'var(--text-sm)' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Impact Statistics ─── */}
            <section className="section" style={s.statsSection}>
                <div className="container">
                    <div className="section-header">
                        <h2 style={{ color: '#fff' }}>The potential impact</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)' }}>Example metrics — customise for your organisation</p>
                    </div>
                    <div style={s.statsGrid}>
                        {[
                            { value: '40%', label: 'Potential reduction in recruitment lead time' },
                            { value: '3×', label: 'Patient comprehension uplift' },
                            { value: '60%', label: 'Staff time saved per patient' },
                            { value: '85%', label: 'Higher completion of pre-screening steps' },
                        ].map((stat, i) => (
                            <div key={i} style={s.statCard}>
                                <div style={s.statValue}>{stat.value}</div>
                                <div style={s.statLabel}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                    <p style={s.statsDisclaimer}>
                        ⓘ Estimated metrics. These are not proven claims.
                    </p>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section className="section" id="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2>How it works</h2>
                        <p>Four simple steps from approved protocol to patient-ready experience</p>
                    </div>
                    <div style={s.stepsGrid}>
                        {[
                            { num: '01', icon: <IconUpload />, title: 'Upload your trial documents', desc: 'Upload your approved trial protocol and Participant Information sheet. Trial Lens securely stores and processes them.' },
                            { num: '02', icon: <IconVideo />, title: 'Generate a video explainer', desc: 'A short animated explainer video is created from your trial materials — or upload your own professional video.' },
                            { num: '03', icon: <IconDoc />, title: 'Build a study-specific hub', desc: 'Video, plain-language summaries, FAQs, accessible formats and translated versions — all in one patient-friendly page.' },
                            { num: '04', icon: <IconChat />, title: 'Add AI-powered assistance', desc: 'A trial-trained assistant answers routine patient questions and escalates complex ones to your clinical team.' },
                        ].map((step, i) => (
                            <div key={i} className="card" style={s.stepCard}>
                                <div style={s.stepNum}>{step.num}</div>
                                <div style={s.stepIcon}>{step.icon}</div>
                                <h4 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>{step.title}</h4>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── What You Get ─── */}
            <section className="section" style={{ background: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>What you get</h2>
                        <p>Everything you need to deliver an outstanding patient information experience</p>
                    </div>
                    <div style={s.featuresGrid}>
                        {[
                            { icon: <IconClipboard />, title: 'Digital study hub', desc: 'A dedicated, branded page for each trial with everything patients need in one place.' },
                            { icon: <IconVideo />, title: 'Video explainer', desc: 'Short, accessible animated video explaining the trial in simple, clear language.' },
                            { icon: <IconDoc />, title: 'Plain-language summary', desc: 'Structured, easy-to-read summary of key information: purpose, process, risks, and next steps.' },
                            { icon: <IconChat />, title: 'FAQs', desc: 'Study-specific frequently asked questions with searchable interface.' },
                            { icon: <IconGlobe />, title: 'Translations & accessibility', desc: 'Multi-language support and accessible formats to reach every patient.' },
                            { icon: <IconChat />, title: 'Trial-only assistant', desc: 'AI assistant trained on your trial materials with escalation to clinical staff.' },
                            { icon: <IconCheck />, title: 'Audit trail & consent', desc: 'Digital consent capture with full audit trail of patient interactions.' },
                            { icon: <IconShield />, title: 'Privacy & compliance', desc: 'Built with privacy by design, ready for regulatory frameworks.' },
                        ].map((feat, i) => (
                            <div key={i} style={s.featureCard}>
                                <div style={s.featureIcon}>{feat.icon}</div>
                                <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 'var(--space-1)' }}>{feat.title}</h4>
                                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="section" style={s.ctaSection} id="demo">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: '#fff', marginBottom: 'var(--space-4)' }}>Ready to transform your patient information?</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-8)' }}>
                        Get in touch to see Trial Lens in action and discuss how it can help your trials.
                    </p>
                    <a href="mailto:arjun.arun.mba25@said.oxford.edu" className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-primary)', fontWeight: 700 }}>
                        Request a demo
                    </a>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer style={s.footer}>
                <div className="container">
                    <div style={s.footerInner}>
                        <div>
                            <Logo size="sm" />
                            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginTop: 'var(--space-2)', maxWidth: '300px' }}>
                                Making clinical trial information accessible to every patient.
                            </p>
                        </div>
                        <div style={s.footerLinks}>
                            <a href="#" style={s.footerLink}>Privacy Policy</a>
                            <a href="#" style={s.footerLink}>Terms of Use</a>
                            <a href="mailto:arjun.arun.mba25@said.oxford.edu" style={s.footerLink}>Contact</a>
                        </div>
                    </div>
                    <div style={s.footerDisclaimer}>
                        <p>
                            <strong>Medical disclaimer:</strong> Trial Lens is an informational support tool only. It does not provide medical advice, diagnosis, or treatment.
                            All clinical decisions should be made by qualified healthcare professionals. The information provided through this platform is intended to support
                            understanding of clinical trial documentation and should not replace consultation with your clinical team.
                        </p>
                    </div>
                    <div style={s.footerBottom}>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                            © {new Date().getFullYear()} Trial Lens. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

/* ─── Styles ─── */
const s = {
    nav: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(248,250,251,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        height: 'var(--header-height)',
    },
    navInner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '0 var(--space-6)',
    },
    navLinks: {
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'center',
    },
    hero: {
        paddingTop: 'calc(var(--header-height) + var(--space-20))',
        paddingBottom: 'var(--space-20)',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-bg)',
    },
    heroGlow: {
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(0,180,216,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
    },
    heroContent: {
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        maxWidth: '800px',
        margin: '0 auto',
    },
    heroBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        background: 'rgba(0,180,216,0.08)',
        color: 'var(--color-secondary-dark)',
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        padding: 'var(--space-2) var(--space-4)',
        borderRadius: 'var(--radius-full)',
        marginBottom: 'var(--space-6)',
    },
    heroBadgeDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: 'var(--color-secondary)',
        display: 'inline-block',
    },
    heroH1: {
        fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        marginBottom: 'var(--space-6)',
        color: 'var(--color-primary)',
    },
    heroGradientText: {
        background: 'var(--gradient-primary)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSub: {
        fontSize: 'var(--text-xl)',
        color: 'var(--color-text-secondary)',
        lineHeight: 'var(--leading-relaxed)',
        maxWidth: '640px',
        margin: '0 auto var(--space-8)',
    },
    heroCtas: {
        display: 'flex',
        gap: 'var(--space-4)',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: 'var(--space-8)',
    },
    heroTrust: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--color-card)',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
    },
    heroTrustIcon: {
        color: 'var(--color-secondary)',
        display: 'flex',
    },
    problemSection: {
        background: 'var(--color-bg)',
    },
    problemGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
        gap: 'var(--space-6)',
    },
    problemCard: {
        borderTop: '3px solid var(--color-secondary)',
        padding: 'var(--space-6)',
    },
    problemIcon: {
        color: 'var(--color-secondary)',
        marginBottom: 'var(--space-4)',
    },
    statsSection: {
        background: 'var(--gradient-hero)',
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
        gap: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
    },
    statCard: {
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-8) var(--space-6)',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.15)',
    },
    statValue: {
        fontSize: 'var(--text-4xl)',
        fontWeight: 800,
        color: '#fff',
        marginBottom: 'var(--space-2)',
    },
    statLabel: {
        fontSize: 'var(--text-sm)',
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 'var(--leading-relaxed)',
    },
    statsDisclaimer: {
        textAlign: 'center',
        fontSize: 'var(--text-xs)',
        color: 'rgba(255,255,255,0.6)',
        fontStyle: 'italic',
    },
    stepsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
        gap: 'var(--space-6)',
    },
    stepCard: {
        textAlign: 'center',
        padding: 'var(--space-8) var(--space-6)',
        position: 'relative',
        overflow: 'hidden',
    },
    stepNum: {
        fontSize: '4rem',
        fontWeight: 800,
        color: 'rgba(0,180,216,0.08)',
        position: 'absolute',
        top: 'var(--space-2)',
        right: 'var(--space-4)',
        lineHeight: 1,
    },
    stepIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(0,180,216,0.08)',
        color: 'var(--color-secondary)',
        marginBottom: 'var(--space-4)',
    },
    featuresGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
        gap: 'var(--space-6)',
    },
    featureCard: {
        background: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        border: '1px solid var(--color-border)',
        transition: 'all var(--transition-base)',
    },
    featureIcon: {
        color: 'var(--color-secondary)',
        marginBottom: 'var(--space-3)',
    },
    ctaSection: {
        background: 'var(--gradient-hero)',
        padding: 'var(--space-20) 0',
    },
    footer: {
        borderTop: '1px solid var(--color-border)',
        padding: 'var(--space-12) 0 var(--space-6)',
        background: 'var(--color-card)',
    },
    footerInner: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-8)',
        marginBottom: 'var(--space-8)',
    },
    footerLinks: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
        flexWrap: 'wrap',
    },
    footerLink: {
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-secondary)',
    },
    footerDisclaimer: {
        padding: 'var(--space-4)',
        background: 'var(--color-bg-alt)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--space-6)',
        fontSize: 'var(--text-xs)',
        color: 'var(--color-muted)',
        lineHeight: 'var(--leading-relaxed)',
    },
    footerBottom: {
        borderTop: '1px solid var(--color-border)',
        paddingTop: 'var(--space-4)',
        textAlign: 'center',
    },
};

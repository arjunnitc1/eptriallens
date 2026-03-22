'use client';

export default function Logo({ size = 'md', className = '' }) {
    const sizes = {
        sm: { fontSize: '1.25rem' },
        md: { fontSize: '1.75rem' },
        lg: { fontSize: '2.5rem' },
        xl: { fontSize: '3.5rem' },
    };

    const style = sizes[size] || sizes.md;

    return (
        <span className={`logo ${className}`} style={style}>
            <span style={{ color: '#1B2D5B', fontWeight: 800, fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
                Trial
            </span>
            <span style={{ color: '#00B4D8', fontWeight: 800, fontFamily: 'var(--font-sans)', letterSpacing: '-0.02em' }}>
                Lens
            </span>
        </span>
    );
}

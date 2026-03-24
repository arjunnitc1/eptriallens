import './globals.css';
import Providers from './providers';

export const metadata = {
    title: 'Trial Lens — Make trial information easy to understand',
    description: 'Trial Lens turns long PI documents into a patient-friendly digital journey with video, summaries, FAQs and a trial-trained assistant.',
    icons: { icon: '/logo.png' },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/logo.png" sizes="any" />
            </head>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

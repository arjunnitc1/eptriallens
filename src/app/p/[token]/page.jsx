'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Logo from '@/components/Logo';

export default function PatientPage() {
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizPassed, setQuizPassed] = useState(false);

    useEffect(() => {
        fetch(`/api/patient/${token}`)
            .then((r) => { if (!r.ok) throw new Error('Invalid link'); return r.json(); })
            .then((d) => { setData(d); setLoading(false); })
            .catch((e) => { setError(e.message); setLoading(false); });
    }, [token]);

    if (loading) return <div style={page.loading}><Logo size="lg" /><p style={{ marginTop: 16, color: 'var(--color-muted)' }}>Loading your information…</p></div>;
    if (error || !data) return <div style={page.loading}><Logo size="lg" /><h2 style={{ marginTop: 16 }}>Link not valid</h2><p style={{ color: 'var(--color-muted)' }}>This link may have expired or is invalid. Please contact your research team.</p></div>;

    return (
        <div style={page.wrapper}>
            <meta name="robots" content="noindex, nofollow" />

            {/* Header */}
            <header style={page.header}>
                <Logo size="sm" />
                <span style={page.projectName}>{data.project.name}</span>
            </header>

            <main style={page.main}>
                {/* Welcome card */}
                <WelcomeCard data={data} />

                {/* Video */}
                <VideoSection video={data.video} />

                {/* Summary (with per-point videos) */}
                <SummarySection summary={data.summary} summaryVideos={data.summaryVideos} />

                {/* Original trial information document */}
                <TrialDocumentSection trialDocument={data.trialDocument} projectName={data.project.name} />

                {/* FAQs */}
                <FAQSection faqs={data.faqs} />

                {/* Chat assistant */}
                <ChatSection token={token} />

                {/* Documents */}
                <DocumentsSection documents={data.documents} />

                {/* Comprehension quiz */}
                <QuizSection questions={data.quizQuestions} onPass={() => setQuizPassed(true)} passed={quizPassed} />

                {/* Consent */}
                {!data.hasConsented && <ConsentSection token={token} data={data} quizPassed={quizPassed} />}
                {data.hasConsented && (
                    <section className="card" style={{ textAlign: 'center', borderColor: 'var(--color-success)', borderWidth: 2 }}>
                        <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                        <h3 style={{ color: 'var(--color-success)' }}>Consent submitted</h3>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>Thank you for providing your consent. The clinical team has been notified.</p>
                    </section>
                )}
            </main>

            {/* Footer */}
            <footer style={page.footer}>
                <div className="safety-banner" style={{ marginBottom: 16 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    <span>This platform provides information about the study only and does not constitute medical advice.</span>
                </div>
                <Logo size="sm" />
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 8, lineHeight: 1.6 }}>
                    Privacy notice placeholder · Data retention placeholder · © {new Date().getFullYear()} Trial Lens
                </p>
            </footer>
        </div>
    );
}

/* ─── Welcome Card ─── */
function WelcomeCard({ data }) {
    return (
        <section className="card" style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.05) 0%, rgba(72,202,228,0.05) 100%)', borderColor: 'rgba(0,180,216,0.2)' }}>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 8 }}>
                Welcome{data.firstName ? `, ${data.firstName}` : ''} 👋
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-relaxed)' }}>
                This page contains all the information you need about the <strong>{data.project.name}</strong> study.
                Take your time to watch the video, read the summary, and explore the FAQs. If you have any questions,
                our chat assistant is here to help, or you can contact the clinical team directly.
            </p>
        </section>
    );
}

/* ─── Video Section ─── */
function VideoSection({ video }) {
    if (!video) return null;

    return (
        <section>
            <h3 style={sec.heading}>🎬 Study explainer video</h3>
            <div style={sec.videoContainer}>
                {video.sourceType === 'EXTERNAL_URL' && video.url ? (
                    <iframe
                        src={video.url}
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-lg)' }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <video
                        controls
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            borderRadius: 'var(--radius-lg)',
                        }}
                    >
                        <source src={video.filepath} type="video/mp4" />
                        Your browser does not support the video element.
                    </video>
                )}
            </div>
            {video.title && <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginTop: 8 }}>{video.title}</p>}
        </section>
    );
}

/* ─── Summary Video Card ─── */
function SummaryVideoCard({ video, sectionKey }) {
    const gradients = {
        why: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        what: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        risks: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        timeline: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        next: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    };

    const [playing, setPlaying] = useState(false);

    if (!video) return null;

    return (
        <div
            onClick={() => setPlaying(!playing)}
            style={{
                background: gradients[sectionKey] || gradients.why,
                borderRadius: 'var(--radius-md)',
                padding: playing ? '0' : '16px 20px',
                marginBottom: '12px',
                display: 'flex',
                flexDirection: playing ? 'column' : 'row',
                alignItems: playing ? 'stretch' : 'center',
                gap: playing ? '0' : '16px',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                minHeight: playing ? '220px' : 'auto',
            }}
        >
            {playing ? (
                <div style={{ position: 'relative', width: '100%', height: '220px', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', marginBottom: 12 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>{video.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 'var(--text-xs)', marginTop: 4 }}>Video explainer · {video.duration}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: 12, fontStyle: 'italic' }}>Video content would play here in production</p>
                </div>
            ) : (
                <>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backdropFilter: 'blur(8px)',
                        transition: 'transform 0.2s',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{video.title}</div>
                        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.85, marginTop: '2px' }}>▶ Watch explainer · {video.duration}</div>
                    </div>
                </>
            )}
        </div>
    );
}

/* ─── Summary Section ─── */
function SummarySection({ summary, summaryVideos }) {
    const sectionConfig = [
        { key: 'why', label: 'Why this trial', icon: '🔬' },
        { key: 'what', label: 'What participation involves', icon: '📋' },
        { key: 'risks', label: 'Risks and benefits', icon: '⚖️' },
        { key: 'timeline', label: 'Timeline and visits', icon: '📅' },
        { key: 'next', label: 'What happens next', icon: '➡️' },
    ];

    const [openSections, setOpenSections] = useState({});

    function toggle(key) {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    }

    const hasSummary = sectionConfig.some(s => summary[s.key]);
    if (!hasSummary) return null;

    return (
        <section>
            <h3 style={sec.heading}>📖 Study information summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sectionConfig.map(({ key, label, icon }) => {
                    if (!summary[key]) return null;
                    const isOpen = openSections[key];
                    const video = summaryVideos?.[key];
                    return (
                        <div key={key} className="accordion-item">
                            <button
                                className="accordion-trigger"
                                aria-expanded={isOpen}
                                onClick={() => toggle(key)}
                            >
                                <span>{icon} {label}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {video && <span style={{ fontSize: '0.65rem', background: 'rgba(0,180,216,0.1)', color: 'var(--color-primary)', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>🎬 Video</span>}
                                    <span className="chevron" style={{ fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
                                </span>
                            </button>
                            {isOpen && (
                                <div className="accordion-content">
                                    <SummaryVideoCard video={video} sectionKey={key} />
                                    <div style={{ whiteSpace: 'pre-line' }}>{summary[key]}</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

/* ─── Trial Document Section ─── */
function TrialDocumentSection({ trialDocument, projectName }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!trialDocument) return null;

    return (
        <section>
            <h3 style={sec.heading}>📋 Original trial information document</h3>
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                            <div style={{
                                width: 40,
                                height: 40,
                                borderRadius: 'var(--radius-md)',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '18px',
                                flexShrink: 0,
                            }}>📄</div>
                            <div>
                                <h4 style={{ fontSize: 'var(--text-base)' }}>{projectName}</h4>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 2 }}>Full participant information sheet &amp; study guide</p>
                            </div>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={() => setIsExpanded(!isExpanded)} style={{ flexShrink: 0 }}>
                        {isExpanded ? '▲ Collapse' : '▼ View document'}
                    </button>
                </div>

                {isExpanded && (
                    <iframe
                        src={trialDocument}
                        style={{
                            width: '100%',
                            height: '600px',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            background: '#fff',
                            marginTop: 16,
                        }}
                        title="Trial Information Document"
                    />
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: isExpanded ? 12 : 16, flexWrap: 'wrap' }}>
                    <a
                        href={trialDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                    >
                        ↗ Open in new tab
                    </a>
                    <a
                        href={trialDocument}
                        download
                        className="btn btn-ghost btn-sm"
                    >
                        ⬇ Download
                    </a>
                </div>
            </div>
        </section>
    );
}

/* ─── FAQ Section ─── */
function FAQSection({ faqs }) {
    const [search, setSearch] = useState('');
    const [openFaq, setOpenFaq] = useState(null);

    if (!faqs || faqs.length === 0) return null;

    const filtered = search
        ? faqs.filter(f => f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase()))
        : faqs;

    return (
        <section>
            <h3 style={sec.heading}>❓ Frequently asked questions</h3>
            <input
                className="form-input"
                placeholder="Search FAQs…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginBottom: 12 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map((faq) => (
                    <div key={faq.id} className="accordion-item">
                        <button
                            className="accordion-trigger"
                            aria-expanded={openFaq === faq.id}
                            onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                        >
                            <span>{faq.question}</span>
                            <span className="chevron" style={{ fontSize: '0.8rem' }}>{openFaq === faq.id ? '▲' : '▼'}</span>
                        </button>
                        {openFaq === faq.id && (
                            <div className="accordion-content">{faq.answer}</div>
                        )}
                    </div>
                ))}
                {filtered.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--color-muted)', padding: 16, fontSize: 'var(--text-sm)' }}>
                        No FAQs match your search. Try different keywords or ask the assistant below.
                    </p>
                )}
            </div>
        </section>
    );
}

/* ─── Typing Bubble: reveals text word-by-word ─── */
function TypingBubble({ text, onTypingChange }) {
    const [displayed, setDisplayed] = useState('');
    const [done, setDone] = useState(false);
    const cancelledRef = useRef(false);

    useEffect(() => {
        cancelledRef.current = false;
        setDisplayed('');
        setDone(false);

        if (onTypingChange) onTypingChange(true);

        const words = text.split(/(\s+)/);
        let wordIndex = 0;
        const id = setInterval(() => {
            if (cancelledRef.current) { clearInterval(id); return; }
            wordIndex++;
            setDisplayed(words.slice(0, wordIndex).join(''));
            if (wordIndex >= words.length) {
                clearInterval(id);
                setDone(true);
                if (!cancelledRef.current && onTypingChange) onTypingChange(false);
            }
        }, 80);

        return () => {
            cancelledRef.current = true;
            clearInterval(id);
        };
    }, [text]);

    return (
        <>
            {displayed}
            {!done && <span className="typing-cursor">|</span>}
        </>
    );
}

/* ─── Chat Section ─── */
function ChatSection({ token }) {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm Dr. Lens, your study information assistant. I can help answer questions about this trial based on the provided materials. What would you like to know?", typed: true, spoken: true },
    ]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [showEscalation, setShowEscalation] = useState(false);
    const [escalationMsg, setEscalationMsg] = useState('');
    const [escalated, setEscalated] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const [isListening, setIsListening] = useState(false);
    const chatContainerRef = useRef(null);
    const recognitionRef = useRef(null);
    const userSentRef = useRef(false);

    const doctorActive = sending || isTyping;

    // Only auto-scroll the chat container (not the page) after the user sends a message
    useEffect(() => {
        if (userSentRef.current && chatContainerRef.current) {
            const el = chatContainerRef.current;
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, sending]);

    // Initialize Web Speech API for recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setInput(finalTranscript);
                } else if (interimTranscript) {
                    setInput(interimTranscript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Load voices so they are available when requested
    useEffect(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
        }
    }, []);

    const toggleListening = (e) => {
        e.preventDefault();
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (window.speechSynthesis) window.speechSynthesis.cancel(); // Stop talking if we are listening
            setIsSpeaking(false);
            setInput('');
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (err) {
                console.error('Could not start recognition:', err);
            }
        }
    };

    async function sendMessage(e) {
        e.preventDefault();
        if (!input.trim() || sending) return;

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }

        const userMsg = input.trim();
        setInput('');
        userSentRef.current = true;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setSending(true);

        try {
            const res = await fetch(`/api/patient/${token}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });
            const data = await res.json();

            if (res.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.response, typed: false, spoken: false }]);
                if (data.suggestEscalation) {
                    setShowEscalation(true);
                }
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Sorry, something went wrong. Please try again.', typed: false, spoken: false }]);
            }
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.', typed: false, spoken: false }]);
        }

        setSending(false);
    }

    async function submitEscalation() {
        if (!escalationMsg.trim()) return;
        const res = await fetch(`/api/patient/${token}/escalate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: escalationMsg }),
        });
        if (res.ok) {
            setEscalated(true);
            setShowEscalation(false);
        }
    }

    return (
        <section>
            <h3 style={sec.heading}>💬 Study assistant</h3>

            <div className="safety-banner" style={{ marginBottom: 12 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                This assistant provides information about the study, not medical advice.
            </div>

            <div className="chat-container">
                <div className="chat-messages" ref={chatContainerRef}>
                    {/* Doctor avatar header */}
                    <div style={docStyle.chatDocArea}>
                        <div className={doctorActive ? 'doc-img-talking' : 'doc-img-idle'} style={docStyle.docImgWrap}>
                            <img
                                src="/doctor-avatar.png"
                                alt="Dr. Lens"
                                style={docStyle.docImg}
                            />

                            <div style={docStyle.docShadow} className={doctorActive ? 'doc-shadow-talk' : 'doc-shadow-idle'} />
                        </div>
                        <div style={docStyle.nameTag}>
                            Dr. Lens
                            <span style={docStyle.nameTagSub}>Study Assistant</span>
                            <span style={docStyle.onlineDot} />
                        </div>
                    </div>

                    {messages.map((msg, i) => (
                        msg.role === 'user' ? (
                            <div key={i} className="chat-bubble chat-bubble-user">
                                {msg.content}
                            </div>
                        ) : (
                            <div key={i} style={docStyle.assistantRow}>
                                <div style={docStyle.miniAvatar}>
                                    <img src="/doctor-avatar.png" alt="" style={docStyle.miniAvatarImg} />
                                </div>
                                <div style={docStyle.speechBubble} className="speech-appear">
                                    <div style={docStyle.speechTail} />
                                    {msg.typed ? msg.content : (
                                        <TypingBubble
                                            text={msg.content}
                                            onTypingChange={(typing) => {
                                                setIsTyping(typing);
                                                if (!typing) {
                                                    setMessages(prev => prev.map((m, idx) =>
                                                        idx === i ? { ...m, typed: true } : m
                                                    ));
                                                }
                                            }}

                                        />
                                    )}
                                </div>
                            </div>
                        )
                    ))}

                    {sending && (
                        <div style={docStyle.assistantRow}>
                            <div style={docStyle.miniAvatar}>
                                <img src="/doctor-avatar.png" alt="" style={docStyle.miniAvatarImg} />
                            </div>
                            <div style={{ ...docStyle.speechBubble, opacity: 0.7 }}>
                                <div style={docStyle.speechTail} />
                                <span style={docStyle.thinkingDots}>
                                    <span className="dot dot1">●</span>
                                    <span className="dot dot2">●</span>
                                    <span className="dot dot3">●</span>
                                </span>
                            </div>
                        </div>
                    )}


                </div>

                <form className="chat-input-area" onSubmit={sendMessage}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isListening ? "Listening..." : "Ask Dr. Lens a question..."}
                            disabled={sending || isTyping}
                            style={{ paddingRight: '40px', width: '100%', backgroundColor: isListening ? '#f0fafe' : '#fff' }}
                        />
                        <button
                            type="button"
                            onClick={toggleListening}
                            className="voice-btn"
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '4px',
                                borderRadius: '50%',
                                color: isListening ? '#ef4444' : 'var(--color-muted)',
                                backgroundColor: isListening ? '#fee2e2' : 'transparent',
                                transition: 'all 0.2s ease',
                            }}
                            title={isListening ? "Stop listening" : "Speak your question"}
                        >
                            {isListening ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                            )}
                        </button>
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={sending || isTyping || (!input.trim() && !isListening)}>
                        Send
                    </button>
                </form>
            </div>

            {/* Escalation */}
            {showEscalation && !escalated && (
                <div className="card" style={{ marginTop: 12, borderColor: 'var(--color-secondary)', borderWidth: 2 }}>
                    <h4 style={{ marginBottom: 8 }}>📞 Contact the clinical team</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                        If Dr. Lens couldn't fully answer your question, submit it to the clinical team for a personal response.
                    </p>
                    <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="Type your question for the clinical team…"
                        value={escalationMsg}
                        onChange={(e) => setEscalationMsg(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setShowEscalation(false)}>Cancel</button>
                        <button className="btn btn-primary btn-sm" onClick={submitEscalation} disabled={!escalationMsg.trim()}>Submit question</button>
                    </div>
                </div>
            )}

            {escalated && (
                <div className="alert alert-success" style={{ marginTop: 12 }}>
                    ✅ Your question has been submitted to the clinical team. They will respond as soon as possible.
                </div>
            )}

            {/* Doctor animation styles */}
            <style>{`

                .doc-img-idle {
                    animation: docIdleBob 3s ease-in-out infinite;
                }
                .doc-img-talking {
                    animation: docTalkMove 0.6s ease-in-out infinite;
                }
                .doc-shadow-idle {
                    animation: docShadowIdle 3s ease-in-out infinite;
                }
                .doc-shadow-talk {
                    animation: docShadowTalk 0.6s ease-in-out infinite;
                }
                @keyframes docIdleBob {

                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-4px) rotate(0.5deg); }
                }
                @keyframes docTalkMove {
                    0% { transform: translateY(0) rotate(0deg) scale(1); }
                    15% { transform: translateY(-3px) rotate(-1.5deg) scale(1.01); }
                    30% { transform: translateY(-1px) rotate(1deg) scale(1); }
                    50% { transform: translateY(-4px) rotate(-0.5deg) scale(1.01); }
                    70% { transform: translateY(-2px) rotate(1.5deg) scale(1); }
                    85% { transform: translateY(-3px) rotate(-1deg) scale(1.01); }
                    100% { transform: translateY(0) rotate(0deg) scale(1); }
                }
                @keyframes docShadowIdle {
                    0%, 100% { transform: scaleX(1); opacity: 0.12; }
                    50% { transform: scaleX(0.92); opacity: 0.08; }
                }
                @keyframes docShadowTalk {
                    0%, 100% { transform: scaleX(1); opacity: 0.12; }
                    50% { transform: scaleX(0.85); opacity: 0.06; }
                }
                .typing-cursor {
                    display: inline-block;
                    animation: blink 0.6s step-end infinite;
                    color: #00b4d8;
                    font-weight: bold;
                    margin-left: 1px;
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
                .dot { animation: dotPulse 1.2s infinite; font-size: 10px; margin: 0 2px; color: #00b4d8; }
                .dot1 { animation-delay: 0s; }
                .dot2 { animation-delay: 0.2s; }
                .dot3 { animation-delay: 0.4s; }
                @keyframes dotPulse {
                    0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
                    40% { opacity: 1; transform: scale(1.2); }
                }
                .speech-appear {
                    animation: speechPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                @keyframes speechPop {
                    0% { opacity: 0; transform: translateX(-8px) scale(0.95); }
                    100% { opacity: 1; transform: translateX(0) scale(1); }
                }
            `}</style>
        </section>
    );
}

/* ─── Documents Section ─── */
function DocumentsSection({ documents }) {
    if (!documents || documents.length === 0) return null;

    const piSheet = documents.find(d => d.type === 'PI_SHEET');
    const contract = documents.find(d => d.type === 'PATIENT_CONTRACT');

    return (
        <section>
            <h3 style={sec.heading}>📄 Study documents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {piSheet && (
                    <div className="card">
                        <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 8 }}>Participant Information Sheet</h4>
                        <iframe
                            src={`/api/uploads/${piSheet.filepath.replace('/uploads/', '')}`}
                            style={{ width: '100%', height: '400px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                        />
                        <a
                            href={`/api/uploads/${piSheet.filepath.replace('/uploads/', '')}`}
                            download={piSheet.filename}
                            className="btn btn-ghost btn-sm"
                            style={{ marginTop: 8 }}
                        >
                            ⬇ Download {piSheet.filename}
                        </a>
                    </div>
                )}
                {contract && (
                    <div className="card">
                        <h4 style={{ fontSize: 'var(--text-base)', marginBottom: 8 }}>Patient Contract</h4>
                        <iframe
                            src={`/api/uploads/${contract.filepath.replace('/uploads/', '')}`}
                            style={{ width: '100%', height: '400px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                        />
                        <a
                            href={`/api/uploads/${contract.filepath.replace('/uploads/', '')}`}
                            download={contract.filename}
                            className="btn btn-ghost btn-sm"
                            style={{ marginTop: 8 }}
                        >
                            ⬇ Download {contract.filename}
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}

/* ─── Quiz Section ─── */
function QuizSection({ questions, onPass, passed }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    if (!questions || questions.length === 0) return null;

    const passingScore = Math.ceil(questions.length * 0.8);

    function selectAnswer(questionId, optionIndex) {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    }

    function handleSubmit() {
        let correct = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctIndex) correct++;
        });
        setScore(correct);
        setSubmitted(true);
        if (correct >= passingScore) {
            onPass();
        }
    }

    function handleRetry() {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    }

    const allAnswered = questions.every(q => answers[q.id] !== undefined);
    const didPass = score >= passingScore;

    if (passed) {
        return (
            <section className="card" style={{ textAlign: 'center', borderColor: 'var(--color-success)', borderWidth: 2 }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>✅</div>
                <h3 style={{ color: 'var(--color-success)' }}>Comprehension quiz passed</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>
                    You have demonstrated understanding of the trial information. You may now proceed to the consent section below.
                </p>
            </section>
        );
    }

    return (
        <section>
            <h3 style={sec.heading}>🧠 Comprehension quiz</h3>
            <div className="card">
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 20, lineHeight: 'var(--leading-relaxed)' }}>
                    Before providing your consent, please answer these questions to confirm you understand the key aspects of this trial.
                    You need to answer at least <strong>{passingScore} out of {questions.length}</strong> correctly to proceed.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {questions.map((q, qi) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = submitted && userAnswer === q.correctIndex;
                        const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.correctIndex;

                        return (
                            <div key={q.id}>
                                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: 24, height: 24, borderRadius: '50%',
                                        background: submitted ? (isCorrect ? 'var(--color-success)' : isWrong ? '#ef4444' : 'var(--color-primary)') : 'var(--color-primary)',
                                        color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0,
                                    }}>{qi + 1}</span>
                                    {q.question}
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 32 }}>
                                    {q.options.map((opt, oi) => {
                                        const isSelected = userAnswer === oi;
                                        const isCorrectOption = submitted && oi === q.correctIndex;
                                        const isWrongSelection = submitted && isSelected && oi !== q.correctIndex;

                                        let bgColor = 'var(--color-bg-alt)';
                                        let borderColor = 'transparent';
                                        let textColor = 'var(--color-text)';
                                        if (isSelected && !submitted) { bgColor = 'rgba(0,180,216,0.08)'; borderColor = 'var(--color-primary)'; }
                                        if (isCorrectOption) { bgColor = 'rgba(34,197,94,0.1)'; borderColor = 'var(--color-success)'; textColor = '#166534'; }
                                        if (isWrongSelection) { bgColor = 'rgba(239,68,68,0.1)'; borderColor = '#ef4444'; textColor = '#991b1b'; }

                                        return (
                                            <button
                                                key={oi}
                                                type="button"
                                                onClick={() => selectAnswer(q.id, oi)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 10,
                                                    padding: '10px 14px',
                                                    borderRadius: 'var(--radius-md)',
                                                    border: `2px solid ${borderColor}`,
                                                    background: bgColor,
                                                    color: textColor,
                                                    cursor: submitted ? 'default' : 'pointer',
                                                    fontSize: 'var(--text-sm)',
                                                    textAlign: 'left',
                                                    transition: 'all 0.2s',
                                                    width: '100%',
                                                    fontFamily: 'inherit',
                                                }}
                                            >
                                                <span style={{
                                                    width: 22, height: 22, borderRadius: '50%',
                                                    border: `2px solid ${isSelected || isCorrectOption ? borderColor || 'var(--color-primary)' : 'var(--color-border)'}`,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '11px', fontWeight: 700, flexShrink: 0,
                                                    background: isSelected || isCorrectOption ? (isCorrectOption ? 'var(--color-success)' : isWrongSelection ? '#ef4444' : 'var(--color-primary)') : 'transparent',
                                                    color: isSelected || isCorrectOption ? '#fff' : 'var(--color-muted)',
                                                    transition: 'all 0.2s',
                                                }}>{String.fromCharCode(65 + oi)}</span>
                                                {opt}
                                                {isCorrectOption && <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-success)', fontWeight: 600 }}>✓ Correct</span>}
                                                {isWrongSelection && <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: '#ef4444', fontWeight: 600 }}>✗ Incorrect</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {!submitted ? (
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        style={{ marginTop: 24, width: '100%' }}
                    >
                        Submit answers
                    </button>
                ) : (
                    <div style={{ marginTop: 24, textAlign: 'center', padding: '20px 0 8px' }}>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            fontSize: 'var(--text-lg)', fontWeight: 700,
                            color: didPass ? 'var(--color-success)' : '#ef4444',
                            marginBottom: 8,
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>{didPass ? '🎉' : '😕'}</span>
                            {score} / {questions.length} correct
                        </div>
                        {didPass ? (
                            <p style={{ color: 'var(--color-success)', fontSize: 'var(--text-sm)' }}>
                                Well done! You can now proceed to the consent section below.
                            </p>
                        ) : (
                            <>
                                <p style={{ color: '#ef4444', fontSize: 'var(--text-sm)', marginBottom: 16 }}>
                                    You need at least {passingScore} correct answers to proceed. Please review the study information and try again.
                                </p>
                                <button className="btn btn-ghost" onClick={handleRetry}>↻ Retry quiz</button>
                            </>
                        )}
                    </div>
                )}

                {!submitted && !allAnswered && (
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', textAlign: 'center', marginTop: 8 }}>
                        Please answer all {questions.length} questions to submit.
                    </p>
                )}
            </div>
        </section>
    );
}

/* ─── Consent Section ─── */
function ConsentSection({ token, data, quizPassed }) {
    const [readUnderstood, setReadUnderstood] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [signatureName, setSignatureName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    // Signature pad drawing
    function startDraw(e) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasDrawn(true);
    }

    function draw(e) {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
        const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'var(--color-primary)';
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDraw() {
        setIsDrawing(false);
    }

    function clearSignature() {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!readUnderstood || !acceptTerms || !signatureName) return;

        setSubmitting(true);
        const signatureData = hasDrawn ? canvasRef.current?.toDataURL() : '';

        const res = await fetch(`/api/patient/${token}/consent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                readUnderstood,
                acceptTerms,
                signatureName,
                signatureData,
            }),
        });

        if (res.ok) {
            setSubmitted(true);
        } else {
            alert('Failed to submit consent. Please try again.');
        }
        setSubmitting(false);
    }

    if (submitted) {
        return (
            <section className="card" style={{ textAlign: 'center', borderColor: 'var(--color-success)', borderWidth: 2 }}>
                <div style={{ fontSize: '3rem', marginBottom: 8 }}>✅</div>
                <h3 style={{ color: 'var(--color-success)' }}>Consent submitted successfully</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', marginTop: 8 }}>
                    Thank you for providing your consent. The clinical research team has been notified.
                    You will receive confirmation shortly.
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-muted)', marginTop: 12 }}>
                    Signed by: {signatureName} · {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                </p>
            </section>
        );
    }

    if (!quizPassed) {
        return (
            <section>
                <h3 style={sec.heading}>✍️ Consent and agreement</h3>
                <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px' }}>🔒</div>
                    <h4 style={{ marginBottom: 8 }}>Complete the comprehension quiz first</h4>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 'var(--leading-relaxed)' }}>
                        Please complete and pass the comprehension quiz above before providing your consent. This ensures you are fully informed about the trial.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section>
            <h3 style={sec.heading}>✍️ Consent and agreement</h3>
            <form className="card" onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <label className="form-checkbox">
                        <input
                            type="checkbox"
                            checked={readUnderstood}
                            onChange={(e) => setReadUnderstood(e.target.checked)}
                            required
                        />
                        <span style={{ fontSize: 'var(--text-sm)' }}>
                            I have read and understood the information provided about this study,
                            including the Participant Information Sheet and any other documents.
                        </span>
                    </label>

                    <label className="form-checkbox">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            required
                        />
                        <span style={{ fontSize: 'var(--text-sm)' }}>
                            I accept the terms in the patient contract and agree to participate in this study voluntarily.
                            I understand I can withdraw at any time without giving a reason.
                        </span>
                    </label>

                    <div className="form-group">
                        <label className="form-label">Full name (typed signature)</label>
                        <input
                            className="form-input"
                            placeholder="Enter your full name"
                            value={signatureName}
                            onChange={(e) => setSignatureName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Drawn signature (optional)</label>
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={120}
                            className="signature-pad"
                            style={{ width: '100%', maxWidth: '400px', height: '120px' }}
                            onMouseDown={startDraw}
                            onMouseMove={draw}
                            onMouseUp={stopDraw}
                            onMouseLeave={stopDraw}
                            onTouchStart={startDraw}
                            onTouchMove={draw}
                            onTouchEnd={stopDraw}
                        />
                        {hasDrawn && (
                            <button type="button" className="btn btn-ghost btn-sm" style={{ marginTop: 4 }} onClick={clearSignature}>
                                Clear signature
                            </button>
                        )}
                    </div>

                    <div style={{ background: 'var(--color-bg-alt)', padding: 12, borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-muted)' }}>
                        <strong>Date:</strong> {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={!readUnderstood || !acceptTerms || !signatureName || submitting}
                        style={{ width: '100%' }}
                    >
                        {submitting ? 'Submitting…' : 'Submit consent'}
                    </button>
                </div>
            </form>
        </section>
    );
}

/* ─── Page Styles ─── */
const page = {
    wrapper: {
        minHeight: '100vh',
        background: 'var(--color-bg)',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        padding: 'var(--space-6)',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-4) var(--space-6)',
        background: 'var(--color-card)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
    },
    projectName: {
        fontSize: 'var(--text-sm)',
        fontWeight: 600,
        color: 'var(--color-primary)',
    },
    main: {
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
    },
    footer: {
        maxWidth: '720px',
        margin: '0 auto',
        padding: 'var(--space-8) var(--space-6)',
        textAlign: 'center',
        borderTop: '1px solid var(--color-border)',
    },
};

const sec = {
    heading: {
        fontSize: 'var(--text-xl)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginBottom: 'var(--space-4)',
    },
    videoContainer: {
        width: '100%',
        height: '420px',
        borderRadius: 'var(--radius-lg)',
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
};

const docStyle = {
    docImgWrap: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    docImg: {
        width: '120px',
        height: '150px',
        objectFit: 'cover',
        objectPosition: 'top',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,180,216,0.12)',
        border: '2px solid rgba(0,180,216,0.15)',
    },
    docShadow: {
        width: '80px',
        height: '8px',
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.1)',
        marginTop: '6px',
    },
    chatDocArea: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 0 16px',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: '12px',
    },
    nameTag: {
        fontSize: 'var(--text-sm)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginTop: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
    },
    nameTagSub: {
        fontSize: 'var(--text-xs)',
        fontWeight: 400,
        color: 'var(--color-muted)',
    },
    onlineDot: {
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#22c55e',
        marginTop: '2px',
        boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
    },
    assistantRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '8px',
        marginBottom: '8px',
        maxWidth: '90%',
    },
    miniAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        border: '1.5px solid #b2e5f0',
        marginTop: '4px',
    },
    miniAvatarImg: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'top',
    },
    speechBubble: {
        position: 'relative',
        background: 'linear-gradient(135deg, #f0fafe 0%, #e8f7fa 100%)',
        border: '1px solid #cceef5',
        borderRadius: '4px 16px 16px 16px',
        padding: '10px 14px',
        fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)',
        color: 'var(--color-text)',
        boxShadow: '0 1px 3px rgba(0,180,216,0.08)',
    },
    speechTail: {
        position: 'absolute',
        left: '-6px',
        top: '10px',
        width: 0,
        height: 0,
        borderTop: '6px solid transparent',
        borderBottom: '6px solid transparent',
        borderRight: '6px solid #cceef5',
    },
    thinkingDots: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
    },
};


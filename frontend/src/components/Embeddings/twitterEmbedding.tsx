import { useEffect, useRef, useState } from 'react';
import { height, width } from "@/config";

const MAX_RETRIES = 8;
const POLL_INTERVAL = 600;

export const TwitterEmbedding = ({ url }: { url: string }) => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [attempt, setAttempt] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (!url) return;

        let currentAttempt = 0;

        // Twitter script load karo
        const loadTwitterScript = () => {
            return new Promise<void>((resolve, reject) => {
                if ((window as any).twttr && (window as any).twttr.widgets) {
                    resolve();
                    return;
                }

                const existingScript = document.getElementById('twitter-wjs');
                if (existingScript) {
                    existingScript.addEventListener('load', () => resolve());
                    existingScript.addEventListener('error', () => reject());
                    return;
                }

                const script = document.createElement('script');
                script.id = 'twitter-wjs';
                script.src = 'https://platform.twitter.com/widgets.js';
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject();
                document.head.appendChild(script);
            });
        };

        // Embed render karo
        const renderEmbed = async () => {
            try {
                await loadTwitterScript();
                
                if (containerRef.current && (window as any).twttr?.widgets) {
                    (window as any).twttr.widgets.load(containerRef.current);
                }
            } catch (err) {
                console.warn('Twitter script load failed:', err);
            }
        };

        // Check karo embed render hua ya nahi
        const checkIfRendered = () => {
            if (!containerRef.current) return false;
            const iframe = containerRef.current.querySelector('iframe');
            const rendered = containerRef.current.querySelector('.twitter-tweet-rendered');
            return !!(iframe || rendered);
        };

        // Polling function
        const poll = async () => {
            currentAttempt++;
            setAttempt(currentAttempt);

            await renderEmbed();

            setTimeout(() => {
                if (checkIfRendered()) {
                    setStatus('success');
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                } else if (currentAttempt >= MAX_RETRIES) {
                    setStatus('error');
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            }, 400);
        };

        // Start polling
        poll();
        intervalRef.current = window.setInterval(() => {
            if (currentAttempt < MAX_RETRIES) {
                poll();
            }
        }, POLL_INTERVAL);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [url]);

    if (!url) {
        return <p>No URL provided to embed.</p>;
    }

    const newUrl = url.replace("x.com", "twitter.com");

    // Loading state
    if (status === 'loading') {
        return (
            <div 
                style={{ 
                    maxHeight: `${height + 30}px`,
                    overflowY: "hidden",
                    overflowX: "hidden",
                    border: '1px solid #e1e8ed',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f7f9fa',
                    minHeight: '200px'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        border: '3px solid #e1e8ed',
                        borderTopColor: '#1d9bf0',
                        borderRadius: '50%',
                        animation: 'twitterSpin 0.8s linear infinite',
                        margin: '0 auto 12px'
                    }} />
                    <p style={{ margin: 0, color: '#536471', fontSize: '14px' }}>
                        Loading X post... ({attempt}/{MAX_RETRIES})
                    </p>
                    <style>{`
                        @keyframes twitterSpin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    // Error state
    if (status === 'error') {
        return (
            <div 
                style={{ 
                    maxHeight: `${height + 30}px`,
                    overflowY: "hidden",
                    overflowX: "hidden",
                    border: '1px solid #e1e8ed',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#fff',
                    minHeight: '200px'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#536471', marginBottom: '12px', fontSize: '14px' }}>
                        ⚠️ Embed load nahi ho paya
                    </p>
                    <a 
                        href={newUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-block',
                            background: '#1d9bf0',
                            color: 'white',
                            padding: '8px 20px',
                            borderRadius: '20px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '14px'
                        }}
                    >
                        Open on X ↗
                    </a>
                </div>
            </div>
        );
    }

    // Success state - original structure
    return (
        <div 
            ref={containerRef}
            style={{ 
                maxHeight: `${height + 30}px`,
                overflowY: "hidden",
                overflowX: "hidden"
            }}
        >
            <blockquote 
                style={{ width: `${width}px` }}
                className="twitter-tweet"
            >
                <a href={newUrl}></a> 
            </blockquote>
        </div>
    );
};
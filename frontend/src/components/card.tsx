import { LinkedInEmbedding } from "./Embeddings/linkedinEmbedding"
import { DeleteIcon } from "./svg/deleteicon"
import { DynamicIcon } from "./svg/logos";
import YouTubeEmbed from "./Embeddings/youtubeEmbedding";
import { BACKEND_URL, CONTENT, height, width, type CardProps } from "../config";
import { TwitterEmbedding } from "./Embeddings/twitterEmbedding";
import axios, { type AxiosResponse } from "axios";
import { useState } from "react";
import { InstagramEmbed, RedditEmbed } from "./Embeddings/oembed";

const Embedd = ({ type, url }: { type: string, url: string }) => {
    return (
        <>
            {type == "linkedIn" && <div id={type} key={`${url}`}><LinkedInEmbedding url={url} /></div>}
            {type == "youtube" && <div id={type} key={`${url}`}><YouTubeEmbed url={url} /></div>}
            {type == "twitter" && <div id={type} key={`${url}`}><TwitterEmbedding url={url} /></div>}
            {type=="instagram" && <div id={type} key={`${url}`}> <InstagramEmbed url={url} /> </div>}
            {type=="reddit" && <div id={type} key={`${url}`}> <RedditEmbed url={url} /> </div>}
        </>
    )
}

export let sampleLink = ["link1", "link2", "link3"]
const cardWidth = width + 102;
const cardHeight = 350; // Optimized height - compact but airy
const embedHeight = 210; // Optimized for space efficiency
const tagsHeight = 50;

// DELETE content function
const deleteContent = async ({ link }: { link: string }) => {
    try {
        console.log("Delete content clicked");
        const response: AxiosResponse = await axios.delete(BACKEND_URL + CONTENT,
            {
                data: { link },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                }
            });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Delete failed:', error.response?.data || error.message);
            throw new Error(error.response?.data.message || 'Failed to delete content.');
        } else {
            console.error('An unexpected error occurred:', error);
            throw new Error('An unexpected error occurred during deletion.');
        }
    }
}

export const CardComponent = ({ type, heading, tags, url, onDeleted }: CardProps) => {
    const [isHovered, setIsHovered] = useState(false);

    if (!url) {
        return (<p style={{ height: `${height}px`, width: `${width}px` }}>
            No URL provided to embed.</p>)
    }

    return (
        <div
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                width: `${cardWidth}px`,
                height: `${cardHeight}px`,
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: isHovered
                    ? '0 12px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)'
                    : '0 2px 8px rgba(0, 0, 0, 0.06)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                overflow: 'hidden',
                marginBottom: '16px'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '16px 20px 12px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '10px'
            }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                            background: '#F5F5F7',
                            borderRadius: '6px'
                        }}>
                            <DynamicIcon type={type} />
                        </div>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: 600,
                            color: '#999999',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {type}
                        </span>
                    </div>
                    <h3 className="font-heading" style={{
                        margin: 0,
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#000000',
                        lineHeight: '1.3',
                        letterSpacing: '-0.01em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {heading || 'Untitled'}
                    </h3>
                </div>

                {/* Delete Button */}
                <button
                    onClick={async () => {
                        await deleteContent({ link: url });
                        onDeleted?.();
                    }}
                    style={{
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'scale(1)' : 'scale(0.8)',
                        transition: 'all 0.2s ease',
                        background: isHovered ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                        border: 'none',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                    }}
                >
                    <DeleteIcon />
                </button>
            </div>

            {/* Embed Container */}
            <div style={{
                padding: '0 25px',
                marginBottom: '12px'
            }}>
                <div style={{
                    height: `${embedHeight}px`,
                    background: '#FAFAFA',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.06)'
                }}>
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        <Embedd type={type} url={url} />
                    </div>
                </div>
            </div>

            {/* Tags Section */}
            <div style={{
                padding: '0 20px 16px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                maxHeight: `${tagsHeight}px`,
                overflowY: 'auto',
                overflowX: 'hidden'
            }}>
                {tags?.map((tagValue, index) => (
                    <span
                        key={index}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '5px 10px',
                            background: '#F5F5F7',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: '#000000',
                            letterSpacing: '0.01em',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#EBEBED';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#F5F5F7';
                        }}
                    >
                        #{tagValue}
                    </span>
                )) || (
                    <span style={{
                        fontSize: '11px',
                        color: '#999999',
                        fontStyle: 'italic'
                    }}>
                        No tags
                    </span>
                )}
            </div>
        </div>
    )
}

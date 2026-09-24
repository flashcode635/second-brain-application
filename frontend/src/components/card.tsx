import { LinkedInEmbedding } from "./Embeddings/linkedinEmbedding"
import { DeleteIcon } from "./svg/deleteicon"
import { EditIcon } from "./svg/editicon"
import { ThreeDotIcon } from "./svg/threedoticon"
import { DynamicIcon } from "./svg/logos";
import YouTubeEmbed from "./Embeddings/youtubeEmbedding";
import { CONTENT, height, width, type CardProps } from "../config";
import { TwitterEmbedding } from "./Embeddings/twitterEmbedding";
import axios, { type AxiosResponse } from "axios";
import api from "../api";
import { useEffect, useRef, useState } from "react";
import { InstagramEmbed, RedditEmbed } from "./Embeddings/oembed";
import { DocumentEmbedding } from "./Embeddings/documentEmbedding";

const Embedd = ({ type, url, description }: { type: string, url: string, description?: string }) => {
    return (
        <>
            {type == "linkedIn" && <div id={type} key={`${url}`}><LinkedInEmbedding url={url} /></div>}
            {type == "youtube" && <div id={type} key={`${url}`}><YouTubeEmbed url={url} /></div>}
            {type == "twitter" && <div id={type} key={`${url}`}><TwitterEmbedding url={url} /></div>}
            {type=="instagram" && <div id={type} key={`${url}`}> <InstagramEmbed url={url} /> </div>}
            {type=="reddit" && <div id={type} key={`${url}`}> <RedditEmbed url={url} /> </div>}
            {type=="document" && <div id={type} key={`${url}`}> <DocumentEmbedding url={url} description={description} /> </div>}
        </>
    )
}

export let sampleLink = ["link1", "link2", "link3"]
const cardWidth = width + 102;
const cardHeight = 330; // Optimized height - compact but airy
const embedHeight = 210; // Optimized for space efficiency
const tagsHeight = 50;

// DELETE content function
const deleteContent = async ({ link }: { link: string }) => {
    try {
        console.log("Delete content clicked");
        const response: AxiosResponse = await api.delete(CONTENT, {
            data: { link },
            headers: { "Content-Type": "application/json" },
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

export const CardComponent = ({ type, heading, tags, url, description, onDeleted, onEdit }: CardProps) => {
    const [isHovered, setIsHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    if (!url) {
        return (<p style={{ height: `${height}px`, width: `${width}px` }}>
            No URL provided to embed.</p>)
    }

    return (
        <div
            className={`group relative theme-surface mb-4 flex flex-col rounded-2xl border border-border p-5 transition-all duration-300 ease-out ${
                isHovered
                    ? "-translate-y-0.5 shadow-[0_12px_32px_rgba(0,0,0,0.12),0_4px_8px_rgba(0,0,0,0.08)]"
                    : "translate-y-0 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: cardWidth, height: cardHeight }}
        >
            {/* Embed Container: shadow instead of a flat grey fill */}
            <div
                className="mb-3 overflow-hidden rounded-xl"
                style={{ height: embedHeight }}
            >
                <div className="flex h-full items-center justify-center overflow-hidden rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                    <Embedd type={type} url={url} description={description} />
                </div>
            </div>

            {/* Header: icon directly next to title, no type label */}
            <div className="flex items-start justify-between gap-2.5 pb-3">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                    <div className="theme-icon-badge flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
                        <DynamicIcon type={type} />
                    </div>
                    <h3 className="font-heading line-clamp-2 text-xl font-semibold leading-tight tracking-tight text-text-primary">
                        {heading || 'Untitled'}
                    </h3>
                </div>

                {/* 3-dot menu: Edit / Delete */}
                <div className="relative shrink-0" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="More options"
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary transition-all duration-200 hover:bg-hover ${
                            isHovered || menuOpen ? "scale-100 opacity-100" : "scale-[0.8] opacity-0"
                        }`}
                    >
                        <ThreeDotIcon />
                    </button>

                    {menuOpen && (
                        <div
                            role="menu"
                            className="theme-surface absolute right-0 top-9 z-10 w-32 overflow-hidden rounded-lg border border-border shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                        >
                            <button
                                role="menuitem"
                                onClick={() => {
                                    setMenuOpen(false);
                                    onEdit?.();
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-hover [&_svg]:h-4 [&_svg]:w-4"
                            >
                                <EditIcon /> Edit
                            </button>
                            <button
                                role="menuitem"
                                onClick={async () => {
                                    setMenuOpen(false);
                                    await deleteContent({ link: url });
                                    onDeleted?.();
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-red-50 [&_svg]:h-4 [&_svg]:w-4"
                            >
                                <DeleteIcon /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tags Section */}
            <div
                className="flex flex-wrap gap-1.5 overflow-x-hidden overflow-y-auto"
                style={{ maxHeight: tagsHeight }}
            >
                {tags?.length ? (
                    tags.map((tagValue, index) => (
                        <span
                            key={index}
                            className="theme-muted-surface hover:bg-hover inline-flex items-center whitespace-nowrap rounded-[10px] px-2.5 py-1 text-[11px] font-medium tracking-wide text-text-primary transition-colors duration-200"
                        >
                            #{tagValue}
                        </span>
                    ))
                ) : (
                    <span className="text-[11px] italic text-text-muted">No tags</span>
                )}
            </div>
        </div>
    )
}

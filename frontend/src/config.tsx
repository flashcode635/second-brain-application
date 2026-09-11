//  interface for all embeddings- used in linkedinEmbedding and youtubeEmbedding.tsx
export const width =200;
export const height = 185;
export interface EmbeddingProps {
  url: string;

}
// card props for content cards
export interface CardProps{
   // CHANGE: Added 'document' type to support all content types from backend
   // This allows CardComponent to accept document type in addition to social media types
  type: 'linkedIn' | 'youtube' | 'twitter' | 'instagram' | 'reddit' | 'document';
    heading?: string,
  tags?: string[],
    url?: string
    onDeleted?: () => void
}
// common className for input fields
export const className = "p-3 py-2.5 rounded-lg outline-none transition-all cursor-pointer w-fit"

// backend URL - use environment variable in production; in dev use relative URLs via Vite proxy
export const BACKEND_URL = import.meta.env.DEV
  ? ""
  : import.meta.env.VITE_BACKEND_URL || "";


export const SIGN_UP= "/app/v1/signup"
export const SIGN_IN= "/api/auth/login"
export const CONTENT= "/app/v1/content"  // POST endpoint to  content



export const MOBILE_BREAKPOINT = 768;
export const MIN_SIDEBAR_WIDTH = 76;
export const MAX_SIDEBAR_WIDTH = 320;
export const DEFAULT_SIDEBAR_WIDTH = 280;
export const MOBILE_EXPANDED_WIDTH = 240;

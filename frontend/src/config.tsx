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
   type: 'linkedIn' | 'youtube'| 'twitter' | 'document';  // used in DynamicIcon too.
    heading?: string,
  tags?: string[],
    url?: string
    key?: any
}
// common className for input fields
export const className = "px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200  outline-none transition-all text-slate-900 bg-slate-50 shadow-sm"

// backend URL - use environment variable in production, fallback to localhost for development
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
export const SIGN_UP= "/app/v1/signup"
export const SIGN_IN= "/app/v1/signin"
export const CONTENT= "/app/v1/content"  // POST endpoint to  content

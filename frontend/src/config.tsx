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
export const className = "theme-input px-4 py-2 rounded-lg outline-none transition-all"

// backend URL - use environment variable in production, fallback to localhost for development
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
"http://localhost:3001"
export const SIGN_UP= "/app/v1/signup"
export const SIGN_IN= "/app/v1/signin"
export const CONTENT= "/app/v1/content"  // POST endpoint to  content

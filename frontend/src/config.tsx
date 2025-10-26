//  interface for all embeddings- used in linkedinEmbedding and youtubeEmbedding.tsx
export const width =200;
export const height = 185;
export interface EmbeddingProps {
  url: string;

}
// card props for content cards
export interface CardProps{
   type: 'linkedIn' | 'youtube'| 'twitter';  // used in DynamicIcon too.
    heading?: string,
  tags?: string[],
    url?: string
}
// common className for input fields
export const className = "px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200  outline-none transition-all text-slate-900 bg-slate-50 shadow-sm"

// backend URL
export const BACKEND_URL= "http://localhost:3000"
export const SIGN_UP= "/app/v1/signup"
export const SIGN_IN= "/app/v1/signin"
export const ADD_CONTENT= "/app/v1/content"
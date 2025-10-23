//  interface for all embeddings- used in linkedinEmbedding and youtubeEmbedding.tsx
export const width =200;
export const height = 185;
export interface EmbeddingProps {
  url: string;

}

export interface CardProps{
   type: 'linkedIn' | 'youtube'| 'twitter';  // used in DynamicIcon too.
    heading?: string,
    description?: string,
    url?: string
}

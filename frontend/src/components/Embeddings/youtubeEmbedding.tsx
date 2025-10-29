import React from 'react';
import { height, width, type EmbeddingProps } from '../../config';


const YouTubeEmbed: React.FC<EmbeddingProps> = ({
  url,

}) => {
  // Extract video ID from URL
  const getVideoId = (link: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|embed)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(url);
  if (!videoId) return <p>Invalid YouTube URL</p>;

  const embedSrc = `https://www.youtube.com/embed/${videoId}`;
  return (
    <iframe style={{height: `${height}px`, width: `${width+60}px`, borderRadius:'8px'}}
      src={embedSrc}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      title="YouTube video"
    />
  );
};

export default YouTubeEmbed;

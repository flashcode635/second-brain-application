// // backend.js (Express Server)
// import express from 'express';

// const app = express();

// // Tumhare dono functions yahan aayenge
// async function resolveLinkedInLink(shortUrl: string): Promise<string> {
//     try {
//         const response = await fetch(shortUrl, { 
//             redirect: 'follow',
//             headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } 
//         });
//         return response.url; 
//     } catch (error) {
//         return shortUrl; 
//     }
// }

// function extractMetaFromUrl(fullUrl: string) {
//     const idMatch = fullUrl.match(/(activity-|urn:li:activity:|urn:li:share:)(\d+)/);
//     const postId = idMatch ? idMatch[2] : null;

//     const slugMatch = fullUrl.match(/\/posts\/[^_]+_(.*)-activity-/i);
//     let title = "LinkedIn Post";
//     if (slugMatch!=null && slugMatch[1]) {
//         title = slugMatch[1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
//     }

//     const authorMatch = fullUrl.match(/\/posts\/([^_]+)_/);
//     const author = authorMatch ? `@${authorMatch[1]}` : "Unknown Author";

//     return {
//         success: true,
//         provider: "linkedin",
//         postId,
//         title,
//         author,
//         embedUrl: postId ? `https://www.linkedin.com/embed/feed/update/urn:li:activity:${postId}` : null,
//         originalUrl: fullUrl
//     };
// }

// // API ENDPOINT
// app.get('/api/linkedinpreview/:url', async (req, res) => {
//     const { url }:{url: string} = req.params;
//     if (!url) return res.status(400).json({ error: "URL required" });

//     try {
//         // 1. Link resolve karo (lnkd.in -> linkedin.com)
//         const resolvedUrl = await resolveLinkedInLink(url as string);
        
//         // 2. Metadata extract karo
//         const metaData = extractMetaFromUrl(resolvedUrl);
        
//         // 3. Frontend ko bhejo
//         res.json(metaData);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to process link" });
//     }
// });

// app.listen(3000, () => console.log('Server running'));
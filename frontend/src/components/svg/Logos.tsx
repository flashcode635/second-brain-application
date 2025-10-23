import linkedinImage from "../../assets/linkedinImage.svg"
import ytImage from "../../assets/youtubeImage.svg"
import documentImage from "../../assets/documentImage.svg"
import type { CardProps } from "../../config";
import twitterImage from "../../assets/twitterImage.svg"; 
// Defines the structure for the icon props is imported from card props


// Rename the component to something more generic since it handles multiple icons
export const DynamicIcon = ({ type }: CardProps) => {
    // 1. Declare a variable to hold the image source
    let imageSrc: string;

    // 2. Use the switch statement to correctly assign the appropriate image based on 'type'
    switch (type) {
        case "linkedIn":
            // Correctly assign the imported image variable
            imageSrc = linkedinImage;
            break;
        case "youtube":
            // Correctly assign the imported image variable
            imageSrc = ytImage; // Logically, this should be image2 for YouTube
            break;
        case "twitter":
            imageSrc = twitterImage; // Logically, this should be documentImage for Twitter
            break;
        default:
            // Optional: Handle a default case (e.g., set to image1 or an empty string)
            // For now, it will be handled by the TypeScript type if it's strict
            imageSrc = documentImage; 
    }

    // 3. Use the defined variable in the return statement
    return (
        <>
            <img src={imageSrc} className="h-5 w-5 rounded-sm mr-3" alt={`${type} icon`} />
        </>
    )
}
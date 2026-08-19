import type { CardProps } from "../../config";

import { LinkedInLogo } from "./linkedinLogo";
import {XLogo} from "./xLogo";
import { YoutubeLogo } from "./ytLogo";
import { DocumentLogo } from "./document";

// Rename the component to something more generic since it handles multiple icons
export const DynamicIcon = ({ type }: CardProps) => {
    // 1. Declare a variable to hold the image source
    let imageSrc: () => React.JSX.Element;

    // 2. Use the switch statement to correctly assign the appropriate image based on 'type'
    switch (type) {
        case "linkedIn":
            // Correctly assign the imported image variable
            imageSrc = LinkedInLogo;
            break;
        case "youtube":
            // Correctly assign the imported image variable
            imageSrc = YoutubeLogo; // Logically, this should be image2 for YouTube
            break;
        case "twitter":
            imageSrc = XLogo; // Logically, this should be documentImage for Twitter
            break;
        default:
            // Optional: Handle a default case (e.g., set to image1 or an empty string)
            // For now, it will be handled by the TypeScript type if it's strict
            imageSrc = DocumentLogo; 
    }

    // 3. Use the defined variable in the return statement
    return (
        <>
            {/* <img src={imageSrc} className="h-5 w-5 rounded-sm mr-3" alt={`${type} icon`} /> */}
            {imageSrc()}
        </>
    )
}

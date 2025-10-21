import linkedinImage from "../../assets/linkedinImage.svg"
import ytImage from "../../assets/youtubeImage.svg"
import image3 from "../../assets/documentImage.svg"
// Defines the structure for the icon props
export interface Icons {
    type: 'linkedIn' | 'youtube'| 'twitter'; // It's good practice to narrow down string literal types
}

// Rename the component to something more generic since it handles multiple icons
export const DynamicIcon = ({ type }: Icons) => {
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
        default:
            // Optional: Handle a default case (e.g., set to image1 or an empty string)
            // For now, it will be handled by the TypeScript type if it's strict
            imageSrc = image3; 
    }

    // 3. Use the defined variable in the return statement
    return (
        <>
            <img src={imageSrc} className="h-5 w-5 rounded-sm mr-3" alt={`${type} icon`} />
        </>
    )
}
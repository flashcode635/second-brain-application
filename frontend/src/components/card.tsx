/**
 * CardProps
 *
 * Props for the CardComponent.
 *
 * @property {string} type - The type of card content. Used to conditionally render embedded content (e.g., "linkedin").
 * @property {string} heading - The title text shown at the top of the card. Rendered inside a fixed-height heading element.
 * @property {string} description - The body/summary text shown below the heading.
 * @property {string} url - When `type === "linkedin"`, this URL is passed to a LinkedIn embedding subcomponent.
 *
 * Notes:
 * - Each property is required by the component's signature.
 */

/**
 * CardComponent
 *
 * A reusable card UI component that displays a heading, optional embedded content, and a description.
 *
 * Behavior and implementation details:
 * - Heading overflow detection:
 *   - The component uses a `headingRef` (React ref to the heading element) to measure the rendered height.
 *   - On mount and on window resize, it runs `checkOverflow()` which compares `el.scrollHeight` to `el.clientHeight`.
 *     If `scrollHeight > clientHeight`, the heading's content is overflowing its visible area.
 *   - The local state `isOverflowing` is set accordingly.
 *   - The rendered heading element conditionally applies the CSS class for vertical scrolling (`overflow-y-auto`)
 *     only when `isOverflowing` is true; otherwise it uses `overflow-hidden`. This ensures a scrollbar appears
 *     only when the heading content actually overflows.
 *
 * - Lifecycle and cleanup:
 *   - A `resize` event listener is attached to `window` to re-check overflow when the viewport or container size changes.
 *   - The listener is removed in the cleanup function returned by the `useEffect`.
 *
 * - Visual/layout notes:
 *   - The heading element is given a fixed height (via the h-[30px] utility in the original JSX). The overflow logic
 *     relies on that constrained height to determine if the text would need scrolling.
 *   - The component layout includes left and right icon areas (PlusIcon and DeleteIcon), a description paragraph,
 *     and an area for conditional embedded content.
 *
 * - Conditional rendering:
 *   - When `type === "linkedin"`, the `LinkedInEmbedding` child component is rendered and receives `url`.
 *
 * Accessibility and best practices:
 * - The heading is a semantic heading element (e.g., <h1>) — keep heading level appropriate to usage context.
 * - If the heading may scroll, ensure keyboard accessibility (focusability) and appropriate ARIA attributes if needed.
 *
 * @param {Object} props - The component props.
 * @param {string} props.type - Determines embedded content type (e.g., "linkedin").
 * @param {string} props.heading - Heading text to display.
 * @param {string} props.description - Description/body text to display.
 * @param {string} props.url - URL for LinkedIn embed when `type === "linkedin"`.
 *
 * @returns {JSX.Element} A card element with heading, description, icons, and optional LinkedIn embedding.
 *
 * @example
 * <CardComponent
 *   type="linkedin"
 *   heading="Very long title that may overflow the fixed heading height"
 *   description="Short summary or description text."
 *   url="https://www.linkedin.com/in/example"
 * />
 *
 * Implementation hint (why this approach is used):
 * - Comparing `scrollHeight` and `clientHeight` is a reliable way to detect overflow for an element whose visible height
 *   is constrained by CSS. By toggling the scrollable class only when overflow exists, the UI avoids showing a scrollbar
 *   unnecessarily when the content fits.
 */

import { LinkedInEmbedding } from "./Embeddings/linkedinEmbedding"
import { DeleteIcon } from "./svg/deleteicon"
import { DynamicIcon } from "./svg/logos";
import YouTubeEmbed from "./Embeddings/youtubeEmbedding";
import { height, width, type CardProps } from "../config";
import { TwitterEmbedding } from "./Embeddings/twitterEmbedding";

// ...existing code...
export const CardComponent = ({type, heading, description, url}: CardProps)=>{
if (!url) {
    return <p style={{height:`${height}px`, width:`${width}px`}}>No URL provided to embed.</p>;
}
    return(
        <>
        <div
          className="rounded-lg shadow-md bg-[#f5f9ff] border-gray-150 border-[1px] p-2 mb-2"
          style={{ width: `${width + 102}px` }} // use style so Tailwind doesn't purge a dynamic class
        >
            {/* top bar of card */}
            <div 
             className="text-center max-h-[400px] overflow-y-auto overflow-x-hidden p-2 thin-scrollbar">
                <div className="flex justify-between">
                    <div className="flex justify-flex-start items-center ">
                 
                    { <DynamicIcon type={type} /> }

                    <h1
                        className="font-semibold text-xl h-[30px]  overflow-y-auto pr-0"
                    >
                        {heading}
                    </h1>
                    </div>
                    <div className="flex justify-flex-end items-center">

                    <DeleteIcon/>
                    </div>
                </div>
                
                <div className="mb-3 mt-2 flex items-center justify-center w-full">
                    {/* embedded content */}
                     {type == "linkedIn" && <LinkedInEmbedding url={url} />}
                      {type == "youtube" && <YouTubeEmbed url={url}  />}
                      {type == "twitter" && <TwitterEmbedding url={url}  />}
                </div>

                <div>
                    <p className="text-gray-700"> {description} </p>
                </div>
            </div>
        </div>
        </>
    )
}

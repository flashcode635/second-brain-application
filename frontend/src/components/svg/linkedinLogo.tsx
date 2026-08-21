export const LinkedInLogo: () => React.JSX.Element = () => (
    <>
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="25" height="25">
                    <defs>
                        {/* Official LinkedIn Blue Depth Gradient */}
                        <linearGradient id="linkedInBg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--brand-linkedin-start)" />
                        <stop offset="100%" stopColor="var(--brand-linkedin-end)" />
                        </linearGradient>

                        {/* Soft Drop Shadow */}
                        <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="var(--color-surface-dark)" floodOpacity="0.3" />
                        </filter>
                    </defs>

                    {/* Outer Card Container */}
                    <rect width="256" height="256" rx="56" fill="url(#linkedInBg)" filter="url(#dropShadow)" />
                    
                    {/* Subtle Inner Highlight */}
                    <rect x="1" y="1" width="254" height="254" rx="55" fill="none" stroke="var(--color-text-on-dark)" strokeOpacity="0.2" strokeWidth="2" />

                    {/* LinkedIn Official White Logo */}
                    <g fill="var(--color-text-on-dark)">
                        {/* "i" dot */}
                        <circle cx="72" cy="72" r="14" />
                        
                        {/* "i" body */}
                        <rect x="59" y="98" width="26" height="86" rx="6" />
                        
                        {/* "n" body */}
                        <path d="M110 98 h25 v12 h0.4 C139 103 148 96 163 96 c27 0 34 17 34 41 v47 h-26 v-42 c0-10-0.4-23-14-23 -14 0-16 11-16 22 v43 h-27 V98 Z" />
                    </g>
                </svg>
    </>
)
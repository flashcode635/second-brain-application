export const DocumentLogo: () => React.JSX.Element = () => (
    <>
        <svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  className="w-5 h-5"
  role="img"
>
  <title>Journal</title>
  <defs>
    {/* Premium Gradient Depth */}
    <linearGradient id="journalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="var(--brand-linkedin-start)" />
      <stop offset="100%" stopColor="var(--brand-linkedin-end)" />
    </linearGradient>

    {/* Subtle Elevation Drop Shadow */}
    <filter id="journalShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="var(--color-surface-dark)" floodOpacity="0.2" />
    </filter>
  </defs>

  {/* Scaled (1.25x) and Perfectly Centered Group */}
  <g 
    transform="translate(2, 2) scale(1.25)" 
    fill="url(#journalGrad)" 
    filter="url(#journalShadow)"
  >
    {/* Text Lines */}
    <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
    
    {/* Cover/Outline Frame */}
    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
    
    {/* Spine Loops */}
    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
  </g>
        </svg>

    </>
)
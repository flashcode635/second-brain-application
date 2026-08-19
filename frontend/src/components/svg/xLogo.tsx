export const XLogo: () => React.JSX.Element = () => (
    <>
        <svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 27 28" 
  className="w-5 h-5"
  role="img"
>
  <title>X</title>
  <defs>
    {/* Premium Sleek Dark Metallic Gradient */}
    <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#18181B" />
      <stop offset="100%" stopColor="#000000" />
    </linearGradient>

    {/* Subtle Drop Shadow for Elevation on Light Theme */}
    <filter id="xGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.2" />
    </filter>
  </defs>

  {/* X Brand Icon Path Shifted 2.5px Right */}
  <path 
    transform="translate(3, 0)"
    fill="url(#xGrad)" 
    filter="url(#xGlow)"
    d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" 
  />
</svg>
    </>
)
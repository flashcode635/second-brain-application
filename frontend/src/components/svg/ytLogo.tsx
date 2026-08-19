export const YoutubeLogo: () => React.JSX.Element = () => (
    <>
        <svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 24 24" 
  className="w-6 h-6"
  role="img"
>
  <title>YouTube</title>
  <defs>
    {/* Premium Vibrant Red Gradient */}
    <linearGradient id="ytPremiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FF0000" />
      <stop offset="100%" stopColor="#C40000" />
    </linearGradient>

    {/* Subtle Drop Shadow for Elevation */}
    <filter id="ytGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#FF0000" floodOpacity="0.25" />
    </filter>
  </defs>

  {/* Smooth YouTube Body Path */}
  <path 
    fill="url(#ytPremiumGrad)" 
    filter="url(#ytGlow)"
    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" 
  />

  {/* Pure White Crisp Inner Play Button */}
  <path 
    fill="#FFFFFF" 
    d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" 
  />
</svg>
    </>
)
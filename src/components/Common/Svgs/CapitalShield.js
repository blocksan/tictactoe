
const CapitalShield = ({ width = "100%", height = "100%", className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 600"
      width={width}
      height={height}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="baseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <linearGradient id="baseBorder" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.5" />
        </linearGradient>
        
        {/* Bar Chart Gradients */}
        <linearGradient id="barLow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="barMid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="barHigh" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>

        {/* Glass Dome Gradient */}
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.2" />
        </linearGradient>
        
        {/* Glow Filters */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main Isometric Group */}
      <g transform="translate(400, 380)"> {/* Moved down slightly to fit tall elements */}
        
        {/* PLATFORM BASE (Isometric Square) - WIDENED */}
        <g transform="scale(1, 0.6)"> {/* Flattening slightly for better isometric angle */}
             <path 
                d="M0,-100 L230,-20 L0,60 L-230,-20 Z" 
                fill="url(#baseGradient)" 
                stroke="url(#baseBorder)" 
                strokeWidth="2" 
            />
        </g>
        {/* Side thickness manual adjustment due to scale and new width (230) */}
        <path d="M-230,-12 L0,36 L0,56 L-230,8 Z" fill="#111827" />
        <path d="M230,-12 L0,36 L0,56 L230,8 Z" fill="#0f172a" />
        
        {/* Grid Lines */}
        <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" transform="scale(1, 0.6)">
            <line x1="-115" y1="-60" x2="115" y2="20" />
            <line x1="115" y1="-60" x2="-115" y2="20" />
            <line x1="0" y1="-100" x2="0" y2="60" />
        </g>
        
        {/* GREEN UPWARD TREND ICON (Inside Shield) */}
        {/* A swooshing arrow going up */}
        <g transform="translate(-10, -40)">
            <path 
                d="M-100,20 Q-20,20 0,-100 L20,-90 M0,-100 L-20,-90" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="4" 
                strokeLinecap="round" 
                filter="url(#glow)" 
                opacity="0.6"
            />
        </g>

        {/* 3 DISTINCT BARS (Growth Story) */}
        
        {/* Bar 1: Small (Start) */}
        <g transform="translate(-80, 10)">
            <path d="M-20,0 L0,10 L20,0 L0,-10 Z" fill="#059669" /> {/* Base */}
            <path d="M-20,0 L-20,-40 L0,-50 L0,10 Z" fill="#10b981" /> {/* Left */}
            <path d="M20,0 L20,-40 L0,-50 L0,10 Z" fill="#059669" /> {/* Right */}
            <path d="M-20,-40 L0,-50 L20,-40 L0,-30 Z" fill="#34d399" /> {/* Top */}
        </g>

        {/* Bar 2: Medium (Progress) */}
        <g transform="translate(0, 20)">
            <path d="M-20,0 L0,10 L20,0 L0,-10 Z" fill="#0891b2" /> 
            <path d="M-20,0 L-20,-80 L0,-90 L0,10 Z" fill="#06b6d4" /> 
            <path d="M20,0 L20,-80 L0,-90 L0,10 Z" fill="#0891b2" /> 
            <path d="M-20,-80 L0,-90 L20,-80 L0,-70 Z" fill="#22d3ee" /> 
        </g>

        {/* Bar 3: Tall (Success) */}
        <g transform="translate(80, 10)">
            <path d="M-20,0 L0,10 L20,0 L0,-10 Z" fill="#4f46e5" /> 
            <path d="M-20,0 L-20,-130 L0,-140 L0,10 Z" fill="#6366f1" /> 
            <path d="M20,0 L20,-130 L0,-140 L0,10 Z" fill="#4f46e5" /> 
            <path d="M-20,-130 L0,-140 L20,-130 L0,-120 Z" fill="#818cf8" />
            
             {/* HIGHLIGHTED RUPEE SIGN */}
             <g className="animate-float">
                <circle cx="0" cy="-170" r="24" fill="#1e1b4b" stroke="#8b5cf6" strokeWidth="2" filter="url(#glow)" />
                <text x="0" y="-162" textAnchor="middle" fill="#ffffff" fontSize="28" fontWeight="bold" fontFamily="sans-serif">&#8377;</text>
             </g>
        </g>

        {/* GLASS DOME (Protection) - ENLARGED */}
        <g transform="translate(0, -20)">
            <path 
                d="M-190,0 C-190,-120 -100,-220 0,-220 C100,-220 190,-120 190,0 C190,30 120,40 0,40 C-120,40 -190,30 -190,0" 
                fill="url(#glassGradient)" 
                stroke="#60a5fa" 
                strokeWidth="1.5" 
                strokeOpacity="0.6" 
                style={{ mixBlendMode: 'screen' }}
            />
             {/* Glossy Reflection */}
             <path d="M-120,-120 Q-60,-180 60,-170" fill="none" stroke="white" strokeWidth="4" strokeOpacity="0.15" strokeLinecap="round" />
        </g>
        
        {/* CONTINUOUS ATTACKS (Red Downtrend Icons) - FIXED COLLISION */}
        
        {/* Attack 1: Left Side Crash */}
        <g className="animate-attack-left">
            {/* Red Downtrend Arrow shape */}
            <path d="M-20,0 L0,10 L20,0 L0,-40 Z" fill="#ef4444" transform="rotate(120)" />
            <path d="M0,0 L-40,0" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" transform="rotate(30)" />
        </g>
        
        {/* Attack 2: Right Side Crash */}
        <g className="animate-attack-right" style={{ animationDelay: '1.5s' }}>
             <path d="M-20,0 L0,10 L20,0 L0,-40 Z" fill="#ef4444" transform="rotate(-120)" />
             <path d="M0,0 L40,0" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 2" opacity="0.6" transform="rotate(-30)" />
        </g>

        {/* LABELS */}
        <g transform="translate(0, 100)">
            <text x="0" y="0" textAnchor="middle" fill="#64aaaa" fontSize="13" fontFamily="sans-serif" letterSpacing="3" fontWeight="bold">Controlled Growth Through Risk Discipline</text>
        </g>

      </g>
      
      {/* CSS Styles */}
      <style>
        {`
          .animate-float { animation: float 3s ease-in-out infinite; }
          .animate-attack-left { animation: attackLeft 2.5s infinite linear; }
          .animate-attack-right { animation: attackRight 3s infinite linear; }
          
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          
          @keyframes attackLeft {
            0% { transform: translate(-300px, -60px) scale(0.8); opacity: 0; }
            50% { opacity: 1; }
            70% { transform: translate(-200px, -30px) scale(1); opacity: 1; } /* Hit Dome Outline */
            80% { transform: translate(-230px, -50px) scale(0.9) rotate(-20deg); opacity: 1; } /* Bounce Back */
            100% { transform: translate(-300px, -120px) scale(0); opacity: 0; }
          }
          
           @keyframes attackRight {
            0% { transform: translate(300px, -90px) scale(0.8); opacity: 0; }
            50% { opacity: 1; }
            70% { transform: translate(200px, -40px) scale(1); opacity: 1; } /* Hit Dome Outline */
            80% { transform: translate(230px, -60px) scale(0.9) rotate(20deg); opacity: 1; } /* Bounce Back */
            100% { transform: translate(300px, -140px) scale(0); opacity: 0; }
          }
        `}
      </style>
    </svg>
  );
};

export default CapitalShield;

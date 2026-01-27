
const AllocationLogic = ({ width = "100%", height = "100%", className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="200 200 400 300"
      width={width}
      height={height}
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="allocBaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="allocBaseBorder" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
        </linearGradient>
        
        {/* Block Gradients */}
        <linearGradient id="capitalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="safeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="riskGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        
        {/* Logic Gate Gradient */}
        <linearGradient id="gateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.1" />
        </linearGradient>

        <filter id="allocGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Main Isometric Group */}
      <g transform="translate(400, 350)">
        
        {/* BASE PLATFORM */}
        <g transform="scale(1, 0.6)">
             <path 
                d="M0,-120 L200,-20 L0,80 L-200,-20 Z" 
                fill="url(#allocBaseGradient)" 
                stroke="url(#allocBaseBorder)" 
                strokeWidth="2" 
            />
        </g>
        <path d="M-200,-12 L0,48 L0,68 L-200,8 Z" fill="#020617" />
        <path d="M200,-12 L0,48 L0,68 L200,8 Z" fill="#0f172a" />
        
        {/* Grid Lines */}
        <g stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" transform="scale(1, 0.6)">
            <line x1="-100" y1="-70" x2="100" y2="30" />
            <line x1="100" y1="-70" x2="-100" y2="30" />
             <line x1="0" y1="-120" x2="0" y2="80" />
        </g>

        {/* 1. SOURCE CAPITAL (Left Back) */}
        <g transform="translate(-120, -40)">
             {/* Stack of blue blocks */}
             <path d="M-40,0 L0,20 L40,0 L0,-20 Z" fill="#1e3a8a" />
             <path d="M-40,0 L-40,-60 L0,-80 L0,20 Z" fill="#1d4ed8" />
             <path d="M40,0 L40,-60 L0,-80 L0,20 Z" fill="#1e40af" />
             <path d="M-40,-60 L0,-80 L40,-60 L0,-40 Z" fill="#3b82f6" />
             <text x="0" y="-100" textAnchor="middle" fill="#93c5fd" fontSize="12" fontFamily="monospace">CAPITAL</text>
        </g>
        
        {/* Path to Gate */}
        <path d="M-120,-20 L0,40" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" className="animate-flow" />

        {/* 2. THE LOGIC GATE (Center) */}
        <g transform="translate(0, 40)">
             {/* The Ring */}
             <ellipse cx="0" cy="-40" rx="60" ry="30" fill="none" stroke="#fbbf24" strokeWidth="2" filter="url(#allocGlow)" />
             <path d="M-60,-40 L-60,-80" stroke="#fbbf24" strokeWidth="1" />
             <path d="M60,-40 L60,-80" stroke="#fbbf24" strokeWidth="1" />
             <ellipse cx="0" cy="-80" rx="60" ry="30" fill="url(#gateGradient)" stroke="#fbbf24" strokeWidth="1" />
             
             {/* The Filter Laser */}
             <path d="M-40,-60 L40,-60" stroke="#fbbf24" strokeWidth="2" strokeDasharray="2 2" className="animate-scan" />
             
             <text x="0" y="10" textAnchor="middle" fill="#fbbf24" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="1">RISK FILTER</text>
        </g>

        {/* 3. SAFE OUTPUT (Right Front) */}
        <g transform="translate(120, 0)">
             {/* Smaller, Sized Block */}
             <g className="animate-deposit">
                <path d="M-30,0 L0,15 L30,0 L0,-15 Z" fill="#047857" />
                <path d="M-30,0 L-30,-40 L0,-55 L0,-15 Z" fill="#059669" />
                <path d="M30,0 L30,-40 L0,-55 L0,-15 Z" fill="#047857" />
                <path d="M-30,-40 L0,-55 L30,-40 L0,-25 Z" fill="#34d399" />
             </g>
             <text x="0" y="40" textAnchor="middle" fill="#34d399" fontSize="12" fontFamily="monospace">SIZED</text>
        </g>
        
        {/* 4. REJECTED OVERLEVERAGE (Right Back) */}
        <g transform="translate(80, -60)" opacity="0.5">
             {/* Ghost of a big block being blocked */}
              <path d="M-30,0 L0,15 L30,0 L0,-15 Z" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 2" />
              {/* Red Cross */}
              <path d="M-20,-40 L20,-80 M-20,-80 L20,-40" stroke="#ef4444" strokeWidth="4" />
        </g>
        
        {/* Connections */}
        <path d="M0,40 L120,0" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" className="animate-flow" />

      </g>
      
      {/* CSS Styles */}
      <style>
        {`
          .animate-flow {
              stroke-dashoffset: 100;
              animation: flow 2s linear infinite;
          }
          .animate-scan {
              animation: scan 2s ease-in-out infinite;
          }
          .animate-deposit {
              animation: deposit 4s ease-in-out infinite;
          }
          
          @keyframes flow {
              to { stroke-dashoffset: 0; }
          }
          @keyframes scan {
              0%, 100% { transform: translateY(0); opacity: 0.5; }
              50% { transform: translateY(20px); opacity: 1; }
          }
          @keyframes deposit {
              0% { transform: translateY(-20px); opacity: 0; }
              20% { transform: translateY(0); opacity: 1; }
              80% { transform: translateY(0); opacity: 1; }
              100% { transform: translateY(0); opacity: 1; } /* Stay */
          }
        `}
      </style>
    </svg>
  );
};

export default AllocationLogic;

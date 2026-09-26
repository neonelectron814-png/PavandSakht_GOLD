import React from 'react';

// Reusable Gold Gradient definitions for SVG
export const SvgGoldDefs: React.FC = () => (
  <svg width="0" height="0" className="absolute hidden">
    <defs>
      {/* Primary Warm Metallic Gold Gradient */}
      <linearGradient id="gold-metal-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fdf1c9" />
        <stop offset="25%" stopColor="#e9be6f" />
        <stop offset="50%" stopColor="#be8828" />
        <stop offset="75%" stopColor="#f1d48c" />
        <stop offset="100%" stopColor="#83570c" />
      </linearGradient>

      {/* Deep Shadow Gold Gradient */}
      <linearGradient id="gold-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#b48227" />
        <stop offset="50%" stopColor="#81540a" />
        <stop offset="100%" stopColor="#4f3102" />
      </linearGradient>

      {/* Surface Gold Radial Gradient for 3D sphere/bevel */}
      <radialGradient id="gold-radial" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fffcf0" />
        <stop offset="30%" stopColor="#e8bf72" />
        <stop offset="70%" stopColor="#b07d1e" />
        <stop offset="100%" stopColor="#5d3903" />
      </radialGradient>

      {/* Warm Highlight Bevel */}
      <linearGradient id="gold-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#e5b863" stopOpacity="0.2" />
      </linearGradient>
    </defs>
  </svg>
);

// Brand Logo Emblem: Stylized Golden Monolith / Architectural Gateway
export const PayvandLogoV3: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left Column */}
      <path
        d="M32 18L48 10V90L32 82V18Z"
        fill="url(#gold-radial)"
        stroke="#5a3802"
        strokeWidth="1.5"
      />
      {/* Right Column */}
      <path
        d="M52 10L68 18V82L52 90V10Z"
        fill="url(#gold-shadow)"
        stroke="#5a3802"
        strokeWidth="1.5"
      />
      {/* Top Bridge / Gable */}
      <polygon
        points="32,18 50,8 68,18 50,26"
        fill="url(#gold-metal-primary)"
        stroke="#5a3802"
        strokeWidth="1.2"
      />
      {/* Center Golden Light Core */}
      <line x1="50" y1="12" x2="50" y2="86" stroke="#fff4cf" strokeWidth="2.5" />
    </svg>
  </div>
);

export const PayvandLogo3D = PayvandLogoV3;

// 1. Golden House / Villa (بازار املاک و مستغلات)
export const GoldenVilla3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="88" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />

      {/* Chimney */}
      <rect x="66" y="22" width="10" height="22" rx="1.5" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.2" />
      <rect x="64" y="20" width="14" height="4.5" rx="1" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1" />

      {/* House Main Body */}
      <rect x="22" y="44" width="56" height="42" rx="3" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.8" />

      {/* Overhanging 3D Pitched Roof */}
      <polygon points="50,14 12,46 22,46 50,22 78,46 88,46" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.8" />
      <polygon points="50,14 88,46 78,46 50,22" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1" />

      {/* Gable Round Window */}
      <circle cx="50" cy="36" r="6" fill="#3e2501" stroke="#fce399" strokeWidth="1.5" />
      <line x1="50" y1="30" x2="50" y2="42" stroke="#fce399" strokeWidth="1" />
      <line x1="44" y1="36" x2="56" y2="36" stroke="#fce399" strokeWidth="1" />

      {/* Main Entrance Door */}
      <rect x="42" y="58" width="16" height="28" rx="2" fill="url(#gold-shadow)" stroke="#3e2501" strokeWidth="1.5" />
      <circle cx="46" cy="72" r="1.8" fill="#fff5d2" stroke="#3e2501" strokeWidth="0.5" />

      {/* Left Window */}
      <rect x="27" y="54" width="10" height="13" rx="2" fill="#321e01" stroke="#5a3903" strokeWidth="1.2" />
      <line x1="32" y1="54" x2="32" y2="67" stroke="#fce399" strokeWidth="0.8" />
      <line x1="27" y1="60.5" x2="37" y2="60.5" stroke="#fce399" strokeWidth="0.8" />

      {/* Right Window */}
      <rect x="63" y="54" width="10" height="13" rx="2" fill="#321e01" stroke="#5a3903" strokeWidth="1.2" />
      <line x1="68" y1="54" x2="68" y2="67" stroke="#fce399" strokeWidth="0.8" />
      <line x1="63" y1="60.5" x2="73" y2="60.5" stroke="#fce399" strokeWidth="0.8" />
    </svg>
  </div>
);

// 2. Handshake (مشارکت در ساخت)
export const GoldenHandshake3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="82" rx="34" ry="5.5" fill="#78500c" fillOpacity="0.22" />

      {/* Left Suit Sleeve */}
      <polygon points="12,62 26,44 36,52 22,70" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.8" />
      <polygon points="26,44 30,47 20,68 16,65" fill="url(#gold-metal-primary)" />

      {/* Right Suit Sleeve */}
      <polygon points="88,62 74,44 64,52 78,70" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.8" />
      <polygon points="74,44 70,47 80,68 84,65" fill="url(#gold-metal-primary)" />

      {/* Left Hand Grasping */}
      <path
        d="M26,44 L44,36 C47,35 52,37 55,41 L64,50 C66,52 64,56 60,57 L46,61 L34,53 Z"
        fill="url(#gold-radial)"
        stroke="#4a2e02"
        strokeWidth="1.8"
      />

      {/* Right Hand Wrapping Over */}
      <path
        d="M74,44 L56,36 C53,35 48,37 45,41 L36,50 C34,52 36,56 40,57 L54,61 L66,53 Z"
        fill="url(#gold-metal-primary)"
        stroke="#4a2e02"
        strokeWidth="1.8"
      />

      {/* Fingers Definition */}
      <g stroke="#3e2501" strokeWidth="1.8" strokeLinecap="round">
        <path d="M42 45C46 48 50 51 54 52" />
        <path d="M46 49C50 52 54 55 58 56" />
        <path d="M49 54C52 56 56 58 60 59" />
      </g>
    </svg>
  </div>
);

// 3. Bricks & Construction Materials (مصالح و متریال ساختمانی)
export const GoldenMaterials3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="85" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />

      {/* Bottom Block 1 (Left) */}
      <polygon points="16,64 40,50 56,58 32,72" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.5" />
      <polygon points="16,64 32,72 32,82 16,74" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      <polygon points="32,72 56,58 56,68 32,82" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.5" />

      {/* Bottom Block 2 (Right) */}
      <polygon points="44,52 68,38 84,46 60,60" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.5" />
      <polygon points="44,52 60,60 60,70 44,62" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      <polygon points="60,60 84,46 84,56 60,70" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.5" />

      {/* Middle Block (Stacked) */}
      <polygon points="28,48 52,34 68,42 44,56" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.5" />
      <polygon points="28,48 44,56 44,66 28,58" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      <polygon points="44,56 68,42 68,52 44,66" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.5" />

      {/* Top Cap Brick */}
      <polygon points="36,34 60,20 76,28 52,42" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.6" />
      <polygon points="36,34 52,42 52,52 36,44" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.6" />
      <polygon points="52,42 76,28 76,38 52,52" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.6" />
    </svg>
  </div>
);

// 4. Industrial Factory & Warehouses (کارخانجات و شهرک‌های صنعتی)
export const GoldenIndustrial3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="86" rx="38" ry="6" fill="#78500c" fillOpacity="0.22" />

      {/* Industrial Chimney 1 */}
      <rect x="23" y="20" width="8" height="42" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.2" />
      <rect x="21" y="17" width="12" height="4" rx="1" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1" />

      {/* Industrial Chimney 2 */}
      <rect x="36" y="24" width="7" height="38" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.2" />
      <rect x="34" y="21" width="11" height="4" rx="1" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1" />

      {/* Factory Sawtooth Sheds */}
      <polygon
        points="14,64 26,50 26,64 38,50 38,64 50,50 50,84 14,84"
        fill="url(#gold-radial)"
        stroke="#4a2e02"
        strokeWidth="1.8"
      />
      {/* Main Large Industrial Hall */}
      <polygon
        points="46,56 70,38 90,52 90,84 46,84"
        fill="url(#gold-metal-primary)"
        stroke="#4a2e02"
        strokeWidth="1.8"
      />
      {/* Roof Depth */}
      <polygon
        points="44,56 70,36 92,52 88,54 70,40 46,58"
        fill="url(#gold-shadow)"
        stroke="#4a2e02"
        strokeWidth="1.2"
      />

      {/* Factory Large Cargo Gate */}
      <rect x="60" y="62" width="18" height="22" rx="2" fill="#2d1a01" stroke="#5a3802" strokeWidth="1.4" />
      <line x1="69" y1="62" x2="69" y2="84" stroke="#e8bf72" strokeWidth="1.2" />
    </svg>
  </div>
);

// 5. Document & Magnifying Glass (استعلام قیمت و متراژ)
export const GoldenDocumentSearch3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="48" cy="85" rx="35" ry="6" fill="#78500c" fillOpacity="0.22" />

      {/* Title Deed Document Sheet */}
      <rect x="22" y="14" width="46" height="68" rx="4" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.8" />
      {/* Folded Top-Right Corner */}
      <polygon points="56,14 68,26 56,26" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.2" />

      {/* Printed Lines of Contract */}
      <line x1="30" y1="30" x2="52" y2="30" stroke="#4a2e02" strokeWidth="3" strokeLinecap="round" />
      <line x1="30" y1="40" x2="60" y2="40" stroke="#5a3802" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="48" x2="54" y2="48" stroke="#5a3802" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="56" x2="48" y2="56" stroke="#5a3802" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="64" x2="44" y2="64" stroke="#5a3802" strokeWidth="2.5" strokeLinecap="round" />

      {/* 3D Magnifying Glass on top */}
      <g>
        {/* Metal Outer Ring */}
        <circle cx="62" cy="58" r="17" fill="url(#gold-metal-primary)" stroke="#3e2501" strokeWidth="2.5" />
        {/* Glass Lens */}
        <circle cx="62" cy="58" r="11" fill="#fffcf0" fillOpacity="0.9" stroke="#5a3802" strokeWidth="1.2" />
        {/* Lens Light Reflection */}
        <path d="M56 52C58 50 63 49 66 51" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

        {/* Handle */}
        <line x1="74" y1="70" x2="88" y2="84" stroke="url(#gold-shadow)" strokeWidth="7" strokeLinecap="round" />
        <line x1="74" y1="70" x2="88" y2="84" stroke="#3e2501" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

// 6. Auction Gavel & Stand (فرصت‌های طلایی و مزایده و...)
export const GoldenGavel3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="44" cy="84" rx="32" ry="6" fill="#78500c" fillOpacity="0.25" />

      {/* Pedestal / Sounding Block */}
      <ellipse cx="44" cy="78" rx="28" ry="9" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.8" />
      <ellipse cx="44" cy="73" rx="24" ry="7" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.2" />

      {/* Gavel Head & Handle */}
      <g transform="rotate(-35 56 42)">
        {/* Main Gavel Cylinder */}
        <rect x="40" y="24" width="32" height="18" rx="3.5" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.8" />
        {/* Dual Metal Trim Rings */}
        <rect x="38" y="22" width="5" height="22" rx="1.5" fill="url(#gold-metal-primary)" stroke="#3e2501" strokeWidth="1" />
        <rect x="69" y="22" width="5" height="22" rx="1.5" fill="url(#gold-metal-primary)" stroke="#3e2501" strokeWidth="1" />

        {/* Handle */}
        <path d="M53 42L53 76C53 78 59 78 59 76L59 42Z" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
        <circle cx="56" cy="78" r="4" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1" />
      </g>
    </svg>
  </div>
);

// 7. Crawler Excavator & Machinery (ماشین‌آلات و تجهیزات)
export const GoldenExcavator3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="85" rx="36" ry="5.5" fill="#78500c" fillOpacity="0.22" />

      {/* Tracks Base */}
      <rect x="18" y="65" width="48" height="16" rx="8" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.8" />
      {/* Wheels */}
      <circle cx="26" cy="73" r="5" fill="url(#gold-radial)" stroke="#3e2501" strokeWidth="1.2" />
      <circle cx="37" cy="73" r="5" fill="url(#gold-radial)" stroke="#3e2501" strokeWidth="1.2" />
      <circle cx="48" cy="73" r="5" fill="url(#gold-radial)" stroke="#3e2501" strokeWidth="1.2" />
      <circle cx="58" cy="73" r="5" fill="url(#gold-radial)" stroke="#3e2501" strokeWidth="1.2" />

      {/* Cabin & Counterweight */}
      <path d="M20 52H38V65H20V52Z" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.8" />
      <path d="M38 42H50L54 52V65H38V42Z" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.8" />
      {/* Cab Glass Window */}
      <path d="M40 44H48L51 51H40V44Z" fill="#321e01" stroke="#e8bf72" strokeWidth="1" />

      {/* Hydraulic Boom, Stick & Bucket */}
      <polygon points="46,58 70,32 76,36 52,64" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      <polygon points="70,32 86,52 82,55 67,36" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.5" />
      <path d="M86 52C86 52 96 60 90 70L82 64L86 52Z" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.8" />
      <line x1="90" y1="70" x2="93" y2="73" stroke="#4a2e02" strokeWidth="2" strokeLinecap="round" />
      <line x1="88" y1="68" x2="91" y2="71" stroke="#4a2e02" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

// 8. Engineer Holding Blueprints (پیمانکاران و مجریان ساخت)
export const GoldenEngineer3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="88" rx="34" ry="5.5" fill="#78500c" fillOpacity="0.22" />

      {/* Shoulders & Torso */}
      <path d="M22 84C22 66 30 60 50 60C70 60 78 66 78 84Z" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.8" />

      {/* Head / Face */}
      <circle cx="50" cy="45" r="12" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.5" />

      {/* Construction Safety Hardhat */}
      <path d="M34 38C34 26 41 20 50 20C59 20 66 26 66 38H34Z" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.8" />
      <path d="M30 38H70C71 38 72 39 72 41C72 42 71 43 70 43H30C29 43 28 42 28 41C28 39 29 38 30 38Z" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.2" />
      <line x1="50" y1="20" x2="50" y2="38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />

      {/* Unfolded Blueprint Sheet */}
      <polygon points="28,64 72,64 76,86 24,86" fill="url(#gold-radial)" stroke="#3e2501" strokeWidth="1.8" />
      <line x1="34" y1="70" x2="66" y2="70" stroke="#3e2501" strokeWidth="1.8" strokeDasharray="3 1.5" />
      <line x1="32" y1="76" x2="68" y2="76" stroke="#3e2501" strokeWidth="1.8" />
      <line x1="30" y1="82" x2="70" y2="82" stroke="#3e2501" strokeWidth="1.8" strokeDasharray="3 1.5" />

      {/* Engineer Hands */}
      <circle cx="26" cy="74" r="4" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.2" />
      <circle cx="74" cy="74" r="4" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.2" />
    </svg>
  </div>
);

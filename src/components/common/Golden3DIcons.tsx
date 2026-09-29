import React from 'react';
import payvandBrandLogoImg from '../../assets/images/Pavand.png';

// Reusable Gold Gradient definitions for SVG
export const SvgGoldDefs: React.FC = () => (
  <svg width="0" height="0" className="absolute hidden" aria-hidden="true">
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

export const GoldGradients: React.FC = () => (
  <defs>
    <linearGradient id="gold-metal-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fdf1c9" />
      <stop offset="25%" stopColor="#e9be6f" />
      <stop offset="50%" stopColor="#be8828" />
      <stop offset="75%" stopColor="#f1d48c" />
      <stop offset="100%" stopColor="#83570c" />
    </linearGradient>
    <linearGradient id="gold-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#b48227" />
      <stop offset="50%" stopColor="#81540a" />
      <stop offset="100%" stopColor="#4f3102" />
    </linearGradient>
    <radialGradient id="gold-radial" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stopColor="#fffcf0" />
      <stop offset="30%" stopColor="#e8bf72" />
      <stop offset="70%" stopColor="#b07d1e" />
      <stop offset="100%" stopColor="#5d3903" />
    </radialGradient>
    <linearGradient id="gold-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
      <stop offset="100%" stopColor="#e5b863" stopOpacity="0.2" />
    </linearGradient>
  </defs>
);

// Brand Logo Emblem: Stylized Golden Monolith / Architectural Gateway with Pavand.png and Subtle Golden Glow
export const PayvandLogoV3: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {!imgError ? (
        <img
          src={payvandBrandLogoImg}
          alt="پیوندساخت"
          loading="eager"
          decoding="async"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_2px_6px_rgba(180,120,20,0.35)] transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <GoldGradients />
          <polygon points="50,10 90,32 90,78 50,95 10,78 10,32" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="2" />
          <polygon points="50,22 80,38 80,72 50,85 20,72 20,38" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="14" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
};

export const PayvandLogo3D = PayvandLogoV3;

// 1. Golden House / Villa (بازار املاک و مستغلات)
export const GoldenVilla3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
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
      <GoldGradients />
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
      <GoldGradients />
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
      <GoldGradients />
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
      <GoldGradients />
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

export const GoldenPriceStats3D = GoldenDocumentSearch3D;

// 6. Auction Gavel & Stand (فرصت‌های طلایی و مزایده)
export const GoldenGavel3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
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

export const GoldenRateCutter3D = GoldenGavel3D;

// 7. Crawler Excavator & Machinery (ماشین‌آلات و تجهیزات)
export const GoldenExcavator3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
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

export const GoldenMachinery3D = GoldenExcavator3D;

// 8. Engineer Holding Blueprints (پیمانکاران و مجریان ساخت)
export const GoldenEngineer3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
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

// 9. Golden Calendar & Credit / Installments (فروش اقساطی)
export const GoldenInstallment3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="86" rx="35" ry="6" fill="#78500c" fillOpacity="0.22" />

      {/* Main Calendar Card Body */}
      <rect x="20" y="24" width="60" height="58" rx="7" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.8" />
      
      {/* Top Header Bar */}
      <path d="M20 31C20 27.134 23.134 24 27 24H73C76.866 24 80 27.134 80 31V38H20V31Z" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      
      {/* Calendar Rings */}
      <rect x="32" y="18" width="6" height="12" rx="3" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.2" />
      <rect x="62" y="18" width="6" height="12" rx="3" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.2" />

      {/* Grid of Dates */}
      <circle cx="34" cy="48" r="3" fill="#4a2e02" />
      <circle cx="50" cy="48" r="3" fill="#4a2e02" />
      <circle cx="66" cy="48" r="3" fill="#4a2e02" />
      
      <circle cx="34" cy="60" r="3" fill="#4a2e02" />
      <circle cx="50" cy="60" r="3" fill="#4a2e02" />
      <circle cx="66" cy="60" r="3" fill="#4a2e02" />

      {/* Highlighted Verified Payment Badge */}
      <circle cx="62" cy="68" r="13" fill="url(#gold-metal-primary)" stroke="#3e2501" strokeWidth="1.5" />
      <path d="M57 68L60.5 71.5L67 65" stroke="#3e2501" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

export const GoldenInstallments3D = GoldenInstallment3D;

// 10. AI Smart Matching & Inquiries (درخواست‌های مشتری و تطبیق هوشمند)
export const GoldenAiMatch3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      {/* Soft Ground Shadow */}
      <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />

      {/* Core Glowing Polygonal Node */}
      <circle cx="50" cy="50" r="16" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="2" />
      <circle cx="50" cy="50" r="9" fill="url(#gold-metal-primary)" stroke="#fff" strokeWidth="1.2" />

      {/* Orbiting Connection Nodes */}
      <circle cx="26" cy="34" r="9" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      <circle cx="74" cy="34" r="9" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      <circle cx="26" cy="66" r="9" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />
      <circle cx="74" cy="66" r="9" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.5" />

      {/* Smart Synaptic Connecting Beams */}
      <line x1="33" y1="39" x2="42" y2="44" stroke="#4a2e02" strokeWidth="2.5" strokeDasharray="3 1.5" />
      <line x1="67" y1="39" x2="58" y2="44" stroke="#4a2e02" strokeWidth="2.5" strokeDasharray="3 1.5" />
      <line x1="33" y1="61" x2="42" y2="56" stroke="#4a2e02" strokeWidth="2.5" strokeDasharray="3 1.5" />
      <line x1="67" y1="61" x2="58" y2="56" stroke="#4a2e02" strokeWidth="2.5" strokeDasharray="3 1.5" />

      {/* Sparkle Rays */}
      <polygon points="50,22 52,28 58,30 52,32 50,38 48,32 42,30 48,28" fill="#fff5d2" stroke="#4a2e02" strokeWidth="0.8" />
      <polygon points="76,70 77,74 81,75 77,76 76,80 75,76 71,75 75,74" fill="#fff5d2" stroke="#4a2e02" strokeWidth="0.8" />
    </svg>
  </div>
);

// 11. 3D Architectural Building & AI Studio (طراحی سه‌بعدی و هوش مصنوعی)
export const Golden3DStudio: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
      {/* 3D Isometric Cube / Building */}
      {/* Top Face */}
      <polygon points="50,18 78,32 50,46 22,32" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.6" />
      {/* Left Face */}
      <polygon points="22,32 50,46 50,78 22,64" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.6" />
      {/* Right Face */}
      <polygon points="50,46 78,32 78,64 50,78" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.6" />
      {/* Wireframe grids */}
      <line x1="36" y1="39" x2="36" y2="71" stroke="#3e2501" strokeWidth="1.2" strokeDasharray="2 1" />
      <line x1="64" y1="39" x2="64" y2="71" stroke="#3e2501" strokeWidth="1.2" strokeDasharray="2 1" />
      {/* AI Pulse Sparkle */}
      <polygon points="50,6 52,12 58,14 52,16 50,22 48,16 42,14 48,12" fill="#fff5d2" stroke="#4a2e02" strokeWidth="0.8" />
    </svg>
  </div>
);

export const Golden3DStudio3D = Golden3DStudio;

// 12. Barter & Material Exchange 3D (تهاتر و مبادله)
export const GoldenBarter3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
      {/* Circular Arrows */}
      <path d="M26 48C26 34 37 24 50 24C60 24 69 30 73 38" stroke="url(#gold-radial)" strokeWidth="7" strokeLinecap="round" />
      <polygon points="73,26 84,38 68,42" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.2" />

      <path d="M74 52C74 66 63 76 50 76C40 76 31 70 27 62" stroke="url(#gold-shadow)" strokeWidth="7" strokeLinecap="round" />
      <polygon points="27,74 16,62 32,58" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.2" />

      {/* Center Building Symbol */}
      <rect x="42" y="42" width="16" height="16" rx="3" fill="url(#gold-metal-primary)" stroke="#4a2e02" strokeWidth="1.5" />
    </svg>
  </div>
);

// 13. Confidential Deal Room 3D (اتاق معامله امن)
export const GoldenDealRoom3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
      {/* Shield Base */}
      <path d="M50 16L80 28V52C80 70 66 84 50 88C34 84 20 70 20 52V28L50 16Z" fill="url(#gold-radial)" stroke="#4a2e02" strokeWidth="1.8" />
      <path d="M50 24L74 34V52C74 66 63 78 50 81C37 78 26 66 26 52V34L50 24Z" fill="url(#gold-shadow)" stroke="#4a2e02" strokeWidth="1.4" />
      
      {/* Golden Vault Lock */}
      <rect x="40" y="46" width="20" height="18" rx="4" fill="url(#gold-metal-primary)" stroke="#3e2501" strokeWidth="1.5" />
      <path d="M44 46V39C44 35.6863 46.6863 33 50 33C53.3137 33 56 35.6863 56 39V46" stroke="url(#gold-metal-primary)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="54" r="2.5" fill="#3e2501" />
      <line x1="50" y1="56.5" x2="50" y2="60" stroke="#3e2501" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

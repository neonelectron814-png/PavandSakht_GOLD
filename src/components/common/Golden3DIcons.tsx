import React, { useState } from 'react';
import payvandBrandLogoImg from '../../assets/images/Pavand.png';

// 3D Realistic Golden Metallic Render Assets (Optimized WebP, ~5-20KB each, ultra-fast loading)
import goldVillaWebp from '../../assets/images/gold_villa_3d.webp';
import goldHandshakeWebp from '../../assets/images/gold_handshake_3d.webp';
import goldMaterialsWebp from '../../assets/images/gold_materials_3d.webp';
import goldScrapWebp from '../../assets/images/gold_scrap_3d.webp';
import goldFactoryWebp from '../../assets/images/gold_factory_3d.webp';
import goldGavelWebp from '../../assets/images/gold_gavel_3d.webp';
import goldExcavatorWebp from '../../assets/images/gold_excavator_3d.webp';
import goldDocumentWebp from '../../assets/images/gold_document_3d.webp';
import goldEngineerWebp from '../../assets/images/gold_engineer_3d.webp';
import goldInstallmentWebp from '../../assets/images/gold_installment_3d.webp';
import goldAiMatchWebp from '../../assets/images/gold_ai_match_3d.webp';
import goldStudioWebp from '../../assets/images/gold_studio_3d.webp';
import goldDealroomWebp from '../../assets/images/gold_dealroom_3d.webp';
import goldBarterWebp from '../../assets/images/gold_barter_3d.webp';

// Reusable Gold Gradient definitions for SVG fallback
export const SvgGoldDefs: React.FC = () => (
  <svg width="0" height="0" className="absolute hidden" aria-hidden="true">
    <defs>
      {/* Primary Warm Metallic Gold Gradient */}
      <linearGradient id="gold-metal-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff8db" />
        <stop offset="25%" stopColor="#f7d580" />
        <stop offset="50%" stopColor="#d89f2a" />
        <stop offset="75%" stopColor="#fedc8c" />
        <stop offset="100%" stopColor="#9e6a0d" />
      </linearGradient>

      {/* Deep Shadow Gold Gradient */}
      <linearGradient id="gold-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#cca03b" />
        <stop offset="50%" stopColor="#9a6911" />
        <stop offset="100%" stopColor="#5d3902" />
      </linearGradient>

      {/* Surface Gold Radial Gradient for 3D sphere/bevel */}
      <radialGradient id="gold-radial" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="25%" stopColor="#fde08f" />
        <stop offset="60%" stopColor="#d1982b" />
        <stop offset="100%" stopColor="#7a4b04" />
      </radialGradient>

      {/* Warm Highlight Bevel */}
      <linearGradient id="gold-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#f5ca68" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  </svg>
);

export const GoldGradients: React.FC = () => (
  <defs>
    <linearGradient id="gold-metal-primary" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#fff8db" />
      <stop offset="25%" stopColor="#f7d580" />
      <stop offset="50%" stopColor="#d89f2a" />
      <stop offset="75%" stopColor="#fedc8c" />
      <stop offset="100%" stopColor="#9e6a0d" />
    </linearGradient>
    <linearGradient id="gold-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#cca03b" />
      <stop offset="50%" stopColor="#9a6911" />
      <stop offset="100%" stopColor="#5d3902" />
    </linearGradient>
    <radialGradient id="gold-radial" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="25%" stopColor="#fde08f" />
      <stop offset="60%" stopColor="#d1982b" />
      <stop offset="100%" stopColor="#7a4b04" />
    </radialGradient>
    <linearGradient id="gold-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
      <stop offset="100%" stopColor="#f5ca68" stopOpacity="0.3" />
    </linearGradient>
  </defs>
);

// Generic Wrapper for Photorealistic 3D Golden WebP Icon
interface GoldenIconProps {
  className?: string;
  src: string;
  alt: string;
  fallbackSvg?: React.ReactNode;
}

const GoldenRender3D: React.FC<GoldenIconProps> = ({
  className = "w-14 h-14",
  src,
  alt,
  fallbackSvg,
}) => {
  const [error, setError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center shrink-0 select-none ${className}`}>
      {!error ? (
        <img
          src={src}
          alt={alt}
          loading="eager"
          decoding="async"
          onError={() => setError(true)}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(200,135,25,0.38)] hover:drop-shadow-[0_6px_14px_rgba(230,165,35,0.5)] transition-all duration-200 transform group-hover:scale-108"
        />
      ) : (
        fallbackSvg
      )}
    </div>
  );
};

// Brand Logo Emblem: Stylized Golden Monolith / Architectural Gateway with Pavand.png
export const PayvandLogoV3: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {!imgError ? (
        <img
          src={payvandBrandLogoImg}
          alt="پیوندساخت"
          loading="eager"
          decoding="async"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_3px_8px_rgba(210,140,25,0.4)] transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <GoldGradients />
          <polygon points="50,10 90,32 90,78 50,95 10,78 10,32" fill="url(#gold-radial)" stroke="#b88a31" strokeWidth="2" />
          <polygon points="50,22 80,38 80,72 50,85 20,72 20,38" fill="url(#gold-shadow)" stroke="#b88a31" strokeWidth="1.5" />
          <circle cx="50" cy="50" r="14" fill="url(#gold-metal-primary)" stroke="#b88a31" strokeWidth="1.5" />
        </svg>
      )}
    </div>
  );
};

export const PayvandLogo3D = PayvandLogoV3;

// 1. Golden House / Villa (بازار املاک و مستغلات)
export const GoldenVilla3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldVillaWebp}
    alt="املاک و مستغلات"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="88" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <rect x="66" y="22" width="10" height="22" rx="1.5" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.2" />
        <rect x="64" y="20" width="14" height="4.5" rx="1" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1" />
        <rect x="22" y="44" width="56" height="42" rx="3" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
        <polygon points="50,14 12,46 22,46 50,22 78,46 88,46" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.8" />
        <polygon points="50,14 88,46 78,46 50,22" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1" />
        <circle cx="50" cy="36" r="6" fill="#3e2501" stroke="#fce399" strokeWidth="1.5" />
        <rect x="42" y="58" width="16" height="28" rx="2" fill="url(#gold-shadow)" stroke="#3e2501" strokeWidth="1.5" />
      </svg>
    }
  />
);

// 2. Handshake (مشارکت در ساخت)
export const GoldenHandshake3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldHandshakeWebp}
    alt="مشارکت در ساخت"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="82" rx="34" ry="5.5" fill="#78500c" fillOpacity="0.22" />
        <polygon points="12,62 26,44 36,52 22,70" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.8" />
        <polygon points="88,62 74,44 64,52 78,70" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.8" />
        <path d="M26,44 L44,36 C47,35 52,37 55,41 L64,50 C66,52 64,56 60,57 L46,61 L34,53 Z" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
      </svg>
    }
  />
);

// 3. Bricks / Building Materials (مصالح و متریال ساختمانی)
export const GoldenMaterials3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldMaterialsWebp}
    alt="مصالح و متریال"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <polygon points="50,18 80,32 50,46 20,32" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.5" />
        <polygon points="20,32 50,46 50,60 20,46" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.5" />
        <polygon points="50,46 80,32 80,46 50,60" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.5" />
      </svg>
    }
  />
);

// 4. Golden Scrap Metal & Construction Waste (ضایعات، آهن قراضه و بازیافت ساختمانی)
export const GoldenScrapMetal3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldScrapWebp}
    alt="ضایعات و بازیافت"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.25" />
        <polygon points="16,66 52,48 84,62 48,80" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.6" />
        <polygon points="24,54 58,38 78,48 44,64" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.5" />
        <circle cx="50" cy="40" r="16" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.5" />
      </svg>
    }
  />
);

// 5. Factory / Industrial Park (کارخانجات و شهرک‌های صنعتی)
export const GoldenIndustrial3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldFactoryWebp}
    alt="کارخانجات و شهرک‌ها"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <polygon points="18,48 38,36 38,48 58,36 58,48 78,36 78,82 18,82" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
        <rect x="74" y="20" width="10" height="28" rx="1.5" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.2" />
      </svg>
    }
  />
);

// 6. Auction Gavel / Distressed Deals (مزایدات و فرصت‌های طلایی / نرخ‌شکن)
export const GoldenGavel3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldGavelWebp}
    alt="فرصت‌های طلایی"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <rect x="20" y="32" width="46" height="20" rx="4" transform="rotate(-30 43 42)" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
        <rect x="42" y="42" width="10" height="42" rx="3" transform="rotate(-30 47 63)" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.6" />
      </svg>
    }
  />
);

export const GoldenRateCutter3D = GoldenGavel3D;

// 7. Excavator / Heavy Machinery (پیوند عمران و معادن)
export const GoldenExcavator3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldExcavatorWebp}
    alt="پیوند عمران و معادن"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <rect x="20" y="68" width="60" height="16" rx="8" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.8" />
        <rect x="36" y="42" width="38" height="26" rx="4" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
      </svg>
    }
  />
);

export const GoldenMachinery3D = GoldenExcavator3D;

// 8. Document & Magnifying Glass (استعلام قیمت و متراژ)
export const GoldenDocumentSearch3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldDocumentWebp}
    alt="استعلام قیمت و متراژ"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <rect x="24" y="18" width="46" height="62" rx="4" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
        <circle cx="64" cy="58" r="16" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="2.5" />
        <line x1="75" y1="69" x2="88" y2="82" stroke="#83570c" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    }
  />
);

export const GoldenPriceStats3D = GoldenDocumentSearch3D;

// 9. Engineer / Contractors (پیمانکاران و مجریان)
export const GoldenEngineer3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldEngineerWebp}
    alt="پیمانکاران و مجریان"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <circle cx="50" cy="48" r="18" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
        <path d="M26,38 C26,24 74,24 74,38 Z" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.8" />
      </svg>
    }
  />
);

// 10. Golden Installments & Credit (فروش اقساطی)
export const GoldenInstallment3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldInstallmentWebp}
    alt="فروش اقساطی"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <rect x="18" y="28" width="64" height="42" rx="6" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
        <rect x="18" y="38" width="64" height="8" fill="#3e2501" />
      </svg>
    }
  />
);

export const GoldenInstallments3D = GoldenInstallment3D;

// 11. Golden AI Match & Customer Requests (درخواست‌های مشتری و تطبیق هوشمند)
export const GoldenAiMatch3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldAiMatchWebp}
    alt="درخواست‌های مشتری"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <circle cx="50" cy="46" r="24" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="2" />
      </svg>
    }
  />
);

// 12. Golden 3D Studio & Architectural Modeling (استودیو سه‌بعدی)
export const Golden3DStudio: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldStudioWebp}
    alt="استودیو سه‌بعدی"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <polygon points="50,18 84,36 50,54 16,36" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
        <polygon points="16,36 50,54 50,84 16,66" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.8" />
        <polygon points="50,54 84,36 84,66 50,84" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.8" />
      </svg>
    }
  />
);

export const Golden3DStudio3D = Golden3DStudio;

// 13. Golden Deal Room 3D (اتاق معامله امن)
export const GoldenDealRoom3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldDealroomWebp}
    alt="اتاق معامله امن"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <ellipse cx="50" cy="86" rx="36" ry="6" fill="#78500c" fillOpacity="0.22" />
        <path d="M50 16L80 28V52C80 70 66 84 50 88C34 84 20 70 20 52V28L50 16Z" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="1.8" />
      </svg>
    }
  />
);

// 14. Golden Barter 3D (تهاتر و مبادله تخصصی)
export const GoldenBarter3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <GoldenRender3D
    className={className}
    src={goldBarterWebp}
    alt="تهاتر و مبادله"
    fallbackSvg={
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <GoldGradients />
        <circle cx="50" cy="50" r="32" stroke="url(#gold-radial)" strokeWidth="6" />
      </svg>
    }
  />
);

// 15. Audio Intelligence 3D (استعلام صوتی هوشمند)
export const GoldenAudio3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      <ellipse cx="50" cy="86" rx="34" ry="5.5" fill="#78500c" fillOpacity="0.22" />
      <path d="M24 54C24 35 34 22 50 22C66 22 76 35 76 54" stroke="url(#gold-radial)" strokeWidth="7" strokeLinecap="round" />
      <rect x="18" y="48" width="12" height="24" rx="6" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.6" />
      <rect x="70" y="48" width="12" height="24" rx="6" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.6" />
      <line x1="42" y1="52" x2="42" y2="64" stroke="url(#gold-shadow)" strokeWidth="3" strokeLinecap="round" />
      <line x1="47" y1="46" x2="47" y2="70" stroke="url(#gold-metal-primary)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="53" y1="42" x2="53" y2="74" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <line x1="58" y1="46" x2="58" y2="70" stroke="url(#gold-metal-primary)" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="63" y1="52" x2="63" y2="64" stroke="url(#gold-shadow)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  </div>
);

// 16. Security & Anti-Fraud Shield 3D (نظارت و امنیت ضد تقلب)
export const GoldenShieldSecurity3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      <ellipse cx="50" cy="86" rx="34" ry="5.5" fill="#78500c" fillOpacity="0.22" />
      <path d="M50 18L78 28V52C78 68 66 82 50 86C34 82 22 68 22 52V28L50 18Z" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="2" />
      <path d="M50 25L72 33V52C72 65 62 76 50 80C38 76 28 65 28 52V33L50 25Z" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="1.5" />
      <path d="M38 52L46 60L64 42" stroke="url(#gold-metal-primary)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// 17. User Dashboard 3D (داشبورد کاربری)
export const GoldenUserDashboard3D: React.FC<{ className?: string }> = ({ className = "w-14 h-14" }) => (
  <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <GoldGradients />
      <ellipse cx="50" cy="86" rx="34" ry="5.5" fill="#78500c" fillOpacity="0.22" />
      <circle cx="50" cy="38" r="14" fill="url(#gold-radial)" stroke="#83570c" strokeWidth="2" />
      <path d="M26 78C26 62 36 56 50 56C64 56 74 62 74 78Z" fill="url(#gold-shadow)" stroke="#83570c" strokeWidth="2" />
      <circle cx="68" cy="68" r="11" fill="url(#gold-metal-primary)" stroke="#83570c" strokeWidth="1.5" />
    </svg>
  </div>
);

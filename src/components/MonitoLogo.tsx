import React, { useState, useEffect, useRef } from 'react';
import { 
  getStoredLogo, 
  saveStoredLogo, 
  removeStoredLogo, 
  LOGO_CHANGE_EVENT 
} from '../utils/logoStorage';
import { Upload, Trash2, Camera, RefreshCw } from 'lucide-react';

interface MonitoLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showUploadControls?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MonitoLogo: React.FC<MonitoLogoProps> = ({
  size = 'md',
  showUploadControls = false,
  className = '',
  onClick
}) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(getStoredLogo());
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleLogoChange = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      setLogoUrl(customEvent.detail);
    };

    window.addEventListener(LOGO_CHANGE_EVENT, handleLogoChange);
    return () => {
      window.removeEventListener(LOGO_CHANGE_EVENT, handleLogoChange);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) {
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/png');
          saveStoredLogo(compressed);
          setLogoUrl(compressed);
        }
        setIsProcessing(false);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeStoredLogo();
    setLogoUrl(null);
  };

  // Dimensions based on size
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-28 h-28 sm:w-36 sm:h-36',
    xl: 'w-44 h-44 sm:w-56 sm:h-56'
  }[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {logoUrl ? (
        <div 
          onClick={onClick}
          className={`${sizeClasses} relative group flex items-center justify-center rounded-2xl bg-amber-50/60 p-1.5 transition-all overflow-hidden ${onClick ? 'cursor-pointer' : ''}`}
        >
          <img 
            src={logoUrl} 
            alt="Monito Panadero Santa Fé - Logotipo Oficial" 
            className="w-full h-full object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
          />

          {showUploadControls && (
            <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 rounded-2xl backdrop-blur-xs print:hidden">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs cursor-pointer shadow-md"
                title="Cambiar monito"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs cursor-pointer shadow-md"
                title="Eliminar logo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Fallback Artesanal: Monito Panadero al Horno con Pan */
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`${sizeClasses} relative group flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/60 to-amber-100/80 border-2 border-dashed border-amber-300 hover:border-amber-500 transition-all cursor-pointer p-2 text-center overflow-hidden shadow-xs hover:shadow-md`}
          title="Haz clic para cargar el archivo original del Monito Panadero"
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-bold text-amber-800">Cargando...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full">
              {/* SVG Silueta Artística del Monito Tallado en Madera */}
              <svg viewBox="0 0 100 100" className="w-full h-full max-h-24 filter drop-shadow-xs" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Horno de ladrillo y fuego al fondo */}
                <path d="M52 35 C52 24, 82 24, 82 52 L82 56 L52 56 Z" fill="#8C351B" opacity="0.85" />
                <path d="M55 38 C55 28, 79 28, 79 53 L55 53 Z" fill="#F59E0B" opacity="0.9" />
                {/* Llama */}
                <path d="M64 50 C60 44, 66 38, 68 34 C71 38, 74 44, 70 50 Z" fill="#EF4444" />
                {/* Pan en el horno */}
                <ellipse cx="68" cy="46" rx="6" ry="3.5" fill="#D97706" />
                
                {/* Pala de madera horizontal */}
                <path d="M22 56 L72 52 L73 54 L22 58 Z" fill="#78350F" />
                
                {/* Monito / Niño panadero */}
                {/* Cabeza y rostro */}
                <circle cx="44" cy="34" r="9" fill="#FBD6B5" />
                {/* Cabello castaño rojizo */}
                <path d="M35 32 C34 26, 42 22, 50 25 C52 28, 51 34, 48 35 C45 32, 40 31, 35 32 Z" fill="#B45309" />
                {/* Gorro de chef blanco alto */}
                <path d="M38 24 C36 15, 42 10, 50 11 C58 11, 62 16, 56 24 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                <path d="M40 24 L54 24 L53 27 L41 27 Z" fill="#E2E8F0" />
                {/* Camisa roja */}
                <path d="M38 41 L34 46 L40 48 L42 43 Z" fill="#DC2626" />
                {/* Mandil azul celeste artesanal */}
                <path d="M41 41 L49 41 L50 64 L37 63 Z" fill="#38BDF8" />
                <rect x="41" y="49" width="6" height="6" rx="1" fill="#0284C7" opacity="0.6" />
                {/* Brazos sujetando la pala */}
                <path d="M36 45 L43 54 L41 56 L34 47 Z" fill="#FBD6B5" />
                <path d="M44 44 L54 52 L52 54 L43 46 Z" fill="#FBD6B5" />
                {/* Piernas y sandalias */}
                <path d="M39 63 L39 74 L44 74 L44 63 Z" fill="#1E293B" />
                <ellipse cx="41" cy="76" rx="4" ry="2" fill="#0284C7" />
                
                {/* Canasta de mimbre con panes enfrente */}
                <path d="M48 68 L64 68 L62 82 L50 82 Z" fill="#D97706" />
                <line x1="50" y1="72" x2="62" y2="72" stroke="#78350F" strokeWidth="0.8" />
                <line x1="51" y1="77" x2="61" y2="77" stroke="#78350F" strokeWidth="0.8" />
                {/* Panes dorados en la canasta */}
                <ellipse cx="53" cy="67" rx="3.5" ry="2.5" fill="#FBBF24" stroke="#B45309" strokeWidth="0.6" />
                <ellipse cx="58" cy="66" rx="4" ry="3" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
                <ellipse cx="56" cy="69" rx="3" ry="2" fill="#FCD34D" stroke="#B45309" strokeWidth="0.6" />
              </svg>

              <span className="text-[10px] font-bold text-amber-900 leading-tight mt-1">
                Monito Panadero
              </span>
              <span className="text-[9px] text-amber-700/80 underline decoration-amber-400 group-hover:text-amber-950 font-medium">
                Cargar original
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

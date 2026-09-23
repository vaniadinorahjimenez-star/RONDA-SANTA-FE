import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Flame, 
  Store, 
  TrendingUp, 
  Upload, 
  Trash2, 
  Camera, 
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Users,
  Award,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { MonitoLogo } from './MonitoLogo';
import { 
  getStoredLogo, 
  saveStoredLogo, 
  removeStoredLogo, 
  LOGO_CHANGE_EVENT 
} from '../utils/logoStorage';

interface PhotoItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  dataUrl: string | null;
}

const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 1,
    title: 'Foto 1',
    subtitle: 'Hornos y Producción',
    description: 'Donde nace nuestro producto y las manos que lo amasan con amor.',
    dataUrl: null
  },
  {
    id: 2,
    title: 'Foto 2',
    subtitle: 'Apertura y Vitrinas',
    description: 'Vitrinas impecables, frescura y el primer horneado listo para venta.',
    dataUrl: null
  },
  {
    id: 3,
    title: 'Foto 3',
    subtitle: 'Mostrador y Clientes',
    description: 'La hora de mayor venta y la calidez en la atención a las familias.',
    dataUrl: null
  },
  {
    id: 4,
    title: 'Foto 4',
    subtitle: 'Equipo y Compañerismo',
    description: 'Maestros panaderos y equipo operativo en planta.',
    dataUrl: null
  },
  {
    id: 5,
    title: 'Foto 5',
    subtitle: 'Rutas y Reparto',
    description: 'Logística, camioneta y entrega mayorista a cafeterías y clientes.',
    dataUrl: null
  },
  {
    id: 6,
    title: 'Foto 6',
    subtitle: 'Calidad e Insumos',
    description: 'Harina Dialpa, levaduras e insumos de primera calidad.',
    dataUrl: null
  },
  {
    id: 7,
    title: 'Foto 7',
    subtitle: 'Tradición y Legado',
    description: 'La esencia y el valor de una tradición familiar que prevalece.',
    dataUrl: null
  }
];

const STORAGE_KEY = 'santafe_fotos_inicio_v1';

interface InicioTabProps {
  onGoToBranches?: () => void;
}

export const InicioTab: React.FC<InicioTabProps> = ({ onGoToBranches }) => {
  const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [hasCustomLogo, setHasCustomLogo] = useState<boolean>(!!getStoredLogo());
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Load photos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = DEFAULT_PHOTOS.map((def, idx) => {
            if (parsed[idx] && parsed[idx].dataUrl) {
              return { 
                ...def, 
                dataUrl: parsed[idx].dataUrl,
                title: parsed[idx].title || def.title,
                subtitle: parsed[idx].subtitle || def.subtitle,
                description: parsed[idx].description || def.description
              };
            }
            return def;
          });
          setPhotos(merged);
        }
      }
    } catch (e) {
      console.warn('No se pudieron recuperar las fotos guardadas:', e);
    }

    const checkLogo = () => setHasCustomLogo(!!getStoredLogo());
    window.addEventListener(LOGO_CHANGE_EVENT, checkLogo);
    return () => window.removeEventListener(LOGO_CHANGE_EVENT, checkLogo);
  }, []);

  const savePhotos = (updated: PhotoItem[]) => {
    setPhotos(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error al persistir fotos en storage:', e);
    }
  };

  const processImageFile = (file: File, index: number) => {
    setUploadingIndex(index);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setUploadingIndex(null);
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
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          const updated = [...photos];
          updated[index] = { ...updated[index], dataUrl: compressedDataUrl };
          savePhotos(updated);
        }
        setUploadingIndex(null);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file, index);
    }
    e.target.value = '';
  };

  const handleRemovePhoto = (index: number) => {
    const updated = [...photos];
    updated[index] = { ...updated[index], dataUrl: null };
    savePhotos(updated);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        saveStoredLogo(result);
        setHasCustomLogo(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto">
      
      {/* ========================================================
          PORTADA EDITORIAL / CARTA EMOTIVA CON EL MONITO OFICIAL
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E8] to-[#F5ECE0] border-2 border-amber-200/90 shadow-xl p-8 sm:p-14 text-stone-900">
        {/* Adornos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        {/* Borde interior ornamental */}
        <div className="relative z-10 space-y-8">
          
          {/* Header con Monito Oficial y Títulos */}
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-10 pb-8 border-b-2 border-amber-200/70">
            
            {/* Contenedor del Monito Oficial */}
            <div className="flex flex-col items-center text-center shrink-0">
              <div 
                onClick={() => logoInputRef.current?.click()}
                className="relative p-2 rounded-3xl bg-white shadow-md border-2 border-amber-300/80 hover:border-amber-500 hover:shadow-lg transition-all cursor-pointer group"
                title="Haz clic para cargar o cambiar imagen"
              >
                <MonitoLogo 
                  size="xl" 
                  showUploadControls={false} 
                  className="w-40 h-40 sm:w-52 sm:h-52"
                />
              </div>
              <input
                type="file"
                ref={logoInputRef}
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>

            {/* Texto de Cabecera y Dedicación */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-700/10 border border-amber-600/30 text-amber-900 text-xs font-bold uppercase tracking-widest">
                <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                <span>Carta de Gratitud &bull; Levantamiento Operativo</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900 font-serif">
                PANADERÍA <span className="text-amber-800">SANTA FÉ</span>
              </h1>

              <div className="inline-block py-1 px-3 bg-amber-100/70 rounded-lg border border-amber-200">
                <p className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-widest">
                  Para la Señora Sandra, Don Juventino y Yovis
                </p>
              </div>

              <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-2xl pt-1">
                Querétaro &bull; Un testimonio de respeto, trabajo mano a mano y compromiso firme con el oficio panadero y las familias que dan vida a este gran proyecto.
              </p>
            </div>
          </div>

          {/* ========================================================
              LA CARTA PRINCIPAL DE AGRADECIMIENTO (TEXTO SOLICITADO)
              ======================================================== */}
          <div className="relative bg-white/80 backdrop-blur-xs rounded-2xl p-6 sm:p-10 border border-amber-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-extrabold uppercase tracking-widest">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Agradecimiento de Corazón</span>
            </div>

            <blockquote className="text-lg sm:text-2xl font-serif text-stone-900 leading-snug font-bold border-l-4 border-amber-600 pl-4 sm:pl-6 italic">
              &ldquo;AGRADEZCO A LA SEÑORA SANDRA, A DON JUVENTINO Y A YOVIS ME HAYAN BRINDADO EL HONOR DE ABRIRME LAS PUERTAS DE PANADERIA SANTA FÉ.&rdquo;
            </blockquote>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed pt-1">
              Bajo el plan se cumplieron <strong>6 semanas de levantamiento operativo</strong>, abarcando <strong>3 turnos</strong> de trabajo en las entrañas mismas de la panadería.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================
          EL RECORRIDO DE LAS 6 SEMANAS & LOS 3 TURNOS (DIARIO DE PLANTA)
          ======================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200/80 pb-3">
          <div>
            <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>Diario de Aprendizaje Operativo en Planta</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif mt-1">
              Las 6 Semanas a Través de los 3 Turnos
            </h2>
          </div>
          <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3.5 py-1.5 rounded-full border border-amber-200 w-fit">
            45 Días &bull; Comprensión Profunda del Negocio
          </span>
        </div>

        {/* 3 Tarjetas Emotivas de los Turnos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Turno 1: Madrugada */}
          <div className="relative bg-gradient-to-b from-white to-amber-50/40 rounded-2xl border-2 border-amber-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-xs">
                <Flame className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-widest block">
                  Primeros 15 Días &bull; Madrugada
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1 font-serif">
                  De Madrugada y en los Hornos
                </h3>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/70 text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                &ldquo;Aprendiendo de dónde nace nuestro producto, quiénes participan en su elaboración, ingredientes, horarios, y las manos que lo realizan.&rdquo;
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Viviendo el silencio de la noche, el calor del fuego, la técnica exacta de los maestros panaderos y el respeto absoluto a los ingredientes de calidad.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
              <span>Materia Prima, Receta y Fuego</span>
            </div>
          </div>

          {/* Turno 2: Mañana y Apertura */}
          <div className="relative bg-gradient-to-b from-white to-amber-50/40 rounded-2xl border-2 border-amber-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-xs">
                <Store className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-widest block">
                  Siguientes 15 Días &bull; Mañana
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1 font-serif">
                  Apertura, Mostrador y Reparto
                </h3>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/70 text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                &ldquo;En la apertura de las panaderías, cómo se va a ver nuestro producto al iniciar el día, limpieza, orden, las personas que integran el equipo de mostrador y el equipo de reparto.&rdquo;
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Cuidando la imagen en las charolas, el brillo del pan recién colocado, la sonrisa que recibe al primer cliente y la logística de entrega a tiempo.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Vitrinas, Higiene y Distribución</span>
            </div>
          </div>

          {/* Turno 3: Tarde y Cierre */}
          <div className="relative bg-gradient-to-b from-white to-amber-50/40 rounded-2xl border-2 border-amber-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shadow-xs">
                <TrendingUp className="w-6 h-6 text-amber-700 group-hover:scale-110 transition-transform" />
              </div>

              <div>
                <span className="text-[11px] font-extrabold text-amber-800 uppercase tracking-widest block">
                  Últimos 15 Días &bull; Tarde y Cierre
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1 font-serif">
                  Pico de Ventas y Atención al Cliente
                </h3>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/70 text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                &ldquo;De la mitad del día al cierre, el turno que más vende, la atención al cliente, y los pedidos que realizan los clientes para el siguiente día.&rdquo;
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                El ritmo acelerado de las tardes con familias completas acudiendo por pan de mesa, el trato afectuoso y la lealtad de quienes reservan su pan con anticipación.
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-amber-200/60 flex items-center gap-2 text-[11px] text-amber-900 font-bold">
              <span className="w-2 h-2 rounded-full bg-stone-900" />
              <span>Mayor Ingreso, Clientes y Cierre</span>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          COLLAGE DE FOTOS DE PLANTA
          ======================================================== */}
      <section className="pt-2">
        {/* Collage Grid de 7 Fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:auto-rows-[220px]">
          {photos.map((photo, index) => {
            const isHero = index === 0;
            const isWide = index === 3 || index === 6;

            let cardSpan = 'col-span-1 min-h-[220px]';
            if (isHero) {
              cardSpan = 'col-span-1 sm:col-span-2 sm:row-span-2 min-h-[280px] sm:min-h-[460px]';
            } else if (isWide) {
              cardSpan = 'col-span-1 sm:col-span-2 min-h-[220px]';
            }

            return (
              <div
                key={photo.id}
                className={`${cardSpan} bg-white rounded-2xl border-2 border-stone-200 shadow-2xs hover:shadow-lg hover:border-amber-400 transition-all flex flex-col overflow-hidden group relative`}
              >
                {photo.dataUrl ? (
                  <div className="relative w-full h-full flex flex-col justify-end overflow-hidden">
                    <img
                      src={photo.dataUrl}
                      alt={photo.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent pointer-events-none" />

                    {/* Botones de acción flotantes */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10 print:hidden">
                      <button
                        onClick={() => fileInputRefs.current[index]?.click()}
                        className="p-1.5 rounded-lg bg-stone-900/85 hover:bg-stone-900 text-white backdrop-blur-xs transition-colors cursor-pointer shadow-md"
                        title="Cambiar fotografía"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemovePhoto(index)}
                        className="p-1.5 rounded-lg bg-red-600/85 hover:bg-red-600 text-white backdrop-blur-xs transition-colors cursor-pointer shadow-md"
                        title="Eliminar fotografía"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="relative z-10 p-3 sm:p-4 text-white">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-600/90 backdrop-blur-xs px-2 py-0.5 rounded text-white">
                          Foto {index + 1}
                        </span>
                        <span className="text-[11px] text-stone-200 font-medium truncate">
                          {photo.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                        {photo.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRefs.current[index]?.click()}
                    disabled={uploadingIndex === index}
                    className="w-full h-full flex flex-col items-center justify-center p-5 text-center hover:bg-amber-50/60 transition-colors cursor-pointer group/btn"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/90 text-amber-800 flex items-center justify-center mb-2 group-hover/btn:scale-110 transition-transform shadow-xs">
                      {uploadingIndex === index ? (
                        <div className="w-5 h-5 border-2 border-amber-700 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Camera className="w-6 h-6 text-amber-700" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-stone-800">
                      {uploadingIndex === index ? 'Procesando...' : `Subir Foto ${index + 1}`}
                    </span>
                    <span className="text-[11px] text-amber-900/80 mt-0.5 font-medium">
                      {photo.subtitle}
                    </span>
                    <span className="text-[10px] text-stone-500 mt-1">
                      Haz clic para elegir archivo
                    </span>
                  </button>
                )}

                <input
                  type="file"
                  accept="image/*"
                  ref={(el) => (fileInputRefs.current[index] = el)}
                  onChange={(e) => handleFileChange(e, index)}
                  className="hidden"
                />
              </div>
            );
          })}
        </div>
      </section>


      {/* ========================================================
          DECLARACIÓN SOLEMNE: COMPROMISO Y LEGADO FAMILIAR
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFDF9] via-[#FAF4EA] to-[#F5ECE0] border-2 border-amber-300/90 p-8 sm:p-12 shadow-lg space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-amber-100" />
          </div>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-900">
              Voto de Continuidad y Crecimiento
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">
              Cuidar y Construir un Legado Familiar
            </h3>
          </div>
        </div>

        {/* Declaración Emotiva Literal Solicitada */}
        <div className="p-6 sm:p-8 bg-white/90 rounded-2xl border-2 border-amber-200/80 shadow-xs">
          <blockquote className="text-base sm:text-xl leading-relaxed text-stone-900 font-serif font-bold italic text-center sm:text-left">
            &ldquo;SEMANAS LLENAS DE EMOCIÓN, MUCHO CORAZÓN, EXPRESO MI MAYOR RESPETO Y LA FIRME DECISIÓN DE TOMAR ESTE NEGOCIO BUSCANDO QUE PREVALEZCA Y CREZCA, ASUMIR ESTE COMPROMISO SERÍA PARA MI CUIDAR Y CONTINUAR CONTRUYENDO UN LEGADO FAMILIAR.&rdquo;
          </blockquote>
        </div>

        {/* Botón de Avance a Sucursales */}
        {onGoToBranches && (
          <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
            <span className="text-xs text-stone-600 font-medium">
              Panadería Santa Fé &bull; Sucursal Zákia y Sucursal Matriz El Refugio
            </span>
            <button
              onClick={onGoToBranches}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer group active:scale-95"
            >
              <span>Ver Números Financieros &bull; Sucursal Zákia</span>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

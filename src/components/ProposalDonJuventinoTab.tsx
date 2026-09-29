import React, { useState, useMemo } from 'react';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { 
  Handshake, 
  Banknote, 
  TrendingUp, 
  HeartHandshake, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  FileText, 
  UserCheck, 
  Printer, 
  Sparkles,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  HelpCircle,
  Coffee,
  Check,
  Coins,
  Scale,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff,
  Delete,
  Download,
  Building,
  Home,
  Landmark,
  Key
} from 'lucide-react';
import { ValuationMultiplesSection } from './ValuationMultiplesSection';
import { PrintProposalDocument } from './PrintProposalDocument';

const SESSION_AUTH_KEY = 'psf_auth_propuesta_juventino_token';
const AUTH_HASH = '0a0667865bc17f9d624bcf11088057bbab46336e7dae65f3d5366f4f7a18333e';
// Obfuscated internal comparison ensuring raw PIN string does not exist in build bundles
const VERIFY_CODE = [49, 51, 53, 55, 57].map(c => String.fromCharCode(c)).join('');

interface AmortizacionRow {
  periodo: string;
  saldoInsoluto: number;
  interesMensual: number;
  interesAnual: number;
  amortizacionCapital: number;
  flujoTotalAnual: number;
}

// Opción 3: $4,360,000 MXN diferidos como capital al 13% anual fijo (4 abonos de $1,000,000 MXN y último abono de $360,000 MXN)
const TABLA_AMORTIZACION_PROP3: AmortizacionRow[] = [
  { periodo: 'Año 1', saldoInsoluto: 4360000, interesMensual: 47233, interesAnual: 566800, amortizacionCapital: 1000000, flujoTotalAnual: 1566800 },
  { periodo: 'Año 2', saldoInsoluto: 3360000, interesMensual: 36400, interesAnual: 436800, amortizacionCapital: 1000000, flujoTotalAnual: 1436800 },
  { periodo: 'Año 3', saldoInsoluto: 2360000, interesMensual: 25567, interesAnual: 306800, amortizacionCapital: 1000000, flujoTotalAnual: 1306800 },
  { periodo: 'Año 4', saldoInsoluto: 1360000, interesMensual: 14733, interesAnual: 176800, amortizacionCapital: 1000000, flujoTotalAnual: 1176800 },
  { periodo: 'Año 5', saldoInsoluto: 360000, interesMensual: 3900, interesAnual: 46800, amortizacionCapital: 360000, flujoTotalAnual: 406800 },
];

interface PlanBlandoRow {
  periodo: string;
  meses: string;
  mensualidadFija: number;
  pagoAnualDonJuventino: number;
  saldoRestante: number;
}

// Opción 2: 42 meses (3.5 años) a $150,000 MXN mensuales = $6.3 MDP diferidos + $5 MDP inicial = $11,300,000 MXN
const TABLA_PLAN_BLANDO_PROP2: PlanBlandoRow[] = [
  { periodo: 'Año 1', meses: 'Meses 1 al 12', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, saldoRestante: 4500000 },
  { periodo: 'Año 2', meses: 'Meses 13 al 24', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, saldoRestante: 2700000 },
  { periodo: 'Año 3', meses: 'Meses 25 al 36', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, saldoRestante: 900000 },
  { periodo: 'Año 4 (6 meses)', meses: 'Meses 37 al 42', mensualidadFija: 150000, pagoAnualDonJuventino: 900000, saldoRestante: 0 },
];

export const ProposalDonJuventinoTab: React.FC = () => {
  // Security State (Protected Access)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === 'granted';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  // 1 = Cash Inmediato, 2 = Interés Blando 3 Años, 3 = Financiamiento 12% a 5 Años, 4 = Pensión Vitalicia (Mín. 10 Años)
  const [selectedScenario, setSelectedScenario] = useState<1 | 2 | 3 | 4>(1);
  const [confirmedChoice, setConfirmedChoice] = useState<number | null>(null);
  const [proposalViewMode, setProposalViewMode] = useState<'todo' | 'valuacion' | 'esquemas'>('todo');

  // Cartas tapadas para Don Juventino (Propuesta 1, 2, 3 y 4)
  const [openedProposals, setOpenedProposals] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const [isPrintDocOpen, setIsPrintDocOpen] = useState<boolean>(false);

  const handleToggleProposal = (id: 1 | 2 | 3 | 4) => {
    setOpenedProposals(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    setSelectedScenario(id);
  };

  const handleOpenProposal = (id: 1 | 2 | 3 | 4) => {
    setOpenedProposals(prev => ({
      ...prev,
      [id]: true
    }));
    setSelectedScenario(id);
  };

  const handleOpenAll = () => {
    setOpenedProposals({ 1: true, 2: true, 3: true, 4: true });
  };

  const handleCloseAll = () => {
    setOpenedProposals({ 1: false, 2: false, 3: false, 4: false });
  };
  
  // Configuración interactiva para Propuesta 4: Traspaso de Activos Inmobiliarios
  const [plusvaliaRateProp4, setPlusvaliaRateProp4] = useState<number>(0.06); // 6% anual moderada
  const [inflacionRentaRateProp4] = useState<number>(0.05); // 5% ajuste anual de rentas

  // Valores clave de activos inmobiliarios
  const VALOR_CASA_TIERRA_PURA = 7000000;
  const RENTA_CASA_TIERRA_PURA = 40000;
  const VALOR_DEPTO_ZAKIA = 2400000;
  const RENTA_DEPTO_ZAKIA = 13000;
  const EFECTIVO_INICIAL_PROP4 = 1000000;
  const VALOR_TOTAL_ACTIVOS_PROP4 = 10400000; // $7M + $2.4M + $1M
  const VALOR_INMUEBLES_BASE = 9400000; // $7M + $2.4M
  const RENTA_MENSUAL_INICIAL_PROP4 = 53000; // $40k + $13k
  const RENTA_ANUAL_INICIAL_PROP4 = 636000;

  // Corrida financiera de 5 años para Propuesta 4 (con ajuste de rentas y plusvalía compuesta)
  const corridaPropuesta4 = useMemo(() => {
    const rows = [];
    let rentasAcum = 0;
    for (let yr = 1; yr <= 5; yr++) {
      const rentaMensual = Math.round(53000 * Math.pow(1 + inflacionRentaRateProp4, yr - 1));
      const rentasAnuales = rentaMensual * 12;
      rentasAcum += rentasAnuales;
      const valorInmuebles = Math.round(VALOR_INMUEBLES_BASE * Math.pow(1 + plusvaliaRateProp4, yr));
      const valorInmueblesPrev = yr === 1 ? VALOR_INMUEBLES_BASE : Math.round(VALOR_INMUEBLES_BASE * Math.pow(1 + plusvaliaRateProp4, yr - 1));
      const plusvaliaGanadaAnual = valorInmuebles - valorInmueblesPrev;
      const plusvaliaAcumulada = valorInmuebles - VALOR_INMUEBLES_BASE;
      const patrimonioTotal = EFECTIVO_INICIAL_PROP4 + rentasAcum + valorInmuebles;
      
      rows.push({
        year: yr,
        periodo: `Año ${yr}`,
        meses: `Meses ${(yr - 1) * 12 + 1} al ${yr * 12}`,
        rentaMensual,
        rentasAnuales,
        rentasAcumuladas: rentasAcum,
        valorInmuebles,
        plusvaliaGanadaAnual,
        plusvaliaAcumulada,
        patrimonioTotal
      });
    }
    return rows;
  }, [plusvaliaRateProp4, inflacionRentaRateProp4]);

  const handlePrintProposal = () => {
    setIsPrintDocOpen(true);
  };

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin) {
      setErrorMessage('Por favor ingrese la clave de seguridad.');
      return;
    }

    setIsVerifying(true);
    let isValid = false;

    if (cleanPin === VERIFY_CODE) {
      isValid = true;
    } else {
      try {
        const msgUint8 = new TextEncoder().encode(cleanPin);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        if (hashHex === AUTH_HASH) {
          isValid = true;
        }
      } catch {
        isValid = cleanPin === VERIFY_CODE;
      }
    }

    setIsVerifying(false);

    if (isValid) {
      try {
        sessionStorage.setItem(SESSION_AUTH_KEY, 'granted');
      } catch {
        // ignore storage errors
      }
      setIsAuthenticated(true);
      setPinInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('Clave de seguridad incorrecta. Acceso restringido.');
      setPinInput('');
    }
  };

  const handleLock = () => {
    try {
      sessionStorage.removeItem(SESSION_AUTH_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPinInput('');
    setErrorMessage('');
  };

  // Lock Screen View if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Lock Screen Header Banner */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-6 sm:p-8 text-center text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 text-amber-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Documento Confidencial Protegido
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Propuesta Don Juventino
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-2 max-w-md mx-auto leading-relaxed">
              Este módulo contiene términos patrimoniales y esquemas de negociación privados. Ingrese la clave de seguridad autorizada para desbloquear el contenido.
            </p>
          </div>

          {/* Keypad & Input Form */}
          <div className="p-6 sm:p-8 bg-stone-50/60 space-y-6">
            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <label htmlFor="security-pin-field" className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2 text-center">
                  Clave de Seguridad
                </label>
                <div className="relative max-w-xs mx-auto">
                  <input
                    id="security-pin-field"
                    type={showPassword ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="off"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    placeholder="•••••"
                    className={`w-full px-4 py-3.5 pr-12 text-center text-xl font-mono tracking-widest bg-white border rounded-xl outline-none transition-all ${
                      errorMessage
                        ? 'border-red-400 ring-2 ring-red-100 text-red-900 bg-red-50/30'
                        : 'border-stone-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-stone-900'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors p-1 cursor-pointer"
                    aria-label={showPassword ? "Ocultar clave" : "Mostrar clave"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {errorMessage && (
                  <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 text-center animate-in fade-in">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Touch Keypad */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider text-center mb-2.5">
                  Teclado Numérico
                </div>
                <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      onClick={() => {
                        setPinInput(prev => prev + digit);
                        if (errorMessage) setErrorMessage('');
                      }}
                      className="py-3 bg-white hover:bg-amber-50 active:bg-amber-100 border border-stone-200 hover:border-amber-300 rounded-xl font-mono font-bold text-stone-800 text-lg shadow-2xs transition-all cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setPinInput('');
                      setErrorMessage('');
                    }}
                    className="py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl font-medium text-stone-600 text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    Borrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPinInput(prev => prev + '0');
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="py-3 bg-white hover:bg-amber-50 active:bg-amber-100 border border-stone-200 hover:border-amber-300 rounded-xl font-mono font-bold text-stone-800 text-lg shadow-2xs transition-all cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPinInput(prev => prev.slice(0, -1));
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="py-3 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl font-medium text-stone-600 text-xs shadow-2xs transition-all flex items-center justify-center cursor-pointer"
                    aria-label="Retroceso"
                  >
                    <Delete className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3 max-w-xs mx-auto">
                <button
                  type="submit"
                  disabled={isVerifying || !pinInput.trim()}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <span className="animate-spin w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full" />
                  ) : (
                    <KeyRound className="w-4 h-4 text-stone-950" />
                  )}
                  <span>Desbloquear Documento</span>
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-stone-200 text-center">
              <span className="text-[11px] text-stone-500">
                Seguridad activa &bull; Acceso estrictamente reservado
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Active Security Status Bar */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 text-emerald-900 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Acceso Privado Autorizado &bull; Propuesta Don Juventino Desbloqueada</span>
        </div>
        <button
          onClick={handleLock}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-medium hover:text-stone-900 transition-colors shadow-2xs cursor-pointer"
          title="Bloquear y proteger este documento"
        >
          <Lock className="w-3.5 h-3.5 text-stone-600" />
          <span>Bloquear Acceso</span>
        </button>
      </div>
      {/* 1. HERO & OFFICIAL RECOGNITION LETTER */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-stone-800 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Handshake className="w-4 h-4 text-amber-400" />
            <span>Documento Formal &bull; Propuesta Integral de Negocio y Adquisición</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Propuesta Exclusiva para <span className="text-amber-400">Don Juventino</span>
          </h2>

          <p className="text-stone-300 text-sm sm:text-base mt-3 leading-relaxed">
            Cuatro alternativas financieras y operativas formuladas para brindarle bienestar, liquidez inmediata, total certeza jurídica y la tranquilidad que merece para disfrutar de su patrimonio y retiro.
          </p>
        </div>
      </div>

      {/* Sub-navegación para presentación ejecutiva en reuniones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 bg-stone-100/90 border border-stone-200 rounded-2xl print:hidden">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setProposalViewMode('todo')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              proposalViewMode === 'todo'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            Vista Completa (Todo el Documento)
          </button>
          <button
            type="button"
            onClick={() => setProposalViewMode('valuacion')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              proposalViewMode === 'valuacion'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>1. Valuación por Múltiplos &amp; 3 Cartas Cerradas ($7.8M / $9.36M / $10.92M)</span>
          </button>
          <button
            type="button"
            onClick={() => setProposalViewMode('esquemas')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              proposalViewMode === 'esquemas'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white hover:bg-stone-50 text-stone-700'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            <span>2. Esquemas de Pago para Don Juventino (Contado / Blando / Pensión)</span>
          </button>
        </div>

        <div className="text-[11px] text-stone-500 font-medium px-2 hidden lg:block">
          {proposalViewMode === 'valuacion' && 'Foco: Múltiplos y 3 cartas cerradas'}
          {proposalViewMode === 'esquemas' && 'Foco: Esquemas de salida patrimonial'}
          {proposalViewMode === 'todo' && 'Foco: Documento integral completo'}
        </div>
      </div>

      {/* SECCIÓN 1: FUNDAMENTO TÉCNICO & VALUACIÓN POR MÚLTIPLOS (CARTAS CERRADAS $7.8M, $9.36M, $10.92M) */}
      {(proposalViewMode === 'todo' || proposalViewMode === 'valuacion') && (
        <ValuationMultiplesSection />
      )}

      {/* SECCIÓN 2: ESQUEMAS DE PAGO & PROPUESTAS ESPECÍFICAS PARA DON JUVENTINO */}
      {(proposalViewMode === 'todo' || proposalViewMode === 'esquemas') && (
        <>
          {/* Separador temático cuando se ve todo */}
          {proposalViewMode === 'todo' && (
            <div className="pt-6 pb-2 border-t-2 border-stone-200">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-widest">
                <Handshake className="w-4 h-4 text-amber-700" />
                <span>Estructuras de Formalización &bull; Opciones de Pago para Don Juventino</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                Alternativas de Pago y Liquidación Patrimonial
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                Una vez definida la cifra en las cartas anteriores, Don Juventino puede elegir el esquema de flujo que mejor responda a su proyecto de vida:
              </p>
            </div>
          )}

      {/* 2. SCENARIO SELECTOR CARDS (Top Overview & Interactive Switch) */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2.5 py-1.5 px-3 bg-stone-50 border border-stone-200 rounded-xl shadow-xs">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-800 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Cartas de Propuesta para Don Juventino</span>
            </div>
            <p className="text-[11px] text-stone-600">
              Toca cada carta para abrirla y ver su corrida completa a un lado en la misma ventana.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap sm:shrink-0">
            <button
              onClick={handleOpenAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Abrir todas las cartas"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Abrir las 4</span>
            </button>
            <button
              onClick={handleCloseAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Tapar todas las cartas"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Tapar todas</span>
            </button>
            <button
              onClick={() => setIsPrintDocOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-stone-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Descargar documento ejecutivo en PDF con las 4 propuestas y cuadro comparativo"
            >
              <Download className="w-3.5 h-3.5 text-amber-800" />
              <span>Descargar en PDF / Imprimir</span>
            </button>
          </div>
        </div>

        {/* Master-Detail Layout: 4 Compact Vertical Proposal Cards on Left, Side Detail on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* Vertical Proposal Cards Column (Left Rail) - Ultra-compact, colored, fits in single window */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-2 lg:sticky lg:top-2">
            {/* Card 1: Contado (Amber / Oro Cálido) */}
            {!openedProposals[1] ? (
              <div
                onClick={() => {
                  setSelectedScenario(1);
                  handleOpenProposal(1);
                }}
                className="group relative rounded-xl p-2 sm:p-2.5 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white border-2 border-amber-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-800/60 border border-amber-300/40 text-amber-100 uppercase tracking-wider">
                    <Banknote className="w-3 h-3 text-amber-200" />
                    PROPUESTA 1 &bull; Contado
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-amber-100 bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-300/30">
                    <EyeOff className="w-2.5 h-2.5 text-amber-200" />
                    Carta tapada
                  </span>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-900/50 text-amber-200 border border-amber-300/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Banknote className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-amber-100 transition-colors">
                      Adquisición Directa en $9,360,000
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-amber-100/90 leading-tight truncate">
                      Oferta: $8.5M contado &bull; Certeza en un solo pago
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-amber-400/30 flex items-center justify-between text-[10px]">
                  <span className="text-amber-100/80">Toca para abrir</span>
                  <span className="inline-flex items-center gap-0.5 font-bold text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Abrir carta</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectedScenario(1)}
                className={`rounded-xl p-2 sm:p-2.5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedScenario === 1
                    ? 'bg-amber-50/95 border-amber-600 shadow-md ring-2 ring-amber-400/30'
                    : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <Banknote className="w-3 h-3 text-amber-800" />
                    PROPUESTA 1 &bull; Contado
                  </span>
                  <div className="flex items-center gap-1">
                    {confirmedChoice === 1 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Elegida
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      <Eye className="w-2.5 h-2.5 text-amber-700" />
                      Abierta
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProposal(1);
                      }}
                      className="text-[9px] font-semibold text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Tapar esta carta"
                    >
                      <EyeOff className="w-2.5 h-2.5" />
                      <span>Tapar</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Banknote className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                      Adquisición Directa en $9,360,000
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 leading-tight truncate">
                      Oferta: $8.5M contado &bull; Certeza en un solo pago
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-stone-200/80 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-900 flex items-center gap-0.5">
                    {selectedScenario === 1 ? 'Viendo corrida a un lado' : 'Ver corrida a un lado'}
                    <ChevronRight className="w-3 h-3 text-amber-700" />
                  </span>
                  <span className="text-stone-500 font-medium">1 exhibición</span>
                </div>
              </div>
            )}

            {/* Card 2: 42 Meses (Teal / Petróleo) */}
            {!openedProposals[2] ? (
              <div
                onClick={() => {
                  setSelectedScenario(2);
                  handleOpenProposal(2);
                }}
                className="group relative rounded-xl p-2 sm:p-2.5 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 text-white border-2 border-teal-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-900/60 border border-teal-300/40 text-teal-100 uppercase tracking-wider">
                    <Coins className="w-3 h-3 text-teal-200" />
                    PROPUESTA 2 &bull; 42 Meses Fijos
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-teal-100 bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-300/30">
                    <EyeOff className="w-2.5 h-2.5 text-teal-200" />
                    Carta tapada
                  </span>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-950/50 text-teal-200 border border-teal-300/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-teal-100 transition-colors">
                      Financiamiento a 42 Meses
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-teal-100/90 leading-tight truncate">
                      Flujo mensual garantizado durante 3.5 años
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-teal-400/30 flex items-center justify-between text-[10px]">
                  <span className="text-teal-100/80">Toca para abrir</span>
                  <span className="inline-flex items-center gap-0.5 font-bold text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Abrir carta</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectedScenario(2)}
                className={`rounded-xl p-2 sm:p-2.5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedScenario === 2
                    ? 'bg-teal-50/95 border-teal-600 shadow-md ring-2 ring-teal-400/30'
                    : 'bg-white border-teal-200 hover:border-teal-400 hover:bg-teal-50/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                    <Coins className="w-3 h-3 text-teal-800" />
                    PROPUESTA 2 &bull; 42 Meses Fijos
                  </span>
                  <div className="flex items-center gap-1">
                    {confirmedChoice === 2 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Elegida
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded">
                      <Eye className="w-2.5 h-2.5 text-teal-700" />
                      Abierta
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProposal(2);
                      }}
                      className="text-[9px] font-semibold text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Tapar esta carta"
                    >
                      <EyeOff className="w-2.5 h-2.5" />
                      <span>Tapar</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                      Financiamiento a 42 Meses
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 leading-tight truncate">
                      Flujo mensual garantizado durante 3.5 años
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-stone-200/80 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-teal-900 flex items-center gap-0.5">
                    {selectedScenario === 2 ? 'Viendo corrida a un lado' : 'Ver corrida a un lado'}
                    <ChevronRight className="w-3 h-3 text-teal-700" />
                  </span>
                  <span className="text-stone-500 font-medium">3.5 años</span>
                </div>
              </div>
            )}

            {/* Card 3: Pagos 1 MDP Anuales + Intereses (Blue / Zafiro) */}
            {!openedProposals[3] ? (
              <div
                onClick={() => {
                  setSelectedScenario(3);
                  handleOpenProposal(3);
                }}
                className="group relative rounded-xl p-2 sm:p-2.5 bg-gradient-to-br from-blue-600 via-indigo-700 to-indigo-800 text-white border-2 border-blue-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-900/60 border border-blue-300/40 text-blue-100 uppercase tracking-wider">
                    <TrendingUp className="w-3 h-3 text-blue-200" />
                    PROPUESTA 3 &bull; Pagos 1 MDP Anuales + Intereses
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-blue-100 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-blue-300/30">
                    <EyeOff className="w-2.5 h-2.5 text-blue-200" />
                    Carta tapada
                  </span>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-950/50 text-blue-200 border border-blue-300/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-blue-100 transition-colors">
                      Pagos 1 MDP Anuales + Intereses
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-blue-100/90 leading-tight truncate">
                      $5 MDP inicial + 4 pagos de $1 MDP y $360k (+ intereses 13%)
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-blue-400/30 flex items-center justify-between text-[10px]">
                  <span className="text-blue-100/80">Toca para abrir</span>
                  <span className="inline-flex items-center gap-0.5 font-bold text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Abrir carta</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectedScenario(3)}
                className={`rounded-xl p-2 sm:p-2.5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedScenario === 3
                    ? 'bg-blue-50/95 border-blue-600 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-white border-blue-200 hover:border-blue-400 hover:bg-blue-50/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                    <TrendingUp className="w-3 h-3 text-blue-800" />
                    PROPUESTA 3 &bull; Pagos 1 MDP Anuales + Intereses
                  </span>
                  <div className="flex items-center gap-1">
                    {confirmedChoice === 3 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Elegida
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                      <Eye className="w-2.5 h-2.5 text-blue-700" />
                      Abierta
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProposal(3);
                      }}
                      className="text-[9px] font-semibold text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Tapar esta carta"
                    >
                      <EyeOff className="w-2.5 h-2.5" />
                      <span>Tapar</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                      Pagos 1 MDP Anuales + Intereses
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 leading-tight truncate">
                      $5 MDP inicial + 4 pagos de $1 MDP y $360k (+ intereses 13%)
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-stone-200/80 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-blue-900 flex items-center gap-0.5">
                    {selectedScenario === 3 ? 'Viendo corrida a un lado' : 'Ver corrida a un lado'}
                    <ChevronRight className="w-3 h-3 text-blue-700" />
                  </span>
                  <span className="text-stone-500 font-medium">5 años &bull; 13%</span>
                </div>
              </div>
            )}

            {/* Card 4: Traspaso de Activos Inmobiliarios (Emerald / Esmeralda Patrimonial) */}
            {!openedProposals[4] ? (
              <div
                onClick={() => {
                  setSelectedScenario(4);
                  handleOpenProposal(4);
                }}
                className="group relative rounded-xl p-2 sm:p-2.5 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white border-2 border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-300/40 text-emerald-100 uppercase tracking-wider">
                    <Home className="w-3 h-3 text-emerald-200" />
                    PROPUESTA 4 &bull; Inmobiliaria
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-100 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300/30">
                    <EyeOff className="w-2.5 h-2.5 text-emerald-200" />
                    Carta tapada
                  </span>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/50 text-emerald-200 border border-emerald-300/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-emerald-100 transition-colors">
                      Traspaso de Activos Inmobiliarios
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-emerald-100/90 leading-tight truncate">
                      Casa Tierra Pura + Depto Zákia + $1M &bull; Rentas $53k/mes
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-emerald-400/30 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-100/80">Toca para abrir</span>
                  <span className="inline-flex items-center gap-0.5 font-bold text-white group-hover:translate-x-0.5 transition-transform">
                    <span>Abrir carta</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectedScenario(4)}
                className={`rounded-xl p-2 sm:p-2.5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                  selectedScenario === 4
                    ? 'bg-emerald-50/95 border-emerald-600 shadow-md ring-2 ring-emerald-400/30'
                    : 'bg-white border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <Home className="w-3 h-3 text-emerald-800" />
                    PROPUESTA 4 &bull; Inmobiliaria
                  </span>
                  <div className="flex items-center gap-1">
                    {confirmedChoice === 4 && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Elegida
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      <Eye className="w-2.5 h-2.5 text-emerald-700" />
                      Abierta
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleProposal(4);
                      }}
                      className="text-[9px] font-semibold text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors cursor-pointer"
                      title="Tapar esta carta"
                    >
                      <EyeOff className="w-2.5 h-2.5" />
                      <span>Tapar</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                      Traspaso de Activos Inmobiliarios
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 leading-tight truncate">
                      Casa Tierra Pura + Depto Zákia + $1M &bull; Rentas $53k/mes
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-stone-200/80 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-900 flex items-center gap-0.5">
                    {selectedScenario === 4 ? 'Viendo corrida a un lado' : 'Ver corrida a un lado'}
                    <ChevronRight className="w-3 h-3 text-emerald-700" />
                  </span>
                  <span className="text-stone-500 font-medium">Activos: $10.4 MDP</span>
                </div>
              </div>
            )}
          </div>

          {/* Side Detailed View of Currently Selected Proposal (Right Column) - Contained height */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-2xl border border-stone-200 shadow-sm p-3.5 sm:p-4.5 lg:h-[calc(100vh-175px)] lg:min-h-[460px] lg:max-h-[600px] lg:overflow-y-auto">
        {!openedProposals[selectedScenario] ? (
          <div className="py-10 px-4 text-center space-y-3 max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center mx-auto shadow-xs">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest">
                Carta Tapada &bull; Don Juventino
              </span>
              <h3 className="text-xl font-bold text-stone-900 mt-0.5 font-serif">
                PROPUESTA {selectedScenario}
              </h3>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Esta propuesta se encuentra cubierta para su presentación formal. Toca la carta de la <strong>Propuesta {selectedScenario}</strong> a la izquierda o presiona el botón para abrirla y consultar su corrida completa.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleOpenProposal(selectedScenario)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                <span>Abrir y Mostrar Propuesta {selectedScenario}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Scenario 1 Detailed Tab */}
            {selectedScenario === 1 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 mb-2">
                  <Banknote className="w-4 h-4 text-amber-800" />
                  Propuesta 1 en Detalle &bull; Valuación Base: $9,360,000 MXN
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Adquisición Directa en $9,360,000
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 mt-1 font-medium">
                  Valuación del negocio fijada en <strong>$9,360,000 MXN</strong> con oferta del pago de <strong>8.5 millones de contado ($8,500,000 MXN)</strong>. Certeza en un solo pago, facilitando su transición inmediata hacia nuevos proyectos.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200 shrink-0">
                <span className="text-xs text-stone-500 block">Oferta de Contado (Cash)</span>
                <span className="text-2xl font-extrabold text-stone-900 font-mono">{formatCurrency(8500000)}</span>
                <span className="text-[11px] text-amber-800 font-semibold block mt-0.5">Valuación Base: $9,360,000 MXN</span>
              </div>
            </div>

            {/* Justificación y Oferta de Contado */}
            <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4>Oferta de Adquisición Directa de Contado ($8.5 MDP)</h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Con base en la valuación de <strong>$9,360,000 MXN</strong>, se formaliza la <strong>oferta de pago de $8,500,000 MXN de contado</strong>: <em>certeza en un solo pago, facilitando su transición inmediata hacia nuevos proyectos</em> sin exposición crediticia ni dependencia de utilidades futuras.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Utilidad Base Mensual</span>
                  <span className="text-base font-bold text-stone-900 font-mono">{formatCurrency(270881)}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Normalizada (con admin. deducida)</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Utilidad Neta Anual</span>
                  <span className="text-base font-bold text-stone-900 font-mono">{formatCurrency(3250572)}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">$270,881 &times; 12 meses</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Valuación de Referencia</span>
                  <span className="text-base font-extrabold text-stone-900 font-mono">{formatCurrency(9360000)}</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">2.88x EBITDA / Base común 4 opciones</span>
                </div>
                <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300">
                  <span className="text-amber-950 block text-[11px] font-bold">Oferta de Contado</span>
                  <span className="text-base font-black text-amber-950 font-mono">{formatCurrency(8500000)}</span>
                  <span className="text-[10px] text-amber-900 block mt-0.5">Liquidez 100% inmediata ante notario</span>
                </div>
              </div>
            </div>

            {/* Condiciones de la Oferta Cash */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2.5">
                <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Condiciones Operativas y Legales
                </h5>
                <ul className="space-y-2 text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Valuación del negocio:</span>
                    <span className="font-semibold text-stone-900 font-mono">$9,360,000 MXN</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Oferta de contado (Cash):</span>
                    <span className="font-bold text-emerald-700 font-mono">$8,500,000 MXN</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Propósito central:</span>
                    <span className="text-stone-800">Certeza en un solo pago, facilitando su transición inmediata hacia nuevos proyectos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Forma de liquidación:</span>
                    <span>Pago íntegro de contado a la firma del contrato ante notario.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Saldo pendiente:</span>
                    <span className="font-semibold text-stone-900">$0 MXN (sin plazos diferidos ni exposición crediticia).</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2.5">
                <h5 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Beneficios Inmediatos para Don Juventino
                </h5>
                <ul className="space-y-2 text-stone-700 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span><strong>Certeza en un solo pago:</strong> $8,500,000 MXN líquidos en su cuenta bancaria desde el día uno ante notario.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span><strong>Transición inmediata hacia nuevos proyectos:</strong> Deslinde total de responsabilidades laborales, operativas y fiscales.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span><strong>Cero contingencias futuras:</strong> Sin depender de utilidades mensuales, ventas ni fluctuaciones de mercado.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 2 Detailed Tab (NUEVA OPCIÓN 2: INTERÉS BLANDO 42 MESES / 3.5 AÑOS) */}
        {selectedScenario === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-900 mb-2">
                  <Coins className="w-4 h-4 text-teal-800" />
                  Propuesta 2 en Detalle &bull; Gesto de Buena Fe y Estabilidad Operativa
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Financiamiento a 42 Meses ($150,000 MXN Mensuales Fijos / 3.5 Años)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Esquema equilibrado de 42 meses (3.5 años) pagando $150,000 MXN fijos al mes. Esta alternativa suma $6,300,000 MXN en pagos diferidos que, sumados a los $5,000,000 MXN iniciales de contado, alcanzan un total acumulado de $11,300,000 MXN para Don Juventino con total predictibilidad y respaldo notarial.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Total Acumulado a Percibir</span>
                <span className="text-2xl font-extrabold text-teal-950 font-mono">{formatCurrency(11300000)}</span>
                <span className="text-[11px] text-teal-700 block mt-0.5">$5 MDP Cash + $6.3 MDP en 42 Meses</span>
              </div>
            </div>

            {/* Condiciones principales de la Propuesta 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-xs">Pago Inicial en Efectivo</span>
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                <p className="text-stone-600 text-xs mt-1">100% líquido en cuenta a la firma del contrato.</p>
              </div>
              <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200">
                <span className="text-teal-900 font-semibold block text-xs">Mensualidad Fija a Don Juventino</span>
                <span className="text-xl font-bold text-teal-950 font-mono">{formatCurrency(150000)}</span>
                <p className="text-teal-800 text-xs mt-1">42 pagos mensuales idénticos sin variación (3.5 años).</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-xs">Total Diferido a Plazos</span>
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(6300000)}</span>
                <p className="text-stone-600 text-xs mt-1">42 mensualidades fijas garantizadas con pagarés.</p>
              </div>
            </div>

            {/* Justificación de Equilibrio Financiero: ¿Por qué 42 meses a $150k? */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-700" />
                Estructura de Certeza: 42 Meses a $150,000 MXN ($11,300,000 MXN Totales)
              </h5>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Esta alternativa ofrece un flujo mensual continuo y programado de <strong>$150,000 MXN al mes</strong> durante 3.5 años, alcanzando un total acumulado muy superior al esquema de contado:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-teal-900 block">Flujo Mensual Sustancial para Don Juventino:</span>
                  <p className="text-stone-600">
                    Recibe <strong>$150,000 MXN mensuales garantizados</strong> durante 42 meses continuos (3.5 años), sumando <strong>$6,300,000 MXN</strong>. Con los $5,000,000 MXN iniciales de contado, percibe un total de <strong>$11,300,000 MXN</strong> en su bolsa.
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-teal-900 block">Certeza Jurídica y Respaldo Notarial:</span>
                  <p className="text-stone-600">
                    Cada mensualidad queda respaldada por un <strong>pagaré mercantil notarial independiente</strong> entregado desde el día uno, otorgándole plena seguridad jurídica sin depender de fluctuaciones operativas.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla Detallada de Calendario a 42 Meses */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">
                    Calendario de Pagos y Amortización (42 Meses / 3.5 Años)
                  </h5>
                  <p className="text-xs text-stone-500">
                    Flujo mensual garantizado de $150,000 MXN soportado con pagarés mercantiles notariales.
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-900 bg-teal-100 px-2.5 py-1 rounded-full">
                  42 Mensualidades Fijas de $150,000 MXN
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Periodo</th>
                      <th className="py-3 px-4">Meses</th>
                      <th className="py-3 px-4 text-right font-semibold text-teal-900">Mensualidad Fija</th>
                      <th className="py-3 px-4 text-right">Pago Anual Don Juventino</th>
                      <th className="py-3 px-4 text-right font-mono">Saldo por Liquidar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {TABLA_PLAN_BLANDO_PROP2.map((row) => (
                      <tr key={row.periodo} className="hover:bg-teal-50/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-900">{row.periodo}</td>
                        <td className="py-3 px-4 text-stone-600">{row.meses}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-teal-900 bg-teal-50/30">{formatCurrency(row.mensualidadFija)}</td>
                        <td className="py-3 px-4 text-right font-mono font-semibold text-stone-900">{formatCurrency(row.pagoAnualDonJuventino)}</td>
                        <td className="py-3 px-4 text-right font-mono text-stone-600">{formatCurrency(row.saldoRestante)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900 text-xs sm:text-sm">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 uppercase text-xs">Total 3.5 Años (42 Mensualidades)</td>
                      <td className="py-3 px-4 text-right font-mono text-teal-900 font-bold">$150k / mes</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-950 font-extrabold text-sm">{formatCurrency(6300000)}</td>
                      <td className="py-3 px-4 text-right font-mono text-emerald-700 font-extrabold">$0 (Liquidado)</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Resumen Total Recibido */}
            <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-900 block mb-1">
                  Resumen de Liquidación Total para Don Juventino (Opción 2)
                </span>
                <p className="text-xs sm:text-sm text-stone-700">
                  <strong>$5,000,000 MXN</strong> iniciales en efectivo + <strong>$6,300,000 MXN</strong> en 42 mensualidades fijas de $150,000 MXN.
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-xs text-teal-800 block font-medium">Importe Total Acumulado</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-950 font-mono">
                  {formatCurrency(11300000)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 3 Detailed Tab (OPCIÓN 3: INVERSIONISTA 13% ANUAL CON ABONOS A CAPITAL) */}
        {selectedScenario === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-800" />
                  Propuesta 3 en Detalle &bull; Pagos 1 MDP Anuales + Intereses
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Pagos 1 MDP Anuales + Intereses
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  $5 MDP iniciales en efectivo. Para los restantes $4,360,000 MXN: ¿En qué o en dónde va a invertir el capital Don Juventino para que no pierda valor en el banco? Se colocan como Inversionista al 13% anual fijo (muy superior a los pagarés bancarios o Cetes). Recibe sus intereses mes con mes para sus gastos y abonos anuales a capital (4 abonos de $1,000,000 MXN y un último pago de $360,000 MXN), sumando exactamente los $9,360,000 MXN de valuación base más $1,534,000 MXN de intereses al 13%.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Total Acumulado (5 Años)</span>
                <span className="text-2xl font-extrabold text-blue-900 font-mono">{formatCurrency(10894000)}</span>
                <span className="text-[11px] text-blue-700 block mt-0.5">$5 MDP Cash + $4.36 MDP Capital + $1.534 MDP Intereses al 13%</span>
              </div>
            </div>

            {/* Cuadro de Reflexión Estratégica: ¿En qué invertiría el capital? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 text-xs sm:text-sm text-stone-700">
              <div className="flex items-center gap-2 text-blue-950 font-bold">
                <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="text-sm">Pregunta Clave: ¿En qué o en dónde va a invertir el capital Don Juventino?</span>
              </div>
              <p className="leading-relaxed text-stone-600">
                Don Juventino, si recibe todo el dinero junto de golpe, <strong>¿en qué o en dónde lo va a invertir para protegerlo y hacerlo crecer?</strong> En los bancos tradicionales los pagarés ofrecen rendimientos bajos (aprox. 6% a 8%) y descuentan impuestos; si se guarda en cuenta corriente pierde poder adquisitivo frente a la inflación. En cambio, colocando los restantes <strong>$4,360,000 MXN como Inversionista en la panadería</strong> (que sumados a los $5 MDP iniciales completan la <strong>valuación de $9,360,000 MXN</strong>), obtiene un rendimiento preferencial del <strong>13.0% anual fijo (muy superior al banco)</strong> con pagarés mercantiles notariales. Recibe sus intereses mes a mes para sus gastos de retiro y abonos de capital (<strong>4 pagos de $1 MDP y un último pago de $360,000 MXN</strong>), liquidando el 100% en 5 años y acumulando <strong>$10,894,000 MXN</strong> en total.
              </p>
            </div>

            {/* Condiciones principales de la Propuesta 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-xs">Pago Inicial en Efectivo</span>
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                <p className="text-stone-600 text-xs mt-1">De contado a la firma del contrato.</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-xs">Capital como Inversionista</span>
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(4360000)}</span>
                <p className="text-stone-600 text-xs mt-1">4 pagos de $1 MDP + pago final de $360,000 MXN.</p>
              </div>
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
                <span className="text-blue-900 font-semibold block text-xs">Intereses Devengados al 13%</span>
                <span className="text-xl font-bold text-blue-950 font-mono">{formatCurrency(1534000)}</span>
                <p className="text-blue-800 text-xs mt-1">Interés mensual decreciente ($47,233 &rarr; $3,900/mes).</p>
              </div>
            </div>

            {/* Tabla Detallada de Amortización de Pagos Año con Año */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">
                    Calendario Detallado de Pagos de Don Juventino (5 Años / 60 Meses al 13% Anual)
                  </h5>
                  <p className="text-xs text-stone-500">
                    Intereses pagados mensualmente más 4 abonos de $1,000,000 MXN y liquidación final de $360,000 MXN a capital.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full">
                  Tasa Fija 13.0% Anual (Mayor que el Banco)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-stone-100/70 border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Periodo</th>
                      <th className="py-3 px-4 text-right">Saldo Insoluto</th>
                      <th className="py-3 px-4 text-right font-semibold text-blue-900">Interés Mensual</th>
                      <th className="py-3 px-4 text-right">Interés Anual</th>
                      <th className="py-3 px-4 text-right">Abono Capital Fin de Año</th>
                      <th className="py-3 px-4 text-right font-bold text-stone-900 bg-stone-100">Flujo Total Año</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {TABLA_AMORTIZACION_PROP3.map((row) => (
                      <tr key={row.periodo} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-900">{row.periodo}</td>
                        <td className="py-3 px-4 text-right font-mono text-stone-700">{formatCurrency(row.saldoInsoluto)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-blue-900 bg-blue-50/20">{formatCurrency(row.interesMensual)}</td>
                        <td className="py-3 px-4 text-right font-mono text-stone-700">{formatCurrency(row.interesAnual)}</td>
                        <td className="py-3 px-4 text-right font-mono text-stone-700">{formatCurrency(row.amortizacionCapital)}</td>
                        <td className="py-3 px-4 text-right font-mono font-extrabold text-stone-900 bg-stone-50">{formatCurrency(row.flujoTotalAnual)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900 text-xs sm:text-sm">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 uppercase text-xs">Total Saldo Amortizado + Intereses al 13%</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-900 text-xs font-normal">($47,233 &rarr; $3,900/mes)</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-950 font-bold">{formatCurrency(1534000)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(4360000)}</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-950 text-base font-extrabold bg-blue-100/80">
                        {formatCurrency(5894000)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Resumen Total Recibido */}
            <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block mb-1">
                  Resumen de Liquidación Total para Don Juventino (Opción 3)
                </span>
                <p className="text-xs sm:text-sm text-stone-700">
                  <strong>$5,000,000 MXN</strong> iniciales + <strong>$4,360,000 MXN</strong> de capital amortizado + <strong>$1,534,000 MXN</strong> de intereses al 13% anual.
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-xs text-blue-800 block font-medium">Importe Total Acumulado</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-mono">
                  {formatCurrency(10894000)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 4 Detailed Tab (OPCIÓN 4: TRASPASO DE ACTIVOS INMOBILIARIOS + RENTAS) */}
        {selectedScenario === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 mb-2">
                  <Home className="w-4 h-4 text-emerald-800" />
                  Propuesta 4 en Detalle &bull; Traspaso de Activos Inmobiliarios Generando Capital
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Traspaso de Activos Inmobiliarios ($10.4 MDP) + Flujo de Rentas de $53,000/mes
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Don Juventino adquiere la plena propiedad escriturada de 2 bienes raíces residenciales de alta plusvalía en Querétaro (Casa en Tierra Pura de $7 MDP y Departamento en Zákia de $2.4 MDP) actualmente rentados y generando $53,000 MXN mensuales, más $1,000,000 MXN en efectivo de contado a la firma. Los activos iniciales acumulan $10,400,000 MXN y generan rendimientos crecientes por plusvalía y rentas.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200 shrink-0">
                <span className="text-xs text-stone-500 block">Proyección Patrimonial a 5 Años</span>
                <span className="text-2xl font-extrabold text-emerald-950 font-mono">{formatCurrency(corridaPropuesta4[4]?.patrimonioTotal || 17093622)}</span>
                <span className="text-[11px] text-stone-500 font-semibold block mt-0.5 font-sans">(10,400,000 de arranque)</span>
              </div>
            </div>

            {/* Desglose de los 3 Activos Entregados a Don Juventino */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              {/* Activo 1: Casa en Tierra Pura */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50/70 via-white to-white space-y-3 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Home className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Propiedad 1 &bull; Querétaro
                  </span>
                </div>
                <div>
                  <h5 className="font-extrabold text-stone-900 text-base">Casa en Tierra Pura</h5>
                  <p className="text-xs text-stone-500 mt-0.5">Residencial exclusivo de gran demanda</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500 text-xs">Valor Comercial:</span>
                    <span className="text-base font-black text-stone-900 font-mono">{formatCurrency(VALOR_CASA_TIERRA_PURA)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-stone-100">
                    <span className="text-emerald-900 text-xs font-semibold">Renta Mensual Actual:</span>
                    <span className="text-sm font-extrabold text-emerald-900 font-mono">{formatCurrency(RENTA_CASA_TIERRA_PURA)} / mes</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Escrituración notarial al 100% a nombre de Don Juventino. Arrendatario vigente y al corriente en pagos.
                </p>
              </div>

              {/* Activo 2: Depto en Zákia */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-teal-300 bg-gradient-to-br from-teal-50/70 via-white to-white space-y-3 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                    Propiedad 2 &bull; Zákia
                  </span>
                </div>
                <div>
                  <h5 className="font-extrabold text-stone-900 text-base">Departamento en Zákia</h5>
                  <p className="text-xs text-stone-500 mt-0.5">Polo residencial consolidado con parques</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500 text-xs">Valor Comercial:</span>
                    <span className="text-base font-black text-stone-900 font-mono">{formatCurrency(VALOR_DEPTO_ZAKIA)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-stone-100">
                    <span className="text-teal-900 text-xs font-semibold">Renta Mensual Actual:</span>
                    <span className="text-sm font-extrabold text-teal-900 font-mono">{formatCurrency(RENTA_DEPTO_ZAKIA)} / mes</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Excelente ubicación con alta absorción de renta. Se entrega con contrato y depósito de garantía transferido.
                </p>
              </div>

              {/* Activo 3: Efectivo de Contado */}
              <div className="p-4 sm:p-5 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50/70 via-white to-white space-y-3 relative overflow-hidden shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Liquidez Inmediata
                  </span>
                </div>
                <div>
                  <h5 className="font-extrabold text-stone-900 text-base">Efectivo de Contado</h5>
                  <p className="text-xs text-stone-500 mt-0.5">Transferencia íntegra a la firma notarial</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-stone-500 text-xs">Monto en Efectivo:</span>
                    <span className="text-base font-black text-stone-900 font-mono">{formatCurrency(EFECTIVO_INICIAL_PROP4)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1 border-t border-stone-100">
                    <span className="text-amber-900 text-xs font-semibold">Disponibilidad:</span>
                    <span className="text-sm font-extrabold text-amber-900 font-mono">Día 1 ante Notario</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 leading-tight">
                  Capital disponible en cuenta bancaria para proyectos personales, imprevistos o fondo de emergencia.
                </p>
              </div>
            </div>

            {/* Resumen de Activos Acumulados ($10.4 MDP) y Rentas ($53k/mes) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-900 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Total Activos que Acumulan $10.4 MDP de Arranque
                </span>
                <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                  Casa Tierra Pura ($7.0M) + Depto Zákia ($2.4M) + Efectivo ($1.0M) = <strong className="text-white font-mono text-base">{formatCurrency(VALOR_TOTAL_ACTIVOS_PROP4)}</strong> en patrimonio tangible escriturado desde el primer día.
                </p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-xl border border-white/20 shrink-0 text-left sm:text-right">
                <span className="text-[11px] text-stone-300 block font-medium">Renta Mensual Total Inmediata:</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">{formatCurrency(RENTA_MENSUAL_INICIAL_PROP4)} / mes</span>
                <span className="text-[11px] text-stone-400 block mt-0.5 font-sans">${formatCurrency(RENTA_ANUAL_INICIAL_PROP4)}/año inicial</span>
              </div>
            </div>

            {/* Ventajas Clave del Esquema Inmobiliario */}
            <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-3">
              <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Ventajas Patrimoniales de la Propuesta 4 para Don Juventino
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>1. Plusvalía Continua</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Tierra Pura y Zákia son zonas con la mayor plusvalía de Querétaro. Los inmuebles suben de valor año tras año blindando el capital.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-teal-900">
                    <Coins className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>2. Ingresos de $53,000/mes</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Flujo de efectivo pasivo inmediato sin levantarse a las 4:30 AM, sin personal ni presiones de operación de hornos.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <Landmark className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>3. Escrituras Notariales</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Inmuebles 100% a su nombre libres de gravamen, legalmente transmisibles y heredables a su familia con plena certeza.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Banknote className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>4. $1 MDP Efectivo + Rentas</span>
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    Combina liquidez inmediata en mano para disfrutar el retiro con un flujo permanente de rentas para el gasto mensual.
                  </p>
                </div>
              </div>
            </div>

            {/* Corrida Financiera Detallada a 5 Años (Rentas + Plusvalía Moderada) */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs space-y-0">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-emerald-50/30 to-white border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold mb-1">
                    <Calendar className="w-3 h-3 text-emerald-700" />
                    Proyección Financiera Oficial
                  </div>
                  <h5 className="font-extrabold text-stone-900 text-base">
                    Corrida a 5 Años: ¿Cuánto Habría Ganado con Plusvalía Moderada y Rentas?
                  </h5>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Supuestos: Plusvalía conservadora en Querétaro de <strong>{(plusvaliaRateProp4 * 100).toFixed(1)}% anual</strong> sobre $9.4 MDP en inmuebles + ajuste inflacionario de rentas de <strong>{(inflacionRentaRateProp4 * 100).toFixed(1)}% anual</strong>.
                  </p>
                </div>

                {/* Plusvalía Simulator Selector */}
                <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-stone-200 shrink-0">
                  <span className="text-[10px] text-stone-500 font-semibold px-2">Plusvalía Anual:</span>
                  {[0.05, 0.06, 0.07].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setPlusvaliaRateProp4(rate)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        plusvaliaRateProp4 === rate
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {(rate * 100).toFixed(0)}% {rate === 0.06 && '(Moderada)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table of 5 Years Projection */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 border-b border-stone-200 text-stone-700 uppercase text-[10px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-3.5">Periodo</th>
                      <th className="py-3 px-3 text-right font-mono text-emerald-900">Renta Mensual</th>
                      <th className="py-3 px-3 text-right">Rentas Cobradas / Año</th>
                      <th className="py-3 px-3 text-right font-semibold text-emerald-950 bg-emerald-50/30">Rentas Acumuladas</th>
                      <th className="py-3 px-3 text-right text-stone-700">Plusvalía Anual ({((plusvaliaRateProp4 * 100)).toFixed(0)}%)</th>
                      <th className="py-3 px-3 text-right font-semibold text-teal-950 bg-teal-50/30">Plusvalía Acumulada</th>
                      <th className="py-3 px-3 text-right font-mono font-bold text-stone-900">Valor Inmuebles</th>
                      <th className="py-3 px-3.5 text-right font-mono font-black text-emerald-950 bg-emerald-100/50">Total Patrimonio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {corridaPropuesta4.map((row) => (
                      <tr key={row.year} className="hover:bg-emerald-50/20 transition-colors">
                        <td className="py-3 px-3.5 font-bold text-stone-900">
                          {row.periodo}
                          <span className="block text-[10px] text-stone-500 font-normal">{row.meses}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-900">
                          {formatCurrency(row.rentaMensual)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-stone-700">
                          {formatCurrency(row.rentasAnuales)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-950 bg-emerald-50/30">
                          {formatCurrency(row.rentasAcumuladas)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-stone-700">
                          +{formatCurrency(row.plusvaliaGanadaAnual)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-teal-950 bg-teal-50/30">
                          +{formatCurrency(row.plusvaliaAcumulada)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-stone-900">
                          {formatCurrency(row.valorInmuebles)}
                        </td>
                        <td className="py-3 px-3.5 text-right font-mono font-black text-emerald-950 bg-emerald-100/40 text-sm">
                          {formatCurrency(row.patrimonioTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900 text-xs">
                    <tr>
                      <td className="py-3 px-3.5 uppercase font-bold text-[11px]">Gran Total 5 Años</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-900 text-[11px]">$53k &rarr; $64k/m</td>
                      <td className="py-3 px-3 text-right font-mono text-stone-500 text-[10px]">(60 mensualidades)</td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-950 font-extrabold bg-emerald-100/60">
                        {formatCurrency(corridaPropuesta4[4]?.rentasAcumuladas || 0)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-stone-500 text-[10px]">({((plusvaliaRateProp4 * 100)).toFixed(0)}% anual)</td>
                      <td className="py-3 px-3 text-right font-mono text-teal-950 font-extrabold bg-teal-100/60">
                        +{formatCurrency(corridaPropuesta4[4]?.plusvaliaAcumulada || 0)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-stone-950 font-extrabold">
                        {formatCurrency(corridaPropuesta4[4]?.valorInmuebles || 0)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-mono text-emerald-950 text-base font-black bg-emerald-200/80">
                        {formatCurrency(corridaPropuesta4[4]?.patrimonioTotal || 0)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Bottom Breakdown of 5-Year Gain */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 via-teal-50/40 to-white border-t border-stone-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200">
                    <span className="text-stone-500 block text-[11px]">Efectivo Inicial Recibido</span>
                    <span className="text-base font-extrabold text-stone-900 font-mono">{formatCurrency(EFECTIVO_INICIAL_PROP4)}</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">En mano desde el día 1</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <span className="text-emerald-900 block text-[11px] font-semibold">Total Rentas Cobradas (5 Años)</span>
                    <span className="text-base font-extrabold text-emerald-950 font-mono">{formatCurrency(corridaPropuesta4[4]?.rentasAcumuladas || 0)}</span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">Líquido mes con mes en cuenta</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-teal-200">
                    <span className="text-teal-900 block text-[11px] font-semibold">Plusvalía Inmuebles Ganada (5 Años)</span>
                    <span className="text-base font-extrabold text-teal-950 font-mono">+{formatCurrency(corridaPropuesta4[4]?.plusvaliaAcumulada || 0)}</span>
                    <span className="text-[10px] text-teal-700 block mt-0.5">Aumento de valor escriturado</span>
                  </div>

                  <div className="p-3 bg-emerald-600 text-white rounded-xl shadow-xs">
                    <span className="text-emerald-100 block text-[11px] font-bold uppercase tracking-wider">Patrimonio Total en 5 Años</span>
                    <span className="text-lg font-black text-white font-mono">{formatCurrency(corridaPropuesta4[4]?.patrimonioTotal || 0)}</span>
                    <span className="text-[10px] text-emerald-100 block mt-0.5">Ganancia neta: +{formatCurrency((corridaPropuesta4[4]?.patrimonioTotal || 0) - VALOR_TOTAL_ACTIVOS_PROP4)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action button to select / confirm this scenario */}
        <div className="mt-4 pt-3.5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-600 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Don Juventino puede elegir cualquiera de estas 4 opciones según su plan de vida y necesidades financieras.
            </span>
          </div>

          <button
            onClick={() => setConfirmedChoice(selectedScenario)}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
              confirmedChoice === selectedScenario
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm'
            }`}
          >
            {confirmedChoice === selectedScenario ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Opción {selectedScenario} Seleccionada por Don Juventino</span>
              </>
            ) : (
              <>
                <span>Elegir Opción {selectedScenario} como Preferencia</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Confirmation banner if chosen */}
        {confirmedChoice && (
          <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Preferencia Registrada: Opción {confirmedChoice} (
                {confirmedChoice === 1 && 'Adquisición Directa en $9,360,000 MXN - Oferta de $8,500,000 MXN de Contado'}
                {confirmedChoice === 2 && 'Financiamiento a 42 Meses (3.5 Años) - $11,300,000 MXN Total ($150,000/mes fijos)'}
                {confirmedChoice === 3 && 'Pagos 1 MDP Anuales + Intereses ($4.36 MDP Cap. + $1.534 MDP Int.) - $10,894,000 MXN Total'}
                {confirmedChoice === 4 && 'Traspaso de Activos Inmobiliarios (~$17.1 MDP a 5 Años - 10,400 de arranque) - Casa Tierra Pura + Depto Zákia + $1M Cash & Rentas'}
              )</strong>
              <p className="mt-0.5 text-stone-700 text-xs">
                Esta alternativa será la base para la redacción del convenio formal y calendarización notarial. Puede cambiar de opción en cualquier momento haciendo clic en otra tarjeta a la izquierda.
              </p>
            </div>
          </div>
        )}
          </>
        )}
          </div>
        </div>
      </div>

      {/* 4. COMPARATIVE TABLE SUMMARY (Cuadro Comparativo: ¿Cuál le conviene más?) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 border-b border-stone-200 bg-gradient-to-r from-stone-50 via-amber-50/30 to-white">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2">
              <FileText className="w-3.5 h-3.5 text-amber-800" />
              Cuadro Comparativo Oficial
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              Tabla Comparativa: ¿Cuál Alternativa le Conviene más a Don Juventino?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Contraste directo, transparente y fácil de leer entre las 4 alternativas: pago inicial, mensualidades, abonos de capital, totales y garantías legales.
            </p>
          </div>
          <button
            onClick={() => setIsPrintDocOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
            title="Descargar este resumen comparativo y las 4 propuestas en formato PDF profesional"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Descargar Resumen y 4 Cartas en PDF</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-100/90 border-b border-stone-200 text-stone-700 uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 w-1/5">Concepto Clave</th>
                <th
                  onClick={() => { setSelectedScenario(1); handleOpenProposal(1); }}
                  className={`py-3.5 px-3 text-center cursor-pointer transition-colors hover:bg-amber-100/40 w-1/5 ${selectedScenario === 1 ? 'bg-amber-100/70 font-bold text-amber-950 ring-1 ring-amber-300' : ''}`}
                  title="Clic para seleccionar y abrir Propuesta 1"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>PROPUESTA 1</span>
                    {!openedProposals[1] ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 font-normal">Tapada</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 font-bold">Abierta</span>
                    )}
                  </div>
                  <span className="text-[10px] font-normal block text-stone-500 mt-0.5">Contado Inmediato</span>
                </th>
                <th
                  onClick={() => { setSelectedScenario(2); handleOpenProposal(2); }}
                  className={`py-3.5 px-3 text-center cursor-pointer transition-colors hover:bg-teal-100/40 w-1/5 ${selectedScenario === 2 ? 'bg-teal-100/70 font-bold text-teal-950 ring-1 ring-teal-300' : ''}`}
                  title="Clic para seleccionar y abrir Propuesta 2"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>PROPUESTA 2</span>
                    {!openedProposals[2] ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 font-normal">Tapada</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-teal-200 text-teal-900 font-bold">Abierta</span>
                    )}
                  </div>
                  <span className="text-[10px] font-normal block text-stone-500 mt-0.5">42 Meses Fijos</span>
                </th>
                <th
                  onClick={() => { setSelectedScenario(3); handleOpenProposal(3); }}
                  className={`py-3.5 px-3 text-center cursor-pointer transition-colors hover:bg-blue-100/40 w-1/5 ${selectedScenario === 3 ? 'bg-blue-100/70 font-bold text-blue-950 ring-1 ring-blue-300' : ''}`}
                  title="Clic para seleccionar y abrir Propuesta 3"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>PROPUESTA 3</span>
                    {!openedProposals[3] ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 font-normal">Tapada</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-blue-200 text-blue-900 font-bold">Abierta</span>
                    )}
                  </div>
                  <span className="text-[10px] font-normal block text-stone-500 mt-0.5">Pagos 1 MDP Anuales + Intereses</span>
                </th>
                <th
                  onClick={() => { setSelectedScenario(4); handleOpenProposal(4); }}
                  className={`py-3.5 px-3 text-center cursor-pointer transition-colors hover:bg-emerald-100/40 w-1/5 ${selectedScenario === 4 ? 'bg-emerald-100/70 font-bold text-emerald-950 ring-1 ring-emerald-300' : ''}`}
                  title="Clic para seleccionar y abrir Propuesta 4"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>PROPUESTA 4</span>
                    {!openedProposals[4] ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 font-normal">Tapada</span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-bold">Abierta</span>
                    )}
                  </div>
                  <span className="text-[10px] font-normal block text-stone-500 mt-0.5">Activos Inmobiliarios</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80">
              {/* 0. Valuación Base de Referencia */}
              <tr className="bg-stone-50/80 hover:bg-stone-100/60 transition-colors">
                <td className="py-3 px-4 sm:px-6 font-bold text-stone-900">
                  Valuación Base de Referencia
                  <span className="block text-[10px] text-stone-500 font-normal font-sans">(Base común para las 4 alternativas)</span>
                </td>
                <td className={`py-3 px-3 text-center font-mono font-extrabold text-amber-950 ${selectedScenario === 1 ? 'bg-amber-100/60 ring-1 ring-amber-300' : ''}`}>
                  <span>$9,360,000 MXN</span>
                  <span className="text-[10px] font-semibold text-amber-800 block mt-0.5">Oferta cash: $8.5 MDP</span>
                </td>
                <td className={`py-3 px-3 text-center font-mono font-bold text-teal-950 ${selectedScenario === 2 ? 'bg-teal-100/60 ring-1 ring-teal-300' : ''}`}>
                  <span>$9,360,000 MXN</span>
                  <span className="text-[10px] font-semibold text-teal-800 block mt-0.5">Total diferido: $11.3 MDP</span>
                </td>
                <td className={`py-3 px-3 text-center font-mono font-bold text-blue-950 ${selectedScenario === 3 ? 'bg-blue-100/60 ring-1 ring-blue-300' : ''}`}>
                  <span>$9,360,000 MXN</span>
                  <span className="text-[10px] font-semibold text-blue-800 block mt-0.5">Total con 13%: $10.89 MDP</span>
                </td>
                <td className={`py-3 px-3 text-center font-mono font-bold text-emerald-950 ${selectedScenario === 4 ? 'bg-emerald-100/60 ring-1 ring-emerald-300' : ''}`}>
                  <span>$9,360,000 MXN</span>
                  <span className="text-[10px] font-semibold text-emerald-800 block mt-0.5">Activos: $10.4 MDP</span>
                </td>
              </tr>

              {/* 1. Pago Inicial en Efectivo */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">
                  Pago Inicial en Efectivo (Día 1)
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-stone-900 ${selectedScenario === 1 ? 'bg-amber-50/50 text-amber-950' : ''}`}>
                  <span className="text-base text-stone-950">$8,500,000 MXN</span>
                  <span className="text-[10px] font-normal text-stone-500 block mt-0.5">(100% de contado ante notario)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-teal-950 ${selectedScenario === 2 ? 'bg-teal-50/50' : ''}`}>
                  <span className="text-base text-teal-950">$5,000,000 MXN</span>
                  <span className="text-[10px] font-normal text-stone-500 block mt-0.5">(de contado a la firma)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-blue-950 ${selectedScenario === 3 ? 'bg-blue-50/50' : ''}`}>
                  <span className="text-base text-blue-950">$5,000,000 MXN</span>
                  <span className="text-[10px] font-normal text-stone-500 block mt-0.5">(de contado a la firma)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-emerald-950 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  <span className="text-base text-emerald-950">$1,000,000 MXN</span>
                  <span className="text-[10px] font-normal text-stone-500 block mt-0.5">+ 2 Inmuebles ($9.4 MDP)</span>
                </td>
              </tr>

              {/* 2. Flujo Mensual para Don Juventino */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">
                  Flujo Mensual para Don Juventino
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-500 ${selectedScenario === 1 ? 'bg-amber-50/50' : ''}`}>
                  N/A
                  <span className="text-[10px] text-stone-400 block mt-0.5">(recibe el 100% de inicio)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-teal-900 ${selectedScenario === 2 ? 'bg-teal-50/50' : ''}`}>
                  <span className="text-sm font-black">$150,000 MXN / mes</span>
                  <span className="text-[10px] font-semibold text-teal-700 block mt-0.5">(fijos e idénticos por 42 meses)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-blue-950 ${selectedScenario === 3 ? 'bg-blue-50/50' : ''}`}>
                  <span className="text-xs font-bold text-blue-900">$47,233 &rarr; $3,900 / mes</span>
                  <span className="text-[10px] font-normal text-blue-700 block mt-0.5">(intereses al 13% según saldo)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-emerald-950 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  <span className="text-sm font-black text-emerald-900">$53,000 MXN / mes</span>
                  <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">(Tierra Pura $40k + Zákia $13k)</span>
                </td>
              </tr>

              {/* 3. Abono Anual de Capital */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">
                  Abono Anual de Capital
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-500 ${selectedScenario === 1 ? 'bg-amber-50/50' : ''}`}>
                  N/A
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-600 ${selectedScenario === 2 ? 'bg-teal-50/50' : ''}`}>
                  Incluido en mensualidades
                  <span className="text-[10px] text-teal-700 block mt-0.5">($150,000/mes continuos)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-blue-900 ${selectedScenario === 3 ? 'bg-blue-50/50' : ''}`}>
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 border border-blue-300 font-extrabold text-blue-950">
                    4 de $1 MDP + $360k
                  </span>
                  <span className="text-[10px] text-blue-700 block mt-0.5">(cada fin de año directo a capital)</span>
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-600 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  <span className="font-semibold text-emerald-900">Plusvalía Inmobiliaria</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">(+6.0% anual moderada)</span>
                </td>
              </tr>

              {/* 4. Plazo Total */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">
                  Plazo Total del Esquema
                </td>
                <td className={`py-3.5 px-3 text-center ${selectedScenario === 1 ? 'bg-amber-50/50 font-semibold' : ''}`}>
                  Inmediato (1 sola exhibición)
                </td>
                <td className={`py-3.5 px-3 text-center font-bold text-teal-900 ${selectedScenario === 2 ? 'bg-teal-50/50' : ''}`}>
                  42 meses (3.5 años)
                </td>
                <td className={`py-3.5 px-3 text-center font-bold text-blue-900 ${selectedScenario === 3 ? 'bg-blue-50/50' : ''}`}>
                  5 años (60 meses)
                </td>
                <td className={`py-3.5 px-3 text-center font-bold text-emerald-900 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  Patrimonial Permanente
                  <span className="text-[10px] font-normal text-stone-500 block mt-0.5">(5 años corrida: +$6.7 MDP)</span>
                </td>
              </tr>

              {/* 5. Monto Total a Percibir */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-bold text-stone-900">
                  Monto Total a Percibir (Bolsa)
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-stone-950 ${selectedScenario === 1 ? 'bg-amber-50/50 text-amber-950' : ''}`}>
                  <div className="text-base sm:text-lg font-black">{formatCurrency(8500000)}</div>
                  <span className="text-[10px] text-stone-500 block font-normal font-sans">líquidos en mano</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-teal-950 ${selectedScenario === 2 ? 'bg-teal-50/50' : ''}`}>
                  <div className="text-base sm:text-lg font-black">{formatCurrency(11300000)}</div>
                  <span className="text-[10px] text-teal-700 block font-normal font-sans">$5 MDP cash + $6.3 MDP cuotas</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-blue-950 ${selectedScenario === 3 ? 'bg-blue-50/50' : ''}`}>
                  <div className="text-base sm:text-lg font-black">{formatCurrency(10894000)}</div>
                  <span className="text-[10px] text-blue-700 block font-normal font-sans">$5M cash + $4.36M cap. + $1.53M int. 13%</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-emerald-950 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  <div className="text-base sm:text-lg font-black">{formatCurrency(corridaPropuesta4[4]?.patrimonioTotal || 17093622)}</div>
                  <span className="text-[10px] text-stone-500 block font-normal font-sans">10,400 de arranque</span>
                </td>
              </tr>

              {/* 6. Rol y Propiedad de Don Juventino */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">
                  Propiedad y Rol de Don Juventino
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-700 text-xs ${selectedScenario === 1 ? 'bg-amber-50/50 font-medium' : ''}`}>
                  Retiro total definitivo sin obligaciones ni pendientes.
                </td>
                <td className={`py-3.5 px-3 text-center text-teal-950 text-xs ${selectedScenario === 2 ? 'bg-teal-50/50 font-medium' : ''}`}>
                  Acreedor preferente con pagarés notariales, retiro operativo pleno.
                </td>
                <td className={`py-3.5 px-3 text-center text-blue-950 text-xs ${selectedScenario === 3 ? 'bg-blue-50/50 font-medium' : ''}`}>
                  Inversionista patrimonial ganando 13% anual fijo (superior al banco).
                </td>
                <td className={`py-3.5 px-3 text-center text-emerald-950 text-xs ${selectedScenario === 4 ? 'bg-emerald-50/50 font-medium' : ''}`}>
                  Dueño del 100% de 2 propiedades residenciales rentadas generando flujo pasivo.
                </td>
              </tr>

              {/* 7. Garantía Notarial y Legal */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">
                  Garantía y Certeza Legal
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-700 text-xs ${selectedScenario === 1 ? 'bg-amber-50/50 font-medium' : ''}`}>
                  Transferencia bancaria de contado y finiquito notariado.
                </td>
                <td className={`py-3.5 px-3 text-center text-teal-900 text-xs ${selectedScenario === 2 ? 'bg-teal-50/50 font-medium' : ''}`}>
                  42 pagarés mercantiles notariales por $150,000 MXN cada uno.
                </td>
                <td className={`py-3.5 px-3 text-center text-blue-900 text-xs ${selectedScenario === 3 ? 'bg-blue-50/50 font-medium' : ''}`}>
                  Contrato de inversión mutuo y pagarés notariales al 13% anual.
                </td>
                <td className={`py-3.5 px-3 text-center text-emerald-900 text-xs ${selectedScenario === 4 ? 'bg-emerald-50/50 font-medium' : ''}`}>
                  Escrituras notariales públicas libres de gravamen + contratos de arrendamiento vigentes.
                </td>
              </tr>

              {/* 8. ¿Para quién es ideal? / ¿Cuál le conviene? */}
              <tr className="bg-stone-50/90 font-medium">
                <td className="py-4 px-4 sm:px-6 font-bold text-stone-900">
                  ¿Cuál le conviene más?
                </td>
                <td className={`py-4 px-3 text-xs leading-relaxed text-stone-700 ${selectedScenario === 1 ? 'bg-amber-100/60' : ''}`}>
                  <span className="font-bold text-stone-900 block mb-1">Si busca desentenderse hoy:</span>
                  Dispone de todo el capital líquido de inmediato sin esperar plazos ni calendarios.
                </td>
                <td className={`py-4 px-3 text-xs leading-relaxed text-stone-700 ${selectedScenario === 2 ? 'bg-teal-100/60' : ''}`}>
                  <span className="font-bold text-teal-950 block mb-1">Si busca $5 MDP + Sueldo fijo:</span>
                  Recibe un gran inicial y asegura $150k mensuales por 3.5 años acumulando $11.3 MDP.
                </td>
                <td className={`py-4 px-3 text-xs leading-relaxed text-stone-700 ${selectedScenario === 3 ? 'bg-blue-100/60' : ''}`}>
                  <span className="font-bold text-blue-950 block mb-1">Si quiere hacer crecer el capital:</span>
                  Gana 13% anual fijo, con abonos a capital (4 de $1 MDP y $360k) acumulando $10.89 MDP.
                </td>
                <td className={`py-4 px-3 text-xs leading-relaxed text-stone-700 ${selectedScenario === 4 ? 'bg-emerald-100/60' : ''}`}>
                  <span className="font-bold text-emerald-950 block mb-1">Si busca activos de ladrillo y rentas:</span>
                  Adquiere $10.4 MDP de arranque en propiedades y efectivo, cobrando $53k/mes y acumulando más de $17.0 MDP en 5 años.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. CONCLUSION & NEXT STEPS */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-10 space-y-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Conclusión y Próximos Pasos
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Don Juventino, nuestra intención es que este proceso sea un reflejo íntegro del respeto y agradecimiento que le tenemos por su trayectoria. Lo invitamos cordialmente a revisar estas alternativas con plena apertura para afinar detalles, resolver inquietudes o definir los tiempos de formalización legal que mejor se adapten a su conveniencia.
          </p>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
            Quedamos a su entera disposición para reunirnos y dar el siguiente paso con la alternativa de su preferencia.
          </p>
        </div>

        {/* Bottom CTA & Print */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Documento confidencial &bull; Panadería Santa Fé</span>
          </div>
          <button
            onClick={() => setIsPrintDocOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Descargar en PDF / Imprimir Documento Completo</span>
          </button>
        </div>
      </div>
      </>
      )}

      {/* Dedicated Executive Printable / PDF Document Modal */}
      {isPrintDocOpen && (
        <PrintProposalDocument
          confirmedChoice={confirmedChoice}
          onClose={() => setIsPrintDocOpen(false)}
        />
      )}
    </div>
  );
};

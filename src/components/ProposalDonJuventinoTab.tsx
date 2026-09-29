import React, { useState } from 'react';
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
  Download
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

// Opción 3: $5 MDP invertidos al 13% anual fijo, abonos anuales de $1 MDP a capital
const TABLA_AMORTIZACION_PROP3: AmortizacionRow[] = [
  { periodo: 'Año 1', saldoInsoluto: 5000000, interesMensual: 54167, interesAnual: 650000, amortizacionCapital: 1000000, flujoTotalAnual: 1650000 },
  { periodo: 'Año 2', saldoInsoluto: 4000000, interesMensual: 43333, interesAnual: 520000, amortizacionCapital: 1000000, flujoTotalAnual: 1520000 },
  { periodo: 'Año 3', saldoInsoluto: 3000000, interesMensual: 32500, interesAnual: 390000, amortizacionCapital: 1000000, flujoTotalAnual: 1390000 },
  { periodo: 'Año 4', saldoInsoluto: 2000000, interesMensual: 21667, interesAnual: 260000, amortizacionCapital: 1000000, flujoTotalAnual: 1260000 },
  { periodo: 'Año 5', saldoInsoluto: 1000000, interesMensual: 10833, interesAnual: 130000, amortizacionCapital: 1000000, flujoTotalAnual: 1130000 },
];

interface PlanBlandoRow {
  periodo: string;
  meses: string;
  mensualidadFija: number;
  pagoAnualDonJuventino: number;
  colchonOperativoMensual: number;
  colchonOperativoAnual: number;
  saldoRestante: number;
}

// Opción 2: 42 meses (3.5 años) a $150,000 MXN mensuales = $6.3 MDP diferidos + $5 MDP inicial = $11,300,000 MXN
const TABLA_PLAN_BLANDO_PROP2: PlanBlandoRow[] = [
  { periodo: 'Año 1', meses: 'Meses 1 al 12', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, colchonOperativoMensual: 120881, colchonOperativoAnual: 1450572, saldoRestante: 4500000 },
  { periodo: 'Año 2', meses: 'Meses 13 al 24', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, colchonOperativoMensual: 120881, colchonOperativoAnual: 1450572, saldoRestante: 2700000 },
  { periodo: 'Año 3', meses: 'Meses 25 al 36', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, colchonOperativoMensual: 120881, colchonOperativoAnual: 1450572, saldoRestante: 900000 },
  { periodo: 'Año 4 (6 meses)', meses: 'Meses 37 al 42', mensualidadFija: 150000, pagoAnualDonJuventino: 900000, colchonOperativoMensual: 120881, colchonOperativoAnual: 725286, saldoRestante: 0 },
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
  
  // Interactive slider for Scenario 3 utility simulation
  const [simulatedUtility, setSimulatedUtility] = useState<number>(233333);

  // Mínimo de $35,000 mensuales garantizados por un periodo forzoso mínimo de 10 años y vitalicio
  const MIN_PENSION_MENSUAL = 35000;
  const rawCalculatedPension = Math.round(simulatedUtility * 0.15);
  const calculatedPensionMensual = Math.max(MIN_PENSION_MENSUAL, rawCalculatedPension);
  const calculatedPensionAnual = calculatedPensionMensual * 12;

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
                      Adquisición Directa de Contado
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-amber-100/90 leading-tight truncate">
                      100% ante notario en una sola exhibición
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
                      Adquisición Directa de Contado
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 leading-tight truncate">
                      100% ante notario en una sola exhibición
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

            {/* Card 3: Inversionista 13% (Blue / Zafiro) */}
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
                    PROPUESTA 3 &bull; Inversionista 13%
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
                      Inversión Patrimonial al 13%
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-blue-100/90 leading-tight truncate">
                      Rendimiento anual fijo con abonos a capital
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
                    PROPUESTA 3 &bull; Inversionista 13%
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
                      Inversión Patrimonial al 13%
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 leading-tight truncate">
                      Rendimiento anual fijo con abonos a capital
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

            {/* Card 4: Sociedad Vitalicia (Emerald / Esmeralda) */}
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
                    <HeartHandshake className="w-3 h-3 text-emerald-200" />
                    PROPUESTA 4 &bull; Sociedad 13%
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-100 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-300/30">
                    <EyeOff className="w-2.5 h-2.5 text-emerald-200" />
                    Carta tapada
                  </span>
                </div>

                <div className="flex items-center gap-2 my-0.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/50 text-emerald-200 border border-emerald-300/40 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight group-hover:text-emerald-100 transition-colors">
                      Sociedad Patrimonial (13%)
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-emerald-100/90 leading-tight truncate">
                      Ingreso mensual vitalicio no heredado
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
                    <HeartHandshake className="w-3 h-3 text-emerald-800" />
                    PROPUESTA 4 &bull; Sociedad 13%
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
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-extrabold text-stone-900 leading-tight">
                      Sociedad Patrimonial (13%)
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-stone-600 leading-tight truncate">
                      Ingreso mensual vitalicio no heredado
                    </p>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-stone-200/80 flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-900 flex items-center gap-0.5">
                    {selectedScenario === 4 ? 'Viendo corrida a un lado' : 'Ver corrida a un lado'}
                    <ChevronRight className="w-3 h-3 text-emerald-700" />
                  </span>
                  <span className="text-stone-500 font-medium">Vitalicio</span>
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 mb-2">
                  <Banknote className="w-4 h-4 text-amber-800" />
                  Propuesta 1 en Detalle
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Adquisición Directa de Contado (Liquidez Inmediata en Efectivo)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Orientada a brindarle certidumbre financiera absoluta y disponibilidad inmediata de fondos en una sola exhibición.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Pago 100% Líquido</span>
                <span className="text-2xl font-extrabold text-stone-900 font-mono">{formatCurrency(8500000)}</span>
              </div>
            </div>

            {/* Justificación de Valuación de Mercado */}
            <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h4>Justificación Técnica de Valuación de Mercado ($9,000,000 MXN)</h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                La valuación técnica del establecimiento se sitúa en <strong>$9,000,000 MXN</strong>, calculada con base en los múltiplos de mercado estándar para empresas y comercios tradicionales en marcha dentro del sector de alimentos y panificación, los cuales oscilan habitualmente entre <strong>3 y 4 veces la utilidad neta anual</strong>:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Utilidad Base Mensual</span>
                  <span className="text-base font-bold text-stone-900 font-mono">{formatCurrency(230000)}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Promedio neto mensual</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Utilidad Neta Anual</span>
                  <span className="text-base font-bold text-stone-900 font-mono">{formatCurrency(2760000)}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">$230,000 &times; 12 meses</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[11px]">Rango Múltiplos (3x - 4x)</span>
                  <span className="text-base font-bold text-stone-900 font-mono">$8.28M &ndash; $11.04M</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">3.0x a 4.0x utilidad neta</span>
                </div>
                <div className="bg-amber-100/60 p-3.5 rounded-xl border border-amber-300">
                  <span className="text-amber-900 block text-[11px] font-bold">Valuación Fijada</span>
                  <span className="text-base font-extrabold text-amber-950 font-mono">{formatCurrency(9000000)}</span>
                  <span className="text-[10px] text-amber-800 block mt-0.5">Múltiplo de mercado objetivo (3.26x)</span>
                </div>
              </div>
            </div>

            {/* Condiciones de la Oferta Cash */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-3">
                <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Condiciones Operativas y Legales
                </h5>
                <ul className="space-y-2.5 text-stone-600">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Valuación del negocio:</span>
                    <span>$9,000,000 MXN</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Monto en efectivo (Cash):</span>
                    <span className="font-bold text-emerald-700 font-mono">$8,500,000 MXN</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Forma de liquidación:</span>
                    <span>Pago íntegro de contado a la firma del contrato y entrega de la unidad.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-stone-900 min-w-36">Saldo pendiente:</span>
                    <span className="font-semibold text-stone-900">$0 MXN (sin plazos diferidos ni exposición crediticia).</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-3">
                <h5 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  Beneficios Inmediatos para Don Juventino
                </h5>
                <ul className="space-y-2 text-stone-700 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span><strong>Disponibilidad inmediata:</strong> $8,500,000 MXN líquidos en su cuenta bancaria desde el día uno.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span><strong>Cero contingencias futuras:</strong> Sin depender de utilidades mensuales, ventas o fluctuaciones de mercado.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <span><strong>Retiro pleno y digno:</strong> Cierre expedito de la operación y deslinde total de compromisos operativos y fiscales.</span>
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
                  Esquema equilibrado de 42 meses (3.5 años) pagando $150,000 MXN fijos al mes. Esta alternativa suma $6,300,000 MXN en pagos diferidos que, sumados a los $5,000,000 MXN iniciales de contado, alcanzan un total acumulado de $11,300,000 MXN para Don Juventino, garantizando a la vez un colchón operativo mensual de $120,881 MXN libres para contingencias de la panadería.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Total Acumulado a Percibir</span>
                <span className="text-2xl font-extrabold text-teal-950 font-mono">{formatCurrency(11300000)}</span>
                <span className="text-[11px] text-teal-700 block mt-0.5">$5 MDP Cash + $6.3 MDP en 42 Meses</span>
              </div>
            </div>

            {/* Condiciones principales de la Propuesta 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
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
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
                <span className="text-amber-900 font-semibold block text-xs">Colchón Operativo Panadería</span>
                <span className="text-xl font-bold text-amber-950 font-mono">{formatCurrency(120881)} <span className="text-xs font-normal">/mes</span></span>
                <p className="text-amber-800 text-xs mt-1">Reserva libre para mantenimiento e imprevistos.</p>
              </div>
            </div>

            {/* Justificación de Equilibrio Financiero: ¿Por qué 42 meses a $150k? */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-700" />
                El Equilibrio Perfecto: 42 Meses a $150,000 MXN ($11,300,000 MXN Totales)
              </h5>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Esta alternativa equilibra un flujo de efectivo sumamente atractivo para Don Juventino con la viabilidad operativa de las dos sucursales. Con <strong>42 meses a $150,000 MXN mensuales</strong> se logra una fórmula ganar-ganar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-teal-900 block">Beneficio para Don Juventino:</span>
                  <p className="text-stone-600">
                    Recibe <strong>$150,000 MXN mensuales garantizados</strong> durante 42 meses continuos (3.5 años), sumando <strong>$6,300,000 MXN</strong>. Con los $5,000,000 MXN iniciales de contado, percibe un total de <strong>$11,300,000 MXN</strong> en su bolsa.
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Beneficio Operativo para la Panadería:</span>
                  <p className="text-stone-600">
                    De la utilidad mensual normalizada de $270,881 MXN, tras pagar la mensualidad de $150,000 MXN a Don Juventino, restan <strong>$120,881 MXN mensuales libres ($1,450,572 MXN al año)</strong> de colchón de seguridad para refacciones de hornos, materias primas y contingencias.
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
                      <th className="py-3 px-4 text-right text-amber-900 font-semibold bg-amber-50/50">Colchón Mensual Negocio</th>
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
                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-900 bg-amber-50/40">
                          {formatCurrency(row.colchonOperativoMensual)} <span className="text-[10px] text-stone-500 font-normal">({formatCurrency(row.colchonOperativoAnual)}/año)</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-stone-600">{formatCurrency(row.saldoRestante)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900 text-xs sm:text-sm">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 uppercase text-xs">Total 3.5 Años (42 Mensualidades)</td>
                      <td className="py-3 px-4 text-right font-mono text-teal-900 font-bold">$150k / mes</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-950 font-extrabold text-sm">{formatCurrency(6300000)}</td>
                      <td className="py-3 px-4 text-right font-mono text-amber-950 font-extrabold bg-amber-100/60">
                        {formatCurrency(5076990)} <span className="text-[10px] font-normal block text-amber-900">(reserva total panadería)</span>
                      </td>
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
                  Propuesta 3 en Detalle &bull; Rol Inversionista 13% Anual con Abonos a Capital
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Inversión Patrimonial al 13% Anual con Abono Anual de $1 MDP a Capital
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  $5 MDP iniciales en efectivo. Para los otros $5 MDP: ¿En qué o en dónde va a invertir el capital Don Juventino para que no pierda valor en el banco? Se colocan como Inversionista al 13% anual fijo (muy superior a los pagarés bancarios o Cetes). Recibe sus intereses mes con mes para sus gastos y, al final de cada año, un anticipo de $1 MDP a capital, por lo que el interés va bajando año con año conforme disminuye el saldo.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Total Acumulado (5 Años)</span>
                <span className="text-2xl font-extrabold text-blue-900 font-mono">{formatCurrency(11950000)}</span>
                <span className="text-[11px] text-blue-700 block mt-0.5">$5 MDP Cash + $5 MDP Capital + $1.95 MDP Intereses al 13%</span>
              </div>
            </div>

            {/* Cuadro de Reflexión Estratégica: ¿En qué invertiría el capital? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 text-xs sm:text-sm text-stone-700">
              <div className="flex items-center gap-2 text-blue-950 font-bold">
                <HelpCircle className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="text-sm">Pregunta Clave: ¿En qué o en dónde va a invertir el capital Don Juventino?</span>
              </div>
              <p className="leading-relaxed text-stone-600">
                Don Juventino, si recibe todo el dinero junto de golpe, <strong>¿en qué o en dónde lo va a invertir para protegerlo y hacerlo crecer?</strong> En los bancos tradicionales los pagarés ofrecen rendimientos bajos (aprox. 6% a 8%) y descuentan impuestos; si se guarda en cuenta corriente pierde poder adquisitivo frente a la inflación. En cambio, colocando los otros <strong>$5,000,000 MXN como Inversionista en la panadería</strong>, obtiene un rendimiento preferencial del <strong>13.0% anual fijo (mucho mayor y superior que el banco)</strong> con pagarés mercantiles notariales. Recibe sus intereses mes a mes para sus gastos de retiro y, al final de cada año, se le entrega un abono de <strong>$1,000,000 MXN directo a capital</strong>. Al amortizarse capital año con año, el monto de intereses va bajando de forma programada y ordenada hasta liquidar el 100% en 5 años.
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
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                <p className="text-stone-600 text-xs mt-1">Pagarés notariales con abonos de $1 MDP a fin de año.</p>
              </div>
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
                <span className="text-blue-900 font-semibold block text-xs">Intereses Devengados al 13%</span>
                <span className="text-xl font-bold text-blue-950 font-mono">{formatCurrency(1950000)}</span>
                <p className="text-blue-800 text-xs mt-1">Interés mensual decreciente ($54,167 &rarr; $10,833/mes).</p>
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
                    Intereses pagados mensualmente más abonos anuales de capital de $1,000,000 MXN a fin de cada año.
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
                      <td className="py-3 px-4 text-right font-mono text-blue-900 text-xs font-normal">($54,167 &rarr; $10,833/mes)</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-950 font-bold">{formatCurrency(1950000)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(5000000)}</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-950 text-base font-extrabold bg-blue-100/80">
                        {formatCurrency(6950000)}
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
                  <strong>$5,000,000 MXN</strong> iniciales + <strong>$5,000,000 MXN</strong> de capital amortizado + <strong>$1,950,000 MXN</strong> de intereses al 13% anual.
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-xs text-blue-800 block font-medium">Importe Total Acumulado</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-mono">
                  {formatCurrency(11950000)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 4 Detailed Tab (OPCIÓN 4: SOCIEDAD 13% CON INGRESO VITALICIO NO HEREDADO) */}
        {selectedScenario === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 mb-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-800" />
                  Propuesta 4 en Detalle &bull; Sociedad 13% e Ingreso Vitalicio No Heredable
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Sociedad Patrimonial (13% de Acciones) con Ingreso Mensual Vitalicio No Heredado
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Don Juventino se retira completamente de la operación diaria recibiendo $5,000,000 MXN iniciales en efectivo y manteniéndose como dueño del 13% de la sociedad. Este esquema le otorga un ingreso mensual vitalicio no heredado (personalísimo de por vida) con un piso mínimo garantizado de $35,000 MXN mensuales: hacia arriba si hay más venta y utilidades, pero nunca hacia abajo de los $35,000 MXN.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Ingreso Mensual Vitalicio Garantizado</span>
                <span className="text-2xl font-extrabold text-emerald-900 font-mono">{formatCurrency(35000)}</span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">Dueño del 13% &bull; Hacia arriba si hay más venta, nunca hacia abajo</span>
              </div>
            </div>

            {/* Los 3 Pilares de la Propuesta 4 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold mb-3">
                  <Banknote className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-stone-900 text-sm">1. Pago Inicial de Contado</h5>
                <p className="text-stone-600">
                  <strong className="text-stone-900 font-mono text-base">{formatCurrency(5000000)}</strong> entregados de manera íntegra y de contado a la firma del convenio formal ante notario público.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 bg-white space-y-2">
                <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold mb-3">
                  <Coffee className="w-5 h-5 text-amber-700" />
                </div>
                <h5 className="font-bold text-stone-900 text-sm">2. Asunción Operativa Absoluta</h5>
                <p className="text-stone-600">
                  Nosotros asumimos el 100% de la carga: turnos matutinos desde las <strong>4:30 AM</strong>, personal, plantilla, abasto de harina/materia prima, mantenimiento de hornos y obligaciones fiscales.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h5 className="font-bold text-emerald-950 text-sm">3. Dueño del 13% y Retiro Vitalicio</h5>
                <p className="text-stone-700">
                  Ingreso vitalicio <strong>no heredado</strong> con piso garantizado de <strong>$35,000 MXN mensuales</strong>: hacia arriba si la panadería incrementa ventas y utilidades, pero <strong>nunca hacia abajo</strong>.
                </p>
              </div>
            </div>

            {/* Cláusula de Seguridad Patrimonial: 13%, Vitalicio No Heredable */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-emerald-900 font-semibold block">
                  Condiciones de Sociedad y Retiro Vitalicio para Don Juventino:
                </strong>
                <p className="text-stone-700 text-xs leading-relaxed">
                  Don Juventino es <strong>dueño del 13% de la sociedad</strong>. Este esquema le confiere un <strong>ingreso mensual vitalicio personalísimo (no heredado)</strong> con un piso irreductible de <strong>$35,000 MXN mensuales garantizados</strong>. Si en cualquier ejercicio o mes las ventas y utilidades crecen, su 13% le pagará el importe mayor correspondiente (hacia arriba); pero bajo ninguna circunstancia recibirá menos de $35,000 MXN al mes (nunca hacia abajo).
                </p>
              </div>
            </div>

            {/* Simulador Interactivo de Sociedad al 13% con Piso Garantizado */}
            <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Simulador: 13% de Utilidad Mensual vs. Piso Garantizado de $35,000 MXN
                  </h5>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Don Juventino es dueño del 13% y tiene asegurado el piso de <strong>$35,000 MXN mensuales</strong>. Hacia arriba si hay más venta y utilidades, cobra el monto superior real; pero nunca hacia abajo de $35,000 MXN.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Utilidad Neta Mensual del Negocio:</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">{formatCurrency(simulatedUtility)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-500 font-mono">
                  <span>Actual: $270,881 / mes</span>
                  <span>Objetivo Operativo: $350,000 / mes</span>
                </div>
                <input 
                  type="range"
                  min="180000"
                  max="400000"
                  step="10000"
                  value={simulatedUtility}
                  onChange={(e) => setSimulatedUtility(Number(e.target.value))}
                  className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block">Piso Mensual Garantizado</span>
                  <span className="text-lg font-extrabold text-stone-900 font-mono">$35,000 MXN</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">Nunca hacia abajo</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block">13% de Utilidad Mensual</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">{formatCurrency(rawCalculatedPension)}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">13% de {formatCurrency(simulatedUtility)}</span>
                </div>
                <div className="bg-emerald-100/80 p-3.5 rounded-xl border border-emerald-300">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-900 font-bold block">Ingreso a Percibir</span>
                    {rawCalculatedPension <= MIN_PENSION_MENSUAL && (
                      <span className="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">Piso activo</span>
                    )}
                    {rawCalculatedPension > MIN_PENSION_MENSUAL && (
                      <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">Alza por venta</span>
                    )}
                  </div>
                  <span className="text-xl font-extrabold text-emerald-950 font-mono">{formatCurrency(calculatedPensionMensual)}</span>
                  <span className="text-[10px] text-emerald-800 block mt-0.5">Depósito mensual vitalicio</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block">Condición Jurídica</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">Vitalicio</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Personalísimo (no heredado)</span>
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
                {confirmedChoice === 1 && 'Adquisición Directa de Contado - $8,500,000 MXN Líquidos'}
                {confirmedChoice === 2 && 'Financiamiento a 42 Meses (3.5 Años) - $11,300,000 MXN Total ($150,000/mes fijos)'}
                {confirmedChoice === 3 && 'Inversión Patrimonial al 13% con Abonos a Capital - $11,950,000 MXN Total'}
                {confirmedChoice === 4 && 'Sociedad Patrimonial (13%) con Ingreso Vitalicio No Heredado - $5 MDP + Mínimo $35,000 MXN/mes Vitalicio'}
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
                  <span className="text-[10px] font-normal block text-stone-500 mt-0.5">Inversionista 13% Anual</span>
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
                  <span className="text-[10px] font-normal block text-stone-500 mt-0.5">Sociedad 13% Vitalicia</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/80">
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
                  <span className="text-base text-emerald-950">$5,000,000 MXN</span>
                  <span className="text-[10px] font-normal text-stone-500 block mt-0.5">(de contado a la firma)</span>
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
                  <span className="text-xs font-bold text-blue-900">$54,167 &rarr; $10,833 / mes</span>
                  <span className="text-[10px] font-normal text-blue-700 block mt-0.5">(intereses al 13% según saldo)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-emerald-950 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  <span className="text-sm font-black text-emerald-900">$35,000 MXN / mes mín.</span>
                  <span className="text-[10px] font-semibold text-emerald-700 block mt-0.5">(hacia arriba si hay más venta, nunca hacia abajo)</span>
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
                    $1,000,000 MXN
                  </span>
                  <span className="text-[10px] text-blue-700 block mt-0.5">(cada fin de año directo a capital)</span>
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-500 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  N/A
                  <span className="text-[10px] text-emerald-700 block mt-0.5">(ingreso vitalicio mensual)</span>
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
                  Vitalicio (de por vida)
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
                  <div className="text-base sm:text-lg font-black">{formatCurrency(11950000)}</div>
                  <span className="text-[10px] text-blue-700 block font-normal font-sans">$5M cash + $5M cap. + $1.95M int. 13%</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-emerald-950 ${selectedScenario === 4 ? 'bg-emerald-50/50' : ''}`}>
                  <div className="text-sm font-black">$5 MDP + Vitalicio</div>
                  <span className="text-[10px] text-emerald-700 block font-normal font-sans">$35,000/mes mín. de por vida</span>
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
                  Dueño del 13% de la sociedad con derecho a utilidades crecientes.
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
                  Escritura de sociedad (13%) y cláusula notarial de pensión vitalicia no reducible.
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
                  Gana 13% anual fijo (muy superior al banco), con intereses mensuales y $1 MDP cada año.
                </td>
                <td className={`py-4 px-3 text-xs leading-relaxed text-stone-700 ${selectedScenario === 4 ? 'bg-emerald-100/60' : ''}`}>
                  <span className="font-bold text-emerald-950 block mb-1">Si quiere tranquilidad de por vida:</span>
                  Recibe $5 MDP en mano y un piso vitalicio de $35k/mes con ganancias al alza si hay más venta.
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

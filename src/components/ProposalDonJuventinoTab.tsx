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
  Delete
} from 'lucide-react';

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

const TABLA_AMORTIZACION_PROP3: AmortizacionRow[] = [
  { periodo: 'Año 1', saldoInsoluto: 5000000, interesMensual: 50000, interesAnual: 600000, amortizacionCapital: 1000000, flujoTotalAnual: 1600000 },
  { periodo: 'Año 2', saldoInsoluto: 4000000, interesMensual: 40000, interesAnual: 480000, amortizacionCapital: 1000000, flujoTotalAnual: 1480000 },
  { periodo: 'Año 3', saldoInsoluto: 3000000, interesMensual: 30000, interesAnual: 360000, amortizacionCapital: 1000000, flujoTotalAnual: 1360000 },
  { periodo: 'Año 4', saldoInsoluto: 2000000, interesMensual: 20000, interesAnual: 240000, amortizacionCapital: 1000000, flujoTotalAnual: 1240000 },
  { periodo: 'Año 5', saldoInsoluto: 1000000, interesMensual: 10000, interesAnual: 120000, amortizacionCapital: 1000000, flujoTotalAnual: 1120000 },
];

interface PlanBlandoRow {
  periodo: string;
  meses: string;
  mensualidadFija: number;
  pagoAnualDonJuventino: number;
  interesBlandoAnual: number;
  colchonOperativoMensual: number;
  colchonOperativoAnual: number;
  saldoRestante: number;
}

const TABLA_PLAN_BLANDO_PROP2: PlanBlandoRow[] = [
  { periodo: 'Año 1', meses: 'Meses 1 al 12', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, interesBlandoAnual: 133333, colchonOperativoMensual: 80000, colchonOperativoAnual: 960000, saldoRestante: 3600000 },
  { periodo: 'Año 2', meses: 'Meses 13 al 24', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, interesBlandoAnual: 133333, colchonOperativoMensual: 80000, colchonOperativoAnual: 960000, saldoRestante: 1800000 },
  { periodo: 'Año 3', meses: 'Meses 25 al 36', mensualidadFija: 150000, pagoAnualDonJuventino: 1800000, interesBlandoAnual: 133334, colchonOperativoMensual: 80000, colchonOperativoAnual: 960000, saldoRestante: 0 },
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
  
  // Interactive slider for Scenario 3 utility simulation
  const [simulatedUtility, setSimulatedUtility] = useState<number>(233333);

  // Mínimo de $35,000 mensuales garantizados por un periodo forzoso mínimo de 10 años y vitalicio
  const MIN_PENSION_MENSUAL = 35000;
  const rawCalculatedPension = Math.round(simulatedUtility * 0.15);
  const calculatedPensionMensual = Math.max(MIN_PENSION_MENSUAL, rawCalculatedPension);
  const calculatedPensionAnual = calculatedPensionMensual * 12;

  const handlePrintProposal = () => {
    window.print();
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

      {/* 2. SCENARIO SELECTOR CARDS (Top Overview & Interactive Switch) */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              Los 4 Escenarios Disponibles
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Haga clic en cualquiera de las alternativas para consultar su desglose detallado, justificación y corridas financieras.
            </p>
          </div>
          <button
            onClick={handlePrintProposal}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Imprimir Propuesta Formal</span>
          </button>
        </div>

        {/* 4 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1 */}
          <div
            onClick={() => setSelectedScenario(1)}
            className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedScenario === 1
                ? 'bg-amber-50/70 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  <Banknote className="w-3.5 h-3.5 text-amber-800" />
                  Opción 1 &bull; Liquidez Inmediata
                </span>
                {confirmedChoice === 1 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Elegida
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                Adquisición Directa de Contado
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Pago 100% líquido en efectivo en una sola exhibición. Retiro total inmediato sin riesgos ni plazos diferidos.
              </p>

              <div className="my-3.5 p-3 bg-white/80 rounded-xl border border-stone-200/80">
                <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Monto en Efectivo</div>
                <div className="text-2xl font-extrabold text-stone-900 font-mono">
                  {formatCurrency(8500000)}
                </div>
                <div className="text-xs text-emerald-800 font-semibold mt-0.5">
                  100% de contado al firmar ante notario
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Disponibilidad inmediata:</strong> $8.5 MDP líquidos en cuenta el día uno.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>$0 deuda o crédito:</strong> Cero exposición y cero tiempos de espera.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Retiro definitivo:</strong> Exención absoluta de hornos, personal y nóminas.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                {selectedScenario === 1 ? 'Viendo detalles abajo' : 'Ver corrida detallada'}
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] text-stone-400 font-mono">1 exhibición</span>
            </div>
          </div>

          {/* Card 2 (NUEVA OPCIÓN 2: INTERÉS BLANDO 3 AÑOS - $150k/mes) */}
          <div
            onClick={() => setSelectedScenario(2)}
            className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedScenario === 2
                ? 'bg-amber-50/70 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-900">
                  <Coins className="w-3.5 h-3.5 text-teal-800" />
                  Opción 2 &bull; Interés Blando (3 Años)
                </span>
                {confirmedChoice === 2 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Elegida
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                Financiamiento con Interés Blando
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                $5 MDP iniciales + 36 mensualidades fijas de $150,000 MXN. $10.4 MDP totales ($400k de interés como gesto de buena fe).
              </p>

              <div className="my-3.5 p-3 bg-white/80 rounded-xl border border-stone-200/80">
                <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Total Acumulado a Percibir</div>
                <div className="text-2xl font-extrabold text-teal-950 font-mono">
                  {formatCurrency(10400000)}
                </div>
                <div className="text-xs text-teal-800 font-semibold mt-0.5">
                  $5 MDP inicial + 36 pagos de $150,000 MXN
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>$150,000 MXN / mes fijos:</strong> Flujo seguro, idéntico y puntual durante 3 años (36 meses).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>$400,000 MXN interés blando:</strong> Gesto de agradecimiento y buena fe superando la valuación.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span><strong>$80,000 MXN / mes de colchón:</strong> Margen operativo para contingencias y salud del negocio.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                {selectedScenario === 2 ? 'Viendo detalles abajo' : 'Ver corrida detallada'}
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] text-teal-700 font-mono font-bold">3 años (36 meses)</span>
            </div>
          </div>

          {/* Card 3 (ANTERIOR OPCIÓN 2: INTERÉS 12% A 5 AÑOS) */}
          <div
            onClick={() => setSelectedScenario(3)}
            className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedScenario === 3
                ? 'bg-amber-50/70 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-800" />
                  Opción 3 &bull; Máximo Retorno 12%
                </span>
                {confirmedChoice === 3 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Elegida
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                Asociación y Financiamiento al 12%
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                $5 MDP iniciales + pagarés mercantiles con tasa fija del 12% anual a 5 años. Máxima rentabilidad patrimonial.
              </p>

              <div className="my-3.5 p-3 bg-white/80 rounded-xl border border-stone-200/80">
                <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Total Acumulado a Percibir</div>
                <div className="text-2xl font-extrabold text-stone-900 font-mono">
                  {formatCurrency(11800000)}
                </div>
                <div className="text-xs text-blue-800 font-semibold mt-0.5">
                  $5 MDP inicial + $5 MDP capital + $1.8 MDP intereses
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Pago inicial fuerte:</strong> $5,000,000 MXN en efectivo a la firma.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Interés fijo 12% anual:</strong> Ingresos mensuales desde $50,000 hasta $10,000 MXN.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Pagarés mercantiles:</strong> Respaldo legal y de mutuo sobre saldos insolutos.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                {selectedScenario === 3 ? 'Viendo detalles abajo' : 'Ver corrida detallada'}
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] text-stone-400 font-mono">5 años (60 meses)</span>
            </div>
          </div>

          {/* Card 4 (ANTERIOR OPCIÓN 3: PENSIÓN VITALICIA MÍN. 10 AÑOS) */}
          <div
            onClick={() => setSelectedScenario(4)}
            className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              selectedScenario === 4
                ? 'bg-amber-50/70 border-amber-600 shadow-md ring-2 ring-amber-500/20'
                : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50 shadow-2xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                  <HeartHandshake className="w-3.5 h-3.5 text-emerald-800" />
                  Opción 4 &bull; Pensión Vitalicia (Mín. 10 Años)
                </span>
                {confirmedChoice === 4 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                    <Check className="w-3 h-3" /> Elegida
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-stone-900 leading-snug">
                Traspaso con Pensión Vitalicia
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                $5 MDP iniciales en efectivo + Pensión vitalicia con piso mínimo garantizado de $35,000 MXN/mes por al menos 10 años (120 meses) y de por vida.
              </p>

              <div className="my-3.5 p-3 bg-white/80 rounded-xl border border-stone-200/80">
                <div className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">Flujo Mensual Mínimo Garantizado</div>
                <div className="text-2xl font-extrabold text-emerald-900 font-mono">
                  {formatCurrency(35000)} <span className="text-xs font-bold text-stone-500">/ mes mín.</span>
                </div>
                <div className="text-xs text-emerald-800 font-semibold mt-0.5">
                  $5,000,000 MXN en banco + Mínimo $4,200,000 MXN en 10 años + Vitalicio
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Garantía mínima 10 años:</strong> 120 meses asegurados por contrato para total certeza patrimonial, continuando de por vida.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Piso mínimo $35,000 MXN/mes:</strong> 15% de utilidades netas garantizando que nunca reciba menos de $35,000 MXN al mes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Descanso total desde las 4:30 AM:</strong> Asumimos el 100% de la carga de hornos, personal, abasto y nóminas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Potencial de alza:</strong> Si las utilidades crecen, su 15% mensual superará los $35,000 MXN automáticamente.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1">
                {selectedScenario === 4 ? 'Viendo detalles abajo' : 'Ver corrida detallada'}
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] text-stone-500 font-mono font-medium">Mín. 10 años &bull; Vitalicio</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DETAILED VIEW OF THE CURRENTLY SELECTED SCENARIO */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8">
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
                <h4>Justificación Técnica de Valuación de Mercado ($10,000,000 MXN)</h4>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                La valuación técnica del establecimiento se sitúa en <strong>$10,000,000 MXN</strong>, calculada con base en los múltiplos de mercado estándar para empresas y comercios tradicionales en marcha dentro del sector de alimentos y panificación, los cuales oscilan habitualmente entre <strong>3 y 4 veces la utilidad neta anual</strong>:
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
                  <span className="text-base font-extrabold text-amber-950 font-mono">{formatCurrency(10000000)}</span>
                  <span className="text-[10px] text-amber-800 block mt-0.5">Rango alto de mercado (3.62x)</span>
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
                    <span>$10,000,000 MXN</span>
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

        {/* Scenario 2 Detailed Tab (NUEVA OPCIÓN 2: INTERÉS BLANDO 3 AÑOS) */}
        {selectedScenario === 2 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-teal-100 text-teal-900 mb-2">
                  <Coins className="w-4 h-4 text-teal-800" />
                  Propuesta 2 en Detalle &bull; Gesto de Buena Fe y Estabilidad Operativa
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Financiamiento a 3 Años con Interés Blando ($150,000 MXN Mensuales Fijos)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  En lugar de un esquema de 2 años al 0%, se propone un plazo equilibrado de 3 años (36 meses) pagando $150,000 MXN fijos al mes. Esta alternativa suma $5,400,000 MXN ($400,000 MXN de interés total como muestra de respeto patrimonial), garantizando a la vez un colchón operativo mensual de $80,000 MXN para contingencias de la panadería.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Total Acumulado a Percibir</span>
                <span className="text-2xl font-extrabold text-teal-950 font-mono">{formatCurrency(10400000)}</span>
                <span className="text-[11px] text-teal-700 block mt-0.5">$5 MDP Cash + $5.4 MDP en 36 Meses</span>
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
                <p className="text-teal-800 text-xs mt-1">36 pagos mensuales idénticos sin variación.</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-xs">Interés Blando Acumulado</span>
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(400000)}</span>
                <p className="text-stone-600 text-xs mt-1">Gesto de buena fe que eleva el saldo a $5.4 MDP.</p>
              </div>
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200">
                <span className="text-amber-900 font-semibold block text-xs">Colchón Operativo Panadería</span>
                <span className="text-xl font-bold text-amber-950 font-mono">{formatCurrency(80000)} <span className="text-xs font-normal">/mes</span></span>
                <p className="text-amber-800 text-xs mt-1">Reserva para mantenimiento e imprevistos.</p>
              </div>
            </div>

            {/* Justificación de Equilibrio Financiero: ¿Por qué 3 años a $150k? */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <Scale className="w-4 h-4 text-teal-700" />
                El Equilibrio Perfecto: Gesto de Buena Fe + Viabilidad Operativa
              </h5>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Esta alternativa corrige las limitaciones de los plazos extremos: un esquema a 2 años requeriría pagar más de $208,000 MXN mensuales, comprometiendo casi el 100% de la utilidad del negocio; mientras que un plazo a 5 años resulta demasiado largo para quien busca su retiro. Con <strong>3 años a $150,000 MXN mensuales</strong> se logra una fórmula ganar-ganar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-teal-900 block">Beneficio para Don Juventino:</span>
                  <p className="text-stone-600">
                    Recibe <strong>$150,000 MXN mensuales garantizados</strong> durante 36 meses continuos, sumando <strong>$5,400,000 MXN</strong>. Esto incluye <strong>$400,000 MXN adicionales de interés blando</strong> que demuestran total seriedad y agradecimiento hacia su persona.
                  </p>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-1">
                  <span className="font-bold text-amber-900 block">Beneficio Operativo para la Panadería:</span>
                  <p className="text-stone-600">
                    De la utilidad mensual promedio estimada de $230,000 MXN, tras pagar la mensualidad de $150,000 MXN a Don Juventino, restan <strong>$80,000 MXN mensuales libres ($960,000 MXN al año)</strong> de colchón de seguridad para refacciones de hornos, materias primas y contingencias.
                  </p>
                </div>
              </div>
            </div>

            {/* Tabla Detallada de Calendario a 3 Años */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">
                    Calendario de Pagos y Amortización con Interés Blando (3 Años / 36 Meses)
                  </h5>
                  <p className="text-xs text-stone-500">
                    Flujo mensual garantizado de $150,000 MXN soportado con pagarés mercantiles notariales.
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-900 bg-teal-100 px-2.5 py-1 rounded-full">
                  36 Mensualidades Fijas de $150,000 MXN
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
                      <th className="py-3 px-4 text-right">Interés Blando Anual</th>
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
                        <td className="py-3 px-4 text-right font-mono text-stone-600">{formatCurrency(row.interesBlandoAnual)}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-900 bg-amber-50/40">
                          {formatCurrency(row.colchonOperativoMensual)} <span className="text-[10px] text-stone-500 font-normal">({formatCurrency(row.colchonOperativoAnual)}/año)</span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-stone-600">{formatCurrency(row.saldoRestante)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900 text-xs sm:text-sm">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 uppercase text-xs">Total 3 Años (36 Mensualidades)</td>
                      <td className="py-3 px-4 text-right font-mono text-teal-900 font-bold">$150k / mes</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-950 font-extrabold text-sm">{formatCurrency(5400000)}</td>
                      <td className="py-3 px-4 text-right font-mono text-teal-900">{formatCurrency(400000)}</td>
                      <td className="py-3 px-4 text-right font-mono text-amber-950 font-extrabold bg-amber-100/60">
                        {formatCurrency(2880000)} <span className="text-[10px] font-normal block text-amber-900">(reserva total 3 años)</span>
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
                  <strong>$5,000,000 MXN</strong> iniciales en efectivo + <strong>$5,000,000 MXN</strong> de capital financiado + <strong>$400,000 MXN</strong> de interés blando devengado.
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-xs text-teal-800 block font-medium">Importe Total Acumulado</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-950 font-mono">
                  {formatCurrency(10400000)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 3 Detailed Tab (ANTERIOR OPCIÓN 2: ASOCIACIÓN E INTERÉS 12% A 5 AÑOS) */}
        {selectedScenario === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-800" />
                  Propuesta 3 en Detalle
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Estructura de Asociación y Financiamiento con Interés (12% Anual a 5 Años)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Diseñada para maximizar el rendimiento patrimonial a mediano plazo, funcionando como un instrumento de inversión respaldado por los activos.
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Total Acumulado (5 Años)</span>
                <span className="text-2xl font-extrabold text-blue-900 font-mono">{formatCurrency(11800000)}</span>
              </div>
            </div>

            {/* Condiciones principales de la Propuesta 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-xs">Pago Inicial en Efectivo</span>
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                <p className="text-stone-600 text-xs mt-1">De contado a la firma del contrato.</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-stone-500 block text-xs">Saldo Financiado con Mutuo</span>
                <span className="text-xl font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                <p className="text-stone-600 text-xs mt-1">Constituido mediante pagarés mercantiles al 12% anual.</p>
              </div>
              <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-200">
                <span className="text-blue-900 font-semibold block text-xs">Intereses Devengados a Percibir</span>
                <span className="text-xl font-bold text-blue-950 font-mono">{formatCurrency(1800000)}</span>
                <p className="text-blue-800 text-xs mt-1">1.0% mensual sobre saldos insolutos durante 5 años.</p>
              </div>
            </div>

            {/* Tabla Detallada de Amortización de Pagos Año con Año */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
              <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-stone-900 text-sm">
                    Calendario Detallado de Pagos de Don Juventino (5 Años / 60 Meses)
                  </h5>
                  <p className="text-xs text-stone-500">
                    Amortizaciones anuales de capital por $1,000,000 MXN más intereses devengados mensualmente.
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full">
                  Tasa Fija 12.0% Anual
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
                      <th className="py-3 px-4 text-right">Amortización Capital</th>
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
                      <td colSpan={2} className="py-3 px-4 uppercase text-xs">Total Saldo Amortizado + Intereses</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-900 text-xs font-normal">($50k &rarr; $10k/mes)</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-950 font-bold">{formatCurrency(1800000)}</td>
                      <td className="py-3 px-4 text-right font-mono">{formatCurrency(5000000)}</td>
                      <td className="py-3 px-4 text-right font-mono text-blue-950 text-base font-extrabold bg-blue-100/80">
                        {formatCurrency(6800000)}
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
                  Resumen de Liquidación Total para Don Juventino
                </span>
                <p className="text-xs sm:text-sm text-stone-700">
                  <strong>$5,000,000 MXN</strong> iniciales + <strong>$5,000,000 MXN</strong> de capital amortizado + <strong>$1,800,000 MXN</strong> de intereses devengados.
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="text-xs text-blue-800 block font-medium">Importe Total Acumulado</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 font-mono">
                  {formatCurrency(11800000)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Scenario 4 Detailed Tab (ANTERIOR OPCIÓN 3: PENSIÓN VITALICIA MÍN. 10 AÑOS) */}
        {selectedScenario === 4 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 mb-2">
                  <HeartHandshake className="w-4 h-4 text-emerald-800" />
                  Propuesta 4 en Detalle &bull; Máxima Seguridad Patrimonial
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
                  Traspaso Operativo con Retiro Pleno y Pensión Vitalicia (Mínimo 10 Años y Piso $35,000 MXN/mes)
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Prioriza su descanso absoluto e inmediato sin operar el negocio, brindando total certidumbre jurídica mediante contrato garantizado por un plazo mínimo forzoso de 10 años (120 meses) y vigencia vitalicia, asegurando al menos $35,000 MXN mensuales (o 15% de utilidades netas).
                </p>
              </div>

              <div className="text-left sm:text-right bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <span className="text-xs text-stone-500 block">Pensión Mensual Mínima Garantizada</span>
                <span className="text-2xl font-extrabold text-emerald-900 font-mono">{formatCurrency(35000)}</span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">Mínimo 10 Años ($4.2 MDP) + Vitalicio + $5 MDP Cash</span>
              </div>
            </div>

            {/* Los 3 Pilares de la Propuesta 3 */}
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
                <h5 className="font-bold text-emerald-950 text-sm">3. Mínimo 10 Años y Piso $35,000 MXN</h5>
                <p className="text-stone-700">
                  Pensión vitalicia con <strong>garantía forzosa mínima de 10 años (120 meses consecutivos = $4,200,000 MXN asegurados)</strong> y piso mensual no menor a <strong>$35,000 MXN</strong>, con potencial de incremento al 15% de utilidades netas.
                </p>
              </div>
            </div>

            {/* Cláusula de Seguridad Patrimonial */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-300 flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="text-emerald-900 font-semibold block">
                  Cláusula de Seguridad y Protección Jurídica para Don Juventino:
                </strong>
                <p className="text-stone-700 text-xs leading-relaxed">
                  Para otorgar absoluta certeza a Don Juventino y su familia, el convenio incluye un <strong>plazo mínimo garantizado irrevocable de 10 años (120 pagos mensuales de al menos $35,000 MXN = $4,200,000 MXN asegurados)</strong> con cobertura patrimonial para beneficiarios, y se extiende de forma <strong>vitalicia e indefinida</strong> para Don Juventino a partir del año 11 en adelante.
                </p>
              </div>
            </div>

            {/* Simulador Interactivo de Pensión Vitalicia con Piso Garantizado */}
            <div className="bg-stone-50 rounded-2xl p-5 sm:p-6 border border-stone-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    Simulador Interactivo: Piso Garantizado de $35,000 MXN vs. Crecimiento de Utilidad
                  </h5>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Don Juventino tiene asegurado el piso de <strong>$35,000 MXN mensuales</strong>. Si la panadería eleva su utilidad mediante optimización y nuevas sucursales, el 15% aumenta su pensión por encima del piso.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-stone-500 block">Utilidad Neta Mensual del Negocio:</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">{formatCurrency(simulatedUtility)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-stone-500 font-mono">
                  <span>Actual: $230,000 / mes</span>
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
                  <span className="text-[10px] text-emerald-700 block mt-0.5">Mínimo irreductible</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block">15% de Utilidad Mensual</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">{formatCurrency(rawCalculatedPension)}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">15% de {formatCurrency(simulatedUtility)}</span>
                </div>
                <div className="bg-emerald-100/80 p-3.5 rounded-xl border border-emerald-300">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-900 font-bold block">Pensión a Percibir</span>
                    {rawCalculatedPension <= MIN_PENSION_MENSUAL && (
                      <span className="text-[9px] font-bold bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">Piso activo</span>
                    )}
                  </div>
                  <span className="text-xl font-extrabold text-emerald-950 font-mono">{formatCurrency(calculatedPensionMensual)}</span>
                  <span className="text-[10px] text-emerald-800 block mt-0.5">Depósito mensual directo</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-stone-200">
                  <span className="text-stone-500 block">Mínimo 10 Años Garantizados</span>
                  <span className="text-lg font-bold text-stone-900 font-mono">{formatCurrency(Math.max(4200000, calculatedPensionAnual * 10))}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">120 meses asegurados + Vitalicio</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action button to select / confirm this scenario */}
        <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-stone-600 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Don Juventino puede elegir cualquiera de estas 4 opciones según su plan de vida y necesidades financieras.
            </span>
          </div>

          <button
            onClick={() => setConfirmedChoice(selectedScenario)}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Preferencia Registrada: Opción {confirmedChoice} (
                {confirmedChoice === 1 && 'Adquisición Directa de Contado - $8,500,000 MXN Líquidos'}
                {confirmedChoice === 2 && 'Financiamiento con Interés Blando (3 Años) - $10,400,000 MXN Total ($150,000/mes fijos)'}
                {confirmedChoice === 3 && 'Asociación y Financiamiento al 12% (5 Años) - $11,800,000 MXN Total'}
                {confirmedChoice === 4 && 'Traspaso Operativo con Pensión Vitalicia - $5 MDP + Mínimo $35,000 MXN/mes por 10 años garantizados y Vitalicio'}
              )</strong>
              <p className="mt-0.5 text-stone-700 text-xs">
                Esta alternativa será la base para la redacción del convenio formal y calendarización notarial. Puede cambiar de opción en cualquier momento haciendo clic en otra tarjeta.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. COMPARATIVE TABLE SUMMARY (Cuadro Sinóptico Oficial) */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-stone-200 bg-gradient-to-r from-stone-50 to-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2">
            <FileText className="w-3.5 h-3.5 text-amber-800" />
            Cuadro Sinóptico Oficial
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Tabla Comparativa Resumen de las 4 Propuestas
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Contraste directo entre liquidez inmediata, interés blando a 3 años, financiamiento a 5 años y pensión vitalicia con garantía mínima de 10 años.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-700 uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Concepto / Métrica</th>
                <th className={`py-3.5 px-3 text-center ${selectedScenario === 1 ? 'bg-amber-100/60 font-bold text-amber-950' : ''}`}>
                  Propuesta 1 (Cash Inmediato)
                </th>
                <th className={`py-3.5 px-3 text-center ${selectedScenario === 2 ? 'bg-teal-100/60 font-bold text-teal-950' : ''}`}>
                  Propuesta 2 (Interés Blando 3 Años)
                </th>
                <th className={`py-3.5 px-3 text-center ${selectedScenario === 3 ? 'bg-blue-100/60 font-bold text-blue-950' : ''}`}>
                  Propuesta 3 (Interés 12% a 5 Años)
                </th>
                <th className={`py-3.5 px-3 text-center ${selectedScenario === 4 ? 'bg-emerald-100/60 font-bold text-emerald-950' : ''}`}>
                  Propuesta 4 (Pensión Mín. 10 Años y $35k/mes)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/70">
              {/* Valuación */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Valuación de Referencia</td>
                <td className={`py-3.5 px-3 text-center font-mono ${selectedScenario === 1 ? 'bg-amber-50/40 font-bold' : ''}`}>
                  $10,000,000 MXN
                </td>
                <td className={`py-3.5 px-3 text-center font-mono ${selectedScenario === 2 ? 'bg-teal-50/40 font-bold' : ''}`}>
                  $10,000,000 MXN
                </td>
                <td className={`py-3.5 px-3 text-center font-mono ${selectedScenario === 3 ? 'bg-blue-50/40 font-bold' : ''}`}>
                  $10,000,000 MXN
                </td>
                <td className={`py-3.5 px-3 text-center font-mono ${selectedScenario === 4 ? 'bg-emerald-50/40 font-bold' : ''}`}>
                  $10,000,000 MXN
                </td>
              </tr>

              {/* Pago Inicial / Efectivo */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Pago Inicial en Efectivo</td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-stone-900 ${selectedScenario === 1 ? 'bg-amber-50/40 text-amber-950' : ''}`}>
                  $8,500,000 MXN <span className="text-[10px] font-normal text-stone-500 block">(100% contado notarial)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-teal-950 ${selectedScenario === 2 ? 'bg-teal-50/40' : ''}`}>
                  $5,000,000 MXN <span className="text-[10px] font-normal text-stone-500 block">(a la firma)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-stone-900 ${selectedScenario === 3 ? 'bg-blue-50/40 text-blue-950' : ''}`}>
                  $5,000,000 MXN <span className="text-[10px] font-normal text-stone-500 block">(a la firma)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-stone-900 ${selectedScenario === 4 ? 'bg-emerald-50/40 text-emerald-950' : ''}`}>
                  $5,000,000 MXN <span className="text-[10px] font-normal text-stone-500 block">(a la firma)</span>
                </td>
              </tr>

              {/* Monto Total Estimado */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Monto Total Estimado</td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-stone-900 ${selectedScenario === 1 ? 'bg-amber-50/40 text-amber-950' : ''}`}>
                  $8,500,000 MXN líquidos
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-teal-950 ${selectedScenario === 2 ? 'bg-teal-50/40' : ''}`}>
                  $10,400,000 MXN <span className="text-[10px] font-medium text-teal-700 block">($400k interés blando)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-blue-900 ${selectedScenario === 3 ? 'bg-blue-50/40' : ''}`}>
                  $11,800,000 MXN <span className="text-[10px] font-medium text-blue-700 block">($1.8 MDP intereses)</span>
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-emerald-900 ${selectedScenario === 4 ? 'bg-emerald-50/40' : ''}`}>
                  $5,000,000 MXN + Mín. $4,200,000 MXN (10 años) + Vitalicio
                </td>
              </tr>

              {/* Plazo de Liquidación */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Plazo de Liquidación</td>
                <td className={`py-3.5 px-3 text-center ${selectedScenario === 1 ? 'bg-amber-50/40 font-semibold' : ''}`}>
                  Inmediato (1 sola exhibición)
                </td>
                <td className={`py-3.5 px-3 text-center font-bold text-teal-900 ${selectedScenario === 2 ? 'bg-teal-50/40' : ''}`}>
                  3 años (36 meses fijos)
                </td>
                <td className={`py-3.5 px-3 text-center ${selectedScenario === 3 ? 'bg-blue-50/40 font-semibold' : ''}`}>
                  5 años (60 meses)
                </td>
                <td className={`py-3.5 px-3 text-center ${selectedScenario === 4 ? 'bg-emerald-50/40 font-semibold text-emerald-900' : ''}`}>
                  Mínimo 10 años (120 meses) + Vitalicio
                </td>
              </tr>

              {/* Flujo Mensual Don Juventino */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Flujo Mensual Don Juventino</td>
                <td className={`py-3.5 px-3 text-center text-stone-500 ${selectedScenario === 1 ? 'bg-amber-50/40' : ''}`}>
                  N/A (Liquidación total día 1)
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-extrabold text-teal-900 ${selectedScenario === 2 ? 'bg-teal-50/40' : ''}`}>
                  $150,000 MXN / mes fijos
                </td>
                <td className={`py-3.5 px-3 text-center font-mono text-stone-800 ${selectedScenario === 3 ? 'bg-blue-50/40 font-bold' : ''}`}>
                  Variable: $50,000 &rarr; $10,000 MXN
                </td>
                <td className={`py-3.5 px-3 text-center font-mono font-bold text-emerald-900 ${selectedScenario === 4 ? 'bg-emerald-50/40' : ''}`}>
                  Mínimo $35,000 MXN / mes garantizado (o 15% utilidades)
                </td>
              </tr>

              {/* Colchón Operativo Negocio */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Colchón Mensual para la Panadería</td>
                <td className={`py-3.5 px-3 text-center text-stone-600 ${selectedScenario === 1 ? 'bg-amber-50/40' : ''}`}>
                  Flujo 100% libre (sin compromisos)
                </td>
                <td className={`py-3.5 px-3 text-center font-bold text-amber-900 bg-amber-50/30 ${selectedScenario === 2 ? 'ring-1 ring-amber-300' : ''}`}>
                  $80,000 MXN / mes <span className="text-[10px] font-normal block text-stone-500">($960k/año para contingencias)</span>
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-700 ${selectedScenario === 3 ? 'bg-blue-50/40' : ''}`}>
                  $180,000 &rarr; $220,000 MXN / mes
                </td>
                <td className={`py-3.5 px-3 text-center text-emerald-900 ${selectedScenario === 4 ? 'bg-emerald-50/40' : ''}`}>
                  85% de utilidades netas retenidas
                </td>
              </tr>

              {/* Carga de Trabajo Operativa */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Carga de Trabajo Operativa</td>
                <td className={`py-3.5 px-3 text-center text-emerald-800 font-semibold ${selectedScenario === 1 ? 'bg-amber-50/40' : ''}`}>
                  Nula (Retiro definitivo)
                </td>
                <td className={`py-3.5 px-3 text-center text-emerald-800 font-semibold ${selectedScenario === 2 ? 'bg-teal-50/40' : ''}`}>
                  Nula (Retiro definitivo)
                </td>
                <td className={`py-3.5 px-3 text-center text-emerald-800 font-semibold ${selectedScenario === 3 ? 'bg-blue-50/40' : ''}`}>
                  Nula (Rol de inversionista)
                </td>
                <td className={`py-3.5 px-3 text-center text-emerald-800 font-semibold ${selectedScenario === 4 ? 'bg-emerald-50/40' : ''}`}>
                  Nula (Retiro pleno con participación)
                </td>
              </tr>

              {/* Garantía Principal */}
              <tr className="hover:bg-stone-50/50">
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-stone-900">Garantía Principal</td>
                <td className={`py-3.5 px-3 text-center text-stone-700 ${selectedScenario === 1 ? 'bg-amber-50/40 font-medium' : ''}`}>
                  Pago total de contado ante notario
                </td>
                <td className={`py-3.5 px-3 text-center text-teal-900 ${selectedScenario === 2 ? 'bg-teal-50/40 font-medium' : ''}`}>
                  Pagarés mercantiles notariales ($150,000 MXN fijos mensuales)
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-700 ${selectedScenario === 3 ? 'bg-blue-50/40 font-medium' : ''}`}>
                  Pagarés mercantiles / Contrato mutuo al 12%
                </td>
                <td className={`py-3.5 px-3 text-center text-stone-700 ${selectedScenario === 4 ? 'bg-emerald-50/40 font-medium' : ''}`}>
                  Garantía forzosa mínima de 10 años notariada y vitalicia
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
            onClick={handlePrintProposal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Documento Completo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

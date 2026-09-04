import React, { useState, useMemo } from 'react';
import { 
  formatCurrency, 
  formatPercent, 
  calcularTasaEscala 
} from '../utils/formatters';
import { 
  TOTALES_CONSOLIDADOS, 
  BENCHMARK_INMUEBLE, 
  BENCHMARK_BANCO 
} from '../data/financialData';
import { 
  Calculator, 
  DollarSign, 
  Home, 
  Landmark, 
  Store, 
  TrendingUp, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Sliders, 
  Sparkles,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  AreaChart, 
  Area 
} from 'recharts';

export const InvestorCalculatorTab: React.FC = () => {
  // Investment parameters state - Default to $2.2M and 13.0% in Tasa Personalizada
  const [monto, setMonto] = useState<number>(2200000); 
  const [rateMode, setRateMode] = useState<'libre' | 'preferencial' | 'escala'>('libre');
  const [tasaManual, setTasaManual] = useState<number>(13.0);
  const [plazoAnios, setPlazoAnios] = useState<number>(3);
  const [capitalizacion, setCapitalizacion] = useState<'mensual' | 'compuesto'>('mensual');

  // Compute active effective rate
  const tasaEfectiva = useMemo(() => {
    if (rateMode === 'escala') {
      return calcularTasaEscala(monto);
    } else if (rateMode === 'preferencial') {
      return 14.5; 
    } else {
      return tasaManual;
    }
  }, [rateMode, monto, tasaManual]);

  // Financial calculations: Panadería Santa Fé
  const rendimientoMensualPanaderia = (monto * (tasaEfectiva / 100)) / 12;
  const rendimientoSemanalPanaderia = rendimientoMensualPanaderia / 4.33;
  const rendimientoAnualPanaderia = monto * (tasaEfectiva / 100);
  const gananciaTotalPanaderiaSimple = rendimientoAnualPanaderia * plazoAnios;
  const capitalFinalPanaderiaCompuesto = monto * Math.pow(1 + tasaEfectiva / 100, plazoAnios);
  const gananciaTotalPanaderiaCompuesto = capitalFinalPanaderiaCompuesto - monto;

  // Benchmark: Casa / Bien Raíz (Ejemplo real: $2.2 MDP cobra renta de $11,500/mes)
  const rentaMensualBrutaInmueble = monto * (BENCHMARK_INMUEBLE.rentaMensual / BENCHMARK_INMUEBLE.valorCasa);
  const rentaMensualNetaInmueble = rentaMensualBrutaInmueble * (1 - BENCHMARK_INMUEBLE.gastosMantenimientoPredialVacanciaPct);
  const rendimientoAnualInmueble = rentaMensualNetaInmueble * 12;
  const gananciaTotalInmueble = rendimientoAnualInmueble * plazoAnios;

  // Benchmark: Banco / Pagaré / Cetes (9.0% neto)
  const tasaNetaBanco = BENCHMARK_BANCO.tasaNetaAnual; // 9.0%
  const rendimientoMensualBanco = (monto * tasaNetaBanco) / 12;
  const rendimientoAnualBanco = monto * tasaNetaBanco;
  const gananciaTotalBancoSimple = rendimientoAnualBanco * plazoAnios;
  const capitalFinalBancoCompuesto = monto * Math.pow(1 + tasaNetaBanco, plazoAnios);
  const gananciaTotalBancoCompuesto = capitalFinalBancoCompuesto - monto;

  // Differences vs Casa and Banco
  const diferenciaVsCasaMensual = rendimientoMensualPanaderia - rentaMensualNetaInmueble;
  const porcentajeVsCasa = Math.round((diferenciaVsCasaMensual / rentaMensualNetaInmueble) * 100);
  const diferenciaVsBancoMensual = rendimientoMensualPanaderia - rendimientoMensualBanco;
  const porcentajeVsBanco = Math.round((diferenciaVsBancoMensual / rendimientoMensualBanco) * 100);

  // Debt coverage analysis based on Panadería Santa Fé audit
  const utilidadMensualPanaderia = TOTALES_CONSOLIDADOS.utilidadMensualTotal; // $187,973
  const ratioCobertura = Number((utilidadMensualPanaderia / rendimientoMensualPanaderia).toFixed(1));
  const porcentajeUtilidadComprometido = Number(((rendimientoMensualPanaderia / utilidadMensualPanaderia) * 100).toFixed(1));

  // Multi-year comparison projection table data
  const yearlyProjections = useMemo(() => {
    const data = [];
    let saldoPanaderiaCompuesto = monto;
    let saldoBancoCompuesto = monto;
    let flujoAcumuladoPanaderiaSimple = 0;
    let flujoAcumuladoInmueble = 0;
    let flujoAcumuladoBanco = 0;

    for (let anio = 1; anio <= plazoAnios; anio++) {
      saldoPanaderiaCompuesto = saldoPanaderiaCompuesto * (1 + tasaEfectiva / 100);
      saldoBancoCompuesto = saldoBancoCompuesto * (1 + tasaNetaBanco);
      flujoAcumuladoPanaderiaSimple += rendimientoAnualPanaderia;
      flujoAcumuladoInmueble += rendimientoAnualInmueble;
      flujoAcumuladoBanco += rendimientoAnualBanco;

      data.push({
        anio: `Año ${anio}`,
        panaderiaSimple: Math.round(flujoAcumuladoPanaderiaSimple),
        panaderiaCompuesto: Math.round(saldoPanaderiaCompuesto - monto),
        inmuebleRenta: Math.round(flujoAcumuladoInmueble),
        bancoSimple: Math.round(flujoAcumuladoBanco),
        bancoCompuesto: Math.round(saldoBancoCompuesto - monto),
        saldoTotalPanaderiaCompuesto: Math.round(saldoPanaderiaCompuesto),
        saldoTotalPanaderiaSimple: Math.round(monto + flujoAcumuladoPanaderiaSimple),
        saldoTotalInmueble: Math.round(monto + flujoAcumuladoInmueble),
        saldoTotalBancoCompuesto: Math.round(saldoBancoCompuesto),
      });
    }
    return data;
  }, [monto, tasaEfectiva, tasaNetaBanco, rendimientoAnualPanaderia, rendimientoAnualInmueble, rendimientoAnualBanco, plazoAnios]);

  // Data for live bar chart
  const monthlyFlowChartData = [
    {
      nombre: 'Renta Casa (Neta)',
      monto: Math.round(rentaMensualNetaInmueble),
      tasa: '5.3% neta',
      fill: '#94a3b8'
    },
    {
      nombre: 'Banco / Cetes',
      monto: Math.round(rendimientoMensualBanco),
      tasa: '9.0% neta',
      fill: '#64748b'
    },
    {
      nombre: 'Panadería Santa Fé',
      monto: Math.round(rendimientoMensualPanaderia),
      tasa: `${formatPercent(tasaEfectiva)} anual`,
      fill: '#f59e0b'
    }
  ];

  // Percent widths for visual live meter comparison
  const maxFlow = Math.max(rendimientoMensualPanaderia, rendimientoMensualBanco, rentaMensualNetaInmueble);
  const widthPanaderia = 100;
  const widthBanco = Math.min(100, Math.max(10, Math.round((rendimientoMensualBanco / maxFlow) * 100)));
  const widthCasa = Math.min(100, Math.max(10, Math.round((rentaMensualNetaInmueble / maxFlow) * 100)));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4" />
            <span>Simulador Financiero para Inversionistas</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
            Calculadora de Rendimientos &amp; <span className="font-bold">Comparativa Tripartita</span>
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-300">
            Modo interactivo: Resultados en tiempo real
          </span>
        </div>
      </div>

      {/* DYNAMIC SIDE-BY-SIDE SIMULATOR COCKPIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: CONTROL DECK (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Parámetros de Inversión
              </h3>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
              Desliza para mover
            </span>
          </div>

          {/* Capital Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Capital a Invertir:
              </label>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 font-mono">
                  {formatCurrency(monto)}
                </span>
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                  MXN
                </span>
              </div>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={500000}
              max={10000000}
              step={100000}
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 transition-all hover:bg-slate-200"
            />

            {/* Quick Capital Preset Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {[
                { label: '$1 MDP', val: 1000000 },
                { label: '$2.2 MDP (Ejemplo Casa)', val: 2200000 },
                { label: '$3 MDP', val: 3000000 },
                { label: '$5 MDP', val: 5000000 },
                { label: '$10 MDP', val: 10000000 },
              ].map((preset) => (
                <button
                  key={preset.val}
                  onClick={() => setMonto(preset.val)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                    monto === preset.val
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rate Selector with 13% Personalizada Default */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Tasa de Retorno Anual Acordada:
            </label>

            {/* Mode selection tabs */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setRateMode('libre')}
                className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                  rateMode === 'libre'
                    ? 'bg-white text-amber-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Personalizada
              </button>
              <button
                onClick={() => setRateMode('preferencial')}
                className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                  rateMode === 'preferencial'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Oferta 14.5%
              </button>
              <button
                onClick={() => setRateMode('escala')}
                className={`text-[11px] font-bold py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                  rateMode === 'escala'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Escala Monto
              </button>
            </div>

            {/* Dynamic Rate Control based on mode */}
            {rateMode === 'libre' ? (
              <div className="p-3.5 bg-amber-500/10 border border-amber-300 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-950">
                    Tasa Personalizada (Editable):
                  </span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={8}
                      max={20}
                      step={0.5}
                      value={tasaManual}
                      onChange={(e) => setTasaManual(Number(e.target.value))}
                      className="w-16 px-2 py-0.5 text-base font-black text-right text-amber-700 bg-white border border-amber-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-xs font-bold text-amber-900">% anual</span>
                  </div>
                </div>

                {/* Smooth rate slider */}
                <input
                  type="range"
                  min={8}
                  max={20}
                  step={0.5}
                  value={tasaManual}
                  onChange={(e) => setTasaManual(Number(e.target.value))}
                  className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                />

                {/* Quick Preset Buttons (13% highlighted) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-amber-900/80 mr-1">Rango Clave:</span>
                  {[
                    { label: '13.0%', val: 13.0 },
                    { label: '14.0%', val: 14.0 },
                    { label: '15.0%', val: 15.0 },
                    { label: '16.0%', val: 16.0 },
                  ].map((preset) => (
                    <button
                      key={preset.val}
                      onClick={() => setTasaManual(preset.val)}
                      className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                        tasaManual === preset.val
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white text-amber-900 hover:bg-amber-100 border border-amber-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : rateMode === 'preferencial' ? (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">Oferta Preferencial:</span>
                  <span className="text-xl font-bold text-amber-600 font-mono">14.5% anual</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Punto medio entre 13% y 16% para maximizar atractivo y retención del inversionista.
                </p>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-800">Escala según Capital:</span>
                  <span className="text-xl font-bold text-slate-900 font-mono">
                    {formatPercent(calcularTasaEscala(monto))} anual
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Regla proporcional: 1 MDP genera 8.0%, escalando hasta 10 MDP al 12.0% anual.
                </p>
              </div>
            )}
          </div>

          {/* Plazo & Modalidad */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Plazo de Inversión:
              </label>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5].map((year) => (
                  <button
                    key={year}
                    onClick={() => setPlazoAnios(year)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      plazoAnios === year
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {year}a
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Tipo de Retorno:
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setCapitalizacion('mensual')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    capitalizacion === 'mensual'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Mensual
                </button>
                <button
                  onClick={() => setCapitalizacion('compuesto')}
                  className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                    capitalizacion === 'compuesto'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Compuesto
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE RESULTS & COMPARATIVE METERS (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* THE HERO DISPLAY: Monthly Payout in Big Display */}
          <div className="bg-slate-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/15 via-amber-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Retorno Mensual Líquido
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Tasa {formatPercent(tasaEfectiva)} Anual
                </div>
              </div>

              {/* Huge Monthly Figure */}
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block mb-1">
                  Tu inversionista recibirá mensualmente solo de rendimientos:
                </span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-mono drop-shadow-sm transition-all duration-200">
                    {formatCurrency(rendimientoMensualPanaderia)}
                  </span>
                  <span className="text-amber-400 font-bold text-base sm:text-lg">
                    MXN / mes en efectivo
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2">
                  Flujo garantizado vía transferencia cada 30 días sobre un capital de <strong>{formatCurrency(monto)}</strong>.
                </p>
              </div>

              {/* DYNAMIC COMPARATIVE PROGRESS METERS */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Comparativa de Flujo Mensual en Tiempo Real:</span>
                  <span className="text-amber-400 font-mono">Diferencia Neta</span>
                </div>

                {/* Bar 1: Panadería Santa Fé */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-amber-400" />
                      Panadería Santa Fé ({formatPercent(tasaEfectiva)})
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-sm">
                      {formatCurrency(rendimientoMensualPanaderia)} / mes
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${widthPanaderia}%` }}
                    />
                  </div>
                </div>

                {/* Bar 2: Banco Tradicional */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5 text-slate-400" />
                      Pagaré Bancario / Cetes (9.0% neto)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300">
                        {formatCurrency(rendimientoMensualBanco)} / mes
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 font-mono">
                        +{formatCurrency(diferenciaVsBancoMensual)} más
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="bg-slate-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${widthBanco}%` }}
                    />
                  </div>
                </div>

                {/* Bar 3: Casa / Inmueble */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5 text-slate-400" />
                      Renta de Casa ($2.2M &rarr; $11.5k bruto / ~$9.8k neto)
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-300">
                        {formatCurrency(rentaMensualNetaInmueble)} / mes
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 font-mono">
                        +{formatCurrency(diferenciaVsCasaMensual)} más
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="bg-slate-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${widthCasa}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Delta Highlights Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-medium">Frente a Rentar una Casa:</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                    +{formatCurrency(diferenciaVsCasaMensual)} / mes ({porcentajeVsCasa > 0 ? `+${porcentajeVsCasa}%` : `${porcentajeVsCasa}%`})
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Sin lidiar con inquilinos, contratos vencidos, mantenimiento o predial.
                  </p>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[11px] text-slate-400 block font-medium">Frente a Pagaré Bancario:</span>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5 font-mono">
                    +{formatCurrency(diferenciaVsBancoMensual)} / mes ({porcentajeVsBanco > 0 ? `+${porcentajeVsBanco}%` : `${porcentajeVsBanco}%`})
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Superando por completo la inflación con respaldo de maquinaria física.
                  </p>
                </div>
              </div>

              {/* 3-Pillar Summary Row */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-center">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Flujo Semanal</span>
                  <span className="text-sm sm:text-base font-bold text-white font-mono">
                    {formatCurrency(rendimientoSemanalPanaderia)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Rendimiento Anual</span>
                  <span className="text-sm sm:text-base font-bold text-amber-400 font-mono">
                    {formatCurrency(rendimientoAnualPanaderia)}
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                    Retorno ({plazoAnios} {plazoAnios === 1 ? 'año' : 'años'})
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white font-mono">
                    {formatCurrency(capitalizacion === 'mensual' ? gananciaTotalPanaderiaSimple : gananciaTotalPanaderiaCompuesto)}
                  </span>
                </div>
              </div>

              {/* Viability Footer */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Utilidad Panadería Santa Fé: <strong className="text-slate-200">{formatCurrency(utilidadMensualPanaderia)}/mes</strong></span>
                </div>
                <div className="font-mono text-slate-300">
                  Cobertura: <strong className="text-emerald-400 font-bold">{ratioCobertura}x</strong> ({porcentajeUtilidadComprometido}%)
                </div>
              </div>
            </div>
          </div>

          {/* LIVE CASH FLOW CHART (Right Below Hero) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Gráfica Dinámica: Flujo Mensual en Efectivo (Cash Flow)
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">Actualización en vivo</span>
            </div>
            
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyFlowChartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="nombre" width={120} tick={{ fontSize: 11, fill: '#334155' }} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Flujo Mensual']} />
                  <Bar dataKey="monto" radius={[0, 6, 6, 0]} isAnimationActive={true} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* DETAILED 3-PILLAR COMPARATIVE CARDS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>2. Comparativa Financiera Rigurosa</span>
          </div>
          <h3 className="text-xl font-light text-slate-900">
            Panadería Santa Fé vs. Banco Tradicional vs. <span className="font-bold">Compra de Inmueble (Casa)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
            Comparativa basada en los datos reales del inversionista: <strong>Una casa de $2.2 MDP cobra renta de $11,500 pesos al mes (6.27% bruto anual / ~5.33% neto)</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Casa */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full">
                  <Home className="w-3.5 h-3.5" /> Bienes Raíces (Casa)
                </span>
                <span className="text-xs text-slate-400 font-mono">Dato Real</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Renta Residencial
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Casa de $2.2 MDP cobrando $11,500/mes de renta (6.27% bruto anual).
              </p>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Renta Mensual Bruta:</span>
                  <span className="font-mono font-medium text-slate-700">{formatCurrency(rentaMensualBrutaInmueble)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Renta Mensual Neta:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(rentaMensualNetaInmueble)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Tasa Anual Neta:</span>
                  <span className="font-mono font-medium text-slate-600">~5.33% anual</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Retorno {plazoAnios} Años:</span>
                  <span className="font-mono font-medium text-slate-800">{formatCurrency(gananciaTotalInmueble)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div>&bull; Requiere pago de predial, seguro y mantenimiento.</div>
              <div>&bull; Riesgo latente de meses desocupada sin inquilino.</div>
              <div>&bull; Nula liquidez inmediata ante una emergencia.</div>
            </div>
          </div>

          {/* Card 2: Banco */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-0.5 rounded-full">
                  <Landmark className="w-3.5 h-3.5" /> Banco Tradicional
                </span>
                <span className="text-xs text-slate-400 font-mono">Pagaré / Cetes</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Instrumento Financiero Fijo
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Pagaré bancario promedio ~9.5% bruto (9.0% neto tras retención ISR).
              </p>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Rendimiento Mensual Neto:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {formatCurrency(rendimientoMensualBanco)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Tasa Anual Neta:</span>
                  <span className="font-mono font-medium text-slate-600">9.0% anual</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Retorno {plazoAnios} Años:</span>
                  <span className="font-mono font-medium text-slate-800">{formatCurrency(gananciaTotalBancoSimple)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
              <div>&bull; Tasas a la baja por recortes de política monetaria.</div>
              <div>&bull; La inflación absorbe gran parte del rendimiento.</div>
              <div>&bull; Sin activos productivos físicos de respaldo.</div>
            </div>
          </div>

          {/* Card 3: Panadería Santa Fé */}
          <div className="bg-white border-2 border-amber-500 rounded-xl p-5 flex flex-col justify-between shadow-xs relative">
            <div className="absolute -top-3 right-4 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              Recomendado
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Store className="w-3.5 h-3.5" /> Panadería Santa Fé
                </span>
                <span className="text-xs text-amber-600 font-bold font-mono">{formatPercent(tasaEfectiva)} anual</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">
                Inversión Productiva con Flujo Diario
              </h4>
              <p className="text-xs text-slate-500 mb-4">
                Negocio ya operando con $15.5 MDP anuales en ventas auditadas.
              </p>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-medium">Rendimiento Mensual:</span>
                  <span className="font-mono font-bold text-amber-600 text-base">
                    {formatCurrency(rendimientoMensualPanaderia)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Diferencia vs Casa:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +{formatCurrency(diferenciaVsCasaMensual)} / mes
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Diferencia vs Banco:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    +{formatCurrency(diferenciaVsBancoMensual)} / mes
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 font-medium">Retorno Total {plazoAnios} Años:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {formatCurrency(capitalizacion === 'mensual' ? gananciaTotalPanaderiaSimple : gananciaTotalPanaderiaCompuesto)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <div>&bull; <strong>+{porcentajeVsCasa}% más flujo mensual</strong> que rentar una casa.</div>
              <div>&bull; Respaldo con maquinaria, hornos continuos y camionetas.</div>
              <div>&bull; Contrato mercantil notariado y pagos puntuales mensuales.</div>
            </div>
          </div>
        </div>

        {/* MULTI-YEAR AREA CHART */}
        <div className="bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Proyección de Rendimiento Acumulado a {plazoAnios} Años
              </h4>
              <p className="text-xs text-slate-500">
                Evolución del capital e intereses según la modalidad seleccionada ({capitalizacion === 'mensual' ? 'Flujo Simple Mensual' : 'Capitalización Compuesta'}):
              </p>
            </div>
            <span className="text-xs font-semibold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              Capital Inicial: {formatCurrency(monto)}
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={yearlyProjections} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="anio" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey={capitalizacion === 'mensual' ? 'panaderiaSimple' : 'panaderiaCompuesto'} 
                  stroke="#f59e0b" 
                  fill="#fef3c7" 
                  name={`Panadería Santa Fé (${formatPercent(tasaEfectiva)})`} 
                />
                <Area 
                  type="monotone" 
                  dataKey={capitalizacion === 'mensual' ? 'bancoSimple' : 'bancoCompuesto'} 
                  stroke="#64748b" 
                  fill="#f1f5f9" 
                  name="Banco (9.0%)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="inmuebleRenta" 
                  stroke="#94a3b8" 
                  fill="#f8fafc" 
                  name="Inmueble Renta (~5.3%)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AMORTIZATION TABLE */}
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
            <h4 className="text-sm font-bold text-slate-900">
              Calendario y Cronograma de Retorno Año por Año
            </h4>
            <span className="text-xs text-slate-500">
              Tasa Acordada: <strong className="text-amber-600">{formatPercent(tasaEfectiva)} anual</strong>
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[11px] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Periodo</th>
                  <th className="py-3 px-4 text-right">Rendimiento Mensual</th>
                  <th className="py-3 px-4 text-right">Rendimiento Anual</th>
                  <th className="py-3 px-4 text-right font-bold text-amber-600">Ganancia Acum. Panadería Santa Fé</th>
                  <th className="py-3 px-4 text-right">Ganancia Acum. Banco</th>
                  <th className="py-3 px-4 text-right">Ganancia Acum. Inmueble</th>
                  <th className="py-3 px-4 text-right font-bold text-slate-900">Saldo Total Inversionista</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {yearlyProjections.map((item) => (
                  <tr key={item.anio} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.anio}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatCurrency(rendimientoMensualPanaderia)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">{formatCurrency(rendimientoAnualPanaderia)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-600">
                      {formatCurrency(capitalizacion === 'mensual' ? item.panaderiaSimple : item.panaderiaCompuesto)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {formatCurrency(capitalizacion === 'mensual' ? item.bancoSimple : item.bancoCompuesto)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {formatCurrency(item.inmuebleRenta)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(capitalizacion === 'mensual' ? item.saldoTotalPanaderiaSimple : item.saldoTotalPanaderiaCompuesto)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

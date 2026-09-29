import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Scale, 
  Clock, 
  FileText,
  ShieldAlert,
  ArrowRight,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface ValuationMultiplesSectionProps {
  onSelectMultiple?: (multiple: number, amount: number) => void;
}

export const ValuationMultiplesSection: React.FC<ValuationMultiplesSectionProps> = ({
  onSelectMultiple
}) => {
  // Cartas abiertas por defecto según requerimiento
  const [openedCards, setOpenedCards] = useState<{
    apertura: boolean;
    medio: boolean;
    techo: boolean;
  }>({
    techo: true,
    apertura: true,
    medio: true,
  });

  const handleToggle = (card: 'apertura' | 'medio' | 'techo') => {
    setOpenedCards(prev => ({
      ...prev,
      [card]: !prev[card]
    }));
  };

  const handleOpenAll = () => {
    setOpenedCards({
      apertura: true,
      medio: true,
      techo: true
    });
  };

  const handleCloseAll = () => {
    setOpenedCards({
      apertura: false,
      medio: false,
      techo: false
    });
  };

  // Cifras base financieras acordadas
  const utilidadAnualReportada = 3670572;
  const utilidadMensualReportada = 305881;
  const sueldoAdministracion = 35000;
  const utilidadMensualNormalizada = 270881; // $305,881 - $35,000
  const utilidadAnualNormalizada = utilidadMensualNormalizada * 12; // $3,250,572

  // Escenarios de múltiplos ordenados: 1° Techo 3.5x, 2° Oferta de Apertura 2.4x, 3° Punto Medio 2.9x
  const escenarios = [
    {
      id: 'techo' as const,
      multiplo: '3.5x',
      nombre: 'Techo con Riesgo',
      badge: 'Límite Máximo Condicionado (1° Lugar)',
      badgeColor: 'bg-rose-100 text-rose-950 border-rose-300',
      cardTheme: 'from-rose-950 via-stone-900 to-stone-900 border-rose-500/40',
      highlightBorder: 'border-rose-400',
      highlightBg: 'bg-rose-50/70',
      cifra: 10920000,
      cifraFormatted: '$10,920,000',
      mesesRoi: '40.3 meses',
      aniosRoi: '3.4 años',
      descripcion: 'Techo con riesgo porque las ventas del último trimestre han sido menores que las proyectadas. Superar este umbral pondría en riesgo la viabilidad financiera del negocio.',
      criterio: 'Límite superior del mercado (3.5x EBITDA). Requiere cumplimiento al 100% de proyecciones.',
      ventajas: [
        'Máxima aspiración económica para el vendedor.',
        'Exige acompañamiento o esquemas diferidos para no asfixiar el capital de trabajo.',
        'Retorno prolongado a 40.3 meses (~3.4 años).'
      ]
    },
    {
      id: 'apertura' as const,
      multiplo: '2.4x',
      nombre: 'Oferta de Apertura',
      badge: 'Apertura Prudente (2° Lugar)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      cardTheme: 'from-amber-950 via-stone-900 to-stone-900 border-amber-500/40',
      highlightBorder: 'border-amber-500',
      highlightBg: 'bg-amber-50/70',
      cifra: 7800000,
      cifraFormatted: '$7,800,000',
      mesesRoi: '28.8 meses',
      aniosRoi: '2.4 años',
      descripcion: 'Oferta disciplinada de entrada para iniciar la negociación. Protege la liquidez inicial y mitiga el riesgo de variabilidad del último trimestre.',
      criterio: 'Rango conservador de mercado (Capital en Orden: 2x - 2.5x).',
      ventajas: [
        'Recuperación acelerada del capital en menos de 29 meses.',
        'Colchón financiero amplio para absorber imprevistos o caídas de venta.',
        'Certeza de pago sin presionar el flujo operativo de las sucursales.'
      ]
    },
    {
      id: 'medio' as const,
      multiplo: '2.9x',
      nombre: 'Punto Medio de Negociación',
      badge: 'Punto de Equilibrio Recomendado (3° Lugar)',
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
      cardTheme: 'from-emerald-950 via-stone-900 to-stone-900 border-emerald-500/50',
      highlightBorder: 'border-emerald-500',
      highlightBg: 'bg-emerald-50/80',
      cifra: 9360000,
      cifraFormatted: '$9,360,000',
      mesesRoi: '34.6 meses',
      aniosRoi: '2.9 años',
      descripcion: 'Punto medio de negociación justo y razonable para ambas partes. Reconoce el valor de la empresa en marcha (Zákia y El Refugio) manteniendo un periodo de retorno por debajo de los 3 años.',
      criterio: 'Punto de equilibrio óptimo dentro del estándar PyME México (2.5x - 3.5x).',
      ventajas: [
        'Retorno de inversión en exactamente 34.6 meses sin tocar un solo peso de utilidad.',
        'Precio competitivo que reconoce el esfuerzo patrimonial del fundador.',
        'Atractivo tanto para Don Juventino como para la estructura de fondeo.'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. HEADER EXPLICATIVO OFICIAL */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white rounded-3xl p-6 sm:p-9 shadow-lg border border-stone-800 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -bottom-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Fundamento Técnico &bull; Metodología de Valuación PyME México</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Cómo se llegó a la cifra propuesta &bull; <span className="text-amber-400">Racional Financiero</span>
          </h2>

          <p className="text-stone-200 text-sm sm:text-base leading-relaxed font-normal">
            Este documento explica, de forma clara, cómo se llegó a la cifra propuesta, a la información financiera que alineamos. <strong className="text-white font-semibold">No es un número arbitrario: Es un número que resulta de los reportes de venta y gasto.</strong> Confiando en que los últimos meses proyectados sean correctos y no menores.
          </p>
        </div>

        {/* 2. RECUADROS DE ALINEACIÓN DE UTILIDAD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-stone-800/80 relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Utilidad Neta Reportada Anual
            </span>
            <div className="text-2xl font-black text-white font-mono mt-1">
              {formatCurrency(utilidadAnualReportada)}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Zákia ($986k) + El Refugio ($2.68M)
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
              Utilidad Reportada Mensual
            </span>
            <div className="text-2xl font-black text-amber-300 font-mono mt-1">
              {formatCurrency(utilidadMensualReportada)}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Promedio antes de honorario directivo
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] font-bold text-rose-300 uppercase tracking-wider block">
              (-) Costo Administración
            </span>
            <div className="text-2xl font-black text-rose-300 font-mono mt-1">
              -{formatCurrency(sueldoAdministracion)}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Sueldo de administración profesional
            </p>
          </div>

          <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-2xl p-4 backdrop-blur-xs">
            <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
              (=) Utilidad Normalizada
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
              {formatCurrency(utilidadMensualNormalizada)}
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-1 font-semibold">
              ${formatCurrency(utilidadAnualNormalizada)} al año normalizado
            </p>
          </div>
        </div>
      </div>

      {/* 3. CRITERIO DE REFERENCIA DE MERCADO (MÉXICO - CAPITAL EN ORDEN) */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-stone-900 font-bold text-base sm:text-lg">
          <Briefcase className="w-5 h-5 text-amber-700" />
          <h3>Múltiplos de Referencia del Mercado Mexicano de PyMEs</h3>
        </div>

        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          Para convertir esa utilidad en un precio de negocio, se usa un múltiplo de referencia del mercado mexicano de PyMEs — el mismo criterio que usan compradores y valuadores para negocios de alimentos con más de una sucursal en México:
        </p>

        <div className="overflow-x-auto border border-stone-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-100 text-stone-800 font-bold text-[11px] uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4 sm:px-6 w-5/12">Referencia de Mercado (México) &amp; Publicación</th>
                <th className="py-3 px-4 text-center w-2/12">Múltiplo Típico</th>
                <th className="py-3 px-4 sm:px-6 w-5/12">Criterio Técnico / Factor Clave</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-stone-700">
              {/* Referencia 1: Multiplos bajos */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">
                    Capital en Orden
                  </div>
                  <div className="text-xs text-amber-900 font-medium mt-0.5">
                    Concentración de clientes extrema comprime el múltiplo a 2x&ndash;2.5x
                  </div>
                  <a
                    href="https://capitalenorden.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-900 font-semibold underline mt-1.5 transition-colors"
                    title="Abrir enlace de referencia en nueva pestaña"
                  >
                    <span>capitalenorden.com</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-900 bg-amber-50/50">
                  <span className="px-2.5 py-1 rounded-md bg-amber-100 border border-amber-300 text-xs">
                    2x &ndash; 2.5x
                  </span>
                  <span className="block text-[10px] text-stone-500 mt-1 font-normal">EBITDA normalizado</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-xs text-stone-600 leading-relaxed">
                  Aplica cuando la concentración de ingresos o la dependencia en personas clave comprime los múltiplos hacia rangos conservadores (2.0x a 2.5x), justificando una oferta prudente de entrada.
                </td>
              </tr>

              {/* Referencia 2: Como comprar una empresa */}
              <tr className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-4 sm:px-6">
                  <div className="font-bold text-stone-900 text-xs sm:text-sm">
                    Capital en Orden &mdash; &ldquo;Cómo Comprar una Empresa en México&rdquo;
                  </div>
                  <div className="text-xs text-emerald-900 font-medium mt-0.5">
                    Negocios con alta dependencia del fundador se ubican en 2.5x&ndash;3.5x EBITDA
                  </div>
                  <a
                    href="https://capitalenorden.com/guia/comprar-empresa-mexico"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline mt-1.5 transition-colors"
                    title="Abrir enlace de referencia en nueva pestaña"
                  >
                    <span>capitalenorden.com/guia/comprar-empresa-mexico</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </td>
                <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-900 bg-emerald-50/50">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-xs">
                    2.5x &ndash; 3.5x
                  </span>
                  <span className="block text-[10px] text-stone-500 mt-1 font-normal">EBITDA normalizado</span>
                </td>
                <td className="py-3.5 px-4 sm:px-6 text-xs text-stone-600 leading-relaxed">
                  Aplica a PyMEs de alimentos con marca reconocida y 2 unidades operando que requieren un periodo de transición estructurado para desvincular al fundador sin mermar ventas ni utilidades.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. CARTAS INTERACTIVAS DE VALUACIÓN (ORDEN: 1° TECHO 3.5x, 2° APERTURA 2.4x, 3° MEDIO 2.9x) */}
      <div className="space-y-4">
        {/* Barra de control para abrir / cerrar cartas */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-amber-50/90 border border-amber-200 rounded-2xl shadow-xs">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>Cartas de Valuación y Negociación (Abiertas)</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
              1° Techo de 3.5x &bull; 2° Oferta de Apertura (2.4x) &bull; 3° Punto Medio (2.9x)
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              Las 3 cartas se presentan abiertas en el orden solicitado para su consulta y análisis de retorno de inversión.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:shrink-0">
            <button
              type="button"
              onClick={handleOpenAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Abrir las 3 cartas"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Abrir las 3 Cartas</span>
            </button>
            <button
              type="button"
              onClick={handleCloseAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Tapar las 3 cartas"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Tapar las 3 Cartas</span>
            </button>
          </div>
        </div>

        {/* Grid de las 3 Cartas Cerradas / Abiertas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {escenarios.map((esc) => {
            const isOpened = openedCards[esc.id];

            return (
              <div key={esc.id} className="flex flex-col">
                {!isOpened ? (
                  /* ================= ESTADO CARTA CERRADA ================= */
                  <div
                    onClick={() => handleToggle(esc.id)}
                    className={`group relative rounded-3xl p-6 sm:p-7 bg-gradient-to-br ${esc.cardTheme} text-white border-2 hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden min-h-[440px] active:scale-[0.99]`}
                  >
                    {/* Glow decorativo */}
                    <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/10 rounded-full blur-2xl group-hover:bg-amber-400/25 transition-all pointer-events-none" />

                    {/* Cabecera de la carta cerrada */}
                    <div className="flex items-center justify-between gap-2 relative z-10">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700 text-amber-300 text-[11px] font-bold tracking-wider uppercase">
                        <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                        Carta Cerrada
                      </span>
                      <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-amber-400/80">
                        {esc.multiplo}
                      </span>
                    </div>

                    {/* Contenido central sellado */}
                    <div className="text-center my-6 space-y-4 relative z-10">
                      {/* Sello de cera / Icono confidencial */}
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-stone-950 flex items-center justify-center shadow-xl border-4 border-amber-200/40 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                        <FileText className="w-9 h-9 text-stone-950" />
                      </div>

                      <div>
                        <span className="text-xs font-bold text-amber-300 uppercase tracking-widest block">
                          {esc.multiplo} EBITDA Normalizado
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-amber-50 tracking-tight mt-1 font-serif">
                          {esc.nombre}
                        </h3>
                        <p className="text-xs text-stone-300 mt-2 font-medium max-w-xs mx-auto leading-relaxed">
                          {esc.id === 'medio' 
                            ? 'Punto medio de negociación a revelar al tocar la carta en reunión.'
                            : esc.id === 'apertura'
                            ? 'Oferta disciplinada de apertura basada en múltiplos prudentes.'
                            : 'Techo condicionado al cumplimiento estricto del último trimestre.'}
                        </p>
                      </div>

                      <div className="py-2">
                        <span className="inline-block text-[11px] font-mono text-stone-400 border border-stone-700/60 rounded-lg px-3 py-1 bg-stone-900/60">
                          Cifra sellada &bull; Toca para abrir
                        </span>
                      </div>
                    </div>

                    {/* Botón inferior para abrir */}
                    <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 group-hover:bg-amber-500 text-amber-300 group-hover:text-stone-950 font-bold text-xs transition-all border border-amber-400/40">
                        <span>Toca para abrir la carta</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= ESTADO CARTA ABIERTA ================= */
                  <div
                    className={`rounded-3xl p-6 sm:p-7 border-2 ${esc.highlightBorder} ${esc.highlightBg} shadow-md transition-all flex flex-col justify-between min-h-[440px]`}
                  >
                    <div className="space-y-4">
                      {/* Top Bar con badge y botón para tapar */}
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${esc.badgeColor}`}>
                          <Sparkles className="w-3.5 h-3.5" />
                          {esc.multiplo} &bull; {esc.nombre}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleToggle(esc.id)}
                          className="text-[11px] font-semibold text-stone-500 hover:text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          title="Tapar esta carta"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Tapar</span>
                        </button>
                      </div>

                      {/* Título y Cifra Principal */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                          {esc.multiplo} de Utilidad Normalizada ($270,881/mes)
                        </span>
                        <div className="text-3xl sm:text-4xl font-black text-stone-900 font-mono tracking-tight mt-1">
                          {esc.cifraFormatted} <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
                        </div>
                      </div>

                      {/* RECUADRO OBLIGATORIO DE RETORNO DE INVERSIÓN (RESALTADO Y EN NEGRITAS) */}
                      <div className="p-3.5 rounded-2xl bg-white border-2 border-amber-400/80 shadow-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-stone-950 font-extrabold text-xs uppercase tracking-wide">
                            <Clock className="w-4 h-4 text-amber-700" />
                            <span>ROI Tiempo de Retorno de Inversión:</span>
                          </div>
                          <span className="text-xs font-bold text-stone-500 font-mono">({esc.aniosRoi})</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-stone-950 font-mono tracking-tight">
                          {esc.mesesRoi}
                        </div>
                        <div className="pt-1 border-t border-amber-200">
                          <span className="block text-xs font-black text-amber-950 uppercase tracking-tight bg-amber-100 border border-amber-300/80 px-2 py-1 rounded-md text-center shadow-2xs">
                            &ldquo;no tocando un solo peso de utilidad&rdquo;
                          </span>
                        </div>
                      </div>

                      {/* Explicación y contexto */}
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {esc.descripcion}
                      </p>

                      {/* Alerta de riesgo específica en el techo de 3.5x */}
                      {esc.id === 'techo' && (
                        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-900 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>
                            <strong>Riesgo latente:</strong> Las ventas del último trimestre han sido menores que las proyectadas originalmente.
                          </span>
                        </div>
                      )}

                      {/* Puntos de valor */}
                      <ul className="space-y-1.5 text-xs text-stone-700 pt-1">
                        {esc.ventajas.map((v, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{v}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Botón de acción si se requiere seleccionar */}
                    {onSelectMultiple && (
                      <div className="mt-4 pt-3 border-t border-stone-200/80">
                        <button
                          type="button"
                          onClick={() => onSelectMultiple(parseFloat(esc.multiplo), esc.cifra)}
                          className="w-full py-2 px-3 text-xs font-bold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Usar este escenario en corridas</span>
                          <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Resumen comparativo de ROI */}
        <div className="bg-stone-100/80 border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-700">
          <div className="space-y-1 text-center sm:text-left">
            <span className="font-bold text-stone-900 block">
              Regla de Recuperación sin Retirar Flujo Operativo:
            </span>
            <p className="text-stone-600 text-[11px]">
              Los 3 escenarios se calculan dividiendo el monto acordado entre los <strong className="text-stone-900">$270,881 MXN mensuales netos</strong> (después de $35,000 de administración).
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-amber-200/70 border border-amber-300 font-mono font-bold text-amber-950">
              2.4x: 28.8 meses
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-200/70 border border-emerald-300 font-mono font-bold text-emerald-950">
              2.9x: 34.6 meses
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-200/70 border border-rose-300 font-mono font-bold text-rose-950">
              3.5x: 40.3 meses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { TOTALES_CONSOLIDADOS, BENCHMARK_INMUEBLE } from '../data/financialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { 
  Briefcase, 
  ShieldCheck, 
  TrendingUp, 
  Store, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Lock, 
  Award,
  ArrowRight,
  Sparkles,
  PieChart as PieChartIcon
} from 'lucide-react';

interface ExecutiveSummaryTabProps {
  onGoToCalculator: () => void;
  onGoToBranches: () => void;
}

export const ExecutiveSummaryTab: React.FC<ExecutiveSummaryTabProps> = ({ 
  onGoToCalculator, 
  onGoToBranches 
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner: Executive Pitch */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xs border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-amber-400 border border-slate-700 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Oportunidad de Inversión Privada &bull; Ronda Semilla
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-tight">
            Adquisición de Cadena en Marcha &bull; <span className="font-bold text-white">PANADERÍA SANTA FÉ</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Levantamiento de capital de <strong>$10,000,000 MXN</strong> para la compra estratégica y consolidación de <strong>Panadería Santa Fé</strong> (2 sucursales en plena operación: Zákia y El Refugio, Querétaro). Facturación superior a <strong>$15.5 Millones de Pesos anuales</strong>, flujo de caja diario inmediato y retornos garantizados del <strong>13% al 16% anual</strong> con respaldo en activos físicos.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToCalculator}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs uppercase tracking-widest transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Simular Rendimientos Mensuales</span>
            </button>
            <button
              onClick={onGoToBranches}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span>Ver Números por Sucursal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Core KPIs of the Business */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
            Ventas Mensuales Reales
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-mono tracking-tight">
            {formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasTotal)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Anualizado: <strong className="text-slate-700">{formatCurrency(TOTALES_CONSOLIDADOS.proyeccionAnualizadaVentas)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
            Utilidad Neta Mensual
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1 font-mono tracking-tight">
            {formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualTotal)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Margen Neto Sólido: <strong className="text-emerald-700">14.5%</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
            Target ROI Anual
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-amber-500 mt-1 font-mono tracking-tight">
            13% &ndash; 16% <span className="text-xs font-normal text-slate-500">anual</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pago mensual en cuenta bancaria
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block">
            Ventas Auditadas (7 Meses)
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 font-mono tracking-tight">
            {formatCurrency(TOTALES_CONSOLIDADOS.ventas7MesesAmbas)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Utilidad acumulada: <strong className="text-slate-700">{formatCurrency(TOTALES_CONSOLIDADOS.utilidad7MesesTotal)}</strong>
          </p>
        </div>
      </div>

      {/* Visual Benchmark Progress Meters (Matching Clean Minimalism theme) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Comparativa de Rentabilidad vs Alternativas ($2.2 MDP)</h3>
            <p className="text-xs text-slate-500">Rendimiento mensual neto en efectivo por cada $2,200,000 MXN invertidos</p>
          </div>
          <button 
            onClick={onGoToCalculator}
            className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            Ver simulador completo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4 pt-1">
          {/* Real Estate */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Bienes Raíces Tradicionales (Renta de Casa de $2.2M)</span>
              <span className="font-bold font-mono text-slate-600">$11,500 / mes</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-slate-400 h-full rounded-full" style={{ width: '42%' }}></div>
            </div>
            <div className="text-[11px] text-right mt-1 text-slate-400">~5.3% Rendimiento Neto Real (tras predial y mantenimiento)</div>
          </div>

          {/* Bank */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700">Pagaré Bancario / Cetes a 28 días</span>
              <span className="font-bold font-mono text-slate-600">$16,500 / mes</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: '60%' }}></div>
            </div>
            <div className="text-[11px] text-right mt-1 text-slate-400">9.0% Neto (tasas en tendencia descendente)</div>
          </div>

          {/* Bakery Offer */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Inversión en Panadería Santa Fé (Tu Oferta)
              </span>
              <span className="font-extrabold font-mono text-amber-600">$25,667 &ndash; $29,333 / mes</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
            <div className="text-[11px] text-right mt-1 font-semibold text-amber-600">14.0% &ndash; 16.0% Anual (¡Más del doble que una casa!)</div>
          </div>
        </div>
      </div>

      {/* THE 6 PILLARS TO CONVINCE INVESTORS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">
          Propuesta de Valor Irresistible
        </div>
        <h3 className="text-2xl font-light text-slate-900 mb-2">
          ¿Por qué este proyecto <span className="font-bold">supera a cualquier otra alternativa</span>?
        </h3>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Los inversionistas buscan tres cosas primordiales: <strong>seguridad del capital, flujo recurrente de efectivo y retornos superiores a la inflación</strong>. La adquisición de <strong>Panadería Santa Fé</strong> cumple cabalmente con cada una:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold mb-3 shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1">
                1. Doble de Flujo que una Casa
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Por los mismos <strong>$2.2 MDP</strong> que una casa genera <strong>$11,500/mes</strong> de renta (con inquilinos morosos y gastos de predial), nuestro proyecto entrega <strong>de $25,600 a $29,333 pesos mensuales</strong> limpios en su cuenta.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-amber-600 font-bold">
              +140% más rendimiento en efectivo
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold mb-3 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1">
                2. Negocio en Marcha "Turn-Key"
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No es una promesa ni un startup de riesgo. <strong>Panadería Santa Fé</strong> es un negocio probado que <strong>ya factura $1.29 MDP al mes</strong> con clientes fidelizados, recetas artesanales consolidadas, personal capacitado y hornos industriales funcionando 7 días a la semana.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-amber-600 font-bold">
              Cero tiempo muerto de arranque
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold mb-3 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1">
                3. Respaldo en Activos Tangibles
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A diferencia de pagarés bancarios o acciones bursátiles volátiles, la inversión está respaldada por maquinaria de grado alimenticio, hornos de alta eficiencia a gas LP, camionetas de reparto utilitarias e inventario de rotación diaria.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-amber-600 font-bold">
              Garantía física y prendaria
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold mb-3 shadow-xs">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1">
                4. Demanda Inelástica y Anticíclica
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                El pan es un alimento de primera necesidad en la canasta básica mexicana. La gente compra pan todos los días, tanto en tiempos de bonanza como de incertidumbre económica. Cobros diarios tanto con tarjeta bancaria como en efectivo.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-amber-600 font-bold">
              Flujo de caja 365 días al año
            </div>
          </div>

          {/* Pillar 5 */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold mb-3 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-slate-900 mb-1">
                5. Certeza Jurídica &amp; Transparencia
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Estructura de inversión mediante Contrato de Asociación en Participación o Pagaré Mercantil notariado. Fechas de pago inamovibles (días 1 o 15 de cada mes), con reportes contables mensuales y auditorías semestrales para los inversionistas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-amber-600 font-bold">
              Contratos mercantiles claros
            </div>
          </div>
        </div>
      </div>

      {/* QUICK BENCHMARK SUMMARY (CASA vs BANCO vs PANADERÍA) */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4 mb-6">
            <div>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                Resumen Ejecutivo Comparativo
              </span>
              <h3 className="text-xl font-light text-white">
                ¿Por qué invertir en Panadería Santa Fé y no <span className="font-bold">comprar una casa o dejarlo en el banco</span>?
              </h3>
            </div>
            <button
              onClick={onGoToCalculator}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer self-start sm:self-auto"
            >
              Ir a Calculadora Interactiva &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-2 bg-slate-800/80 p-5 rounded-xl border border-slate-700/80">
              <div className="text-slate-400 font-bold uppercase text-[11px]">Casa / Bienes Raíces ($2.2 MDP)</div>
              <div className="text-2xl font-light text-white font-mono">$11,500 <span className="text-xs opacity-60">/ mes</span></div>
              <p className="text-slate-400 leading-relaxed">
                Por <strong>$2.2 MDP</strong> invertidos en una casa, la renta mensual neta ronda apenas los $9,775 MXN (~5.3% neto tras predial y mantenimiento). Además el capital queda inmovilizado.
              </p>
            </div>

            <div className="space-y-2 bg-slate-800/80 p-5 rounded-xl border border-slate-700/80">
              <div className="text-slate-400 font-bold uppercase text-[11px]">Pagaré Bancario / Cetes</div>
              <div className="text-2xl font-light text-white font-mono">$16,500 <span className="text-xs opacity-60">/ mes</span></div>
              <p className="text-slate-400 leading-relaxed">
                Por los mismos $2.2 MDP al 9.0% neto bancario, genera $16,500/mes. Sin embargo, las tasas van a la baja y la inflación erosiona el poder adquisitivo.
              </p>
            </div>

            <div className="space-y-2 bg-slate-800 p-5 rounded-xl border-2 border-amber-500/80 relative">
              <div className="flex justify-between items-center">
                <div className="text-amber-400 font-bold uppercase text-[11px]">Panadería Santa Fé (Tu Oferta)</div>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase">Recomendado</span>
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono">$25,667 &ndash; $29,333 <span className="text-xs opacity-80">/ mes</span></div>
              <p className="text-slate-300 leading-relaxed">
                Por los mismos $2.2 MDP, a tasas del 14% al 16% acordadas, el inversionista recibe de <strong>$25,667 a $29,333 pesos al mes</strong> en efectivo puntual, duplicando o triplicando la renta de la casa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

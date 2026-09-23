import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Scale,
  PieChart as PieChartIcon,
  BarChart3,
  Printer,
  Briefcase,
  Check,
  RotateCcw
} from 'lucide-react';
import { 
  TOTALES_CONSOLIDADOS, 
  VENTAS_ZAKIA, 
  VENTAS_REFUGIO, 
  RESUMEN_UTILIDAD_ZAKIA, 
  RESUMEN_UTILIDAD_REFUGIO 
} from '../data/financialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
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
import { SummaryEquationCards } from './SummaryEquationCards';

interface UnifiedConsolidatedTabProps {
  onExport?: () => void;
}

export const UnifiedConsolidatedTab: React.FC<UnifiedConsolidatedTabProps> = ({ onExport }) => {
  // Estado para restar $35,000 MXN mensuales por concepto de Administración General
  const [deducirAdminGeneral, setDeducirAdminGeneral] = useState<boolean>(false);

  const MONTO_ADMIN_MENSUAL = 35000;
  const MONTO_ADMIN_ANUAL = MONTO_ADMIN_MENSUAL * 12; // $420,000 MXN

  // 1. Venta anualizada y mensual (Permanecen idénticas al 100% de la facturación)
  const ventasMensualesTotal = TOTALES_CONSOLIDADOS.promedioMensualVentasTotal; // $1,340,722 MXN
  const ventasAnualesTotal = TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal; // $16,088,656 MXN
  const ventasAnualizadas = TOTALES_CONSOLIDADOS.proyeccionAnualizadaVentas; // $16,088,656 MXN

  // 2. Costos operativos mensuales y anualizados
  const gastosMensualesTotal = deducirAdminGeneral
    ? TOTALES_CONSOLIDADOS.gastosMensualesTotal + MONTO_ADMIN_MENSUAL // $1,105,171 + $35,000 = $1,140,171 MXN
    : TOTALES_CONSOLIDADOS.gastosMensualesTotal; // $1,105,171 MXN

  const gastosAnualesTotal = deducirAdminGeneral
    ? TOTALES_CONSOLIDADOS.gastosAnualesCadenaTotal + MONTO_ADMIN_ANUAL // $13,262,047 + $420,000 = $13,682,047 MXN
    : TOTALES_CONSOLIDADOS.gastosAnualesCadenaTotal; // $13,262,047 MXN

  const costosOperativosAnualizados = deducirAdminGeneral
    ? TOTALES_CONSOLIDADOS.proyeccionAnualizadaGastos + MONTO_ADMIN_ANUAL // $13,682,047 MXN
    : TOTALES_CONSOLIDADOS.proyeccionAnualizadaGastos; // $13,262,047 MXN

  const gastosSemanalesTotal = deducirAdminGeneral
    ? Math.round(TOTALES_CONSOLIDADOS.gastosSemanalesTotal + (MONTO_ADMIN_ANUAL / 52)) // $262,486 MXN
    : TOTALES_CONSOLIDADOS.gastosSemanalesTotal; // $254,409 MXN

  // 3. Utilidad neta mensual: calculada sobre 200,551 MXN exactos cuando está activo
  const utilidadMensualTotal = deducirAdminGeneral
    ? 200551 // $235,551 - $35,000 = $200,551 MXN
    : TOTALES_CONSOLIDADOS.utilidadMensualTotal; // $235,551 MXN

  // 4. Utilidad neta anualizada: $200,551 x 12 = $2,406,612 MXN
  const utilidadNetaAnualizada = deducirAdminGeneral
    ? 200551 * 12 // $2,406,612 MXN
    : TOTALES_CONSOLIDADOS.proyeccionAnualizadaUtilidad; // $2,826,609 MXN

  // Margen neto ponderado
  const margenPonderadoTotal = Number(((utilidadMensualTotal / ventasMensualesTotal) * 100).toFixed(2));

  // Monthly consolidated data for all 12 months
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const consolidatedMonthly = meses.map((mes) => {
    const vz = VENTAS_ZAKIA.find(v => v.mes === mes)?.ventaTotalMensual || 0;
    const vr = VENTAS_REFUGIO.find(v => v.mes === mes)?.ventaTotalMensual || 0;
    const gz = RESUMEN_UTILIDAD_ZAKIA.find(r => r.mes === mes)?.gastosOperativos || 399400;
    const gr = RESUMEN_UTILIDAD_REFUGIO.find(r => r.mes === mes)?.gastosOperativos || 705771;
    const adminMes = deducirAdminGeneral ? MONTO_ADMIN_MENSUAL : 0;
    const uz = vz - gz;
    const ur = vr - gr;
    const ut = (uz + ur) - adminMes;

    return {
      mes,
      ventasZakia: vz,
      ventasRefugio: vr,
      ventasTotal: vz + vr,
      gastosTotal: gz + gr + adminMes,
      utilidadZakia: uz,
      utilidadRefugio: ur,
      utilidadTotal: ut,
      margenTotal: Number((((ut) / (vz + vr)) * 100).toFixed(1))
    };
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Panadería Santa Fé &bull; Consolidación de Cadena (Zákia + El Refugio)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Estado Financiero Consolidado Unificado (12 Meses Auditados)
          </h2>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed">
            Visión integral de <strong>Panadería Santa Fé</strong> consolidada con la ronda de $10 MDP. Dos ubicaciones estratégicas sinérgicas generando <strong>{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)}</strong> anuales en ventas brutas y <strong>{formatCurrency(utilidadNetaAnualizada)}</strong> en utilidad neta anualizada.
          </p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
            title="Exportar hoja ejecutiva auditada en conjunto"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar Resumen PDF</span>
          </button>
        )}
      </div>

      {/* CORE FORMULA CONSOLIDADA: INGRESOS - GASTOS = UTILIDAD */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center justify-between flex-wrap gap-3">
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-amber-700" />
            Ecuación Financiera Mensual Consolidada (Ambas Sucursales)
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDeducirAdminGeneral(!deducirAdminGeneral)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                deducirAdminGeneral
                  ? 'bg-stone-800 text-stone-100 border-stone-800 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 shadow-2xs'
              }`}
              title="Alternar deducción de $35,000 mensuales de Administración General"
            >
              <Briefcase className="w-3.5 h-3.5 text-stone-400" />
              <span>{deducirAdminGeneral ? 'Restar $35,000 Admón. Gral. (Activo)' : 'Restar $35,000 Admón. Gral.'}</span>
              <span className={`w-2 h-2 rounded-full ${deducirAdminGeneral ? 'bg-emerald-400' : 'bg-stone-300'}`} />
            </button>
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-100">
              Flujo Operativo Validado
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Total Ingresos */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-stone-900 font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Ingresos Totales / Mes
              </span>
              <span className="text-stone-400 font-mono">100%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
              {formatCurrency(ventasMensualesTotal)}
            </div>
            <div className="mt-2 text-xs text-stone-600 space-y-0.5">
              <div className="flex justify-between">
                <span>Refugio ({((TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio / ventasMensualesTotal) * 100).toFixed(1)}%):</span>
                <span className="font-semibold text-stone-800 font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia ({((TOTALES_CONSOLIDADOS.promedioMensualVentasZakia / ventasMensualesTotal) * 100).toFixed(1)}%):</span>
                <span className="font-semibold text-stone-800 font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasZakia)}</span>
              </div>
            </div>
          </div>

          {/* Menos Gastos */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-stone-900 font-bold">
                <DollarSign className="w-4 h-4 text-amber-600" />
                Gastos Operativos / Mes
              </span>
              <span className="text-stone-500 font-mono">{((gastosMensualesTotal / ventasMensualesTotal) * 100).toFixed(1)}%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono">
              {formatCurrency(gastosMensualesTotal)}
            </div>
            <div className="mt-2 text-xs text-stone-600 space-y-0.5">
              <div className="flex justify-between">
                <span>Refugio:</span>
                <span className="font-semibold text-stone-800 font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia:</span>
                <span className="font-semibold text-stone-800 font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesZakia)}</span>
              </div>
              {deducirAdminGeneral && (
                <div className="flex justify-between text-stone-700 font-medium pt-1 border-t border-stone-200">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-stone-500" />
                    Admón. General:
                  </span>
                  <span className="font-mono">+{formatCurrency(MONTO_ADMIN_MENSUAL)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Igual Utilidad */}
          <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Utilidad Neta / Mes
              </span>
              <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-mono">
                {margenPonderadoTotal}% Margen
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 font-mono">
              {formatCurrency(utilidadMensualTotal)}
            </div>
            <div className="mt-2 text-xs text-emerald-800 space-y-0.5 font-medium">
              <div className="flex justify-between">
                <span>Refugio ({((TOTALES_CONSOLIDADOS.utilidadMensualRefugio / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% de util.):</span>
                <span className="font-bold font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia ({((TOTALES_CONSOLIDADOS.utilidadMensualZakia / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% de util.):</span>
                <span className="font-bold font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualZakia)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annualized Projection Bar (Venta Anualizada, Costo Operativo Anualizado, Utilidad Neta Anualizada) */}
        <div className="mt-6 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-xs text-stone-700 block font-semibold">Venta Anualizada (12 Meses):</span>
            <span className="text-xl font-extrabold text-stone-900 font-mono">{formatCurrency(ventasAnualizadas)}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">100% ingresos de la red</span>
          </div>
          <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
            <span className="text-xs text-stone-700 block font-semibold">Costos Operativos Anualizados:</span>
            <span className="text-xl font-extrabold text-stone-800 font-mono">{formatCurrency(costosOperativosAnualizados)}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              {deducirAdminGeneral 
                ? 'Incluye +$420,000 anuales de Admón.' 
                : 'Sucursales Zákia + El Refugio'}
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-300">
            <span className="text-xs text-emerald-900 font-bold block">Utilidad Neta Anualizada:</span>
            <span className="text-xl font-black text-emerald-950 font-mono">{formatCurrency(utilidadNetaAnualizada)}</span>
            <span className="text-[10px] text-emerald-800 block mt-0.5 font-bold">
              {deducirAdminGeneral 
                ? 'Calculada sobre $200,551/mes (x 12 meses)' 
                : 'Calculada sobre $235,551/mes (x 12 meses)'}
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-side Branch Comparison Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Comparativa Directa: Sucursal Zákia vs. Sucursal El Refugio
            </h3>
            <p className="text-xs text-stone-700 mt-0.5">
              Diferencias de volumen, estructura de costos y aportación al negocio consolidado {deducirAdminGeneral && '(con deducción de $35k de Administración General)'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Métrica Financiera / Operativa</th>
                <th className="py-3 px-4 text-right">Sucursal Zákia</th>
                <th className="py-3 px-4 text-right">Sucursal El Refugio</th>
                <th className="py-3 px-4 text-right font-bold text-stone-900">Total Consolidado</th>
                <th className="py-3 px-4 text-center">Aportación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Ventas Promedio Mensuales</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasZakia)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(ventasMensualesTotal)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">{((TOTALES_CONSOLIDADOS.promedioMensualVentasZakia / ventasMensualesTotal) * 100).toFixed(1)}% Z / {((TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio / ventasMensualesTotal) * 100).toFixed(1)}% R</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Ventas Anuales (12M Auditadas / Anualizadas)</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesRefugio12M)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(ventasAnualesTotal)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">100% de la red</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Gasto Operativo Mensual Proyectado</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesZakia)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesRefugio)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">
                  {formatCurrency(gastosMensualesTotal)}
                  {deducirAdminGeneral && (
                    <span className="block text-[10px] text-amber-700 font-normal">incluye +$35k admón.</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">
                  {deducirAdminGeneral ? 'Red + Admón. Gral.' : `${((TOTALES_CONSOLIDADOS.gastosMensualesZakia / TOTALES_CONSOLIDADOS.gastosMensualesTotal) * 100).toFixed(1)}% Z / ${((TOTALES_CONSOLIDADOS.gastosMensualesRefugio / TOTALES_CONSOLIDADOS.gastosMensualesTotal) * 100).toFixed(1)}% R`}
                </td>
              </tr>
              {deducirAdminGeneral && (
                <tr className="bg-stone-50 border-t border-b border-stone-200">
                  <td className="py-3 px-4 font-semibold text-stone-900 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                    <span>Administración General</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-stone-400">-</td>
                  <td className="py-3 px-4 text-right font-mono text-stone-400">-</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">+{formatCurrency(MONTO_ADMIN_MENSUAL)}</td>
                  <td className="py-3 px-4 text-center text-xs text-stone-600">Deducción mensual</td>
                </tr>
              )}
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Gasto de Nómina Operativa Semanal</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(28000)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(50000)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(78000)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">{formatCurrency(338743)} / mes</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Materia Prima Dialpa (Harinas) / Semanal</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(25000)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(38000)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(63000)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-amber-800 font-medium">Gran sinergia escala</td>
              </tr>
              <tr className="bg-emerald-50/60 font-bold">
                <td className="py-3.5 px-4 text-emerald-950 font-bold">Utilidad Neta Mensual Promedio</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-900">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualZakia)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-900">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualRefugio)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-950 text-base">
                  {formatCurrency(utilidadMensualTotal)}
                  {deducirAdminGeneral && (
                    <span className="block text-[10px] text-emerald-700 font-bold">Sobre $200,551 MXN</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-emerald-800">
                  {deducirAdminGeneral ? 'Ajustada (-$35k/mes)' : `${((TOTALES_CONSOLIDADOS.utilidadMensualZakia / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% Z / ${((TOTALES_CONSOLIDADOS.utilidadMensualRefugio / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% R`}
                </td>
              </tr>
              <tr className="bg-emerald-50/30">
                <td className="py-3.5 px-4 font-semibold text-stone-900">Margen Neto de Operación (%)</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-800">{((TOTALES_CONSOLIDADOS.utilidadMensualZakia / TOTALES_CONSOLIDADOS.promedioMensualVentasZakia) * 100).toFixed(1)}%</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-800">{((TOTALES_CONSOLIDADOS.utilidadMensualRefugio / TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio) * 100).toFixed(1)}%</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-900">{margenPonderadoTotal}%</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">Margen ponderado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart: Historical Consolidated Evolution (12 Meses Auditados) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              Evolución Mensual Consolidada: Ingresos vs. Costos vs. Utilidad (12 Meses)
            </h4>
            <p className="text-xs text-stone-700">
              Historial real auditado de los 12 meses (Enero a Diciembre) {deducirAdminGeneral ? 'con deducción de $35,000/mes de Administración General' : 'para ambas sucursales'}
            </p>
          </div>
          <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
            Total 12 Meses: {formatCurrency(ventasAnualesTotal)} en ventas
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={consolidatedMonthly} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fill: '#4b5563', fontSize: 12 }} />
              <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} tick={{ fill: '#4b5563', fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
              <Legend />
              <Bar dataKey="ventasTotal" fill="#b45309" name="Venta Consolidada ($)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastosTotal" fill="#78716c" name={deducirAdminGeneral ? "Gastos Totales + Admón ($)" : "Gastos Totales ($)"} radius={[4, 4, 0, 0]} />
              <Bar dataKey="utilidadTotal" fill="#059669" name={deducirAdminGeneral ? "Utilidad Neta Ajustada ($)" : "Utilidad Neta ($)"} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recuadros Resumen al Final de la Hoja */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
              Recuadros Resumen Financiero &bull; Cadena Consolidada (Zákia + El Refugio)
            </h3>
            <p className="text-xs text-stone-500">
              Ecuación neta mensual consolidada de la red integral conforme a auditoría de 12 meses {deducirAdminGeneral ? '(ajustada sobre $200,551 MXN de utilidad neta)' : ''}.
            </p>
          </div>
          {onExport && (
            <button
              onClick={onExport}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 cursor-pointer bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors w-fit"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Abrir Hoja Exportable PDF</span>
            </button>
          )}
        </div>

        <SummaryEquationCards
          ingresosMensuales={ventasMensualesTotal}
          ingresosAnuales={ventasAnualesTotal}
          gastosMensuales={gastosMensualesTotal}
          gastosAnuales={costosOperativosAnualizados}
          gastosSemanales={gastosSemanalesTotal}
          rubrosCount={deducirAdminGeneral ? 48 : 47}
          utilidadMensual={utilidadMensualTotal}
          utilidadAnual={utilidadNetaAnualizada}
          margenNeto={`${margenPonderadoTotal}%`}
          tituloIngresos="1. INGRESOS TOTALES MENSUALES PROMEDIO"
          showClickHelper={false}
        />
      </div>
    </div>
  );
};


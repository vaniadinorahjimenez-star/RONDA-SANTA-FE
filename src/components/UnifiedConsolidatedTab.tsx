import React from 'react';
import { 
  TOTALES_CONSOLIDADOS, 
  VENTAS_ZAKIA, 
  VENTAS_REFUGIO, 
  RESUMEN_UTILIDAD_ZAKIA, 
  RESUMEN_UTILIDAD_REFUGIO 
} from '../data/financialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
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
  Printer
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
import { SummaryEquationCards } from './SummaryEquationCards';

interface UnifiedConsolidatedTabProps {
  onExport?: () => void;
}

export const UnifiedConsolidatedTab: React.FC<UnifiedConsolidatedTabProps> = ({ onExport }) => {
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
    const uz = vz - gz;
    const ur = vr - gr;

    return {
      mes,
      ventasZakia: vz,
      ventasRefugio: vr,
      ventasTotal: vz + vr,
      gastosTotal: gz + gr,
      utilidadZakia: uz,
      utilidadRefugio: ur,
      utilidadTotal: uz + ur,
      margenTotal: Number((((uz + ur) / (vz + vr)) * 100).toFixed(1))
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
            Visión integral de <strong>Panadería Santa Fé</strong> consolidada con la ronda de $10 MDP. Dos ubicaciones estratégicas sinérgicas generando <strong>{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)}</strong> anuales en ventas brutas y <strong>{formatCurrency(TOTALES_CONSOLIDADOS.utilidadAnualCadenaTotal)}</strong> en utilidad neta.
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
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-amber-700" />
            Ecuación Financiera Mensual Consolidada (Ambas Sucursales)
          </span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
            Flujo Operativo Validado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Total Ingresos */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-stone-900">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Ingresos Totales / Mes
              </span>
              <span className="text-stone-400">100%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasTotal)}
            </div>
            <div className="mt-2 text-xs text-stone-600 space-y-0.5">
              <div className="flex justify-between">
                <span>Refugio ({((TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio / TOTALES_CONSOLIDADOS.promedioMensualVentasTotal) * 100).toFixed(1)}%):</span>
                <span className="font-semibold text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia ({((TOTALES_CONSOLIDADOS.promedioMensualVentasZakia / TOTALES_CONSOLIDADOS.promedioMensualVentasTotal) * 100).toFixed(1)}%):</span>
                <span className="font-semibold text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasZakia)}</span>
              </div>
            </div>
          </div>

          {/* Menos Gastos */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold mb-1">
              <span className="flex items-center gap-1.5 text-stone-900">
                <DollarSign className="w-4 h-4 text-amber-600" />
                Gastos Operativos / Mes
              </span>
              <span className="text-stone-400">{((TOTALES_CONSOLIDADOS.gastosMensualesTotal / TOTALES_CONSOLIDADOS.promedioMensualVentasTotal) * 100).toFixed(1)}%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesTotal)}
            </div>
            <div className="mt-2 text-xs text-stone-600 space-y-0.5">
              <div className="flex justify-between">
                <span>Refugio:</span>
                <span className="font-semibold text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia:</span>
                <span className="font-semibold text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesZakia)}</span>
              </div>
            </div>
          </div>

          {/* Igual Utilidad */}
          <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-5">
            <div className="flex items-center justify-between text-xs text-emerald-900 font-bold mb-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                Utilidad Neta / Mes
              </span>
              <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {TOTALES_CONSOLIDADOS.margenPonderadoTotal}% Margen
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              {formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualTotal)}
            </div>
            <div className="mt-2 text-xs text-emerald-800 space-y-0.5 font-medium">
              <div className="flex justify-between">
                <span>Refugio ({((TOTALES_CONSOLIDADOS.utilidadMensualRefugio / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% de util.):</span>
                <span className="font-bold">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia ({((TOTALES_CONSOLIDADOS.utilidadMensualZakia / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% de util.):</span>
                <span className="font-bold">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualZakia)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annualized Projection Bar */}
        <div className="mt-6 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-stone-50 rounded-lg">
            <span className="text-xs text-stone-700 block">Venta Anualizada (12 Meses):</span>
            <span className="text-lg font-bold text-stone-900">{formatCurrency(TOTALES_CONSOLIDADOS.proyeccionAnualizadaVentas)}</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <span className="text-xs text-stone-700 block">Costo Operativo Anualizado:</span>
            <span className="text-lg font-bold text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.proyeccionAnualizadaGastos)}</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block">Utilidad Neta Anualizada:</span>
            <span className="text-lg font-extrabold text-emerald-900">{formatCurrency(TOTALES_CONSOLIDADOS.proyeccionAnualizadaUtilidad)}</span>
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
              Diferencias de volumen, estructura de costos y aportación al negocio consolidado
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
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasTotal)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">{((TOTALES_CONSOLIDADOS.promedioMensualVentasZakia / TOTALES_CONSOLIDADOS.promedioMensualVentasTotal) * 100).toFixed(1)}% Z / {((TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio / TOTALES_CONSOLIDADOS.promedioMensualVentasTotal) * 100).toFixed(1)}% R</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Ventas Anuales (12M Auditadas / Anualizadas)</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesRefugio12M)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">100% de la red</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Gasto Operativo Mensual Proyectado</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesZakia)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesRefugio)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesTotal)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">{((TOTALES_CONSOLIDADOS.gastosMensualesZakia / TOTALES_CONSOLIDADOS.gastosMensualesTotal) * 100).toFixed(1)}% Z / {((TOTALES_CONSOLIDADOS.gastosMensualesRefugio / TOTALES_CONSOLIDADOS.gastosMensualesTotal) * 100).toFixed(1)}% R</td>
              </tr>
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
                <td className="py-3.5 px-4 text-right font-mono text-emerald-950 text-base">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualTotal)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-emerald-800">{((TOTALES_CONSOLIDADOS.utilidadMensualZakia / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% Z / {((TOTALES_CONSOLIDADOS.utilidadMensualRefugio / TOTALES_CONSOLIDADOS.utilidadMensualTotal) * 100).toFixed(1)}% R</td>
              </tr>
              <tr className="bg-emerald-50/30">
                <td className="py-3.5 px-4 font-semibold text-stone-900">Margen Neto de Operación (%)</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-800">{((TOTALES_CONSOLIDADOS.utilidadMensualZakia / TOTALES_CONSOLIDADOS.promedioMensualVentasZakia) * 100).toFixed(1)}%</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-800">{((TOTALES_CONSOLIDADOS.utilidadMensualRefugio / TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio) * 100).toFixed(1)}%</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-900">{TOTALES_CONSOLIDADOS.margenPonderadoTotal}%</td>
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
              Historial real auditado de los 12 meses (Enero a Diciembre) para ambas sucursales
            </p>
          </div>
          <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
            Total 12 Meses: {formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)} en ventas
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
              <Bar dataKey="gastosTotal" fill="#78716c" name="Gastos Totales ($)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="utilidadTotal" fill="#059669" name="Utilidad Neta ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sinergias & Oportunidades con la Inyección de 10 MDP */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Estrategia de Valor Agregado &bull; Post-Adquisición</span>
        </div>
        <h3 className="text-xl font-bold text-stone-900 mb-2">
          Oportunidades Inmediatas de Optimización Financiera
        </h3>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          Los números presentados corresponden al estado operativo actual independiente. Al unificar la gestión centralizada y fondear con $10 MDP, se liberan sinergias tangibles:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4.5 rounded-xl border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h4 className="font-bold text-sm text-stone-900 mb-1">
              Compras por Volumen (Dialpa)
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Ambas panaderías gastan juntas <strong>$63,000 semanales ($273,600/mes)</strong> solo en harina Dialpa. Comprar por tonelada directa a molino generará un ahorro estimado de entre 8% y 12% en materia prima (~$25,000/mes de utilidad extra).
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h4 className="font-bold text-sm text-stone-900 mb-1">
              Rutas y Logística Compartida
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Refugio cuenta con camioneta para reparto ($210k/mes de ventas mayoristas) y Zakia arrienda camioneta ($13,528/mes). Centralizar la flotilla optimiza gasolinas y mantenimiento, ampliando capacidad de reparto a cafeterías en Zákia.
            </p>
          </div>

          <div className="bg-white p-4.5 rounded-xl border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h4 className="font-bold text-sm text-stone-900 mb-1">
              Consolidación Contable y Fiscal
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Se pagan $12,594 mensuales en dos despachos contables separados. Unificar la persona moral o esquema corporativo reduce costos de asesoría y maximiza deducciones de equipo y gastos de operación.
            </p>
          </div>
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
              Ecuación neta mensual consolidada de la red integral conforme a auditoría de 12 meses.
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
          ingresosMensuales={TOTALES_CONSOLIDADOS.promedioMensualVentasTotal}
          ingresosAnuales={TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal}
          gastosMensuales={TOTALES_CONSOLIDADOS.gastosMensualesTotal}
          gastosAnuales={TOTALES_CONSOLIDADOS.gastosAnualesCadenaTotal}
          gastosSemanales={TOTALES_CONSOLIDADOS.gastosSemanalesTotal}
          rubrosCount={47}
          utilidadMensual={TOTALES_CONSOLIDADOS.utilidadMensualTotal}
          utilidadAnual={TOTALES_CONSOLIDADOS.utilidadAnualCadenaTotal}
          margenNeto={`${TOTALES_CONSOLIDADOS.margenPonderadoTotal}%`}
          tituloIngresos="1. INGRESOS TOTALES MENSUALES PROMEDIO"
          showClickHelper={false}
        />
      </div>
    </div>
  );
};

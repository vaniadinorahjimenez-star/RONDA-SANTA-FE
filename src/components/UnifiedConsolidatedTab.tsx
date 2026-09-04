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
  BarChart3
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

export const UnifiedConsolidatedTab: React.FC = () => {
  // Monthly consolidated data
  const meses = ['Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'];
  const consolidatedMonthly = meses.map((mes, idx) => {
    const vz = VENTAS_ZAKIA[idx].ventaTotalMensual;
    const vr = VENTAS_REFUGIO[idx].ventaTotalMensual;
    const gz = RESUMEN_UTILIDAD_ZAKIA[idx].gastosOperativos;
    const gr = RESUMEN_UTILIDAD_REFUGIO[idx].gastosOperativos;
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
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-4 h-4" />
            <span>Panadería Santa Fé &bull; Consolidación de Cadena (Zákia + El Refugio)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Estado Financiero Consolidado Unificado
          </h2>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed">
            Visión integral de <strong>Panadería Santa Fé</strong> que se consolidará con la ronda de $10 MDP. Dos ubicaciones estratégicas sinérgicas generando más de $15.5 Millones de Pesos anuales en ventas brutas y $2.25 Millones de Pesos en utilidad neta.
          </p>
        </div>
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
                <span>Refugio (65.6%):</span>
                <span className="font-semibold text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia (34.4%):</span>
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
              <span className="text-stone-400">85.5%</span>
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
                14.5% Margen
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950">
              {formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualTotal)}
            </div>
            <div className="mt-2 text-xs text-emerald-800 space-y-0.5 font-medium">
              <div className="flex justify-between">
                <span>Refugio (75.8% de util.):</span>
                <span className="font-bold">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualRefugio)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zákia (24.2% de util.):</span>
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
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(444857)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(848286)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(1293143)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">34.4% Z / 65.6% R</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Ventas 7 Meses Auditadas (Feb - Ago)</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(3114000)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(5938000)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(9052000)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">100% de la red</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-stone-900">Gasto Operativo Mensual Proyectado</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(399400)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-700">{formatCurrency(705771)}</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(1105171)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">36.1% Z / 63.9% R</td>
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
                <td className="py-3.5 px-4 text-right font-mono text-emerald-900">{formatCurrency(45458)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-900">{formatCurrency(142515)}</td>
                <td className="py-3.5 px-4 text-right font-mono text-emerald-950 text-base">{formatCurrency(187973)}</td>
                <td className="py-3.5 px-4 text-center text-xs text-emerald-800">24.2% Z / 75.8% R</td>
              </tr>
              <tr className="bg-emerald-50/30">
                <td className="py-3.5 px-4 font-semibold text-stone-900">Margen Neto de Operación (%)</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-800">10.2%</td>
                <td className="py-3.5 px-4 text-right font-mono text-stone-800">16.8%</td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-900">14.5%</td>
                <td className="py-3.5 px-4 text-center text-xs text-stone-700">Margen ponderado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Chart: Historical Consolidated Evolution (Feb - Ago) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              Evolución Mensual Consolidada: Ingresos vs. Costos vs. Utilidad
            </h4>
            <p className="text-xs text-stone-700">
              Historial real auditado de los 7 meses reportados (febrero a agosto)
            </p>
          </div>
          <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
            Total 7 Meses: {formatCurrency(9052000)} en ventas
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
    </div>
  );
};

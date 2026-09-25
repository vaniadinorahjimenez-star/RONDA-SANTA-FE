import React, { useState } from 'react';
import { GASTOS_ZAKIA, VENTAS_ZAKIA, RESUMEN_UTILIDAD_ZAKIA, TOTALES_CONSOLIDADOS } from '../data/financialData';
import { GastoRubro } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { DetailModal } from './DetailModal';
import { ZakiaSalesTable } from './ZakiaSalesTable';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Coins, 
  Store, 
  HelpCircle, 
  ArrowRight, 
  ArrowUp,
  ArrowDown,
  Filter, 
  Search,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
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
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { SummaryEquationCards } from './SummaryEquationCards';

interface BranchZakiaTabProps {
  onExport?: () => void;
}

export const BranchZakiaTab: React.FC<BranchZakiaTabProps> = ({ onExport }) => {
  const [selectedGasto, setSelectedGasto] = useState<GastoRubro | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'gastos' | 'ventas' | 'resumen'>('gastos');
  const [showIngresosTable, setShowIngresosTable] = useState<boolean>(false);

  const categories = ['Todas', ...Array.from(new Set(GASTOS_ZAKIA.map(g => g.categoria)))];

  const filteredGastos = GASTOS_ZAKIA.filter(gasto => {
    const matchesCategory = selectedCategory === 'Todas' || gasto.categoria === selectedCategory;
    const matchesSearch = gasto.concepto.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gasto.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 12-Month Evolution Data (Ingresos vs. Costos vs. Utilidad)
  const zakiaMonthlyEvolution = RESUMEN_UTILIDAD_ZAKIA.map(item => ({
    mes: item.mes,
    ventas: item.ventaTotal,
    gastos: item.gastosOperativos,
    utilidad: item.utilidadNeta,
    margen: item.margen
  }));

  // Calculate totals dynamically from GASTOS_ZAKIA
  const totalSemanalZakia = GASTOS_ZAKIA.reduce((acc, g) => acc + g.gastoSemanal, 0);
  const totalDiarioZakia = GASTOS_ZAKIA.reduce((acc, g) => acc + g.gastoDiario, 0);
  const totalMensualZakia = GASTOS_ZAKIA.reduce((acc, g) => acc + g.proyeccionMensual, 0);
  const totalAnualZakia = totalMensualZakia * 12;

  // Category aggregations for pie chart
  const categoryData = Object.entries(
    GASTOS_ZAKIA.reduce((acc, curr) => {
      acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.proyeccionMensual;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    value: Math.round(value),
    pct: ((value / (totalMensualZakia || 1)) * 100).toFixed(1)
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#b45309', '#d97706', '#f59e0b', '#78350f', '#92400e'];

  const chartVentasData = VENTAS_ZAKIA.map(v => ({
    mes: v.mes,
    Tarjeta: v.puntoDeVentaTDC,
    Efectivo: v.ventasMostradorEfectivo,
    Total: v.ventaTotalMensual
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Context */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Store className="w-4 h-4" />
            <span>Panadería Santa Fé &bull; Sucursal Zákia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Análisis Operativo &amp; Financiero Zákia
          </h2>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed">
            Predominio de pagos electrónicos (60.3%) y venta directa de pan recién horneado.
          </p>
        </div>
        {onExport && (
          <button
            onClick={onExport}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
            title="Exportar hoja ejecutiva auditada de Zákia"
          >
            <Printer className="w-4 h-4" />
            <span>Exportar Resumen PDF</span>
          </button>
        )}
      </div>

      {/* CORE EQUATION HIGHLIGHT: INGRESOS - GASTOS = UTILIDAD */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Ingresos */}
          <div 
            onClick={() => setShowIngresosTable(!showIngresosTable)}
            className={`w-full lg:w-1/3 border-2 rounded-xl p-4.5 text-center sm:text-left cursor-pointer transition-all ${
              showIngresosTable
                ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                : 'bg-stone-50 border-stone-200 hover:border-stone-400'
            }`}
          >
            <div className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>1. Ingresos Mensuales Promedio</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                showIngresosTable ? 'bg-amber-500 text-stone-900' : 'bg-stone-200 text-stone-700'
              }`}>
                {showIngresosTable ? 'Ocultar' : 'Desplegar'}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900">
              {formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasZakia)}
            </div>
            <div className="text-xs text-stone-700 mt-1">
              Venta Total Anual (12M): <strong className="text-stone-900">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)}</strong>
            </div>
            <div className="mt-2.5 pt-2 border-t border-stone-200/70 text-xs font-semibold text-amber-900 flex items-center justify-between">
              <span className="flex items-center gap-1">
                {showIngresosTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showIngresosTable ? 'Cerrar tabla de ingresos' : 'Desplegar tabla de ingresos por mes'}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                12 Meses
              </span>
            </div>
          </div>

          <div className="hidden lg:flex text-stone-400 font-bold text-2xl">-</div>

          {/* Menos Gastos */}
          <div 
            onClick={() => setActiveSection('gastos')}
            className={`w-full lg:w-1/3 border rounded-xl p-4.5 text-center sm:text-left cursor-pointer transition-all ${
              activeSection === 'gastos'
                ? 'bg-stone-100/70 border-stone-400 shadow-2xs'
                : 'bg-stone-50 border-stone-200 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>2. Menos Gastos Operativos</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900">
              {formatCurrency(totalMensualZakia)}
            </div>
            <div className="text-xs text-stone-700 mt-1">
              Gasto Anual (12M): {formatCurrency(totalAnualZakia)} &bull; Semanal: {formatCurrency(totalSemanalZakia)}
            </div>
            <div className="mt-2.5 pt-2 border-t border-stone-200/70 text-xs text-stone-600 flex items-center justify-between">
              <span>23 Rubros auditados</span>
              <span className="text-[10px] text-amber-800 font-bold">Ver desglose &rarr;</span>
            </div>
          </div>

          <div className="hidden lg:flex text-stone-400 font-bold text-2xl">=</div>

          {/* Igual Utilidad */}
          <div 
            onClick={() => setActiveSection('resumen')}
            className={`w-full lg:w-1/3 border rounded-xl p-4.5 text-center sm:text-left cursor-pointer transition-all ${
              activeSection === 'resumen'
                ? 'bg-emerald-100/60 border-emerald-500 shadow-2xs'
                : 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3. Igual Utilidad Neta Mensual</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
              {formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualZakia)}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1">
              Margen Neto: <strong>{formatPercent((TOTALES_CONSOLIDADOS.utilidadAnualZakia12M / TOTALES_CONSOLIDADOS.ventasAnualesZakia12M) * 100)}</strong> &bull; Utilidad Anual (12M): {formatCurrency(TOTALES_CONSOLIDADOS.utilidadAnualZakia12M)}
            </div>
            <div className="mt-2.5 pt-2 border-t border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <span>Retorno neto mensual</span>
              <span className="text-[10px] text-emerald-900 font-bold">Ver histórico &rarr;</span>
            </div>
          </div>
        </div>

        {/* DESPLEGABLE DE TABLA DE INGRESOS POR MES CONFORME A REPORTE */}
        {showIngresosTable && (
          <div className="pt-2 animate-in fade-in duration-200">
            <ZakiaSalesTable 
              defaultExpanded={true}
              showToggle={true}
              title="Tabla de Ingresos Mensuales Auditados (12 Meses: Enero a Diciembre)"
              subtitle="Desglose auditado conforme a libros contables: Punto de Venta (Tarjeta) vs. Efectivo Mostrador, Gastos Operativos y Utilidad Neta Mensual."
            />
          </div>
        )}

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
            Haz clic en <strong>"1. Ingresos Mensuales Promedio"</strong> para desplegar u ocultar la tabla mensual auditada.
          </span>
          <span className="font-semibold text-amber-800 hidden sm:inline">
            12 Meses Auditados (100% Real)
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-stone-200 space-x-4">
        <button
          onClick={() => setActiveSection('gastos')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'gastos'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Estructura de Gastos (23 Rubros)
        </button>
        <button
          onClick={() => setActiveSection('ventas')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'ventas'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Análisis de Ventas (12 Meses)
        </button>
        <button
          onClick={() => setActiveSection('resumen')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'resumen'
              ? 'border-amber-800 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Resumen Utilidad Mensual (12 Meses)
        </button>
      </div>

      {/* SECTION 1: ESTRUCTURA DE GASTOS */}
      {activeSection === 'gastos' && (
        <div className="space-y-6">
          {/* Controls: Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filtrar:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-800 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar concepto o proveedor..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-stone-500">
              <span className="flex items-center gap-1 font-medium bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200">
                <ArrowUp className="w-2.5 h-2.5 text-red-600 stroke-[3]" /> Gasto incrementó
              </span>
              <span className="flex items-center gap-1 font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                <ArrowDown className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" /> Gasto bajó
              </span>
            </div>
          </div>

          {/* Interactive Expenses Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">No.</th>
                    <th className="py-3 px-4">Categoría</th>
                    <th className="py-3 px-4">Concepto / Rubro</th>
                    <th className="py-3 px-4 text-right">Gasto Semanal</th>
                    <th className="py-3 px-4 text-right">Gasto Diario</th>
                    <th className="py-3 px-4 text-right">Proyección Mensual</th>
                    <th className="py-3 px-4 text-right">% del Total</th>
                    <th className="py-3 px-4 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredGastos.map((gasto) => (
                    <tr
                      key={gasto.no}
                      onClick={() => setSelectedGasto(gasto)}
                      className="hover:bg-amber-50/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 text-center text-stone-400 font-mono text-xs">
                        {gasto.no}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block text-[11px] px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-medium">
                          {gasto.categoria}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>{gasto.concepto}</span>
                          {gasto.tendencia === 'subio' && (
                            <span 
                              className="inline-flex items-center text-red-600" 
                              title={`Gasto incrementó (antes ${formatCurrency(gasto.gastoAnteriorSemanal || 0)}/sem)`}
                            >
                              <ArrowUp className="w-3 h-3 text-red-600 stroke-[3]" />
                            </span>
                          )}
                          {gasto.tendencia === 'bajo' && (
                            <span 
                              className="inline-flex items-center text-emerald-600" 
                              title={`Gasto bajó (antes ${formatCurrency(gasto.gastoAnteriorSemanal || 0)}/sem)`}
                            >
                              <ArrowDown className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">
                        <div className="flex items-center justify-end gap-1">
                          <span>{formatCurrency(gasto.gastoSemanal)}</span>
                          {gasto.tendencia === 'subio' && (
                            <span title={`Incrementó: antes ${formatCurrency(gasto.gastoAnteriorSemanal || 0)}/sem`}>
                              <ArrowUp className="w-2.5 h-2.5 text-red-600 stroke-[3]" />
                            </span>
                          )}
                          {gasto.tendencia === 'bajo' && (
                            <span title={`Bajó: antes ${formatCurrency(gasto.gastoAnteriorSemanal || 0)}/sem`}>
                              <ArrowDown className="w-2.5 h-2.5 text-emerald-600 stroke-[3]" />
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-500">
                        {formatCurrency(gasto.gastoDiario, true)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                        {formatCurrency(gasto.proyeccionMensual)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-semibold text-stone-800 font-mono">
                            {formatPercent(gasto.porcentajeTotal)}
                          </span>
                          <div className="w-12 bg-stone-100 h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="bg-amber-700 h-full rounded-full"
                              style={{ width: `${Math.min(gasto.porcentajeTotal * 3, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-xs text-amber-800 font-medium group-hover:underline inline-flex items-center gap-1">
                          Ver <ArrowRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Row */}
                <tfoot className="bg-stone-50 font-bold border-t-2 border-stone-300 text-stone-900">
                  <tr>
                    <td colSpan={3} className="py-3.5 px-4 text-left uppercase text-xs tracking-wider">
                      Total General Zakia (23 Rubros)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      {formatCurrency(totalSemanalZakia)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      {formatCurrency(totalDiarioZakia, true)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-900 text-base">
                      {formatCurrency(totalMensualZakia)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      100.0%
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Visual Distribution of Expenses by Category */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
            <div className="bg-white p-6 rounded-2xl border border-stone-200">
              <h3 className="text-base font-bold text-stone-900 mb-1 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-amber-700" />
                Composición de Gastos Mensuales por Categoría
              </h3>
              <p className="text-xs text-stone-700 mb-6">
                Mano de obra (Nómina) e Insumos (Harinas Dialpa) representan más del 70% del costo operativo.
              </p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, pct }) => `${name.split(' ')[0]} (${pct}%)`}
                      labelLine={false}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Gasto Mensual']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 mb-1">
                  Desglose por Importancia de Costos
                </h3>
                <p className="text-xs text-stone-700 mb-4">
                  Valores nominales proyectados mensualmente en Zákia:
                </p>
                <div className="space-y-3">
                  {categoryData.map((cat, idx) => (
                    <div key={cat.name} className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-xs font-semibold text-stone-800">{cat.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-stone-900 block">{formatCurrency(cat.value)}</span>
                        <span className="text-[10px] text-stone-700">{cat.pct}% del presupuesto</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: ANALISIS DE VENTAS (12 MESES) */}
      {activeSection === 'ventas' && (
        <div className="space-y-6">
          <ZakiaSalesTable 
            defaultExpanded={true}
            showToggle={false}
            title="Historial de Ventas y Utilidad Auditado (12 Meses: Ene - Dic)"
            subtitle="Desglose auditado conforme a libros contables: Punto de Venta (Tarjeta) vs. Efectivo Mostrador, Gastos Operativos y Utilidad Neta Mensual."
          />

          {/* Chart: Sales breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200">
            <h4 className="text-sm font-bold text-stone-900 mb-4">
              Comparativa Mensual: Cobro con Tarjeta vs. Efectivo en Mostrador
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartVentasData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                  <Legend />
                  <Bar dataKey="Tarjeta" stackId="a" fill="#b45309" name="Cobro Tarjeta (TDC) 60.3%" />
                  <Bar dataKey="Efectivo" stackId="a" fill="#d97706" name="Efectivo Mostrador 39.7%" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: RESUMEN UTILIDAD MENSUAL (12 MESES) */}
      {activeSection === 'resumen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                Resumen Final de Utilidad Neta Mensual Zákia (12 Meses)
              </h3>
              <p className="text-xs text-stone-700 mt-1">
                Venta Total menos Gastos Operativos fijos y variables ($399,400/mes) resulta en una Utilidad Neta Anual de $1,025,918 MXN (17.6% de margen promedio).
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Mes</th>
                    <th className="py-3 px-4 text-right">Venta Total ($)</th>
                    <th className="py-3 px-4 text-right">Gastos Operativos ($)</th>
                    <th className="py-3 px-4 text-right font-bold text-emerald-800">Utilidad Neta Mensual ($)</th>
                    <th className="py-3 px-4 text-right">Margen (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {RESUMEN_UTILIDAD_ZAKIA.map((item) => (
                    <tr key={item.mes} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-semibold text-stone-900">{item.mes}</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">{formatCurrency(item.ventaTotal)}</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-600">{formatCurrency(item.gastosOperativos)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">{formatCurrency(item.utilidadNeta)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-stone-800">{formatPercent(item.margen)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-bold text-stone-900">
                  <tr>
                    <td className="py-3 px-4 uppercase text-xs">Total Anual (12 Meses)</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.gastosAnualesZakia12M)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-800 text-base">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadAnualZakia12M)}</td>
                    <td className="py-3 px-4 text-right font-mono">19.9%</td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="py-2.5 px-4 uppercase text-xs text-emerald-900">Promedio Mensual</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasZakia)}</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesZakia)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-900 font-extrabold">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualZakia)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-800 font-bold">19.9%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Chart: Historical Monthly Evolution (12 Meses Auditados) */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
          <div>
            <h4 className="text-base font-bold text-stone-900">
              Evolución Mensual: Ingresos vs. Costos vs. Utilidad (12 Meses)
            </h4>
            <p className="text-xs text-stone-600">
              Historial real auditado de los 12 meses (Enero a Diciembre) para Sucursal Zákia
            </p>
          </div>
          <div className="text-xs font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg">
            Total 12 Meses: {formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)} en ventas
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zakiaMonthlyEvolution} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fill: '#4b5563', fontSize: 12 }} />
              <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} tick={{ fill: '#4b5563', fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
              <Legend />
              <Bar dataKey="ventas" fill="#b45309" name="Ventas Totales ($)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" fill="#78716c" name="Gastos Operativos ($)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="utilidad" fill="#059669" name="Utilidad Neta ($)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recuadros Resumen al Final de la Hoja */}
      <div className="pt-4 border-t border-stone-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
              Recuadros Resumen Financiero &bull; Sucursal Zákia
            </h3>
            <p className="text-xs text-stone-500">
              Ecuación neta mensual consolidada conforme a auditoría de 12 meses.
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
          ingresosMensuales={TOTALES_CONSOLIDADOS.promedioMensualVentasZakia}
          ingresosAnuales={TOTALES_CONSOLIDADOS.ventasAnualesZakia12M}
          gastosMensuales={TOTALES_CONSOLIDADOS.gastosMensualesZakia}
          gastosAnuales={TOTALES_CONSOLIDADOS.gastosAnualesZakia12M}
          gastosSemanales={TOTALES_CONSOLIDADOS.gastosSemanalesZakia}
          rubrosCount={23}
          utilidadMensual={TOTALES_CONSOLIDADOS.utilidadMensualZakia}
          utilidadAnual={TOTALES_CONSOLIDADOS.utilidadAnualZakia12M}
          margenNeto={formatPercent((TOTALES_CONSOLIDADOS.utilidadAnualZakia12M / TOTALES_CONSOLIDADOS.ventasAnualesZakia12M) * 100)}
          onToggleIngresos={() => setShowIngresosTable(!showIngresosTable)}
          isIngresosExpanded={showIngresosTable}
          onSelectGastos={() => setActiveSection('gastos')}
          onSelectResumen={() => setActiveSection('resumen')}
          showClickHelper={true}
        />
      </div>

      {/* Selected Gasto Modal */}
      <DetailModal
        item={selectedGasto}
        sucursalNombre="Panadería Santa Fé (Sucursal Zákia)"
        onClose={() => setSelectedGasto(null)}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { GASTOS_REFUGIO, VENTAS_REFUGIO, RESUMEN_UTILIDAD_REFUGIO } from '../data/financialData';
import { GastoRubro } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { DetailModal } from './DetailModal';
import { 
  TrendingUp, 
  DollarSign, 
  Store, 
  HelpCircle, 
  ArrowRight, 
  Filter, 
  Search,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Truck,
  Building
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

export const BranchRefugioTab: React.FC = () => {
  const [selectedGasto, setSelectedGasto] = useState<GastoRubro | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'gastos' | 'ventas' | 'resumen'>('gastos');

  const categories = ['Todas', ...Array.from(new Set(GASTOS_REFUGIO.map(g => g.categoria)))];

  const filteredGastos = GASTOS_REFUGIO.filter(gasto => {
    const matchesCategory = selectedCategory === 'Todas' || gasto.categoria === selectedCategory;
    const matchesSearch = gasto.concepto.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          gasto.categoria.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Category aggregations for pie chart
  const categoryData = Object.entries(
    GASTOS_REFUGIO.reduce((acc, curr) => {
      acc[curr.categoria] = (acc[curr.categoria] || 0) + curr.proyeccionMensual;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({
    name,
    value: Math.round(value),
    pct: ((value / 705771) * 100).toFixed(1)
  })).sort((a, b) => b.value - a.value);

  const COLORS = ['#9a3412', '#c2410c', '#ea580c', '#7c2d12', '#431407'];

  const chartVentasData = VENTAS_REFUGIO.map(v => ({
    mes: v.mes,
    Mostrador: v.ventaTotalMostrador,
    Reparto: v.reparto,
    Cautivos: v.transferenciasCautivos,
    Total: v.ventaTotalMensual
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Context */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-white p-6 sm:p-8 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Store className="w-4 h-4" />
            <span>Panadería Santa Fé &bull; Sucursal Matriz El Refugio (Producción &amp; Reparto)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Análisis Operativo &amp; Financiero El Refugio
          </h2>
          <p className="text-stone-300 text-sm mt-2 leading-relaxed">
            Planta matriz de alta escala: combina ventas de mostrador de alto flujo con rutas de reparto mayorista ($210,286/mes) y clientes institucionales cautivos por transferencia ($49,000/mes). Margen neto del 16.8%.
          </p>
        </div>
      </div>

      {/* CORE EQUATION HIGHLIGHT: INGRESOS - GASTOS = UTILIDAD */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Ingresos */}
          <div className="w-full lg:w-1/3 bg-stone-50 border border-stone-200 rounded-xl p-4.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>1. Ingresos Mensuales Promedio</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900">
              {formatCurrency(848286)}
            </div>
            <div className="text-xs text-stone-700 mt-1">
              Ventas 7 meses: <strong className="text-stone-700">{formatCurrency(5938000)}</strong>
            </div>
          </div>

          <div className="hidden lg:flex text-stone-400 font-bold text-2xl">-</div>

          {/* Menos Gastos */}
          <div className="w-full lg:w-1/3 bg-stone-50 border border-stone-200 rounded-xl p-4.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>2. Menos Gastos Operativos</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-stone-900">
              {formatCurrency(705771)}
            </div>
            <div className="text-xs text-stone-700 mt-1">
              Semanal: {formatCurrency(162513)} &bull; Diario: {formatCurrency(23216.14, true)}
            </div>
          </div>

          <div className="hidden lg:flex text-stone-400 font-bold text-2xl">=</div>

          {/* Igual Utilidad */}
          <div className="w-full lg:w-1/3 bg-emerald-50/80 border border-emerald-200 rounded-xl p-4.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>3. Igual Utilidad Neta Mensual</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900">
              {formatCurrency(142515)}
            </div>
            <div className="text-xs text-emerald-700 font-medium mt-1">
              Margen Neto: <strong>16.8%</strong> &bull; 7 Meses: {formatCurrency(997605)}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-700">
          <span className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
            Haz clic en cualquier renglón o rubro abajo para ver el desglose diario, semanal y justificación detallada.
          </span>
          <span className="font-semibold text-amber-800 hidden sm:inline">
            23 Rubros Operativos
          </span>
        </div>
      </div>

      {/* Revenue Channels Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold mb-1">
            <Store className="w-4 h-4 text-amber-700" />
            <span>Venta Mostrador (Tienda)</span>
          </div>
          <div className="text-lg font-bold text-stone-900">
            {formatCurrency(589000)} <span className="text-xs font-normal text-stone-500">/ mes (69.4%)</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Tarjeta TDC ($323k) + Efectivo ($265k)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold mb-1">
            <Truck className="w-4 h-4 text-amber-700" />
            <span>Rutas de Reparto Mayorista</span>
          </div>
          <div className="text-lg font-bold text-stone-900">
            {formatCurrency(210286)} <span className="text-xs font-normal text-stone-500">/ mes (24.8%)</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Distribución programada a cafeterías y tiendas
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold mb-1">
            <Building className="w-4 h-4 text-amber-700" />
            <span>Transferencias Clientes Cautivos</span>
          </div>
          <div className="text-lg font-bold text-stone-900">
            {formatCurrency(49000)} <span className="text-xs font-normal text-stone-500">/ mes (5.8%)</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            Cuentas corporativas fijas e institucionales
          </p>
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
          Análisis de Ventas (Feb - Ago)
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
          Resumen Utilidad Mensual
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
                        {gasto.concepto}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">
                        {formatCurrency(gasto.gastoSemanal)}
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
                      Total General Refugio (23 Rubros)
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      {formatCurrency(162513)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">
                      {formatCurrency(23216.14, true)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-amber-900 text-base">
                      {formatCurrency(705770.74)}
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
                Composición de Gastos en Planta Refugio
              </h3>
              <p className="text-xs text-stone-700 mb-6">
                Refugio concentra la mayor capacidad de amasado y horneado, abasteciendo la sucursal y clientes mayoristas.
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
                  Distribución Monetaria Refugio
                </h3>
                <p className="text-xs text-stone-700 mb-4">
                  Valores nominales proyectados mensualmente:
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

      {/* SECTION 2: ANALISIS DE VENTAS (FEB - AGO) */}
      {activeSection === 'ventas' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                Historial de Ventas Auditado por Canal (7 Meses)
              </h3>
              <p className="text-xs text-stone-700 mt-1">
                Tres canales simultáneos de comercialización: Mostrador, Rutas de Reparto y Clientes Cautivos.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">No.</th>
                    <th className="py-3 px-4">Mes</th>
                    <th className="py-3 px-4 text-right">Tarjeta (TDC)</th>
                    <th className="py-3 px-4 text-right">Efectivo (45%)</th>
                    <th className="py-3 px-4 text-right font-semibold text-amber-900">Total Mostrador</th>
                    <th className="py-3 px-4 text-right font-semibold text-stone-800">Reparto</th>
                    <th className="py-3 px-4 text-right">Transf. Cautivos</th>
                    <th className="py-3 px-4 text-right font-bold text-stone-900">Venta Total Mes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {VENTAS_REFUGIO.map((v) => (
                    <tr key={v.mes} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-mono text-stone-400">{v.no}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{v.mes}</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">{formatCurrency(v.cobroTarjetaTDC)}</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">{formatCurrency(v.efectivoCalculado)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-amber-900">{formatCurrency(v.ventaTotalMostrador)}</td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-stone-800">{formatCurrency(v.reparto)}</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-700">{formatCurrency(v.transferenciasCautivos)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(v.ventaTotalMensual)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-bold text-stone-900">
                  <tr>
                    <td colSpan={2} className="py-3 px-4 uppercase text-xs">Total (7 Meses)</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(2267000)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(1856000)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-900">{formatCurrency(4123000)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(1472000)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(343000)}</td>
                    <td className="py-3 px-4 text-right font-mono text-amber-900 text-base">{formatCurrency(5938000)}</td>
                  </tr>
                  <tr className="bg-amber-50/50">
                    <td colSpan={2} className="py-2.5 px-4 uppercase text-xs text-amber-900">Promedio Mensual</td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-800">{formatCurrency(323857)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-800">{formatCurrency(265143)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-amber-900 font-bold">{formatCurrency(589000)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-800">{formatCurrency(210286)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-800">{formatCurrency(49000)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-amber-900 font-extrabold">{formatCurrency(848286)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Chart: Sales breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200">
            <h4 className="text-sm font-bold text-stone-900 mb-4">
              Composición Mensual por Canal Comercial
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartVentasData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <YAxis tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                  <Legend />
                  <Bar dataKey="Mostrador" stackId="a" fill="#c2410c" name="Venta Mostrador (Tienda)" />
                  <Bar dataKey="Reparto" stackId="a" fill="#ea580c" name="Rutas Reparto Mayorista" />
                  <Bar dataKey="Cautivos" stackId="a" fill="#fb923c" name="Transferencias Cautivos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: RESUMEN UTILIDAD MENSUAL */}
      {activeSection === 'resumen' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-stone-200">
              <h3 className="text-base font-bold text-stone-900">
                Resumen Final de Utilidad Neta Mensual Refugio
              </h3>
              <p className="text-xs text-stone-700 mt-1">
                Utilidad neta mensual promedio de $142,515 MXN con un margen neto superior al 16.8% sostenido.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Mes</th>
                    <th className="py-3 px-4 text-right">Venta Total Mostrador ($)</th>
                    <th className="py-3 px-4 text-right">Reparto ($)</th>
                    <th className="py-3 px-4 text-right">Transf. Cautivos ($)</th>
                    <th className="py-3 px-4 text-right font-bold text-stone-900">Venta Total ($)</th>
                    <th className="py-3 px-4 text-right">Gastos Operativos ($)</th>
                    <th className="py-3 px-4 text-right font-bold text-emerald-800">Utilidad Neta ($)</th>
                    <th className="py-3 px-4 text-right">Margen (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {RESUMEN_UTILIDAD_REFUGIO.map((item) => (
                    <tr key={item.mes} className="hover:bg-stone-50">
                      <td className="py-3 px-4 font-semibold text-stone-900">{item.mes}</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-600">
                        {formatCurrency(VENTAS_REFUGIO.find(v => v.mes === item.mes)?.ventaTotalMostrador || 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-600">
                        {formatCurrency(VENTAS_REFUGIO.find(v => v.mes === item.mes)?.reparto || 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-stone-600">
                        {formatCurrency(VENTAS_REFUGIO.find(v => v.mes === item.mes)?.transferenciasCautivos || 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(item.ventaTotal)}</td>
                      <td className="py-3 px-4 text-right font-mono text-stone-600">{formatCurrency(item.gastosOperativos)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">{formatCurrency(item.utilidadNeta)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-stone-800">{formatPercent(item.margen)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-stone-50 border-t-2 border-stone-300 font-bold text-stone-900">
                  <tr>
                    <td className="py-3 px-4 uppercase text-xs">Total (7 Meses)</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(4123000)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(1472000)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(343000)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(5938000)}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatCurrency(4940395)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-800 text-base">{formatCurrency(997605)}</td>
                    <td className="py-3 px-4 text-right font-mono">16.8%</td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="py-2.5 px-4 uppercase text-xs text-emerald-900">Promedio Mensual</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(589000)}</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(210286)}</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(49000)}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-stone-900">{formatCurrency(848286)}</td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(705771)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-900 font-extrabold">{formatCurrency(142515)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-800 font-bold">16.8%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Selected Gasto Modal */}
      <DetailModal
        item={selectedGasto}
        sucursalNombre="Panadería Santa Fé (Sucursal El Refugio)"
        onClose={() => setSelectedGasto(null)}
      />
    </div>
  );
};

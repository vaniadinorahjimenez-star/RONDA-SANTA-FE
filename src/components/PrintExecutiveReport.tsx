import React, { useState } from 'react';
import { 
  TOTALES_CONSOLIDADOS, 
  GASTOS_ZAKIA, 
  GASTOS_REFUGIO, 
  VENTAS_ZAKIA, 
  VENTAS_REFUGIO, 
  RESUMEN_UTILIDAD_ZAKIA, 
  RESUMEN_UTILIDAD_REFUGIO 
} from '../data/financialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { SummaryEquationCards } from './SummaryEquationCards';
import { Store, Layers, Printer, X, Heart, Flame, TrendingUp, Download, Info } from 'lucide-react';
import { MonitoLogo } from './MonitoLogo';

export type PrintReportType = 'carta' | 'zakia' | 'refugio' | 'unificado' | 'all';

interface PrintExecutiveReportProps {
  onClose: () => void;
  initialReport?: PrintReportType;
  deducirAdmin?: boolean;
}

export const PrintExecutiveReport: React.FC<PrintExecutiveReportProps> = ({ 
  onClose, 
  initialReport = 'carta',
  deducirAdmin: initialDeducirAdmin = false
}) => {
  const [selectedReport, setSelectedReport] = useState<PrintReportType>(initialReport);
  const [deducirAdmin, setDeducirAdmin] = useState<boolean>(initialDeducirAdmin);

  const handlePrint = (reportName?: string) => {
    const originalTitle = document.title;
    const target = reportName || selectedReport;
    if (target === 'unificado') {
      document.title = 'Consolidado_Unificado_Completo_Panaderia_Santa_Fe';
    } else if (target === 'carta') {
      document.title = 'Carta_Intencion_Panaderia_Santa_Fe';
    } else if (target === 'zakia') {
      document.title = 'Reporte_Auditoria_Sucursal_Zakia';
    } else if (target === 'refugio') {
      document.title = 'Reporte_Auditoria_Sucursal_El_Refugio';
    } else {
      document.title = 'Dossier_Completo_Panaderia_Santa_Fe';
    }
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  // 1. ZÁKIA SORTED EXPENSES
  const sortedGastosZakia = [...GASTOS_ZAKIA].sort((a, b) => b.proyeccionMensual - a.proyeccionMensual);
  const totalSemanalZakia = GASTOS_ZAKIA.reduce((s, g) => s + g.gastoSemanal, 0);
  const totalMensualZakia = TOTALES_CONSOLIDADOS.gastosMensualesZakia;
  const totalVentasZakia12M = TOTALES_CONSOLIDADOS.ventasAnualesZakia12M;
  const promVentasZakia = TOTALES_CONSOLIDADOS.promedioMensualVentasZakia;
  const totalTdcZakia = VENTAS_ZAKIA.reduce((s, v) => s + v.puntoDeVentaTDC, 0);
  const totalEfecZakia = VENTAS_ZAKIA.reduce((s, v) => s + v.ventasMostradorEfectivo, 0);

  // 2. REFUGIO SORTED EXPENSES & SALES
  const sortedGastosRefugio = [...GASTOS_REFUGIO].sort((a, b) => b.proyeccionMensual - a.proyeccionMensual);
  const totalSemanalRefugio = GASTOS_REFUGIO.reduce((s, g) => s + g.gastoSemanal, 0);
  const totalMensualRefugio = TOTALES_CONSOLIDADOS.gastosMensualesRefugio;
  const totalVentasRefugio12M = TOTALES_CONSOLIDADOS.ventasAnualesRefugio12M;
  const promVentasRefugio = TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio;
  const totalTdcRefugio = VENTAS_REFUGIO.reduce((s, v) => s + v.cobroTarjetaTDC, 0);
  const totalEfecRefugio = VENTAS_REFUGIO.reduce((s, v) => s + v.efectivoCalculado, 0);
  const totalMostradorRefugio = VENTAS_REFUGIO.reduce((s, v) => s + v.ventaTotalMostrador, 0);
  const totalRepartoRefugio = VENTAS_REFUGIO.reduce((s, v) => s + v.reparto, 0);
  const totalCautivosRefugio = VENTAS_REFUGIO.reduce((s, v) => s + v.transferenciasCautivos, 0);
  const margenNetoRefugio = ((TOTALES_CONSOLIDADOS.utilidadAnualRefugio12M / totalVentasRefugio12M) * 100).toFixed(1);

  // 3. CONSOLIDATED CONJUNTO
  // Aggregate common expense categories
  const consolidatedGastosList = [
    { concepto: 'Nómina Operativa Semanal Consolidada (2 Sucursales)', categoria: 'Mano de Obra y Cargas', semanal: 78000, mensual: 338742.86, pct: 30.6 },
    { concepto: 'Materia Prima Harina Dialpa Semanal (Consolidado)', categoria: 'Materia Prima e Insumos', semanal: 63000, mensual: 273600.00, pct: 24.8 },
    { concepto: 'Renta de Locales Comerciales (Zákia + El Refugio)', categoria: 'Instalaciones y Servicios', semanal: 16876, mensual: 73290.05, pct: 6.6 },
    { concepto: 'Combustible y Mantenimiento Rutas de Reparto', categoria: 'Operación y Logística', semanal: 11192, mensual: 48600.00, pct: 4.4 },
    { concepto: 'Mantequilla Gloria Pura de Exportación (Ambas)', categoria: 'Materia Prima e Insumos', semanal: 8500, mensual: 36914.29, pct: 3.3 },
    { concepto: 'Huevo San Juan por Caja (Ambas)', categoria: 'Materia Prima e Insumos', semanal: 6800, mensual: 29531.43, pct: 2.7 },
    { concepto: 'Gas LP para Hornos Continuos (2 Unidades)', categoria: 'Instalaciones y Servicios', semanal: 6500, mensual: 28228.57, pct: 2.6 },
    { concepto: 'IMSS e INFONAVIT Patronal Consolidado', categoria: 'Mano de Obra y Cargas', semanal: 3923, mensual: 17037.03, pct: 1.5 },
    { concepto: 'Bolsas Kraft, Domos y Empaque Desechables', categoria: 'Operación y Logística', semanal: 3692, mensual: 16030.00, pct: 1.4 },
    { concepto: 'Azúcar Estándar y Refinada por Bulto', categoria: 'Materia Prima e Insumos', semanal: 3462, mensual: 15027.00, pct: 1.4 },
    { concepto: 'Levadura Fresca y Seca Industrial', categoria: 'Materia Prima e Insumos', semanal: 2769, mensual: 12024.00, pct: 1.1 },
    { concepto: 'Energía Eléctrica CFE (2 Unidades Operativas)', categoria: 'Instalaciones y Servicios', semanal: 2538, mensual: 11022.00, pct: 1.0 },
    { concepto: 'Comisión Terminal Punto de Venta (Ambas)', categoria: 'Administración y Otros', semanal: 2538, mensual: 11022.00, pct: 1.0 },
    { concepto: 'Mantenimiento Preventivo / Correctivo de Hornos', categoria: 'Operación y Mantenimiento', semanal: 2308, mensual: 10020.00, pct: 0.9 },
    { concepto: 'Relleno de Fruta, Chocolates y Coberturas', categoria: 'Materia Prima e Insumos', semanal: 1846, mensual: 8016.00, pct: 0.7 },
    { concepto: 'Salario Contador y Auditoría Contable Externa', categoria: 'Administración y Otros', semanal: 1846, mensual: 8016.00, pct: 0.7 },
    { concepto: 'Grasa Vegetal y Manteca Especial Panificación', categoria: 'Materia Prima e Insumos', semanal: 1731, mensual: 7515.00, pct: 0.7 },
    { concepto: 'Insumos de Limpieza, Sanitización y Desinfección', categoria: 'Operación y Mantenimiento', semanal: 1692, mensual: 7349.00, pct: 0.7 },
    { concepto: 'Seguro de Inmuebles y Responsabilidad Civil', categoria: 'Administración y Otros', semanal: 1500, mensual: 6514.00, pct: 0.6 },
    { concepto: 'Internet, Telefonía y Sistema POS Cloud', categoria: 'Servicios y Rentas', semanal: 1269, mensual: 5512.00, pct: 0.5 },
    { concepto: 'Uniformes y Equipo de Protección Personal', categoria: 'Mano de Obra y Cargas', semanal: 1154, mensual: 5011.00, pct: 0.5 },
    { concepto: 'Licencias Comerciales y Dictámenes Protección Civil', categoria: 'Administración y Otros', semanal: 923, mensual: 4008.00, pct: 0.4 },
    { concepto: 'Agua Potable y Filtros Industriales Osmosis', categoria: 'Instalaciones y Servicios', semanal: 846, mensual: 3674.00, pct: 0.3 },
    { concepto: 'Alarma Monitoreada, Circuito Cerrado y Seguridad', categoria: 'Instalaciones y Servicios', semanal: 808, mensual: 3507.00, pct: 0.3 },
    { concepto: 'Otros Gastos Operativos Menores e Imprevistos', categoria: 'Administración y Otros', semanal: 577, mensual: 2504.00, pct: 0.2 },
  ];

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const consolidatedMonthlyData = meses.map((mes) => {
    const vz = VENTAS_ZAKIA.find(v => v.mes === mes)?.ventaTotalMensual || 0;
    const vr = VENTAS_REFUGIO.find(v => v.mes === mes)?.ventaTotalMensual || 0;
    const gz = RESUMEN_UTILIDAD_ZAKIA.find(r => r.mes === mes)?.gastosOperativos || 399400;
    const gr = RESUMEN_UTILIDAD_REFUGIO.find(r => r.mes === mes)?.gastosOperativos || 705771;
    const totalVentas = vz + vr;
    const totalGastos = gz + gr;
    const totalUtilidad = totalVentas - totalGastos;
    const margen = totalVentas > 0 ? (totalUtilidad / totalVentas) * 100 : 0;

    return {
      mes,
      ventasZakia: vz,
      ventasRefugio: vr,
      pctZakia: totalVentas > 0 ? ((vz / totalVentas) * 100).toFixed(1) : '0',
      pctRefugio: totalVentas > 0 ? ((vr / totalVentas) * 100).toFixed(1) : '0',
      ventasTotal: totalVentas,
      gastosTotal: totalGastos,
      utilidadTotal: totalUtilidad,
      margen: margen.toFixed(1)
    };
  });

  const renderZakiaReport = () => (
    <div className="space-y-8 print:space-y-6">
      {/* Institutional Header */}
      <div className="border-b-2 border-stone-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Panadería Santa Fé &bull; Sucursal Satélite Zákia</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Resumen Operativo &amp; Financiero Auditado (12 Meses)
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Plaza Comercial Zákia, Querétaro &bull; Cifras Auditadas y Conciliadas al 100% Real
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-bold">Tipo de Unidad</span>
          <span className="text-base font-bold text-stone-900">Sucursal Satélite (Mostrador)</span>
        </div>
      </div>

      {/* 1. DESGLOSE POR IMPORTANCIA DE COSTOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
              Desglose por Importancia de Costos
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Valores nominales proyectados mensualmente en Zákia ordenados por mayor impacto presupuestal.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 font-mono hidden sm:inline">
            Total Mensual: {formatCurrency(totalMensualZakia)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Concepto / Rubro Operativo</th>
                <th className="py-2.5 px-3">Categoría</th>
                <th className="py-2.5 px-3 text-right">Gasto Semanal ($)</th>
                <th className="py-2.5 px-3 text-right font-bold text-stone-900">Proyección Mensual ($)</th>
                <th className="py-2.5 px-3 text-right">% Gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedGastosZakia.map((g, idx) => (
                <tr key={g.no} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 text-center text-stone-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-stone-900">
                    {g.concepto}
                    {g.descripcion && <span className="block text-[10px] text-stone-500 font-normal">{g.descripcion}</span>}
                  </td>
                  <td className="py-2 px-3 text-stone-600 text-[11px]">{g.categoria}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(g.gastoSemanal)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatCurrency(g.proyeccionMensual)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-amber-900">{g.porcentajeTotal}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td colSpan={3} className="py-2.5 px-3 uppercase text-xs">Total Gastos Operativos (23 Rubros)</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(totalSemanalZakia)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-amber-950">{formatCurrency(totalMensualZakia)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-extrabold">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 2. HISTORIAL DE VENTAS AUDITADO (12 MESES: ENE - DIC) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
              Historial de Ventas y Utilidad Auditado (12 Meses: Ene - Dic)
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Desglose auditado por canal de cobro en mostrador: Terminal Punto de Venta (Tarjeta) vs. Efectivo.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 font-mono hidden sm:inline">
            Total Anual: {formatCurrency(totalVentasZakia12M)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right">Cobro Tarjeta TDC ($)</th>
                <th className="py-2.5 px-3 text-right">% TDC</th>
                <th className="py-2.5 px-3 text-right">Efectivo Mostrador ($)</th>
                <th className="py-2.5 px-3 text-right">% Efec.</th>
                <th className="py-2.5 px-3 text-right font-bold text-stone-900">Venta Total Mensual ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {VENTAS_ZAKIA.map((v, idx) => (
                <tr key={v.mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 font-semibold text-stone-900">{v.mes}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(v.puntoDeVentaTDC)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-500 text-[11px]">{v.porcentajeTDC}%</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(v.ventasMostradorEfectivo)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-500 text-[11px]">{v.porcentajeEfectivo}%</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatCurrency(v.ventaTotalMensual)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td className="py-2.5 px-3 uppercase text-xs">Total Anual (12 Meses)</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(totalTdcZakia)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-600 text-xs">60.3%</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(totalEfecZakia)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-600 text-xs">39.7%</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-amber-950">{formatCurrency(totalVentasZakia12M)}</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                <td className="py-2 px-3 uppercase text-[11px]">Promedio Mensual</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(Math.round(totalTdcZakia / 12))}</td>
                <td className="py-2 px-3 text-right font-mono text-[11px]">60.3%</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(Math.round(totalEfecZakia / 12))}</td>
                <td className="py-2 px-3 text-right font-mono text-[11px]">39.7%</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatCurrency(promVentasZakia)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. RESUMEN DE UTILIDAD POR MES */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
              Resumen de Utilidad Neta por Mes
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Ingresos Totales - Gastos Operativos = Utilidad Neta y Margen Mensual Auditado.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 font-mono hidden sm:inline">
            Utilidad Anual: {formatCurrency(TOTALES_CONSOLIDADOS.utilidadAnualZakia12M)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right">Ventas Totales ($)</th>
                <th className="py-2.5 px-3 text-right">Gastos Operativos ($)</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-800">Utilidad Neta ($)</th>
                <th className="py-2.5 px-3 text-right">Margen Neto (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {RESUMEN_UTILIDAD_ZAKIA.map((r, idx) => (
                <tr key={r.mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 font-semibold text-stone-900">{r.mes}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-800">{formatCurrency(r.ventaTotal)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-600">{formatCurrency(r.gastosOperativos)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800">{formatCurrency(r.utilidadNeta)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-stone-800">{formatPercent(r.margen)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td className="py-2.5 px-3 uppercase text-xs">Total Anual (12 Meses)</td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-950">{formatCurrency(totalVentasZakia12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.gastosAnualesZakia12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-emerald-800">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadAnualZakia12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-800">19.9%</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                <td className="py-2 px-3 uppercase text-[11px]">Promedio Mensual</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatCurrency(promVentasZakia)}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(totalMensualZakia)}</td>
                <td className="py-2 px-3 text-right font-mono font-extrabold text-emerald-900 text-sm">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualZakia)}</td>
                <td className="py-2 px-3 text-right font-mono text-emerald-900 font-bold">19.9%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Y ABAJO LOS RECUADROS RESUMEN */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Recuadros Resumen Financiero &bull; Fórmula Operativa
        </h3>
        <SummaryEquationCards
          ingresosMensuales={promVentasZakia}
          ingresosAnuales={totalVentasZakia12M}
          gastosMensuales={totalMensualZakia}
          gastosAnuales={TOTALES_CONSOLIDADOS.gastosAnualesZakia12M}
          gastosSemanales={totalSemanalZakia}
          rubrosCount={23}
          utilidadMensual={TOTALES_CONSOLIDADOS.utilidadMensualZakia}
          utilidadAnual={TOTALES_CONSOLIDADOS.utilidadAnualZakia12M}
          margenNeto="19.9%"
          isPrintMode={true}
          showClickHelper={false}
        />
      </div>

      {/* Signatures block */}
      <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-12 text-center text-xs text-stone-700">
        <div>
          <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
          <p className="font-bold text-stone-900">Dirección General &bull; Panadería Santa Fé</p>
          <p className="text-[10px]">Representante Legal &bull; Sucursal Zákia</p>
        </div>
        <div>
          <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
          <p className="font-bold text-stone-900">Auditoría / Inversionista</p>
          <p className="text-[10px]">Validación Contable y Conciliación Bancaria</p>
        </div>
      </div>
    </div>
  );

  const renderRefugioReport = () => (
    <div className="space-y-8 print:space-y-6">
      {/* Institutional Header */}
      <div className="border-b-2 border-stone-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Store className="w-4 h-4" />
            <span>Panadería Santa Fé &bull; Sucursal Matriz El Refugio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Resumen Operativo &amp; Financiero Auditado (12 Meses)
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Planta Matriz de Producción &amp; Rutas de Reparto Mayorista, Querétaro &bull; Cifras Auditadas y Conciliadas al 100% Real
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-bold">Tipo de Unidad</span>
          <span className="text-base font-bold text-stone-900">Planta Matriz + Reparto</span>
        </div>
      </div>

      {/* 1. DESGLOSE POR IMPORTANCIA DE COSTOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
              Desglose por Importancia de Costos
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Valores nominales proyectados mensualmente en El Refugio ordenados por mayor impacto presupuestal.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 font-mono hidden sm:inline">
            Total Mensual: {formatCurrency(totalMensualRefugio)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Concepto / Rubro Operativo</th>
                <th className="py-2.5 px-3">Categoría</th>
                <th className="py-2.5 px-3 text-right">Gasto Semanal ($)</th>
                <th className="py-2.5 px-3 text-right font-bold text-stone-900">Proyección Mensual ($)</th>
                <th className="py-2.5 px-3 text-right">% Gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {sortedGastosRefugio.map((g, idx) => (
                <tr key={g.no} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 text-center text-stone-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-stone-900">
                    {g.concepto}
                    {g.descripcion && <span className="block text-[10px] text-stone-500 font-normal">{g.descripcion}</span>}
                  </td>
                  <td className="py-2 px-3 text-stone-600 text-[11px]">{g.categoria}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(g.gastoSemanal)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatCurrency(g.proyeccionMensual)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-amber-900">{g.porcentajeTotal}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td colSpan={3} className="py-2.5 px-3 uppercase text-xs">Total Gastos Operativos (24 Rubros)</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(totalSemanalRefugio)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-amber-950">{formatCurrency(totalMensualRefugio)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-extrabold">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 2. HISTORIAL DE VENTAS AUDITADO (12 MESES: ENE - DIC) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
              Historial de Ventas y Utilidad Auditado (12 Meses: Ene - Dic)
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Desglose mensual completo: Mostrador (TDC + Efectivo validado) + Rutas de Reparto Mayorista + Transferencias Cautivos.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 font-mono hidden sm:inline">
            Total Anual: {formatCurrency(totalVentasRefugio12M)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right">Cobro Tarjeta TDC ($)</th>
                <th className="py-2.5 px-3 text-right">Efectivo Validado ($)</th>
                <th className="py-2.5 px-3 text-right font-semibold text-stone-800">Total Mostrador ($)</th>
                <th className="py-2.5 px-3 text-right">Reparto Mayorista ($)</th>
                <th className="py-2.5 px-3 text-right">Transf. Cautivos ($)</th>
                <th className="py-2.5 px-3 text-right font-bold text-stone-900">Venta Total ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {VENTAS_REFUGIO.map((v, idx) => (
                <tr key={v.mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 font-semibold text-stone-900">{v.mes}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(v.cobroTarjetaTDC)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(v.efectivoCalculado)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-stone-900">{formatCurrency(v.ventaTotalMostrador)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(v.reparto)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(v.transferenciasCautivos)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-amber-950">{formatCurrency(v.ventaTotalMensual)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td className="py-2.5 px-3 uppercase text-xs">Total Anual (12 Meses)</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(totalTdcRefugio)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(totalEfecRefugio)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-900 font-bold">{formatCurrency(totalMostradorRefugio)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(totalRepartoRefugio)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(totalCautivosRefugio)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-amber-950 font-extrabold">{formatCurrency(totalVentasRefugio12M)}</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                <td className="py-2 px-3 uppercase text-[11px]">Promedio Mensual</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(Math.round(totalTdcRefugio / 12))}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(Math.round(totalEfecRefugio / 12))}</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatCurrency(Math.round(totalMostradorRefugio / 12))}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(Math.round(totalRepartoRefugio / 12))}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(Math.round(totalCautivosRefugio / 12))}</td>
                <td className="py-2 px-3 text-right font-mono font-extrabold text-sm">{formatCurrency(promVentasRefugio)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. RESUMEN DE UTILIDAD POR MES */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
              Resumen de Utilidad Neta por Mes
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Ventas Totales - Gastos Operativos de Planta Matriz = Utilidad Neta y Margen Real.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 font-mono hidden sm:inline">
            Utilidad Anual: {formatCurrency(TOTALES_CONSOLIDADOS.utilidadAnualRefugio12M)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right">Ventas Totales ($)</th>
                <th className="py-2.5 px-3 text-right">Gastos Operativos ($)</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-800">Utilidad Neta ($)</th>
                <th className="py-2.5 px-3 text-right">Margen Neto (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {RESUMEN_UTILIDAD_REFUGIO.map((r, idx) => (
                <tr key={r.mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 font-semibold text-stone-900">{r.mes}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-800">{formatCurrency(r.ventaTotal)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-600">{formatCurrency(r.gastosOperativos)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800">{formatCurrency(r.utilidadNeta)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-stone-800">{formatPercent(r.margen)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td className="py-2.5 px-3 uppercase text-xs">Total Anual (12 Meses)</td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-950">{formatCurrency(totalVentasRefugio12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-700">{formatCurrency(TOTALES_CONSOLIDADOS.gastosAnualesRefugio12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-emerald-800">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadAnualRefugio12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-800">{margenNetoRefugio}%</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                <td className="py-2 px-3 uppercase text-[11px]">Promedio Mensual</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatCurrency(promVentasRefugio)}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(totalMensualRefugio)}</td>
                <td className="py-2 px-3 text-right font-mono font-extrabold text-emerald-900 text-sm">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualRefugio)}</td>
                <td className="py-2 px-3 text-right font-mono text-emerald-900 font-bold">{margenNetoRefugio}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Y ABAJO LOS RECUADROS RESUMEN */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Recuadros Resumen Financiero &bull; Fórmula Operativa
        </h3>
        <SummaryEquationCards
          ingresosMensuales={promVentasRefugio}
          ingresosAnuales={totalVentasRefugio12M}
          gastosMensuales={totalMensualRefugio}
          gastosAnuales={TOTALES_CONSOLIDADOS.gastosAnualesRefugio12M}
          gastosSemanales={totalSemanalRefugio}
          rubrosCount={24}
          utilidadMensual={TOTALES_CONSOLIDADOS.utilidadMensualRefugio}
          utilidadAnual={TOTALES_CONSOLIDADOS.utilidadAnualRefugio12M}
          margenNeto={`${margenNetoRefugio}%`}
          isPrintMode={true}
          showClickHelper={false}
        />
      </div>

      {/* Signatures block */}
      <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-12 text-center text-xs text-stone-700">
        <div>
          <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
          <p className="font-bold text-stone-900">Dirección General &bull; Panadería Santa Fé</p>
          <p className="text-[10px]">Representante Legal &bull; Sucursal Matriz El Refugio</p>
        </div>
        <div>
          <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
          <p className="font-bold text-stone-900">Auditoría / Inversionista</p>
          <p className="text-[10px]">Validación Contable y Conciliación Bancaria</p>
        </div>
      </div>
    </div>
  );

  const renderUnificadoReport = () => {
    const MONTO_ADMIN_MENSUAL = 35000;
    const gastosMensualesReporte = deducirAdmin 
      ? TOTALES_CONSOLIDADOS.gastosMensualesTotal + MONTO_ADMIN_MENSUAL 
      : TOTALES_CONSOLIDADOS.gastosMensualesTotal;
    const gastosAnualesReporte = deducirAdmin 
      ? TOTALES_CONSOLIDADOS.gastosAnualesCadenaTotal + (MONTO_ADMIN_MENSUAL * 12) 
      : TOTALES_CONSOLIDADOS.gastosAnualesCadenaTotal;
    const gastosSemanalesReporte = deducirAdmin 
      ? Math.round(TOTALES_CONSOLIDADOS.gastosSemanalesTotal + (MONTO_ADMIN_MENSUAL * 12 / 52)) 
      : TOTALES_CONSOLIDADOS.gastosSemanalesTotal;
    const utilidadMensualReporte = deducirAdmin 
      ? 200551 
      : TOTALES_CONSOLIDADOS.utilidadMensualTotal;
    const utilidadAnualReporte = deducirAdmin 
      ? 200551 * 12 
      : TOTALES_CONSOLIDADOS.utilidadAnualCadenaTotal;
    const margenPonderadoReporte = ((utilidadMensualReporte / TOTALES_CONSOLIDADOS.promedioMensualVentasTotal) * 100).toFixed(1);

    const gastosListUnificado = deducirAdmin 
      ? [
          ...consolidatedGastosList,
          { 
            concepto: 'Administración General (Deducción Operativa)', 
            categoria: 'Administración y Otros', 
            semanal: Math.round(MONTO_ADMIN_MENSUAL * 12 / 52), 
            mensual: MONTO_ADMIN_MENSUAL, 
            pct: Number(((MONTO_ADMIN_MENSUAL / gastosMensualesReporte) * 100).toFixed(1)) 
          }
        ]
      : consolidatedGastosList;

    const monthlyDataUnificado = consolidatedMonthlyData.map(m => {
      const g = deducirAdmin ? m.gastosTotal + MONTO_ADMIN_MENSUAL : m.gastosTotal;
      const u = m.ventasTotal - g;
      const marg = Number(((u / m.ventasTotal) * 100).toFixed(1));
      return {
        ...m,
        gastosTotal: g,
        utilidadTotal: u,
        margen: marg
      };
    });

    return (
    <div className="space-y-8 print:space-y-6">
      {/* Institutional Header */}
      <div className="border-b-2 border-stone-800 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Panadería Santa Fé &bull; Cadena Consolidada (Zákia + El Refugio)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Resumen Operativo &amp; Financiero Integral en Conjunto
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Consolidación de Toda la Red Operativa (2 Unidades en Querétaro) &bull; Auditoría 12 Meses 100% Real
          </p>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-bold">Alcance de Red</span>
          <span className="text-base font-bold text-stone-900">2 Sucursales Integradas</span>
        </div>
      </div>

      {/* Botón y guía de descarga directa a PDF */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 print:hidden shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-600 text-white rounded-xl shadow-xs">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-950">Descargar Archivo Consolidado Completo en PDF</h4>
            <p className="text-xs text-amber-800">
              Haga clic en el botón para descargar el documento PDF consolidado. En la ventana de impresión, seleccione <strong>"Guardar como PDF"</strong> en el destino.
            </p>
          </div>
        </div>
        <button
          onClick={() => handlePrint('unificado')}
          className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-sm active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Descargar PDF Ahora</span>
        </button>
      </div>

      {/* 1. DESGLOSE POR IMPORTANCIA DE COSTOS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
              Desglose por Importancia de Costos
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Valores nominales proyectados mensualmente en conjunto (red consolidada ordenada por mayor impacto).
            </p>
          </div>
          <span className="text-xs font-bold text-amber-900 font-mono hidden sm:inline">
            Total Mensual: {formatCurrency(gastosMensualesReporte)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">Concepto / Rubro Consolidado</th>
                <th className="py-2.5 px-3">Categoría</th>
                <th className="py-2.5 px-3 text-right">Gasto Semanal ($)</th>
                <th className="py-2.5 px-3 text-right font-bold text-stone-900">Proyección Mensual ($)</th>
                <th className="py-2.5 px-3 text-right">% Gasto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {gastosListUnificado.map((g, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 text-center text-stone-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-stone-900">{g.concepto}</td>
                  <td className="py-2 px-3 text-stone-600 text-[11px]">{g.categoria}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(g.semanal)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-stone-900">{formatCurrency(g.mensual)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-amber-900">{g.pct}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td colSpan={3} className="py-2.5 px-3 uppercase text-xs">Total Gastos Operativos Consolidados (Red Completa)</td>
                <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(gastosSemanalesReporte)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-amber-950">{formatCurrency(gastosMensualesReporte)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-800 font-extrabold">100.0%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 2. HISTORIAL DE VENTAS AUDITADO (12 MESES: ENE - DIC) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">2</span>
              Historial de Ventas y Utilidad Auditado (12 Meses: Ene - Dic)
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Facturación mensual consolidada por sucursal y porcentaje de aportación a la red.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 font-mono hidden sm:inline">
            Total Cadena: {formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right">Venta Sucursal Zákia ($)</th>
                <th className="py-2.5 px-3 text-right">% Zákia</th>
                <th className="py-2.5 px-3 text-right">Venta Sucursal El Refugio ($)</th>
                <th className="py-2.5 px-3 text-right">% Refugio</th>
                <th className="py-2.5 px-3 text-right font-bold text-stone-900">Venta Total Consolidada ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {consolidatedMonthlyData.map((m, idx) => (
                <tr key={m.mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 font-semibold text-stone-900">{m.mes}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(m.ventasZakia)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-500 text-[11px]">{m.pctZakia}%</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-700">{formatCurrency(m.ventasRefugio)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-500 text-[11px]">{m.pctRefugio}%</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-amber-950">{formatCurrency(m.ventasTotal)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td className="py-2.5 px-3 uppercase text-xs">Total Anual (12 Meses)</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-600 text-xs">37.2%</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesRefugio12M)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-600 text-xs">62.8%</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-amber-950 font-extrabold">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)}</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                <td className="py-2 px-3 uppercase text-[11px]">Promedio Mensual</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasZakia)}</td>
                <td className="py-2 px-3 text-right font-mono text-[11px]">37.2%</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio)}</td>
                <td className="py-2 px-3 text-right font-mono text-[11px]">62.8%</td>
                <td className="py-2 px-3 text-right font-mono font-extrabold text-sm">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3. RESUMEN DE UTILIDAD POR MES */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between border-b border-stone-300 pb-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] font-bold flex items-center justify-center">3</span>
              Resumen de Utilidad Neta por Mes
            </h2>
            <p className="text-[11px] text-stone-600 mt-0.5">
              Ingresos Totales Consolidados - Gastos Totales = Utilidad Neta Consolidada y Margen Ponderado.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 font-mono hidden sm:inline">
            Utilidad Anual Consolidada: {formatCurrency(utilidadAnualReporte)}
          </span>
        </div>

        <div className="overflow-x-auto border border-stone-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 text-stone-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Mes</th>
                <th className="py-2.5 px-3 text-right">Venta Consolidada ($)</th>
                <th className="py-2.5 px-3 text-right">Gastos Consolidados ($)</th>
                <th className="py-2.5 px-3 text-right font-bold text-emerald-800">Utilidad Neta Consolidada ($)</th>
                <th className="py-2.5 px-3 text-right">Margen Neto (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {monthlyDataUnificado.map((m, idx) => (
                <tr key={m.mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}>
                  <td className="py-2 px-3 font-semibold text-stone-900">{m.mes}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-800">{formatCurrency(m.ventasTotal)}</td>
                  <td className="py-2 px-3 text-right font-mono text-stone-600">{formatCurrency(m.gastosTotal)}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-emerald-800">{formatCurrency(m.utilidadTotal)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold text-stone-800">{m.margen}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-stone-100 border-t-2 border-stone-300 font-bold text-stone-900">
              <tr>
                <td className="py-2.5 px-3 uppercase text-xs">Total Anual (12 Meses)</td>
                <td className="py-2.5 px-3 text-right font-mono text-amber-950">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-stone-700">{formatCurrency(gastosAnualesReporte)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-base text-emerald-800 font-extrabold">{formatCurrency(utilidadAnualReporte)}</td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-800">{margenPonderadoReporte}%</td>
              </tr>
              <tr className="bg-emerald-50/60 font-semibold text-emerald-950">
                <td className="py-2 px-3 uppercase text-[11px]">Promedio Mensual</td>
                <td className="py-2 px-3 text-right font-mono font-bold">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasTotal)}</td>
                <td className="py-2 px-3 text-right font-mono">{formatCurrency(gastosMensualesReporte)}</td>
                <td className="py-2 px-3 text-right font-mono font-extrabold text-emerald-900 text-sm">{formatCurrency(utilidadMensualReporte)}</td>
                <td className="py-2 px-3 text-right font-mono text-emerald-900 font-bold">{margenPonderadoReporte}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Y ABAJO LOS RECUADROS RESUMEN */}
      <div className="pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
          Recuadros Resumen Financiero &bull; Fórmula Operativa Consolidada
        </h3>
        <SummaryEquationCards
          ingresosMensuales={TOTALES_CONSOLIDADOS.promedioMensualVentasTotal}
          ingresosAnuales={TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal}
          gastosMensuales={gastosMensualesReporte}
          gastosAnuales={gastosAnualesReporte}
          gastosSemanales={gastosSemanalesReporte}
          rubrosCount={47}
          utilidadMensual={utilidadMensualReporte}
          utilidadAnual={utilidadAnualReporte}
          margenNeto={`${margenPonderadoReporte}%`}
          isPrintMode={true}
          showClickHelper={false}
        />
      </div>

      {/* Signatures block */}
      <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-12 text-center text-xs text-stone-700">
        <div>
          <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
          <p className="font-bold text-stone-900">Dirección General &bull; Panadería Santa Fé</p>
          <p className="text-[10px]">Representante Legal &bull; Cadena Consolidada Querétaro</p>
        </div>
        <div>
          <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
          <p className="font-bold text-stone-900">Auditoría Contable</p>
          <p className="text-[10px]">Validación Contable y Conciliación Bancaria</p>
        </div>
      </div>
    </div>
    );
  };

  const renderCartaReport = () => {
    let savedPhotos: Array<{ id: number; label?: string; sublabel?: string; title?: string; subtitle?: string; dataUrl: string | null }> = [];
    try {
      const saved = localStorage.getItem('santafe_fotos_inicio_v1');
      if (saved) savedPhotos = JSON.parse(saved);
    } catch {
      // ignore
    }

    return (
      <div className="space-y-6 print:space-y-5">
        {/* Header */}
        <div className="border-b-2 border-amber-900 pb-5 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <MonitoLogo size="md" className="w-16 h-16 shrink-0" />
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Carta de Agradecimiento &bull; Levantamiento Operativo
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-0.5 font-serif">
                PANADERÍA SANTA FÉ
              </h1>
              <p className="text-xs text-amber-900 font-semibold uppercase tracking-wider mt-0.5">
                A la Señora Sandra, a Don Juventino y a Yovis
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-stone-500 block">Periodo de Levantamiento</span>
            <span className="text-sm font-bold text-stone-900 font-mono">6 Semanas &bull; 3 Turnos</span>
          </div>
        </div>

        {/* Cita de Agradecimiento */}
        <div className="bg-amber-50/70 border-l-4 border-amber-800 p-4 rounded-r-xl">
          <p className="text-sm sm:text-base font-serif italic text-stone-900 leading-relaxed">
            &ldquo;Agradezco a la Señora Sandra, a Don Juventino y a Yovis me hayan brindado el honor de abrirme las puertas de Panadería Santa Fé.&rdquo;
          </p>
        </div>

        {/* 3 Turnos */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
            Levantamiento Operativo en Planta (45 Días &bull; 3 Turnos)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[10px]">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>Primeros 15 Días &bull; Madrugada</span>
              </div>
              <p className="font-semibold text-stone-900 text-xs">En los Hornos y Origen</p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Aprendiendo de dónde nace nuestro producto, quiénes participan en su elaboración, ingredientes, horarios y las manos que lo realizan.
              </p>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[10px]">
                <Store className="w-3.5 h-3.5 text-amber-600" />
                <span>Siguientes 15 Días &bull; Mañana</span>
              </div>
              <p className="font-semibold text-stone-900 text-xs">Apertura y Mostrador</p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Cómo se va a ver nuestro producto al iniciar el día, limpieza, orden, las personas que integran el equipo de mostrador y el equipo de reparto.
              </p>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold uppercase tracking-wider text-[10px]">
                <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                <span>Últimos 15 Días &bull; Tarde y Cierre</span>
              </div>
              <p className="font-semibold text-stone-900 text-xs">Ventas y Atención</p>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                De la mitad del día al cierre, el turno que más vende, la atención al cliente y los pedidos que realizan los clientes para el siguiente día.
              </p>
            </div>
          </div>
        </div>

        {/* Evidencia Fotográfica */}
        {savedPhotos.length > 0 && savedPhotos.some(p => p.dataUrl) && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {savedPhotos.filter(p => p.dataUrl).map((photo, i) => (
                <div key={photo.id || i} className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50 shadow-2xs">
                  <div className="aspect-4/3 bg-stone-100 flex items-center justify-center overflow-hidden">
                    <img src={photo.dataUrl!} alt="Fotografía" className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Declaración Final */}
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200">
          <p className="text-xs sm:text-sm leading-relaxed text-stone-800 font-serif italic">
            &ldquo;Semanas llenas de emoción, mucho corazón, expreso mi mayor respeto y la firme decisión de tomar este negocio buscando que prevalezca y crezca, asumir este compromiso sería para mi cuidar y continuar construyendo un legado familiar.&rdquo;
          </p>
        </div>

        {/* Firmas */}
        <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-12 text-center text-xs text-stone-700">
          <div>
            <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
            <p className="font-bold text-stone-900">Dirección y Compromiso de Continuidad</p>
            <p className="text-[10px]">Panadería Santa Fé</p>
          </div>
          <div>
            <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
            <p className="font-bold text-stone-900">Familia Fundadora</p>
            <p className="text-[10px]">Sra. Sandra &bull; Don Juventino &bull; Yovis</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:static print:inset-auto print:p-0 print:bg-white print:overflow-visible print:block">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-6 overflow-hidden border border-stone-200 flex flex-col max-h-[92vh] print:max-h-none print:my-0 print:border-none print:shadow-none print:overflow-visible print:w-full print:block">
        {/* Top Control Bar (Never Printed) */}
        <div className="bg-stone-900 text-white p-3.5 px-5 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm tracking-tight">Centro de Exportación PDF / Impresión Formal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePrint()}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Guardar / Descargar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation for Exportables (Never Printed) */}
        <div className="bg-stone-100 border-b border-stone-200 px-4 py-2 flex flex-wrap items-center gap-1.5 print:hidden shrink-0 text-xs">
          <span className="text-stone-500 font-bold uppercase tracking-wider text-[10px] mr-2">
            Seleccionar Hoja:
          </span>
          <button
            onClick={() => setSelectedReport('carta')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedReport === 'carta'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Inicio &bull; Carta</span>
          </button>
          <button
            onClick={() => setSelectedReport('zakia')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedReport === 'zakia'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Sucursal Zákia</span>
          </button>
          <button
            onClick={() => setSelectedReport('refugio')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedReport === 'refugio'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Sucursal El Refugio</span>
          </button>
          <button
            onClick={() => setSelectedReport('unificado')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedReport === 'unificado'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>En Conjunto (Consolidado)</span>
          </button>
          <button
            onClick={() => setSelectedReport('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedReport === 'all'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
            }`}
          >
            <span>📑 Imprimir Todas las Hojas (Carta + Zákia + Refugio + Consolidado)</span>
          </button>
        </div>

        {/* Printable Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 text-stone-900 font-sans print:p-0 print:overflow-visible" id="printable-report">
          {selectedReport === 'carta' && renderCartaReport()}
          {selectedReport === 'zakia' && renderZakiaReport()}
          {selectedReport === 'refugio' && renderRefugioReport()}
          {selectedReport === 'unificado' && renderUnificadoReport()}
          {selectedReport === 'all' && (
            <div className="space-y-16 print:space-y-0">
              <div className="print:break-after-page mb-12">
                {renderCartaReport()}
              </div>
              <div className="print:break-after-page mb-12">
                {renderZakiaReport()}
              </div>
              <div className="print:break-after-page mb-12">
                {renderRefugioReport()}
              </div>
              <div>
                {renderUnificadoReport()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

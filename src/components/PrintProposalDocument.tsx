import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  FileText, 
  CheckCircle2, 
  Banknote, 
  Coins, 
  TrendingUp, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles,
  Building2,
  Lock,
  ArrowRight,
  Check
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface PrintProposalDocumentProps {
  onClose: () => void;
  confirmedChoice?: number | null;
}

export const PrintProposalDocument: React.FC<PrintProposalDocumentProps> = ({ 
  onClose,
  confirmedChoice = null
}) => {
  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = 'Propuestas_Patrimoniales_Don_Juventino_Panaderia_Santa_Fe';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const currentDate = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Floating Toolbar (Hidden on print) */}
      <div className="w-full max-w-4xl bg-stone-900 text-white rounded-2xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl border border-stone-700 print:hidden sticky top-2 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>Documento Oficial para Imprimir / Guardar en PDF</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Formato Ejecutivo
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Listo para descargar en PDF o imprimir ante notario con las 4 propuestas y cuadro comparativo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            title="Abrir diálogo de impresión para guardar como PDF"
          >
            <Download className="w-4 h-4" />
            <span>Descargar en PDF / Imprimir</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700"
            title="Cerrar vista previa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PRINTABLE SHEET CONTAINER (Styled to look like professional legal / executive report) */}
      <div className="w-full max-w-4xl bg-white text-stone-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-stone-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:rounded-none">
        
        {/* ================= PAGE 1: HEADER & 4 PROPOSALS ================= */}
        <div className="space-y-6">
          {/* Institutional Header */}
          <div className="border-b-2 border-stone-900 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-widest text-amber-800">
                  <Building2 className="w-4 h-4 text-amber-700" />
                  <span>Panadería Tradicional Santa Fé &bull; Zákia &amp; El Refugio</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-black text-stone-900 mt-1 leading-tight tracking-tight">
                  PROPUESTAS PATRIMONIALES DE RETIRO Y LIQUIDACIÓN
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5 font-medium">
                  Documento Ejecutivo y Formal de Salida preparado con respeto y consideración para <strong>Don Juventino Pérez</strong>
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0 bg-stone-50 border border-stone-200 p-2.5 rounded-xl print:border-stone-400">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Carácter Formal</span>
                <span className="text-xs font-bold text-stone-900 block">Estricta Confidencialidad</span>
                <span className="text-[11px] text-stone-600 block mt-0.5">{currentDate}</span>
              </div>
            </div>

            {/* Technical Valuation Basis Strip */}
            <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 print:border-stone-300">
                <span className="text-[10px] text-stone-500 block">Utilidad Base Reportada</span>
                <span className="font-bold font-mono text-stone-900 text-xs">$305,881 MXN / mes</span>
                <span className="text-[9px] text-stone-400 block">$3,670,572 MXN / año</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 print:border-stone-300">
                <span className="text-[10px] text-stone-500 block">Utilidad Normalizada</span>
                <span className="font-bold font-mono text-stone-900 text-xs">$270,881 MXN / mes</span>
                <span className="text-[9px] text-stone-400 block">Deduciendo administración</span>
              </div>
              <div className="bg-stone-50 p-2 rounded-lg border border-stone-200 print:border-stone-300">
                <span className="text-[10px] text-stone-500 block">Múltiplo de Mercado PyMEs</span>
                <span className="font-bold font-mono text-amber-900 text-xs">3.0x a 3.5x Anual</span>
                <span className="text-[9px] text-stone-400 block">Rango $8.2M &ndash; $11.3M</span>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg border border-amber-300 print:border-stone-400">
                <span className="text-[10px] text-amber-900 font-bold block">Garantía de Cumplimiento</span>
                <span className="font-bold text-amber-950 text-xs">Convenio Notarial</span>
                <span className="text-[9px] text-amber-800 block">Pagarés mercantiles avalados</span>
              </div>
            </div>
          </div>

          {/* Section Subtitle */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Las 4 Alternativas de Formalización Financiera</span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Cualquiera de estas 4 opciones garantiza certeza jurídica, liquidez y respaldo financiero total para que Don Juventino elija el esquema que mejor responda a su proyecto de vida:
            </p>
          </div>

          {/* 4 PROPOSALS GRID - 2x2 Clean Executive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* PROPUESTA 1: CONTADO */}
            <div className={`p-4 rounded-xl border-2 transition-all avoid-break ${confirmedChoice === 1 ? 'border-amber-600 bg-amber-50/50' : 'border-amber-300 bg-stone-50/70'}`}>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  <Banknote className="w-3 h-3 text-amber-800" />
                  PROPUESTA 1 &bull; Contado Inmediato
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-900">1 sola exhibición</span>
              </div>

              <h3 className="text-sm font-extrabold text-stone-900">
                Adquisición Directa de Contado
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Orientada a certidumbre absoluta y disponibilidad total de fondos en una sola exhibición sin plazos diferidos.
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-white border border-amber-200">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Monto 100% Líquido en Efectivo</span>
                <span className="text-xl font-extrabold text-amber-950 font-mono">{formatCurrency(8500000)}</span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Transferencia íntegra a la firma ante Notario</span>
              </div>

              <ul className="mt-2.5 space-y-1 text-[11px] text-stone-700">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Disponibilidad inmediata:</strong> $8.5 MDP libres en su cuenta bancaria.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Cero contingencias futuras:</strong> $0 deuda y deslinde operativo total desde el día 1.</span>
                </li>
              </ul>
            </div>

            {/* PROPUESTA 2: 42 MESES */}
            <div className={`p-4 rounded-xl border-2 transition-all avoid-break ${confirmedChoice === 2 ? 'border-teal-600 bg-teal-50/50' : 'border-teal-300 bg-stone-50/70'}`}>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                  <Coins className="w-3 h-3 text-teal-800" />
                  PROPUESTA 2 &bull; 42 Meses Fijos
                </span>
                <span className="text-[10px] font-mono font-bold text-teal-900">3.5 Años</span>
              </div>

              <h3 className="text-sm font-extrabold text-stone-900">
                Financiamiento a 42 Meses ($150,000 MXN / Mes)
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Flujo mensual fijo y garantizado durante 3.5 años, alcanzando un total significativamente superior.
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-white border border-teal-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Pago Inicial Cash</span>
                  <span className="text-base font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-teal-800 uppercase tracking-wider block font-semibold">Mensualidad Fija</span>
                  <span className="text-base font-extrabold text-teal-950 font-mono">$150,000 / mes</span>
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className="text-[10px] text-stone-500 block">Total Acumulado a Percibir:</span>
                <span className="text-lg font-black text-teal-950 font-mono">{formatCurrency(11300000)}</span>
              </div>

              <ul className="mt-1 space-y-1 text-[11px] text-stone-700">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <span><strong>Garantía:</strong> 42 pagarés notariales de $150k sin variación alguna.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
                  <span><strong>Viabilidad:</strong> Deja $120,881/mes libres de colchón de seguridad para la panadería.</span>
                </li>
              </ul>
            </div>

            {/* PROPUESTA 3: INVERSIONISTA 13% */}
            <div className={`p-4 rounded-xl border-2 transition-all avoid-break ${confirmedChoice === 3 ? 'border-blue-600 bg-blue-50/50' : 'border-blue-300 bg-stone-50/70'}`}>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                  <TrendingUp className="w-3 h-3 text-blue-800" />
                  PROPUESTA 3 &bull; Inversionista 13%
                </span>
                <span className="text-[10px] font-mono font-bold text-blue-900">5 Años &bull; 13% Anual</span>
              </div>

              <h3 className="text-sm font-extrabold text-stone-900">
                Inversión Patrimonial al 13% con Abonos a Capital
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                $5 MDP iniciales + $5 MDP como Inversionista al 13% anual fijo (muy superior al banco).
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-white border border-blue-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Pago Inicial Cash</span>
                  <span className="text-base font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-blue-800 uppercase tracking-wider block font-semibold">Tasa Rendimiento</span>
                  <span className="text-base font-extrabold text-blue-950 font-mono">13.0% Fija Anual</span>
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className="text-[10px] text-stone-500 block">Total Acumulado a Percibir (5 Años):</span>
                <span className="text-lg font-black text-blue-950 font-mono">{formatCurrency(11950000)}</span>
              </div>

              <ul className="mt-1 space-y-1 text-[11px] text-stone-700">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                  <span><strong>Interés Mensual:</strong> Recibe intereses mes con mes para sus gastos de retiro.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                  <span><strong>Abonos a Capital:</strong> $1 MDP cada fin de año; el interés baja conforme baja el saldo.</span>
                </li>
              </ul>
            </div>

            {/* PROPUESTA 4: SOCIEDAD VITALICIA 13% */}
            <div className={`p-4 rounded-xl border-2 transition-all avoid-break ${confirmedChoice === 4 ? 'border-emerald-600 bg-emerald-50/50' : 'border-emerald-300 bg-stone-50/70'}`}>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <HeartHandshake className="w-3 h-3 text-emerald-800" />
                  PROPUESTA 4 &bull; Sociedad 13%
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-900">Vitalicio No Heredado</span>
              </div>

              <h3 className="text-sm font-extrabold text-stone-900">
                Sociedad Patrimonial (13%) e Ingreso Mensual Vitalicio
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                $5 MDP iniciales y dueño del 13% con pensión mensual vitalicia garantizada de por vida.
              </p>

              <div className="mt-3 p-2.5 rounded-lg bg-white border border-emerald-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Pago Inicial Cash</span>
                  <span className="text-base font-bold text-stone-900 font-mono">{formatCurrency(5000000)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-800 uppercase tracking-wider block font-semibold">Piso Garantizado</span>
                  <span className="text-base font-extrabold text-emerald-950 font-mono">$35,000 / mes</span>
                </div>
              </div>

              <div className="mt-2 text-right">
                <span className="text-[10px] text-stone-500 block">Condición de Pago Mensual:</span>
                <span className="text-xs font-bold text-emerald-900">Hacia arriba si hay más venta &bull; Nunca hacia abajo</span>
              </div>

              <ul className="mt-1 space-y-1 text-[11px] text-stone-700">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Seguridad:</strong> Piso irreductible de $35k/mes personalísimo no heredado de por vida.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Retiro Pleno:</strong> Nosotros asumimos toda la operación (4:30 AM, personal y hornos).</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* ================= PAGE 2: COMPARATIVE TABLE & SIGNATURES ================= */}
        <div className="mt-8 pt-6 border-t-2 border-stone-800 page-break-before space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                  Herramienta de Decisión para Don Juventino
                </span>
                <h2 className="text-lg sm:text-xl font-serif font-black text-stone-900">
                  Cuadro Comparativo Oficial de las 4 Alternativas
                </h2>
              </div>
              <span className="text-xs text-stone-500 font-mono">Página 2 / 2</span>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Contraste directo entre los 4 esquemas para evaluar liquidez inicial, ingresos mensuales, totales a percibir y respaldo legal:
            </p>
          </div>

          {/* Cuadro Comparativo Table */}
          <div className="border border-stone-300 rounded-xl overflow-hidden avoid-break">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 border-b border-stone-300 text-stone-800 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 w-1/5">Concepto Clave</th>
                  <th className="py-2.5 px-2.5 text-center bg-amber-50/60 text-amber-950 border-l border-stone-200">
                    Propuesta 1 &bull; Contado
                  </th>
                  <th className="py-2.5 px-2.5 text-center bg-teal-50/60 text-teal-950 border-l border-stone-200">
                    Propuesta 2 &bull; 42 Meses
                  </th>
                  <th className="py-2.5 px-2.5 text-center bg-blue-50/60 text-blue-950 border-l border-stone-200">
                    Propuesta 3 &bull; Inversión 13%
                  </th>
                  <th className="py-2.5 px-2.5 text-center bg-emerald-50/60 text-emerald-950 border-l border-stone-200">
                    Propuesta 4 &bull; Sociedad 13%
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {/* Row 1 */}
                <tr className="hover:bg-stone-50/60">
                  <td className="py-2 px-3 font-bold text-stone-900">Pago Inicial en Efectivo</td>
                  <td className="py-2 px-2.5 text-center font-mono font-extrabold text-amber-950 bg-amber-50/20 border-l border-stone-200">
                    $8,500,000 MXN
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-teal-950 bg-teal-50/20 border-l border-stone-200">
                    $5,000,000 MXN
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-blue-950 bg-blue-50/20 border-l border-stone-200">
                    $5,000,000 MXN
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-emerald-950 bg-emerald-50/20 border-l border-stone-200">
                    $5,000,000 MXN
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-stone-50/60">
                  <td className="py-2 px-3 font-bold text-stone-900">Flujo Mensual a Percibir</td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-amber-50/20 border-l border-stone-200">
                    $0 / mes (100% cobrado)
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-teal-950 bg-teal-50/20 border-l border-stone-200">
                    $150,000 MXN / mes fijo
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-blue-950 bg-blue-50/20 border-l border-stone-200">
                    $54,167 &rarr; $10,833/mes*
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-emerald-950 bg-emerald-50/20 border-l border-stone-200">
                    $35,000 MXN/mes piso**
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-stone-50/60">
                  <td className="py-2 px-3 font-bold text-stone-900">Abonos Extra a Capital</td>
                  <td className="py-2 px-2.5 text-center text-stone-500 bg-amber-50/20 border-l border-stone-200">
                    No aplica
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-500 bg-teal-50/20 border-l border-stone-200">
                    Incluidos en mensualidad
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-semibold text-blue-900 bg-blue-50/20 border-l border-stone-200">
                    $1,000,000 MXN a fin de año
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-500 bg-emerald-50/20 border-l border-stone-200">
                    Participación del 13%
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-stone-50/60">
                  <td className="py-2 px-3 font-bold text-stone-900">Plazo de la Operación</td>
                  <td className="py-2 px-2.5 text-center text-stone-700 bg-amber-50/20 border-l border-stone-200">
                    Inmediato (1 exhibición)
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-700 bg-teal-50/20 border-l border-stone-200 font-semibold">
                    42 meses (3.5 años)
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-700 bg-blue-50/20 border-l border-stone-200 font-semibold">
                    5 años (60 meses)
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-700 bg-emerald-50/20 border-l border-stone-200 font-semibold">
                    Vitalicio (No heredado)
                  </td>
                </tr>

                {/* Row 5: Total */}
                <tr className="bg-stone-100/70 font-extrabold">
                  <td className="py-2 px-3 text-stone-950 uppercase text-[11px]">Monto Total Percibido</td>
                  <td className="py-2 px-2.5 text-center font-mono text-stone-950 bg-amber-100/50 border-l border-stone-200 text-sm">
                    {formatCurrency(8500000)}
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono text-teal-950 bg-teal-100/50 border-l border-stone-200 text-sm">
                    {formatCurrency(11300000)}
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono text-blue-950 bg-blue-100/50 border-l border-stone-200 text-sm">
                    {formatCurrency(11950000)}
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono text-emerald-950 bg-emerald-100/50 border-l border-stone-200 text-sm">
                    $5 MDP + Vitalicio
                  </td>
                </tr>

                {/* Row 6: Rol */}
                <tr className="hover:bg-stone-50/60">
                  <td className="py-2 px-3 font-bold text-stone-900">Rol de Don Juventino</td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-amber-50/20 border-l border-stone-200 text-[11px]">
                    Retiro Pleno 100%
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-teal-50/20 border-l border-stone-200 text-[11px]">
                    Acreedor Preferente
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-blue-50/20 border-l border-stone-200 text-[11px]">
                    Inversionista 13% Anual
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-emerald-50/20 border-l border-stone-200 text-[11px]">
                    Dueño del 13% Social
                  </td>
                </tr>

                {/* Row 7: Legal */}
                <tr className="hover:bg-stone-50/60">
                  <td className="py-2 px-3 font-bold text-stone-900">Garantía Jurídica</td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-amber-50/20 border-l border-stone-200 text-[11px]">
                    Finiquito notarial
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-teal-50/20 border-l border-stone-200 text-[11px]">
                    42 pagarés notariales
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-blue-50/20 border-l border-stone-200 text-[11px]">
                    Contrato mutuo al 13%
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-600 bg-emerald-50/20 border-l border-stone-200 text-[11px]">
                    Escritura + Pensión vitalicia
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-stone-500 italic">
            * En la Propuesta 3, el interés mensual inicia en $54,167/mes y va disminuyendo año con año conforme se amortizan $1,000,000 MXN a capital cada fin de año.<br />
            ** En la Propuesta 4, el ingreso mensual es vitalicio con piso garantizado de $35,000 MXN: hacia arriba si aumentan las ventas, nunca hacia abajo.
          </p>

          {/* Decision Guideline Banner */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-300 text-xs text-stone-700 avoid-break">
            <h4 className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>¿Cuál le conviene más a Don Juventino? (Criterio de Decisión Rápida)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-[11px] mt-2">
              <div className="p-2 rounded bg-white border border-stone-200">
                <strong className="text-amber-900 block">Opción 1 (Contado):</strong>
                Ideal si desea liquidez inmediata y desconexión absoluta sin plazos.
              </div>
              <div className="p-2 rounded bg-white border border-stone-200">
                <strong className="text-teal-900 block">Opción 2 (42 Meses):</strong>
                Ideal si prefiere un flujo mensual generoso de $150k y ganar $2.8 MDP extra.
              </div>
              <div className="p-2 rounded bg-white border border-stone-200">
                <strong className="text-blue-900 block">Opción 3 (13% Anual):</strong>
                Ideal para hacer crecer su capital al 13% con pagos mensuales y abonos de $1 MDP.
              </div>
              <div className="p-2 rounded bg-white border border-stone-200">
                <strong className="text-emerald-900 block">Opción 4 (Sociedad):</strong>
                Ideal para recibir $5 MDP hoy y asegurar un sueldo vitalicio irreductible de por vida.
              </div>
            </div>
          </div>

          {/* Formal Acceptance & Signatures Section */}
          <div className="mt-8 pt-6 border-t-2 border-stone-300 avoid-break">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 text-center mb-6">
              Constancia de Presentación y Aceptación Formal de Esquema
            </h4>

            <div className="grid grid-cols-2 gap-8 text-xs text-center">
              <div>
                <div className="border-b-2 border-stone-800 pb-16 mx-4"></div>
                <span className="font-bold text-stone-900 block mt-2">Don Juventino Pérez</span>
                <span className="text-[11px] text-stone-500 block">Propietario / Cedente</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">Opción Seleccionada: ____________________</span>
              </div>

              <div>
                <div className="border-b-2 border-stone-800 pb-16 mx-4"></div>
                <span className="font-bold text-stone-900 block mt-2">Grupo Adquirente / Operador</span>
                <span className="text-[11px] text-stone-500 block">Conformidad y Respaldo Financiero</span>
                <span className="text-[10px] text-stone-400 block mt-0.5">Formalización Notarial Protocolizada</span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-200 text-center text-[10px] text-stone-400">
              Panadería Tradicional Santa Fé &bull; Sucursal Zákia &amp; Sucursal El Refugio &bull; Santiago de Querétaro, Qro. &bull; Documento elaborado con carácter fiduciario y confidencial.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

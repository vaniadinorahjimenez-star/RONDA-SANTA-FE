import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import html2pdf from 'html2pdf.js';
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
  Check,
  Home,
  Building,
  Briefcase,
  Clock,
  ExternalLink,
  Loader2
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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = 'Propuesta_y_Valuacion_Don_Juventino_Panaderia_Santa_Fe';
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1500);
  };

  const handleDirectPDFDownload = async () => {
    const element = document.getElementById('printable-proposal-doc');
    if (!element) {
      handleDownloadPDF();
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const opt = {
        margin: [6, 6, 6, 6],
        filename: 'Propuesta_y_Valuacion_Don_Juventino_Perez.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
      };
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('Error generating PDF with html2pdf, falling back to window.print():', err);
      handleDownloadPDF();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadStandaloneHTML = () => {
    const element = document.getElementById('printable-proposal-doc');
    if (!element) return;
    const fullHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Propuesta y Valuación - Don Juventino Pérez - Panadería Santa Fé</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      @page { size: letter portrait; margin: 8mm; }
      body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; background: white !important; }
      .page-break-before { page-break-before: always; break-before: page; }
      .avoid-break { page-break-inside: avoid; break-inside: avoid; }
    }
  </style>
</head>
<body class="bg-stone-100 text-stone-900 p-4 sm:p-8 font-sans">
  <div class="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-stone-200">
    ${element.innerHTML}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 500);
    };
  </script>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Propuesta_y_Valuacion_Don_Juventino_Perez.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    document.body.classList.add('printing-proposal-open');
    return () => {
      document.body.classList.remove('printing-proposal-open');
    };
  }, []);

  const currentDate = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return createPortal(
    <div 
      id="proposal-print-portal"
      className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex flex-col items-center justify-start overflow-y-auto p-2 sm:p-4 md:p-6 print:p-0 print:bg-white print:static print:inset-auto print:overflow-visible print:block print:w-full print:m-0"
    >
      {/* Floating Toolbar (Hidden on print) */}
      <div className="w-full max-w-4xl bg-stone-900 text-white rounded-2xl p-3 sm:p-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl border border-stone-700 print:hidden sticky top-2 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>Propuesta y Valuación Formal</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Formato Ejecutivo Oficial
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Descargue el archivo PDF real a su equipo o imprímalo en formato notarial.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          {/* Botón Principal: Descargar PDF Real */}
          <button
            onClick={handleDirectPDFDownload}
            disabled={isGeneratingPDF}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 disabled:opacity-60"
            title="Generar y descargar el archivo PDF oficial directamente a su dispositivo"
          >
            {isGeneratingPDF ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                <span>Generando PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-stone-950" />
                <span>Descargar PDF (.pdf)</span>
              </>
            )}
          </button>

          {/* Botón Secundario: Imprimir con navegador */}
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-bold text-xs border border-stone-600 transition-all cursor-pointer active:scale-95"
            title="Abrir diálogo de impresión para guardar con el navegador"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir</span>
          </button>

          {/* Botón Descargar HTML Autónomo */}
          <button
            onClick={handleDownloadStandaloneHTML}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white font-medium text-xs border border-stone-700 transition-all cursor-pointer active:scale-95"
            title="Descargar archivo HTML autónomo para abrir y compartir offline"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Archivo .html</span>
          </button>

          {/* Botón Cerrar */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors cursor-pointer border border-stone-700"
            title="Cerrar vista previa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PRINTABLE SHEET CONTAINER (Styled to look like professional legal / executive report) */}
      <div id="printable-proposal-doc" className="w-full max-w-4xl bg-white text-stone-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-stone-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:rounded-none">
        
        {/* ================= PAGE 1: HEADER, VALUACIÓN PYME Y 4 PROPUESTAS ================= */}
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
                  PROPUESTA Y VALUACIÓN
                </h1>
              </div>

              <div className="text-left sm:text-right shrink-0 bg-stone-50 border border-stone-200 p-2.5 rounded-xl print:border-stone-400">
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Carácter Formal</span>
                <span className="text-xs font-bold text-stone-900 block">Estricta Confidencialidad</span>
                <span className="text-[11px] text-stone-600 block mt-0.5">{currentDate}</span>
              </div>
            </div>

            {/* Technical Valuation Basis Strip (Garantía de Cumplimiento removida) */}
            <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 print:border-stone-300">
                <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Utilidad Base Reportada</span>
                <span className="font-bold font-mono text-stone-900 text-sm">$305,881 MXN / mes</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">$3,670,572 MXN / año</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 print:border-stone-300">
                <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Utilidad Normalizada</span>
                <span className="font-bold font-mono text-stone-900 text-sm">$270,881 MXN / mes</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">Deduciendo administración profesional ($35k/mes)</span>
              </div>
              <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 print:border-stone-300">
                <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-semibold">Valuación Base de Referencia</span>
                <span className="font-bold font-mono text-amber-900 text-sm">$9,360,000 MXN</span>
                <span className="text-[10px] text-stone-600 block mt-0.5">2.88x / 2.9x EBITDA Normalizado (Base Común)</span>
              </div>
            </div>

            {/* Sección: ¿CÓMO SE VALÚA UNA PYME? (Fuentes Consultadas + 3 Valuaciones con ROI) */}
            <div className="mt-5 space-y-3.5 avoid-break">
              <div className="border-b border-stone-300 pb-1.5 flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-700" />
                  <span>¿CÓMO SE VALÚA UNA PYME?</span>
                </h2>
                <span className="text-[10px] font-semibold text-stone-500">Múltiplos de Referencia &bull; Mercado PyME México</span>
              </div>

              {/* Fuentes Consultadas (como en la Imagen 1) */}
              <div className="overflow-hidden border border-stone-200 rounded-xl bg-white text-stone-800 text-xs shadow-2xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-stone-200">
                    {/* Referencia 1 */}
                    <tr className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3 sm:p-3.5 w-5/12 align-middle">
                        <div className="font-extrabold text-stone-900 text-xs sm:text-sm leading-snug">
                          Capital en Orden &mdash; &ldquo;Por qué tu empresa puede valer menos de 3x EBITDA&rdquo;
                        </div>
                        <div className="text-[11px] text-amber-900 font-bold mt-1">
                          Concentración de clientes extrema comprime el múltiplo a 2x&ndash;2.5x
                        </div>
                        <a
                          href="https://capitalenorden.com/blog/multiplos-bajos-pyme-mexico"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-amber-800 hover:text-amber-950 font-medium underline mt-1.5"
                        >
                          <span>capitalenorden.com/blog/multiplos-bajos-pyme-mexico</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="p-3 sm:p-3.5 text-center w-2/12 align-middle border-x border-stone-200 bg-amber-50/30">
                        <div className="inline-block p-1.5 rounded-lg bg-amber-100/90 border border-amber-300">
                          <span className="font-mono font-bold text-amber-950 text-xs sm:text-sm block">
                            2x &ndash; 2.5x
                          </span>
                          <span className="text-[9px] text-stone-600 block mt-0.5 leading-tight">
                            EBITDA normalizado
                          </span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-3.5 w-5/12 text-[11px] text-stone-700 leading-relaxed align-middle">
                        Aplica cuando la concentración de ingresos o la dependencia en personas clave comprime los múltiplos hacia rangos conservadores (2.0x a 2.5x), justificando una oferta prudente de entrada.
                      </td>
                    </tr>

                    {/* Referencia 2 */}
                    <tr className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3 sm:p-3.5 w-5/12 align-middle">
                        <div className="font-extrabold text-stone-900 text-xs sm:text-sm leading-snug">
                          Capital en Orden &mdash; &ldquo;Cómo Comprar una Empresa en México&rdquo;
                        </div>
                        <div className="text-[11px] text-emerald-900 font-bold mt-1">
                          Negocios con alta dependencia del fundador se ubican en 2.5x&ndash;3.5x EBITDA
                        </div>
                        <a
                          href="https://capitalenorden.com/guia/comprar-empresa-mexico"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] text-emerald-800 hover:text-emerald-950 font-medium underline mt-1.5"
                        >
                          <span>capitalenorden.com/guia/comprar-empresa-mexico</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      </td>
                      <td className="p-3 sm:p-3.5 text-center w-2/12 align-middle border-x border-stone-200 bg-emerald-50/30">
                        <div className="inline-block p-1.5 rounded-lg bg-emerald-100/90 border border-emerald-300">
                          <span className="font-mono font-bold text-emerald-950 text-xs sm:text-sm block">
                            2.5x &ndash; 3.5x
                          </span>
                          <span className="text-[9px] text-stone-600 block mt-0.5 leading-tight">
                            EBITDA normalizado
                          </span>
                        </div>
                      </td>
                      <td className="p-3 sm:p-3.5 w-5/12 text-[11px] text-stone-700 leading-relaxed align-middle">
                        Aplica a PyMEs de alimentos con marca reconocida y 2 unidades operando que requieren un periodo de transición estructurado para desvincular al fundador sin mermar ventas ni utilidades.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Las 3 Valuaciones junto con su ROI (como en la Imagen 2) */}
              <div className="pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Valuación 1: 3.5x Techo con Riesgo */}
                  <div className="p-3.5 rounded-2xl border-2 border-rose-300 bg-rose-50/40 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                          <Sparkles className="w-3 h-3 text-rose-700" />
                          3.5x &bull; Techo con Riesgo
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                          3.5X DE UTILIDAD NORMALIZADA ($270,881/MES)
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tracking-tight mt-0.5">
                          $10,920,000 <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
                        </div>
                      </div>
                    </div>

                    {/* Recuadro ROI */}
                    <div className="p-2.5 rounded-xl bg-white border border-amber-400 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-stone-900 uppercase">
                        <div className="flex items-center gap-1 text-stone-900">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>ROI TIEMPO DE RETORNO</span>
                        </div>
                        <span className="font-mono text-stone-600 font-bold">(3.4 años)</span>
                      </div>
                      <div className="text-xl font-black text-stone-900 font-mono tracking-tight">
                        40.3 meses
                      </div>
                      <div className="pt-0.5 border-t border-amber-200">
                        <span className="block text-[9px] font-black text-amber-950 uppercase tracking-tight bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-center">
                          &ldquo;no tocando un solo peso de utilidad&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Valuación 2: 2.4x Oferta de Apertura */}
                  <div className="p-3.5 rounded-2xl border-2 border-amber-300 bg-amber-50/40 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          2.4x &bull; Oferta de Apertura
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                          2.4X DE UTILIDAD NORMALIZADA ($270,881/MES)
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tracking-tight mt-0.5">
                          $7,800,000 <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
                        </div>
                      </div>
                    </div>

                    {/* Recuadro ROI */}
                    <div className="p-2.5 rounded-xl bg-white border border-amber-400 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-stone-900 uppercase">
                        <div className="flex items-center gap-1 text-stone-900">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>ROI TIEMPO DE RETORNO</span>
                        </div>
                        <span className="font-mono text-stone-600 font-bold">(2.4 años)</span>
                      </div>
                      <div className="text-xl font-black text-stone-900 font-mono tracking-tight">
                        28.8 meses
                      </div>
                      <div className="pt-0.5 border-t border-amber-200">
                        <span className="block text-[9px] font-black text-amber-950 uppercase tracking-tight bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-center">
                          &ldquo;no tocando un solo peso de utilidad&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Valuación 3: 2.9x Punto Medio de Negociación */}
                  <div className="p-3.5 rounded-2xl border-2 border-emerald-400 bg-emerald-50/50 flex flex-col justify-between space-y-3 shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                          <Sparkles className="w-3 h-3 text-emerald-700" />
                          2.9x &bull; Punto Medio de Negociación
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 block">
                          2.9X DE UTILIDAD NORMALIZADA ($270,881/MES)
                        </span>
                        <div className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tracking-tight mt-0.5">
                          $9,360,000 <span className="text-xs font-bold text-stone-500 font-sans">MXN</span>
                        </div>
                      </div>
                    </div>

                    {/* Recuadro ROI */}
                    <div className="p-2.5 rounded-xl bg-white border border-amber-400 shadow-2xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-stone-900 uppercase">
                        <div className="flex items-center gap-1 text-stone-900">
                          <Clock className="w-3 h-3 text-amber-700" />
                          <span>ROI TIEMPO DE RETORNO</span>
                        </div>
                        <span className="font-mono text-stone-600 font-bold">(2.9 años)</span>
                      </div>
                      <div className="text-xl font-black text-stone-900 font-mono tracking-tight">
                        34.6 meses
                      </div>
                      <div className="pt-0.5 border-t border-amber-200">
                        <span className="block text-[9px] font-black text-amber-950 uppercase tracking-tight bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded text-center">
                          &ldquo;no tocando un solo peso de utilidad&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Section Subtitle (Starts Page 2 cleanly) */}
          <div className="page-break-before pt-6 border-t-2 border-stone-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Las 4 Alternativas de Formalización Financiera (Valuación Base: $9,360,000 MXN)</span>
              </div>
              <span className="text-[11px] text-stone-500 font-mono font-bold">Página 2 / 3</span>
            </div>
            <p className="text-xs text-stone-600">
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
                Adquisición Directa en $9,360,000
              </h3>
              <p className="text-[11px] text-stone-700 mt-0.5 font-medium leading-tight">
                Valuación fijada en <strong>$9,360,000 MXN</strong> con oferta del pago de <strong>8.5 millones de contado ($8,500,000 MXN)</strong>. Certeza en un solo pago, facilitando su transición inmediata hacia nuevos proyectos.
              </p>

              <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-amber-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">Oferta de Contado (Cash)</span>
                  <span className="text-[10px] font-bold text-amber-800">Valuación Base: $9,360,000</span>
                </div>
                <span className="text-xl font-extrabold text-amber-950 font-mono">{formatCurrency(8500000)}</span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Transferencia íntegra a la firma ante Notario</span>
              </div>

              <ul className="mt-2 space-y-1 text-[11px] text-stone-700">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Certeza en un solo pago:</strong> $8.5 MDP libres en cuenta bancaria desde el día 1.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Transición inmediata:</strong> Deslinde total para enfocarse en nuevos proyectos.</span>
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
                  <span><strong>Certeza:</strong> Flujo mensual continuo y predecible de $150,000 MXN sin interrupciones.</span>
                </li>
              </ul>
            </div>

            {/* PROPUESTA 3: PAGOS 1 MDP ANUALES + INTERESES */}
            <div className={`p-4 rounded-xl border-2 transition-all avoid-break ${confirmedChoice === 3 ? 'border-blue-600 bg-blue-50/50' : 'border-blue-300 bg-stone-50/70'}`}>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                  <TrendingUp className="w-3 h-3 text-blue-800" />
                  PROPUESTA 3 &bull; Pagos 1 MDP Anuales + Intereses
                </span>
                <span className="text-[10px] font-mono font-bold text-blue-900">5 Años &bull; 13% Anual</span>
              </div>

              <h3 className="text-sm font-extrabold text-stone-900">
                Pagos 1 MDP Anuales + Intereses
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                $5 MDP iniciales + $4,360,000 MXN como Inversionista al 13% anual fijo (4 pagos de $1 MDP y liquidación de $360k).
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
                <span className="text-lg font-black text-blue-950 font-mono">{formatCurrency(10894000)}</span>
              </div>

              <ul className="mt-1 space-y-1 text-[11px] text-stone-700">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                  <span><strong>Interés Mensual:</strong> Recibe intereses mes con mes para sus gastos de retiro.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                  <span><strong>Abonos a Capital:</strong> 4 pagos anuales de $1 MDP y $360k al final; el interés baja conforme baja el saldo.</span>
                </li>
              </ul>
            </div>

            {/* PROPUESTA 4: TRASPASO DE ACTIVOS INMOBILIARIOS */}
            <div className={`p-4 rounded-xl border-2 transition-all avoid-break ${confirmedChoice === 4 ? 'border-emerald-600 bg-emerald-50/50' : 'border-emerald-300 bg-stone-50/70'}`}>
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <Home className="w-3 h-3 text-emerald-800" />
                  PROPUESTA 4 &bull; Activos Inmobiliarios
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-900">Activos: $10.4 MDP</span>
              </div>

              <h3 className="text-sm font-extrabold text-stone-900">
                Traspaso de Activos Inmobiliarios Generando Capital
              </h3>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Casa Tierra Pura ($7M) + Depto Zákia ($2.4M) + $1M Efectivo. Rentas activas de $53,000 MXN/mes.
              </p>

              <div className="mt-2.5 p-2 rounded-lg bg-white border border-emerald-200 grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1 bg-stone-50 rounded">
                  <span className="text-[8px] text-stone-500 uppercase tracking-wider block font-semibold">Tierra Pura</span>
                  <span className="text-[11px] font-bold text-stone-900 font-mono">$7,000,000</span>
                  <span className="text-[8px] text-emerald-700 block font-semibold">Renta: $40k/m</span>
                </div>
                <div className="p-1 bg-stone-50 rounded">
                  <span className="text-[8px] text-stone-500 uppercase tracking-wider block font-semibold">Zákia</span>
                  <span className="text-[11px] font-bold text-stone-900 font-mono">$2,400,000</span>
                  <span className="text-[8px] text-emerald-700 block font-semibold">Renta: $13k/m</span>
                </div>
                <div className="p-1 bg-emerald-50 rounded border border-emerald-200">
                  <span className="text-[8px] text-emerald-900 uppercase tracking-wider block font-semibold">Efectivo</span>
                  <span className="text-[11px] font-extrabold text-emerald-950 font-mono">$1,000,000</span>
                  <span className="text-[8px] text-emerald-800 block">Día 1 notarial</span>
                </div>
              </div>

              <div className="mt-2 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-stone-500 block">Renta Mensual Total:</span>
                  <span className="text-xs text-emerald-900 font-mono font-bold">$53,000 MXN/mes</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">Total Proyectado (5 Años):</span>
                  <span className="text-lg font-black text-emerald-950 font-mono">{formatCurrency(17093622)}</span>
                  <span className="text-[9px] text-stone-500 block font-sans">10,400 de arranque</span>
                </div>
              </div>

              <ul className="mt-1 space-y-1 text-[11px] text-stone-700">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Plusvalía Inmobiliaria:</strong> Inmuebles en Querétaro con apreciación continua (+6% anual moderado).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Flujo Pasivo:</strong> $53,000 MXN mensuales libres en cuenta bancaria sin operar la panadería.</span>
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
              <span className="text-[11px] text-stone-500 font-mono font-bold">Página 3 / 3</span>
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
                    Propuesta 3 &bull; Pagos 1 MDP Anuales + Intereses
                  </th>
                  <th className="py-2.5 px-2.5 text-center bg-emerald-50/60 text-emerald-950 border-l border-stone-200">
                    Propuesta 4 &bull; Activos Inmobiliarios
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {/* Row 0: Valuación del Negocio */}
                <tr className="bg-stone-50/70 font-semibold">
                  <td className="py-2 px-3 font-bold text-stone-900">
                    Valuación del Negocio
                    <span className="block text-[9px] text-stone-500 font-normal">Base común 4 alternativas</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-extrabold text-amber-950 bg-amber-50/40 border-l border-stone-200">
                    $9,360,000 MXN
                    <span className="text-[9px] text-amber-800 block font-normal">Oferta: $8.5M contado</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-teal-950 bg-teal-50/40 border-l border-stone-200">
                    $9,360,000 MXN
                    <span className="text-[9px] text-teal-800 block font-normal">Total: $11.3 MDP</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-blue-950 bg-blue-50/40 border-l border-stone-200">
                    $9,360,000 MXN
                    <span className="text-[9px] text-blue-800 block font-normal">Total: $10.89 MDP</span>
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-emerald-950 bg-emerald-50/40 border-l border-stone-200">
                    $9,360,000 MXN
                    <span className="text-[9px] text-emerald-800 block font-normal">Activos: $10.4 MDP</span>
                  </td>
                </tr>

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
                    $1,000,000 MXN
                    <span className="text-[9px] text-stone-500 block font-normal font-sans">+ 2 Casas ($9.4M)</span>
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
                    $47,233 &rarr; $3,900/mes*
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-bold text-emerald-950 bg-emerald-50/20 border-l border-stone-200">
                    $53,000 MXN / mes
                    <span className="text-[9px] text-emerald-800 block font-normal font-sans">Tierra Pura + Zákia</span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-stone-50/60">
                  <td className="py-2 px-3 font-bold text-stone-900">Abonos Extra / Apreciación</td>
                  <td className="py-2 px-2.5 text-center text-stone-500 bg-amber-50/20 border-l border-stone-200">
                    No aplica
                  </td>
                  <td className="py-2 px-2.5 text-center text-stone-500 bg-teal-50/20 border-l border-stone-200">
                    Incluidos en mensualidad
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono font-semibold text-blue-900 bg-blue-50/20 border-l border-stone-200">
                    4 de $1 MDP + $360k
                  </td>
                  <td className="py-2 px-2.5 text-center font-semibold text-emerald-900 bg-emerald-50/20 border-l border-stone-200">
                    Plusvalía Inmobiliaria
                    <span className="text-[9px] text-emerald-700 block font-normal">(+6.0% anual moderada)</span>
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
                    Patrimonial Permanente
                    <span className="text-[9px] text-stone-500 block font-normal">(5 años: ~$17.1 MDP)</span>
                  </td>
                </tr>

                {/* Row 5: Total */}
                <tr className="bg-stone-100/70 font-extrabold">
                  <td className="py-2 px-3 text-stone-950 uppercase text-[11px]">Monto Total Percibido / Activos</td>
                  <td className="py-2 px-2.5 text-center font-mono text-stone-950 bg-amber-100/50 border-l border-stone-200 text-sm">
                    {formatCurrency(8500000)}
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono text-teal-950 bg-teal-100/50 border-l border-stone-200 text-sm">
                    {formatCurrency(11300000)}
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono text-blue-950 bg-blue-100/50 border-l border-stone-200 text-sm">
                    {formatCurrency(10894000)}
                  </td>
                  <td className="py-2 px-2.5 text-center font-mono text-emerald-950 bg-emerald-100/50 border-l border-stone-200 text-sm">
                    <div className="font-extrabold text-emerald-950">{formatCurrency(17093622)}</div>
                    <span className="text-[9px] text-stone-600 block font-normal font-sans">10,400 de arranque</span>
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
                    Propietario 100% Inmuebles
                    <span className="text-[9px] text-emerald-800 block font-normal">Retiro total + Rentas pasivas</span>
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
                    Escrituras notariales públicas
                    <span className="text-[9px] text-emerald-800 block font-normal">+ Contratos arrendamiento</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[10px] text-stone-500 italic">
            * En la Propuesta 3, sobre el saldo de capital de $4,360,000 MXN, el interés mensual inicia en $47,233/mes y va disminuyendo año con año conforme se amortizan 4 pagos de $1,000,000 MXN y un último pago de $360,000 MXN a capital cada fin de año (completando con los $5 MDP iniciales la valuación de $9,360,000 MXN) y totalizando $10,894,000 MXN percibidos.<br />
            ** En la Propuesta 4, los $10.4 MDP corresponden a la Casa en Tierra Pura ($7M), Departamento en Zákia ($2.4M) y $1M en efectivo de inicio (10,400 de arranque). Ambas propiedades generan rentas activas por $53,000 MXN/mes con una proyección acumulada a 5 años de $17,093,622 MXN entre plusvalía y rentas.
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
                <strong className="text-blue-900 block">Opción 3 (Pagos 1 MDP Anuales + Intereses):</strong>
                Ideal para hacer crecer su capital al 13% con pagos mensuales y abonos a capital (4 de $1 MDP y $360k), totalizando $10.89 MDP.
              </div>
              <div className="p-2 rounded bg-white border border-stone-200">
                <strong className="text-emerald-900 block">Opción 4 (Inmobiliaria):</strong>
                Ideal si busca blindar su patrimonio en bienes raíces con escrituras a su nombre, recibir $1 MDP en efectivo y cobrar $53,000 mensuales en rentas acumulando ~$17.1 MDP en 5 años (10,400 de arranque).
              </div>
            </div>
          </div>

          {/* Pie de página institucional y confidencial */}
          <div className="mt-8 pt-4 border-t border-stone-200 text-center text-[10px] text-stone-400 avoid-break">
            Panadería Tradicional Santa Fé &bull; Sucursal Zákia &amp; Sucursal El Refugio &bull; Santiago de Querétaro, Qro. &bull; Documento elaborado con carácter fiduciario y confidencial.
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};

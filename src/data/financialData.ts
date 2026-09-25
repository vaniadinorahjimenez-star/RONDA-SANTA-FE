import { GastoRubro, VentaMensualZakia, VentaMensualRefugio, ResumenUtilidadMensual } from '../types';

export const GASTOS_ZAKIA: GastoRubro[] = [
  {
    no: 1,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'Nómina Operativa Semanal',
    gastoSemanal: 28000,
    gastoDiario: 4000.00,
    proyeccionMensual: 121600.00,
    porcentajeTotal: 29.5,
    descripcion: 'Personal de horneado, maestros panaderos, cajeros y atención en barra.',
    tipo: 'personal'
  },
  {
    no: 2,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'IMSS e INFONAVIT Patronal',
    gastoSemanal: 3600,
    gastoDiario: 514.29,
    proyeccionMensual: 15634.29,
    porcentajeTotal: 3.8,
    descripcion: 'Aportaciones de seguridad social y prestaciones conforme a la ley.',
    tipo: 'personal',
    tendencia: 'subio',
    gastoAnteriorSemanal: 1385
  },
  {
    no: 3,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Renta de Local Comercial',
    gastoSemanal: 8076,
    gastoDiario: 1153.71,
    proyeccionMensual: 35072.91,
    porcentajeTotal: 8.5,
    descripcion: 'Arrendamiento de local comercial premium ubicado en Plaza Comercial Zákia.',
    tipo: 'fijo'
  },
  {
    no: 4,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Gas LP para Hornos de Panadería',
    gastoSemanal: 1500,
    gastoDiario: 214.29,
    proyeccionMensual: 6514.29,
    porcentajeTotal: 1.6,
    descripcion: 'Combustible vital para operación de hornos continuos de alta eficiencia.',
    tipo: 'variable'
  },
  {
    no: 5,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Luz',
    gastoSemanal: 1500,
    gastoDiario: 214.29,
    proyeccionMensual: 6514.29,
    porcentajeTotal: 1.6,
    descripcion: 'Consumo eléctrico CFE para cámaras de fermentación, refrigeración e iluminación.',
    tipo: 'fijo',
    tendencia: 'subio',
    gastoAnteriorSemanal: 923
  },
  {
    no: 6,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Agua',
    gastoSemanal: 415,
    gastoDiario: 59.29,
    proyeccionMensual: 1802.29,
    porcentajeTotal: 0.4,
    descripcion: 'Servicio de agua potable y filtración para masa y aseo.',
    tipo: 'fijo'
  },
  {
    no: 7,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Mantenimiento plaza',
    gastoSemanal: 1234,
    gastoDiario: 176.29,
    proyeccionMensual: 5359.09,
    porcentajeTotal: 1.3,
    descripcion: 'Cuota de condominio de la plaza (vigilancia, áreas comunes y estacionamiento).',
    tipo: 'fijo'
  },
  {
    no: 8,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Arrendamiento camioneta',
    gastoSemanal: 3115,
    gastoDiario: 445.00,
    proyeccionMensual: 13528.00,
    porcentajeTotal: 3.3,
    descripcion: 'Leasing de unidad de transporte y logística para traslado de insumos.',
    tipo: 'fijo'
  },
  {
    no: 9,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Mantenimiento General y Maquinaria',
    gastoSemanal: 1384,
    gastoDiario: 197.71,
    proyeccionMensual: 6010.51,
    porcentajeTotal: 1.5,
    descripcion: 'Mantenimiento preventivo a amasadoras, batidoras, divisoras y hornos.',
    tipo: 'variable'
  },
  {
    no: 10,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Fumigación y Control de Plagas',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 2.1,
    descripcion: 'Certificaciones sanitarias y control grado alimenticio quincenal.',
    tipo: 'fijo'
  },
  {
    no: 11,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Papelería, Empaques y Telefonía/Internet',
    gastoSemanal: 130,
    gastoDiario: 18.57,
    proyeccionMensual: 564.57,
    porcentajeTotal: 0.1,
    descripcion: 'Bolsas ecológicas, cajas, tickets e internet para terminales punto de venta.',
    tipo: 'variable'
  },
  {
    no: 12,
    categoria: 'Operación y Mantenimiento',
    concepto: 'otros (materiales limpieza, compras externas)',
    gastoSemanal: 500,
    gastoDiario: 71.43,
    proyeccionMensual: 2171.43,
    porcentajeTotal: 0.5,
    descripcion: 'Químicos sanitizantes, cofias, delantales y compras menores imprevistas.',
    tipo: 'variable',
    tendencia: 'bajo',
    gastoAnteriorSemanal: 3000
  },
  {
    no: 13,
    categoria: 'Administración y Fiscal',
    concepto: 'Impuestos y Cargas Fiscales Estimadas',
    gastoSemanal: 175,
    gastoDiario: 25.00,
    proyeccionMensual: 760.00,
    porcentajeTotal: 0.2,
    descripcion: 'Provisión para pagos provisionales de ISR y retenciones fiscales.',
    tipo: 'fijo',
    tendencia: 'bajo',
    gastoAnteriorSemanal: 2307
  },
  {
    no: 14,
    categoria: 'Administración y Fiscal',
    concepto: 'Contabilidad',
    gastoSemanal: 1000,
    gastoDiario: 142.86,
    proyeccionMensual: 4342.86,
    porcentajeTotal: 1.1,
    descripcion: 'Honorarios de despacho contable externo, conciliaciones y nómina.',
    tipo: 'fijo'
  },
  {
    no: 15,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Dialpa',
    gastoSemanal: 25000,
    gastoDiario: 3571.43,
    proyeccionMensual: 108571.43,
    porcentajeTotal: 26.4,
    descripcion: 'Proveedor principal de harinas de fuerza, levaduras y mejoradores.',
    tipo: 'materia_prima'
  },
  {
    no: 16,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Cremeria americana',
    gastoSemanal: 3000,
    gastoDiario: 428.57,
    proyeccionMensual: 13028.57,
    porcentajeTotal: 3.2,
    descripcion: 'Insumos lácteos complementarios.',
    tipo: 'materia_prima',
    tendencia: 'subio',
    gastoAnteriorSemanal: 3
  },
  {
    no: 17,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Materia Prima el Trigal',
    gastoSemanal: 3500,
    gastoDiario: 500.00,
    proyeccionMensual: 15200.00,
    porcentajeTotal: 3.7,
    descripcion: 'Chocolates para repostería, mermeladas, coberturas y semillas.',
    tipo: 'materia_prima'
  },
  {
    no: 18,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Huevo',
    gastoSemanal: 2800,
    gastoDiario: 400.00,
    proyeccionMensual: 12160.00,
    porcentajeTotal: 3.0,
    descripcion: 'Huevo fresco de granja grado A para masas finas y pan dulce.',
    tipo: 'materia_prima',
    tendencia: 'bajo',
    gastoAnteriorSemanal: 3000
  },
  {
    no: 19,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Mantequilla',
    gastoSemanal: 1600,
    gastoDiario: 228.57,
    proyeccionMensual: 6948.57,
    porcentajeTotal: 1.7,
    descripcion: 'Mantequilla 100% de vaca para hojaldres, croissants y brioche artesanal.',
    tipo: 'materia_prima',
    tendencia: 'bajo',
    gastoAnteriorSemanal: 2000
  },
  {
    no: 20,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Queso crema',
    gastoSemanal: 0,
    gastoDiario: 0.00,
    proyeccionMensual: 0.00,
    porcentajeTotal: 0.0,
    descripcion: 'Rellenos de pays, danesas y repostería salada/dulce.',
    tipo: 'materia_prima',
    tendencia: 'bajo',
    gastoAnteriorSemanal: 545
  },
  {
    no: 21,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Coca cola y Alpura',
    gastoSemanal: 1800,
    gastoDiario: 257.14,
    proyeccionMensual: 7817.14,
    porcentajeTotal: 1.9,
    descripcion: 'Bebidas embotelladas y leche fresca para venta directa en mostrador.',
    tipo: 'materia_prima',
    tendencia: 'subio',
    gastoAnteriorSemanal: 800
  },
  {
    no: 22,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Quesos',
    gastoSemanal: 2500,
    gastoDiario: 357.14,
    proyeccionMensual: 10857.14,
    porcentajeTotal: 2.6,
    descripcion: 'Quesos manchego y oaxaca para panadería rellena y empanadas.',
    tipo: 'materia_prima',
    tendencia: 'subio',
    gastoAnteriorSemanal: 850
  },
  {
    no: 23,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Nata',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 2.1,
    descripcion: 'Nata fresca tradicional para conchas rellenas y especialidades de la casa.',
    tipo: 'materia_prima',
    tendencia: 'subio',
    gastoAnteriorSemanal: 1800
  }
];

export const GASTOS_REFUGIO: GastoRubro[] = [
  {
    no: 1,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'Nómina Operativa Semanal',
    gastoSemanal: 50000,
    gastoDiario: 7142.86,
    proyeccionMensual: 217142.86,
    porcentajeTotal: 35.1,
    descripcion: 'Nómina completa de producción intensiva, maestros panaderos, reparto y cajas.',
    tipo: 'personal'
  },
  {
    no: 2,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'IMSS e INFONAVIT Patronal',
    gastoSemanal: 2538,
    gastoDiario: 362.57,
    proyeccionMensual: 11022.17,
    porcentajeTotal: 1.8,
    descripcion: 'Cargas sociales y aportaciones patronales de ley.',
    tipo: 'personal'
  },
  {
    no: 3,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Renta de Local Comercial',
    gastoSemanal: 8800,
    gastoDiario: 1257.14,
    proyeccionMensual: 38217.14,
    porcentajeTotal: 6.2,
    descripcion: 'Arrendamiento de local matriz con alta afluencia peatonal en El Refugio.',
    tipo: 'fijo'
  },
  {
    no: 4,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Gas LP para Hornos de Panadería',
    gastoSemanal: 5000,
    gastoDiario: 714.29,
    proyeccionMensual: 21714.29,
    porcentajeTotal: 3.5,
    descripcion: 'Gas LP industrial para hornos de alta capacidad que alimentan producción propia y reparto.',
    tipo: 'variable'
  },
  {
    no: 5,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Luz',
    gastoSemanal: 1700,
    gastoDiario: 242.86,
    proyeccionMensual: 7382.86,
    porcentajeTotal: 1.2,
    descripcion: 'Suministro trifásico para cámaras de refrigeración y maquinaria pesada.',
    tipo: 'fijo'
  },
  {
    no: 6,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Agua',
    gastoSemanal: 0,
    gastoDiario: 0.00,
    proyeccionMensual: 0.00,
    porcentajeTotal: 0.0,
    descripcion: 'Servicio incluido en el condominio/plaza comercial.',
    tipo: 'fijo'
  },
  {
    no: 7,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Mantenimiento plaza',
    gastoSemanal: 0,
    gastoDiario: 0.00,
    proyeccionMensual: 0.00,
    porcentajeTotal: 0.0,
    descripcion: 'Mantenimiento de plaza comercial bonificado / exento.',
    tipo: 'fijo'
  },
  {
    no: 8,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Gasolinas para Rutas de Reparto',
    gastoSemanal: 3187,
    gastoDiario: 455.29,
    proyeccionMensual: 13840.69,
    porcentajeTotal: 2.2,
    descripcion: 'Combustible optimizado para rutas de entrega a clientes y cafeterías.',
    tipo: 'variable'
  },
  {
    no: 9,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Mantenimiento General y Maquinaria',
    gastoSemanal: 2300,
    gastoDiario: 328.57,
    proyeccionMensual: 9988.57,
    porcentajeTotal: 1.6,
    descripcion: 'Servicio preventivo a vehículos utilitarios, hornos y equipos industriales.',
    tipo: 'variable',
    tendencia: 'subio',
    gastoAnteriorSemanal: 2000
  },
  {
    no: 10,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Fumigación y Control de Plagas',
    gastoSemanal: 175,
    gastoDiario: 25.00,
    proyeccionMensual: 760.00,
    porcentajeTotal: 0.1,
    descripcion: 'Control sanitario estricto con certificación COFEPRIS.',
    tipo: 'fijo'
  },
  {
    no: 11,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Papelería, Empaques y Telefonía/Internet',
    gastoSemanal: 0,
    gastoDiario: 0.00,
    proyeccionMensual: 0.00,
    porcentajeTotal: 0.0,
    descripcion: 'Empaque para producto final, charolas desechables y enlace digital.',
    tipo: 'variable'
  },
  {
    no: 12,
    categoria: 'Operación y Mantenimiento',
    concepto: 'otros (materiales limpieza, compras externas)',
    gastoSemanal: 500,
    gastoDiario: 71.43,
    proyeccionMensual: 2171.43,
    porcentajeTotal: 0.4,
    descripcion: 'Insumos de limpieza profunda, cofias, uniformes e insumos auxiliares.',
    tipo: 'variable',
    tendencia: 'bajo',
    gastoAnteriorSemanal: 4000
  },
  {
    no: 13,
    categoria: 'Administración y Fiscal',
    concepto: 'Impuestos y Cargas Fiscales Estimadas',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 1.4,
    descripcion: 'Obligaciones tributarias mensuales estimadas.',
    tipo: 'fijo'
  },
  {
    no: 14,
    categoria: 'Administración y Fiscal',
    concepto: 'Contabilidad',
    gastoSemanal: 1900,
    gastoDiario: 271.43,
    proyeccionMensual: 8251.43,
    porcentajeTotal: 1.3,
    descripcion: 'Servicios de auditoría, timbrado fiscal y asesoría financiera.',
    tipo: 'fijo'
  },
  {
    no: 15,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Dialpa',
    gastoSemanal: 38000,
    gastoDiario: 5428.57,
    proyeccionMensual: 165028.57,
    porcentajeTotal: 26.7,
    descripcion: 'Harinas de alta graduación, polvos y mezclas base de la matriz.',
    tipo: 'materia_prima'
  },
  {
    no: 16,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Cremeria americana',
    gastoSemanal: 6000,
    gastoDiario: 857.14,
    proyeccionMensual: 26057.14,
    porcentajeTotal: 4.2,
    descripcion: 'Cremas para batir, bases pasteleras y rellenos lácteos.',
    tipo: 'materia_prima'
  },
  {
    no: 17,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Materia Prima el Trigal',
    gastoSemanal: 3500,
    gastoDiario: 500.00,
    proyeccionMensual: 15200.00,
    porcentajeTotal: 2.5,
    descripcion: 'Frutas en almíbar, azúcares especiales y coberturas de repostería.',
    tipo: 'materia_prima'
  },
  {
    no: 18,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Huevo',
    gastoSemanal: 4000,
    gastoDiario: 571.43,
    proyeccionMensual: 17371.43,
    porcentajeTotal: 2.8,
    descripcion: 'Consumo diario de huevo fresco para volumen de pan dulce y salado.',
    tipo: 'materia_prima'
  },
  {
    no: 19,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Mantequilla',
    gastoSemanal: 4200,
    gastoDiario: 600.00,
    proyeccionMensual: 18240.00,
    porcentajeTotal: 3.0,
    descripcion: 'Mantequilla pura de exportación para hojaldre y línea europea.',
    tipo: 'materia_prima'
  },
  {
    no: 20,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Queso crema',
    gastoSemanal: 0,
    gastoDiario: 0.00,
    proyeccionMensual: 0.00,
    porcentajeTotal: 0.0,
    descripcion: 'Rellenos para panques, pays y panes artesanales.',
    tipo: 'materia_prima',
    tendencia: 'bajo',
    gastoAnteriorSemanal: 545
  },
  {
    no: 21,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Coca cola y Alpura',
    gastoSemanal: 3000,
    gastoDiario: 428.57,
    proyeccionMensual: 13028.57,
    porcentajeTotal: 2.1,
    descripcion: 'Bebidas comerciales complementarias de mostrador.',
    tipo: 'materia_prima'
  },
  {
    no: 22,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Quesos',
    gastoSemanal: 3500,
    gastoDiario: 500.00,
    proyeccionMensual: 15200.00,
    porcentajeTotal: 2.5,
    descripcion: 'Quesos finos para línea gourmet y baguettes.',
    tipo: 'materia_prima'
  },
  {
    no: 23,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Nata',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 1.4,
    descripcion: 'Nata pura pasteurizada para panes de feria y conchas tradicionales.',
    tipo: 'materia_prima'
  }
];

export const VENTAS_ZAKIA: VentaMensualZakia[] = [
  { no: 1, mes: 'Enero', puntoDeVentaTDC: 352037, ventasMostradorEfectivo: 256640, ventaTotalMensual: 608677, porcentajeTDC: 57.8, porcentajeEfectivo: 42.2 },
  { no: 2, mes: 'Febrero', puntoDeVentaTDC: 258000, ventasMostradorEfectivo: 208984, ventaTotalMensual: 466984, porcentajeTDC: 55.2, porcentajeEfectivo: 44.8 },
  { no: 3, mes: 'Marzo', puntoDeVentaTDC: 262000, ventasMostradorEfectivo: 205819, ventaTotalMensual: 467819, porcentajeTDC: 56.0, porcentajeEfectivo: 44.0 },
  { no: 4, mes: 'Abril', puntoDeVentaTDC: 259500, ventasMostradorEfectivo: 187380, ventaTotalMensual: 446880, porcentajeTDC: 58.1, porcentajeEfectivo: 41.9 },
  { no: 5, mes: 'Mayo', puntoDeVentaTDC: 260639, ventasMostradorEfectivo: 170410, ventaTotalMensual: 431049, porcentajeTDC: 60.5, porcentajeEfectivo: 39.5 },
  { no: 6, mes: 'Junio', puntoDeVentaTDC: 281000, ventasMostradorEfectivo: 175360, ventaTotalMensual: 456360, porcentajeTDC: 61.6, porcentajeEfectivo: 38.4 },
  { no: 7, mes: 'Julio', puntoDeVentaTDC: 284000, ventasMostradorEfectivo: 179054, ventaTotalMensual: 463054, porcentajeTDC: 61.3, porcentajeEfectivo: 38.7 },
  { no: 8, mes: 'Agosto', puntoDeVentaTDC: 283132, ventasMostradorEfectivo: 171855, ventaTotalMensual: 454987, porcentajeTDC: 62.2, porcentajeEfectivo: 37.8 },
  { no: 9, mes: 'Septiembre', puntoDeVentaTDC: 282000, ventasMostradorEfectivo: 176676, ventaTotalMensual: 458676, porcentajeTDC: 61.5, porcentajeEfectivo: 38.5 },
  { no: 10, mes: 'Octubre', puntoDeVentaTDC: 315000, ventasMostradorEfectivo: 212000, ventaTotalMensual: 527000, porcentajeTDC: 59.8, porcentajeEfectivo: 40.2 },
  { no: 11, mes: 'Noviembre', puntoDeVentaTDC: 320000, ventasMostradorEfectivo: 215000, ventaTotalMensual: 535000, porcentajeTDC: 59.8, porcentajeEfectivo: 40.2 },
  { no: 12, mes: 'Diciembre', puntoDeVentaTDC: 354000, ventasMostradorEfectivo: 258000, ventaTotalMensual: 612000, porcentajeTDC: 57.8, porcentajeEfectivo: 42.2 },
];

export const RESUMEN_UTILIDAD_ZAKIA: ResumenUtilidadMensual[] = [
  { mes: 'Enero', ventaTotal: 608677, gastosOperativos: 411829, utilidadNeta: 196848, margen: 32.3 },
  { mes: 'Febrero', ventaTotal: 466984, gastosOperativos: 411829, utilidadNeta: 55155, margen: 11.8 },
  { mes: 'Marzo', ventaTotal: 467819, gastosOperativos: 411829, utilidadNeta: 55990, margen: 12.0 },
  { mes: 'Abril', ventaTotal: 446880, gastosOperativos: 411829, utilidadNeta: 35051, margen: 7.8 },
  { mes: 'Mayo', ventaTotal: 431049, gastosOperativos: 411829, utilidadNeta: 19220, margen: 4.5 },
  { mes: 'Junio', ventaTotal: 456360, gastosOperativos: 411829, utilidadNeta: 44531, margen: 9.8 },
  { mes: 'Julio', ventaTotal: 463054, gastosOperativos: 411829, utilidadNeta: 51225, margen: 11.1 },
  { mes: 'Agosto', ventaTotal: 454987, gastosOperativos: 411829, utilidadNeta: 43158, margen: 9.5 },
  { mes: 'Septiembre', ventaTotal: 458676, gastosOperativos: 411829, utilidadNeta: 46847, margen: 10.2 },
  { mes: 'Octubre', ventaTotal: 527000, gastosOperativos: 411829, utilidadNeta: 115171, margen: 21.9 },
  { mes: 'Noviembre', ventaTotal: 535000, gastosOperativos: 411829, utilidadNeta: 123171, margen: 23.0 },
  { mes: 'Diciembre', ventaTotal: 612000, gastosOperativos: 411829, utilidadNeta: 200171, margen: 32.7 },
];

export const VENTAS_REFUGIO: VentaMensualRefugio[] = [
  { no: 1, mes: 'Enero', cobroTarjetaTDC: 418000, efectivoCalculado: 309075, ventaTotalMostrador: 727075, reparto: 189000, transferenciasCautivos: 44000, ventaTotalMensual: 960075 },
  { no: 2, mes: 'Febrero', cobroTarjetaTDC: 291000, efectivoCalculado: 232595, ventaTotalMostrador: 523595, reparto: 189000, transferenciasCautivos: 44000, ventaTotalMensual: 756595 },
  { no: 3, mes: 'Marzo', cobroTarjetaTDC: 317000, efectivoCalculado: 261208, ventaTotalMostrador: 578208, reparto: 209000, transferenciasCautivos: 49000, ventaTotalMensual: 836208 },
  { no: 4, mes: 'Abril', cobroTarjetaTDC: 284000, efectivoCalculado: 219855, ventaTotalMostrador: 503855, reparto: 189000, transferenciasCautivos: 44000, ventaTotalMensual: 736855 },
  { no: 5, mes: 'Mayo', cobroTarjetaTDC: 274000, efectivoCalculado: 245890, ventaTotalMostrador: 519890, reparto: 184000, transferenciasCautivos: 43000, ventaTotalMensual: 746890 },
  { no: 6, mes: 'Junio', cobroTarjetaTDC: 311000, efectivoCalculado: 257497, ventaTotalMostrador: 568497, reparto: 204000, transferenciasCautivos: 47000, ventaTotalMensual: 819497 },
  { no: 7, mes: 'Julio', cobroTarjetaTDC: 316000, efectivoCalculado: 248387, ventaTotalMostrador: 564387, reparto: 209000, transferenciasCautivos: 49000, ventaTotalMensual: 822387 },
  { no: 8, mes: 'Agosto', cobroTarjetaTDC: 330000, efectivoCalculado: 271921, ventaTotalMostrador: 601921, reparto: 215000, transferenciasCautivos: 50000, ventaTotalMensual: 866921 },
  { no: 9, mes: 'Septiembre', cobroTarjetaTDC: 323634, efectivoCalculado: 271921, ventaTotalMostrador: 595555, reparto: 215000, transferenciasCautivos: 50000, ventaTotalMensual: 860555 },
  { no: 10, mes: 'Octubre', cobroTarjetaTDC: 330000, efectivoCalculado: 271921, ventaTotalMostrador: 601921, reparto: 215000, transferenciasCautivos: 50000, ventaTotalMensual: 866921 },
  { no: 11, mes: 'Noviembre', cobroTarjetaTDC: 330000, efectivoCalculado: 271921, ventaTotalMostrador: 601921, reparto: 215000, transferenciasCautivos: 50000, ventaTotalMensual: 866921 },
  { no: 12, mes: 'Diciembre', cobroTarjetaTDC: 418000, efectivoCalculado: 309075, ventaTotalMostrador: 727075, reparto: 189000, transferenciasCautivos: 44000, ventaTotalMensual: 960075 },
];

export const RESUMEN_UTILIDAD_REFUGIO: ResumenUtilidadMensual[] = [
  { mes: 'Enero', ventaTotal: 960075, gastosOperativos: 617989, utilidadNeta: 342086, margen: 35.6 },
  { mes: 'Febrero', ventaTotal: 756595, gastosOperativos: 617989, utilidadNeta: 138606, margen: 18.3 },
  { mes: 'Marzo', ventaTotal: 836208, gastosOperativos: 617989, utilidadNeta: 218219, margen: 26.1 },
  { mes: 'Abril', ventaTotal: 736855, gastosOperativos: 617989, utilidadNeta: 118866, margen: 16.1 },
  { mes: 'Mayo', ventaTotal: 746890, gastosOperativos: 617989, utilidadNeta: 128901, margen: 17.3 },
  { mes: 'Junio', ventaTotal: 819497, gastosOperativos: 617989, utilidadNeta: 201508, margen: 24.6 },
  { mes: 'Julio', ventaTotal: 822387, gastosOperativos: 617989, utilidadNeta: 204398, margen: 24.9 },
  { mes: 'Agosto', ventaTotal: 866921, gastosOperativos: 617989, utilidadNeta: 248932, margen: 28.7 },
  { mes: 'Septiembre', ventaTotal: 860555, gastosOperativos: 617989, utilidadNeta: 242566, margen: 28.2 },
  { mes: 'Octubre', ventaTotal: 866921, gastosOperativos: 617989, utilidadNeta: 248932, margen: 28.7 },
  { mes: 'Noviembre', ventaTotal: 866921, gastosOperativos: 617989, utilidadNeta: 248932, margen: 28.7 },
  { mes: 'Diciembre', ventaTotal: 960075, gastosOperativos: 617989, utilidadNeta: 342086, margen: 35.6 },
];

// Totales consolidados
export const TOTALES_CONSOLIDADOS = {
  // Datos Anuales Auditados 12M Zákia (Actualizados con tabla de gastos y ventas Excel)
  ventasAnualesZakia12M: 5928486,
  gastosAnualesZakia12M: 4941946,
  utilidadAnualZakia12M: 986540,

  // Datos Anuales Auditados 12M El Refugio (100% Reales y Validados con nuevo Excel)
  ventasAnualesRefugio12M: 10099900,
  gastosAnualesRefugio12M: 7415868,
  utilidadAnualRefugio12M: 2684032,

  // Totales Anuales Cadena Consolidada (Zákia 12M + El Refugio 12M)
  ventasAnualesCadenaTotal: 16028386,
  gastosAnualesCadenaTotal: 12357814,
  utilidadAnualCadenaTotal: 3670572,

  // Promedios Mensuales Reales
  promedioMensualVentasZakia: 494040,
  promedioMensualVentasRefugio: 841658,
  promedioMensualVentasTotal: 1335698,

  gastosMensualesZakia: 411829, // $411,828.80
  gastosMensualesRefugio: 617989, // $617,988.57
  gastosMensualesTotal: 1029818,

  gastosSemanalesZakia: 94829,
  gastosSemanalesRefugio: 142300,
  gastosSemanalesTotal: 237129,

  utilidadMensualZakia: 82212,
  utilidadMensualRefugio: 223669, // $841,658 - $617,989
  utilidadMensualTotal: 305881, // $82,212 + $223,669

  margenPonderadoTotal: 22.90, // 3,670,572 / 16,028,386
  proyeccionAnualizadaVentas: 16028386,
  proyeccionAnualizadaGastos: 12357814,
  proyeccionAnualizadaUtilidad: 3670572,
};

// Benchmark Inmobiliario provisto por el usuario:
// Casa de $2.2 MDP renta en $11,500 MXN mensuales
export const BENCHMARK_INMUEBLE = {
  valorCasa: 2200000,
  rentaMensual: 11500,
  tasaRendimientoBrutaAnual: (11500 * 12) / 2200000, // 0.062727 => 6.27%
  gastosMantenimientoPredialVacanciaPct: 0.15, // ~15% de descuento por predial, seguros, desgaste y vacancia
  tasaRendimientoNetaAnual: ((11500 * 12) * 0.85) / 2200000, // ~5.33%
};

// Benchmark Bancario tradicional (Pagaré Bancario / Cetes):
export const BENCHMARK_BANCO = {
  nombre: 'Pagaré Bancario / Cetes 28 días',
  tasaBrutaAnual: 0.095, // 9.5%
  retencionISR: 0.005, // Retención de ISR promedio
  tasaNetaAnual: 0.090, // 9.0%
};

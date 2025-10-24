import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Operation, SettingsData } from '../types';

export const generateLiquidationPDF = (operation: Operation, settings: SettingsData, type: 'productor' | 'comprador') => {
    try {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        let y = 15;

        // Helper function to format currency
        const formatCurrency = (amount: number, currency: 'ARS' | 'USD' = 'ARS') =>
            new Intl.NumberFormat(currency === 'ARS' ? 'es-AR' : 'en-US', { style: 'currency', currency }).format(amount);
        
        // Header
        if (settings.logo) {
            try {
                const img = new Image();
                img.src = settings.logo;
                const imgType = settings.logo.split(';')[0].split('/')[1].toUpperCase();
                doc.addImage(img, imgType, 15, y, 30, 15);
            } catch(e) {
                console.error("Error adding logo to PDF:", e);
            }
        }
        doc.setFontSize(18);
        doc.text(settings.companyName, doc.internal.pageSize.width - 15, y + 5, { align: 'right' });
        y += 8;
        doc.setFontSize(10);
        doc.text(settings.address, doc.internal.pageSize.width - 15, y + 5, { align: 'right' });
        doc.text(`CUIT: ${settings.cuit}`, doc.internal.pageSize.width - 15, y + 10, { align: 'right' });
        doc.text(`Tel: ${settings.phone}`, doc.internal.pageSize.width - 15, y + 15, { align: 'right' });
        y += 20;

        // Título del Documento
        doc.setFontSize(16);
        doc.text(`LIQUIDACIÓN DE OPERACIÓN - ${type === 'productor' ? 'PRODUCTOR' : 'COMPRADOR'}`, doc.internal.pageSize.width / 2, y, { align: 'center' });
        y += 8;

        // Datos de la Operación
        doc.setFontSize(11);
        autoTable(doc, {
            startY: y,
            head: [['Campo', 'Valor']],
            body: [
                ['N° de Operación', operation.id.substring(0, 8).toUpperCase()],
                ['Fecha', new Date(operation.fecha).toLocaleDateString('es-AR')],
                ['Cereal', operation.cereal],
                ['Productor', operation.productor],
                ['Comprador', operation.comprador],
                ['Transportista', operation.transportista],
                ['Estado', operation.estado],
                ['Total Neto (TN)', operation.neto_ton.toFixed(3)],
            ],
            theme: 'striped',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' }
        });
        y = (doc as any).lastAutoTable.finalY + 10;

        // Detalles de Camiones
        doc.setFontSize(14);
        doc.text('Detalle de Camiones', 15, y);
        y += 5;
        const truckData = operation.camiones.map(t => [
            t.patente,
            t.carta_porte,
            `${t.bruto_kg} kg`,
            `${t.tara_kg} kg`,
            `${t.neto_kg} kg`,
        ]);
        autoTable(doc, {
            startY: y,
            head: [['Patente', 'C. Porte', 'Bruto', 'Tara', 'Neto']],
            body: truckData,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [150, 150, 255] }
        });
        y = (doc as any).lastAutoTable.finalY + 10;
        
        // Resumen Financiero
        doc.setFontSize(14);
        doc.text('Resumen Financiero', 15, y);
        y += 5;

        let financialTableBody: string[][] = [];

        if (type === 'productor') {
            financialTableBody = [
                ['Precio por Tonelada (ARS)', formatCurrency(operation.precio_productor_ars)],
                ['Total a Pagar (ARS)', formatCurrency(operation.total_productor_ars)],
            ];
        } else { // comprador
            financialTableBody = [
                ['Precio por Tonelada (ARS)', formatCurrency(operation.precio_comprador_ars)],
                ['Comisión Interna (ARS)', formatCurrency(operation.comision_interna_ars)],
                ['Total a Cobrar (ARS)', formatCurrency(operation.total_comprador_ars)],
            ];
        }

        autoTable(doc, {
            startY: y,
            head: [['Concepto', 'Monto']],
            body: financialTableBody,
            theme: 'plain',
            styles: { fontSize: 11 },
            headStyles: { fontStyle: 'bold', fillColor: [240, 240, 240] },
            columnStyles: { 1: { halign: 'right' } },
        });
        y = (doc as any).lastAutoTable.finalY + 10;

        // Total en USD (si aplica)
        if (operation.moneda === 'USD' && operation.tipo_de_cambio > 0) {
            const total_usd = type === 'productor' ? operation.total_productor_usd : operation.total_comprador_usd;
             autoTable(doc, {
                startY: y,
                body: [
                    [{ content: `Equivalente en USD (Ref.):`, styles: { fontStyle: 'bold' }}, { content: `${formatCurrency(total_usd, 'USD')}`, styles: { fontStyle: 'bold' }}],
                    [{ content: `Tipo de Cambio Aplicado:`, styles: { fontSize: 9 }}, { content: `${operation.tipo_de_cambio.toFixed(2)} ARS/USD`, styles: { fontSize: 9 }}]
                ],
                theme: 'plain',
                styles: { fontSize: 11 },
                columnStyles: { 1: { halign: 'right' } },
            });
            y = (doc as any).lastAutoTable.finalY + 10;
        }

        // Footer
        const finalY = pageHeight - 15;
        doc.setLineWidth(0.5);
        doc.line(15, finalY - 5, doc.internal.pageSize.width - 15, finalY - 5);
        doc.setFontSize(8);
        doc.text('Documento generado automáticamente por Cereales Rivadavia', 15, finalY);
        doc.text(`Página 1 de 1`, doc.internal.pageSize.width - 15, finalY, { align: 'right' });


        // Save the PDF
        const fileName = `Liquidacion-${type}-${operation.id.substring(0, 8)}-${new Date().getFullYear()}.pdf`;
        doc.save(fileName);
        
    } catch (error) {
        console.error("Error generating PDF in service:", error);
        throw new Error("PDF Generation Failed");
    }
};
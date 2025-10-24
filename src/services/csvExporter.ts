import type { Operation } from '../types';

export const exportToCSV = (operations: Operation[], fileName: string = 'operaciones.csv') => {
    if (operations.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const headers = [
        'ID',
        'Fecha',
        'Productor',
        'Comprador',
        'Transportista',
        'Cereal',
        'Neto (TN)',
        'Moneda',
        'Tipo de Cambio',
        'Precio Productor (ARS)',
        'Precio Comprador (ARS)',
        'Total Productor (ARS)',
        'Total Comprador (ARS)',
        'Comisión Interna (ARS)',
        'Estado',
    ];

    const csvContent = [
        headers.join(','),
        ...operations.map(op => [
            op.id,
            new Date(op.fecha).toLocaleDateString('es-AR'),
            `"${op.productor.replace(/"/g, '""')}"`,
            `"${op.comprador.replace(/"/g, '""')}"`,
            `"${op.transportista.replace(/"/g, '""')}"`,
            op.cereal,
            op.neto_ton.toFixed(3),
            op.moneda,
            op.tipo_de_cambio || '',
            op.precio_productor_ars.toFixed(2),
            op.precio_comprador_ars.toFixed(2),
            op.total_productor_ars.toFixed(2),
            op.total_comprador_ars.toFixed(2),
            op.comision_interna_ars.toFixed(2),
            op.estado
        ].join(','))
    ].join('\n');

    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

import React, { useRef, useLayoutEffect } from 'react';
import type { Operation, SettingsData } from '../types';

// Ayuda para formatear la moneda
const formatCurrency = (amount: number, currency: 'ARS' | 'USD') => 
    new Intl.NumberFormat('es-AR', { 
        style: 'currency', 
        currency: currency, 
        minimumFractionDigits: 2 
    }).format(amount);

// Interfaz para la vista
interface LiquidationPDFViewProps {
    operation: Operation;
    settings: SettingsData;
    isComprador: boolean; // TRUE para Comprador, FALSE para Productor
    // Prop para generar la vista de impresión
    onReady: (htmlContent: string) => void;
}

// Componente para generar el contenido HTML/PDF
export const LiquidationPDFView: React.FC<LiquidationPDFViewProps> = ({ operation, settings, isComprador, onReady }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    const title = isComprador ? 'LIQUIDACIÓN AL COMPRADOR' : 'LIQUIDACIÓN AL PRODUCTOR';
    const totalArs = isComprador ? operation.total_comprador_ars : operation.total_productor_ars;
    const totalUsd = isComprador ? operation.total_comprador_usd : operation.total_productor_usd;
    const precio = isComprador ? operation.precio_comprador_ars : operation.precio_productor_ars;
    const destinatario = isComprador ? operation.comprador : operation.productor;
    
    // Contenido específico de la tabla de detalles para cada tipo de liquidación
    const detailItems = [
        { label: 'Productor', value: operation.productor },
        { label: 'Comprador', value: operation.comprador },
        { label: 'Cereal', value: operation.cereal },
        { label: 'Total Neto (TN)', value: operation.neto_ton.toFixed(4) },
        { label: 'Precio (ARS/TN)', value: formatCurrency(precio, 'ARS') },
        ...(isComprador ? [
            { label: 'Comisión Interna (ARS)', value: formatCurrency(operation.comision_interna_ars, 'ARS') }
        ] : [])
    ];

    useLayoutEffect(() => {
        // Ejecutar después de que el DOM se haya renderizado
        if (contentRef.current) {
            // Clonamos el contenido y lo envolvemos en un documento HTML completo
            const rawContent = contentRef.current.innerHTML;
            const htmlDocument = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${title} - Op. ${operation.id}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; font-size: 10pt; }
                        .container { max-width: 800px; margin: auto; }
                        h1 { text-align: center; color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 20px; }
                        .header-info, .summary-table, .truck-table { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
                        .header-info td { padding: 8px; border: 1px solid #ddd; }
                        .summary-table th, .summary-table td { border: 1px solid #ddd; padding: 10px; text-align: right; }
                        .truck-table th, .truck-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                        .summary-total { background-color: #e0f2f1; font-weight: bold; }
                        .section-title { margin-top: 20px; margin-bottom: 10px; font-size: 12pt; font-weight: bold; border-bottom: 1px solid #aaa; padding-bottom: 5px; }
                        .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; display: flex; justify-content: space-around; font-size: 9pt; }
                        .signature { width: 45%; text-align: center; }
                        .signature-line { border-bottom: 1px solid #000; height: 30px; margin-bottom: 5px; }
                        .logo { height: 40px; margin-right: 15px; vertical-align: middle; }
                        .text-left { text-align: left; }
                        .text-right { text-align: right; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        ${rawContent}
                    </div>
                </body>
                </html>
            `;
            onReady(htmlDocument);
        }
    }, [operation, settings, isComprador, onReady, title, totalArs, totalUsd, precio, destinatario, detailItems]);

    // Renderiza el contenido visible para la función onReady
    return (
        <div ref={contentRef} style={{ display: 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {settings.logo_url && (
                    <img 
                        src={settings.logo_url} 
                        alt="Logo" 
                        className="logo"
                        style={{ height: '40px', marginRight: '15px' }}
                        onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.style.display = 'none'; // Ocultar si falla
                        }}
                    />
                )}
                <h1 style={{ textAlign: 'center' }}>{title}</h1>
            </div>

            <table className="header-info">
                <tbody>
                    <tr><td style={{ width: '30%' }}>**Empresa Emisora**</td><td>{settings.company_name || 'Agro Trading S.A.'}</td></tr>
                    <tr><td>**Destinatario**</td><td>**{destinatario}**</td></tr>
                    <tr><td>**Fecha de Liquidación**</td><td>{new Date().toLocaleDateString('es-AR')}</td></tr>
                    <tr><td>**Operación N°**</td><td>{operation.id}</td></tr>
                    <tr><td>**Cereal**</td><td>{operation.cereal}</td></tr>
                </tbody>
            </table>

            <h2 className="section-title">DETALLE DE PRECIOS Y TONELADAS</h2>
            <table className="summary-table">
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th className="text-left">Concepto</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {detailItems.map((item, index) => (
                        <tr key={index}>
                            <td className="text-left" style={{ fontWeight: 'bold' }}>{item.label}</td>
                            <td>{item.value}</td>
                        </tr>
                    ))}
                    {operation.moneda === 'USD' && 
                        <tr>
                            <td className="text-left" style={{ fontWeight: 'bold' }}>Tipo de Cambio (ARS/USD)</td>
                            <td>{operation.tipo_de_cambio.toFixed(2)}</td>
                        </tr>
                    }
                </tbody>
            </table>

            <h2 className="section-title">DESGLOSE DE CAMIONES ({operation.camiones.length} Unidades)</h2>
            <table className="truck-table">
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0' }}>
                        <th>Patente</th>
                        <th>C. Porte</th>
                        <th>Bruto (Kg)</th>
                        <th>Tara (Kg)</th>
                        <th>Neto (TN)</th>
                    </tr>
                </thead>
                <tbody>
                    {operation.camiones.map((truck, index) => (
                        <tr key={truck.id || index}>
                            <td>{truck.patente}</td>
                            <td>{truck.carta_porte || '-'}</td>
                            <td className="text-right">{truck.bruto_kg.toLocaleString('es-AR')}</td>
                            <td className="text-right">{truck.tara_kg.toLocaleString('es-AR')}</td>
                            <td className="text-right" style={{ fontWeight: 'bold' }}>{truck.neto_ton.toFixed(4)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div style={{ float: 'right', width: '300px', border: '2px solid #1e3a8a', padding: '10px', marginTop: '20px' }}>
                <h3 style={{ margin: 0, padding: '5px', backgroundColor: '#1e3a8a', color: 'white', textAlign: 'center' }}>TOTAL A LIQUIDAR</h3>
                <p style={{ margin: '10px 0', fontSize: '18pt', textAlign: 'center' }}>
                    {formatCurrency(totalArs, 'ARS')}
                </p>
                {operation.moneda === 'USD' && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '14pt', textAlign: 'center', color: '#666' }}>
                        ({formatCurrency(totalUsd, 'USD')})
                    </p>
                )}
            </div>

            <div className="footer">
                <div className="signature">
                    <div className="signature-line"></div>
                    <p>Firma y Sello de la Compañía</p>
                </div>
                <div className="signature">
                    <div className="signature-line"></div>
                    <p>Firma del Destinatario ({destinatario})</p>
                </div>
            </div>
        </div>
    );
};

// Fix: Provide full implementation for formatCurrency.ts
import type { Currency } from "../types";

/**
 * Formats a number as a currency string.
 * @param amount The number to format.
 * @param currency The currency code ('ARS' or 'USD').
 * @returns A formatted currency string.
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
    const locale = currency === 'ARS' ? 'es-AR' : 'en-US';
    
    try {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (error) {
        console.error("Error formatting currency:", error);
        return `${currency} ${amount.toFixed(2)}`;
    }
};

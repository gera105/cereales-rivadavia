/**
 * cn (Class Name) Utility
 * Combina condicionalmente cadenas de clases en una sola cadena.
 * Esto simula la funcionalidad de librerías como 'clsx' o 'tailwind-merge'.
 * * @param inputs - Un array de argumentos que pueden ser strings, arrays de strings, o valores falsy.
 * @returns Una única cadena de texto con las clases combinadas.
 */
export function cn(...inputs: (string | boolean | null | undefined)[]): string {
    const classes = [];
    for (const input of inputs) {
        if (typeof input === 'string' && input.trim() !== '') {
            classes.push(input.trim());
        }
    }
    return classes.join(' ');
}

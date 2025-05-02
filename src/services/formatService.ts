export function formatDateToLocalDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export function formatEuro(value: number) {
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(value);
};

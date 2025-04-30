export function formatDateToLocalDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export function formatCurrency(value: number) {
    return `$${value.toFixed(2)}`;
}
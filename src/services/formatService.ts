export function formatDateToLocalDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export function formatEuro(value: number) {
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: 'EUR'}).format(value);
}

export function formatLargeNumber(value: number): string {
    const absValue = Math.abs(value);

    let formatted: string;
    if (absValue >= 1_000_000_000) {
        formatted = `${(absValue / 1_000_000_000).toFixed(1)}B`;
    } else if (absValue >= 1_000_000) {
        formatted = `${(absValue / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 1_000) {
        formatted = `${(absValue / 1_000).toFixed(1)}K`;
    } else {
        formatted = absValue.toLocaleString();
    }

    return value < 0 ? `-${formatted}` : formatted;
}


export function getNiceStep(r: number) {
    if (r === 0) return 1;
    const exponent = Math.floor(Math.log10(Math.abs(r)));
    const fraction = r / Math.pow(10, exponent);
    let niceFraction;
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
    return niceFraction * Math.pow(10, exponent);
}
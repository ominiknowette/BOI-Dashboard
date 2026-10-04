/**
 * Nigerian Development Finance Number & Currency Formatters
 * Strict adherence to tabular numbers, institutional clarity and consistency.
 */

export function formatNaira(amount: number, compact = false): string {
  if (isNaN(amount) || amount === 0) return "₦0";

  if (compact) {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";

    if (abs >= 1_000_000_000_000) {
      return `${sign}₦${(abs / 1_000_000_000_000).toFixed(2)}trn`;
    }
    if (abs >= 1_000_000_000) {
      return `${sign}₦${(abs / 1_000_000_000).toFixed(1)}bn`;
    }
    if (abs >= 1_000_000) {
      return `${sign}₦${(abs / 1_000_000).toFixed(1)}m`;
    }
    if (abs >= 1_000) {
      return `${sign}₦${(abs / 1_000).toFixed(0)}k`;
    }
    return `${sign}₦${abs.toLocaleString("en-NG")}`;
  }

  return `₦${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatNairaCompact(amount: number): string {
  return formatNaira(amount, true);
}

export function formatNairaFull(amount: number): string {
  return formatNaira(amount, false);
}

export function formatNumber(value: number, compact = false): string {
  if (isNaN(value)) return "0";
  if (compact) {
    if (Math.abs(value) >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}m`;
    }
    if (Math.abs(value) >= 1_000) {
      return `${(value / 1_000).toFixed(1)}k`;
    }
  }
  return value.toLocaleString("en-NG");
}

export function formatPercent(value: number, decimals = 1): string {
  if (isNaN(value)) return "0.0%";
  return `${value.toFixed(decimals)}%`;
}

export function formatDelta(percent: number): { text: string; isPositive: boolean; isNeutral: boolean } {
  if (percent === 0 || isNaN(percent)) {
    return { text: "0.0%", isPositive: true, isNeutral: true };
  }
  const isPositive = percent > 0;
  const sign = isPositive ? "+" : "";
  return {
    text: `${sign}${percent.toFixed(1)}%`,
    isPositive,
    isNeutral: false,
  };
}

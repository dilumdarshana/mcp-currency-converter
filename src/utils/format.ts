/**
 * Locale-aware formatting helpers for currency amounts and exchange rates.
 */

/**
 * Formats an amount in the given currency using locale-aware currency
 * formatting (e.g. €85.00). Falls back to a plain number when the currency
 * code is not recognized by the runtime.
 *
 * @param amount The numeric amount
 * @param currency The ISO currency code (e.g. EUR)
 * @returns The formatted amount string
 */
export function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/**
 * Formats an exchange rate with enough precision to be meaningful (4-6
 * significant decimal places).
 *
 * @param rate The exchange rate
 * @returns The formatted rate string
 */
export function formatRate(rate: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(rate);
}

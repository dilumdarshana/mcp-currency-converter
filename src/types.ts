/**
 * Represents the response from the currency API.
 *
 * @property data - A record where the keys are currency codes (e.g., USD, EUR)
 *                  and the values are the exchange rates relative to a base currency.
 */
export interface CurrencyApiResponse {
  data: Record<string, number | Record<string, number>>; // Mapping of currency codes to their exchange rates.  Handles both latest and historical responses
}

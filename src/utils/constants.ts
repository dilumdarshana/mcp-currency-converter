/**
 * Application configuration using constant variables.
 * This file contains key constants used throughout the application,
 * such as versioning and package metadata.
 */

// MCP server version
// This constant defines the current version of the MCP server.
export const VERSION = '1.0.0';

// The package name for the MCP server
// This constant specifies the name of the package for identification purposes.
export const PACKAGE_NAME = '@alcorme/mcp-currency-converter';

// Base path of the currency conversion API
export const CURRENCY_ENDPOINT_BASE = 'https://api.freecurrencyapi.com/v1';

// Currencies supported by the Free Currency API (ISO 4217 codes)
export const SUPPORTED_CURRENCIES = [
  'AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP',
  'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MXN',
  'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'THB',
  'TRY', 'USD', 'ZAR',
] as const;

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

const DATE_FORMATS = ['DD-MM-YYYY', 'YYYY-MM-DD', 'MMMM D, YYYY', 'MM/DD/YYYY', 'D MMMM YYYY'];

export interface ParsedDate {
  formattedDate?: string;
  readableDate?: string;
}

/**
 * Parses a user-supplied date into the API's YYYY-MM-DD format plus a
 * human-readable label. Returns empty values when no date is given.
 *
 * @param date The date string in a supported format (e.g. DD-MM-YYYY)
 * @returns The normalized date and a readable label
 */
export function parseDate(date?: string): ParsedDate {
  if (!date) return {};

  const parsed = dayjs(date, DATE_FORMATS, true);
  if (!parsed.isValid()) {
    throw new Error('Invalid date format. Please provide a valid date.');
  }

  return {
    formattedDate: parsed.format('YYYY-MM-DD'),
    readableDate: parsed.format('D MMMM YYYY'),
  };
}
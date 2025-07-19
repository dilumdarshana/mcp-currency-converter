import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { randomUUID } from 'node:crypto';

/**
 * Format a timestamp for logging
 * @returns Formatted timestamp 2025-07-18_06-45-12
 */
function getTimestamp(): string {
  return new Date().toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .replace(/\..+/, '');
}

/**
 * Logger class for writing logs to files
 */
class Logger {
  private logFilePath: string;
  private errorFilePath: string;
  private sessionId: string;
  private logStream: fs.WriteStream;
  private errorStream: fs.WriteStream;

  constructor() {
    this.sessionId = randomUUID();

    const homeDir = os.homedir();
    const mcpLogDir = path.join(homeDir, '.mcp', 'logs');

    fs.mkdirSync(mcpLogDir, { recursive: true });

    const timestamp = getTimestamp(); 
    const baseFileName = `${timestamp}.${this.sessionId}`;

    this.logFilePath = path.join(mcpLogDir, `${baseFileName}.log`);
    this.errorFilePath = path.join(mcpLogDir, `${baseFileName}.error.log`);

    this.logStream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
    this.errorStream = fs.createWriteStream(this.errorFilePath, { flags: 'a' });

    this.info('Logger initialized');
  }

  static log(): Logger {
		return new Logger();
	}

  _log(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    isError: boolean = false,
  ) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} [${level.toUpperCase()}] ${message}\n`;

    // Write to the stream
    try {
      this.logStream.write(logMessage);
      if (isError) {
        this.errorStream.write(logMessage);
      }
		} catch (err) {
			// If we can't write to the log file, log the error to console
			console.error(`Failed to write to log file: ${err}`);
		}
  }

  info(message: string) {
		this._log('info', message);
	}

	warn(message: string) {
		this._log('warn', message);
	}

	error(message: string) {
		this._log('error', message, true);
	}

	debug(message: string) {
		this._log('debug', message);
	}

  getLogFilePath(): string {
    return this.logFilePath;
  }

  close() {
    this.logStream.end();
    this.errorStream.end();
  }
}

// Export the Logger class
export { Logger };

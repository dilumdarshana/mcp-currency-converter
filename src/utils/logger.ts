import fs from 'fs';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

class Logger {
  private logFilePath: string;
  private errorFilePath: string;
  private sessionId: string;
  // private stream: fs.WriteStream;
  private logStream: fs.WriteStream;
  private errorStream: fs.WriteStream;

  constructor() {
    this.sessionId = randomUUID();

    const homeDir = os.homedir();
    const mcpLogDir = path.join(homeDir, '.mcp', 'logs');

    fs.mkdirSync(mcpLogDir, { recursive: true });

    const baseFileName = this.sessionId;

    // const logFileName = `${this.sessionId}.log`;
    this.logFilePath = path.join(mcpLogDir, `${baseFileName}.log`);
    this.errorFilePath = path.join(mcpLogDir, `${baseFileName}.error.log`);

    // this.logFilePath = path.join(mcpLogDir, logFileName);

    this.logStream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
    this.errorStream = fs.createWriteStream(this.errorFilePath, { flags: 'a' });

    // this.stream = fs.createWriteStream(this.logFilePath, { flags: 'a' });
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

      // Also append to the log file
			// fs.appendFileSync(this.logFilePath, `${logMessage}\n`, 'utf8');
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

export { Logger };

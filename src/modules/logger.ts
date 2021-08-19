
import * as winston from 'winston';
class Logger {
	private winstonLogger: winston.Logger;
	readonly logger = {
		info: (log: any) => this.sendLog('info', log),
		error: (log: any) => this.sendLog('error', log)
	};
	constructor() {
		this.winstonLogger = winston.createLogger({
			transports: [
				new winston.transports.Console({ format: winston.format.simple() }),
				new winston.transports.File({ filename: 'server.log' })
			]
		});
	}
	sendLog(method: 'info' | 'error', log: any) {
		let text = `[${new Date().toISOString()}] > `;
		if (typeof log === 'string') {
			text += log;
		} else {
			text += JSON.stringify(log);
		}
		this.winstonLogger[method](text);
	}
}

export const logger = new Logger().logger;

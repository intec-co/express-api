
import * as winston from 'winston';
class Logger {
	logger: winston.Logger;
	constructor() {
		this.logger = winston.createLogger({
			transports: [
				new winston.transports.Console({ format: winston.format.simple() }),
				new winston.transports.File({ filename: 'server.log' })
			]
		});
	}
}

export const logger = new Logger().logger;

import { NextFunction, Request, Response } from 'express';
import { logger } from '../modules/logger';
import * as jwt from 'jsonwebtoken';
import { IResponse } from 'src/models/responses';

export const validated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const authorization = req.headers.authorization.split(' ');
	const token = authorization[1];
	logger.info(token);
	try {
		const decoded = jwt.verify(token, 'shhhhh');
		logger.info(decoded);
		next();
		return;
	} catch (err) {
		const error: IResponse = {
			status: false,
			error: 'Lo sentimos en este momento no podemos atender su solicitud, por favor intente más tarde'
		};
		logger.error(`[Auth]> Token invalid>${new Date().toISOString()}`);
		res.json(error);
	}
};

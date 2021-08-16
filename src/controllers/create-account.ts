import { transformAndValidate } from 'class-transformer-validator';
import { Request, Response } from 'express';
import { CreateAccount } from '../models/create-account';
import { logger } from '../modules/logger';

export const create = async (req: Request, res: Response): Promise<void> => {
	logger.info(`${JSON.stringify(req.body)}`);
	try {
		const account2 = await transformAndValidate(CreateAccount, req.body) as CreateAccount;
		logger.info(`${JSON.stringify(account2)}`);
		res.send('create');
	} catch (e) {
		res.send('error');
	}
};

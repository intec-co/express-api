import { transformAndValidate } from 'class-transformer-validator';
import { NextFunction, Request, Response } from 'express';
import { Login } from '../models/login';
import { logger } from '../modules/logger';
import * as jwt from 'jsonwebtoken';
import { IResponse } from 'src/models/responses';
import { mongo } from '../modules/mongodb';
import * as crypto from 'crypto';

export const auth = async (req: Request, res: Response): Promise<void> => {
	let login: Login;
	try {
		login = await transformAndValidate(Login, req.body) as Login;
		logger.info(`[Login]> ${JSON.stringify(login.user)} ${new Date().toISOString()}`);
	} catch (e) {
		const error: IResponse = {
			status: false,
			error: e[0].constraints
		};
		res.json(error);
		logger.error(`[Login]> Error en la estructura de los datos > ${JSON.stringify(e)}`);
		return;
	}
	try {
		const credentialQuery = {
			user: login.user,
			password: crypto.createHash('sha256').update(login.password).digest('hex')
		};
		const credential = await mongo.db.collection('credential').findOne(credentialQuery);
		if (credential) {
			// TODO login
			const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
			const response: IResponse = {
				status: true,
				data: token
			};
			res.json(response);
		} else {
			const error: IResponse = {
				status: false,
				error: 'Usuario y/o contraseña inválidos'
			};
			res.json(error);
			logger.error(`[Login]> fail > ${login.user}`);
			return;
		}
	} catch (e) {
		const error: IResponse = {
			status: false,
			error: 'Lo sentimos en este momento no podemos atender su solicitud, por favor intente más tarde'
		};
		logger.error(`[Login]> Auth >${JSON.stringify(JSON.stringify(e))}`);
		res.json(error);
	}
};

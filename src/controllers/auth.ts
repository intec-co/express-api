import { NextFunction, Request, Response } from 'express';
import { logger } from '../modules/logger';
import * as jwt from 'jsonwebtoken';
import { IResponse } from '../models/responses';
import { transformAndValidate } from 'class-transformer-validator';
import { Login } from '../models/login';
import { mongo } from '../modules/mongodb';
import * as crypto from 'crypto';

class Auth {
	private timeout: number;
	private secret: string;
	constructor() {
		this.timeout = +process.env.SESSION_TIMEOUT * 1000;
		// TODO implement strategy
		this.secret = process.env.SESSION_SECRET;
	}

	login = async (req: Request, res: Response): Promise<void> => {
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
				const token = jwt.sign({ user: true }, this.secret);
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
	}
	validated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const authorization = req.headers.authorization.split(' ');
		const token = authorization[1];
		try {
			const decoded: any = jwt.verify(token, this.secret);
			const timeout = this.timeout + decoded.iat * 1000;
			if (Date.now() > timeout) {
				const reqAny: any = req;
				reqAny.user = decoded.user;
				next();
			} else {
				const error: IResponse = {
					status: false,
					error: 'Lo sentimos su sessión expiro.'
				};
				res.status(401).json(error);
			}
			return;
		} catch (err) {
			const error: IResponse = {
				status: false,
				error: 'Lo sentimos su sessión no es valida.'
			};
			logger.error(`[Auth]> Token invalid>${new Date().toISOString()}`);
			res.status(401).json(error);
		}
	};
}

export const auth = new Auth();


import { transformAndValidate } from 'class-transformer-validator';
import { Request, Response } from 'express';
import { Collection } from 'mongodb';
import { Login } from 'src/models/login';
import { Person } from 'src/models/person';
import { IResponse } from 'src/models/responses';
import { CreateAccount } from '../models/create-account';
import { logger } from '../modules/logger';
import { mongo } from '../modules/mongodb';
import * as crypto from 'crypto';

export const create = async (req: Request, res: Response): Promise<void> => {
	logger.info(`[Create Account]> Request >${JSON.stringify(req.body)}`);
	let accountData: CreateAccount;
	try {
		accountData = await transformAndValidate(CreateAccount, req.body) as CreateAccount;
	} catch (e) {
		const error: IResponse = {
			status: false,
			error: e[0].constraints
		};
		res.json(error);
		logger.error(`[Create Account]> Error en la estructura de los datos > ${JSON.stringify(e)}`);
		return;
	}
	try {
		const personQuery = { user: accountData.user };
		const personColl: Collection = mongo.db.collection('person');
		const personDB = await personColl.findOne(personQuery);
		if (personDB) {
			const error: IResponse = {
				status: false,
				error: `El usuario ${accountData.user} ya existe`
			};
			logger.info(`[Create Account]> User already exists > ${JSON.stringify(accountData.user)}`);
			res.json(error);
		} else {
			const person: Person = {
				name: accountData.name,
				lastName: accountData.lastName,
				user: accountData.user,
				currency: accountData.currency
			};
			const credential: Login = {
				user: accountData.user,
				password: crypto.createHash('sha256').update(accountData.password).digest('hex')
			};
			await mongo.db.collection('credential').insertOne(credential);
			await personColl.insertOne(person);
			const response: IResponse = {
				status: true
			};
			logger.info(`[Create Account]> User Created >${JSON.stringify(accountData.user)}`);
			res.json(response);
		}
	} catch (e) {
		const error: IResponse = {
			status: false,
			error: 'Lo sentimos en este momento no se pudo crear su cuenta, por favor intente más tarde'
		};
		logger.error(`[Create Account]> Try Created >${JSON.stringify(e)}`);
		res.json(error);
	}
};

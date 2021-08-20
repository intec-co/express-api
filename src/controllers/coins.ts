import CoinGecko = require('coingecko-api');
import { Request, Response } from 'express-serve-static-core';
import { IResponse } from '../models/responses';
import { mongo } from '../modules/mongodb';
import { Person } from '../models/person';
import { ICoinGecko } from '../models/coin';
import { logger } from '../modules/logger';

const coinGeckoClient = new CoinGecko();

export const queryAll = async (req: Request, res: Response): Promise<void> => {
	try {
		logger.info('[COINS] > get all coins');
		const reqData: any = req;
		const userData: Person = (await mongo.db.collection('person').findOne({ user: reqData.user })) as Person;
		const currency = userData.currency;
		const coins = await coinGeckoClient.coins.all();
		const response: IResponse = {
			status: true,
			data: coins.data.map((coin: ICoinGecko) =>
			({
				symbol: coin.symbol,
				price: coin.market_data.current_price[currency],
				name: coin.name,
				image: coin.image.large,
				lastUpdated: coin.last_updated
			}))
		};
		res.json(response);
	} catch (e) {
		const response: IResponse = {
			status: false,
			error: 'No se pudo cargar la información de monedas'
		};
		res.json(response);
	}
};

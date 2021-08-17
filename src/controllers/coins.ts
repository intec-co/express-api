import { transformAndValidate } from 'class-transformer-validator';
import CoinGecko = require('coingecko-api');
import { Request, Response } from 'express-serve-static-core';
import { IResponse } from 'src/models/responses';
import { logger } from '../modules/logger';

const coinGeckoClient = new CoinGecko();

export const queryAll = async (req: Request, res: Response): Promise<void> => {
	logger.info(`${JSON.stringify(req.body)}`);
	try {
		const coins = await coinGeckoClient.coins.all();
		// const account2 = await transformAndValidate(CreateAccount, req.body) as CreateAccount;
		const response: IResponse = {
			status: true,
			data: coins.data.map((coin: any) => (
				{
					symbol: coin.symbol,
					// TODO money of user
					price: coin.market_data.current_price.usd,
					name: coin.name,
					image: coin.image.large,
					lastUpdated: coin.last_updated
				}))
		};
		res.json(response);
	} catch (e) {
		const response: IResponse = {
			status: false,
			error: 'No se pudo carga la información de monedas'
		};
		res.json(response);
	}
};

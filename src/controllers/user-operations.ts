import CoinGecko = require('coingecko-api');
import { Request, Response } from 'express-serve-static-core';
import { IResponse } from '../models/responses';
import { mongo } from '../modules/mongodb';
import { logger } from '../modules/logger';
import { Collection } from 'mongodb';
import { ICoinGecko, UserCoin } from '../models/coin';

const coinGeckoClient = new CoinGecko();

export const addCoin = async (req: Request, res: Response): Promise<void> => {
	try {
		if (req.body.coin && typeof req.body.coin === 'string') {
			const reqData: any = req;
			const user = reqData.user;
			const coin = req.body.coin;
			const coinColl: Collection = mongo.db.collection('coins');
			const relationship = await coinColl.findOne({ user, coin });
			if (relationship) {
				const response: IResponse = {
					status: true,
					data: 'No se guardo la moneda, el usuario ya la tiene en su lista.'
				};
				res.json(response);
			} else {
				try {
					await coinColl.insertOne({ user, coin });
					const response: IResponse = {
						status: true,
						data: 'Se guardo la moneda'
					};
					res.json(response);
				} catch (e) {
					logger.error(`[user-operation addCoin] > ${JSON.stringify(e)}`);
					const error: IResponse = {
						status: false,
						error: 'No se pudo agregar la moneda'
					};
					res.json(error);
				}
			}
		} else {
			const response: IResponse = {
				status: false,
				error: 'Request invalido, coin es requerido y debe ser un string'
			};
			res.json(response);
		}
	} catch (e) {
		const error: IResponse = {
			status: false,
			error: 'No se pudo agregar la moneda'
		};
		res.json(error);
	}
};

export const topCoins = async (req: Request, res: Response): Promise<void> => {
	if (!req.params.n) {
		const response: IResponse = {
			status: false,
			error: 'Se require el número de monedas a listar'
		};
		res.json(response);
		return;
	}
	const n = +req.params.n;
	if (n > 25) {
		const response: IResponse = {
			status: false,
			error: 'El número máximo de monedas a listar es 25'
		};
		res.json(response);
		return;
	}
	try {
		const reqData: any = req;
		const user = reqData.user;
		const userCoins: UserCoin[] = (await mongo.db.collection('coins').find({ user }).toArray()) as UserCoin[];
		logger.info(userCoins);
		if (!userCoins || !userCoins.length) {
			const response: IResponse = {
				status: false,
				error: 'No tiene monedas en su lista'
			};
			res.json(response);
			return;
		}
		const coins = await coinGeckoClient.coins.all();
		const coinsMap: Map<string, ICoinGecko> = new Map();
		coins.data.forEach((coin: ICoinGecko) => {
			coinsMap.set(coin.symbol, coin);
		});
		let filteredCoinsGecko: ICoinGecko[] = userCoins.map(coin => {
			return coinsMap.get(coin.coin);
		});
		// Filtra cuando no encontró la moneda
		filteredCoinsGecko = filteredCoinsGecko.filter(coin => coin);
		const filteredCoins = filteredCoinsGecko.map((coin: ICoinGecko) =>
		({
			symbol: coin.symbol,
			priceArs: coin.market_data.current_price.ars,
			priceUsd: coin.market_data.current_price.usd,
			priceEur: coin.market_data.current_price.eur,
			name: coin.name,
			image: coin.image.large,
			lastUpdated: coin.last_updated
		}));
		if (req.params.sort && req.params.sort === 'asc') {
			filteredCoins.sort((a, b) => a.priceUsd - b.priceUsd);
		} else {
			filteredCoins.sort((a, b) => b.priceUsd - a.priceUsd);
		}
		const response: IResponse = {
			status: true,
			data: filteredCoins
		};
		res.json(response);
	} catch (e) {
		logger.error(`[operations/topCoin] > ${e}`);
		const error: IResponse = {
			status: false,
			error: 'No se pudo listar las monedas'
		};
		res.json(error);
	}
};


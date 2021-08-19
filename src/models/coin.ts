export interface UserCoin {
	coin: string;
	user: string;
}

export interface Coin {
	symbol: string;
	price: number;
	name: string;
	image: string;
	lastUpdated: string;
}

export interface ICoinGecko {
	symbol: string;
	market_data: { current_price: { [key: string]: number; } },
	name: string;
	image: { large: string },
	last_updated: string;
}

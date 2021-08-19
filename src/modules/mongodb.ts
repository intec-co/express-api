import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { logger } from './logger';

class MongoDbConnection {
	private mongoServer: MongoMemoryServer;
	private connection: MongoClient;
	db: Db;

	constructor() {
		this.connect();
	}
	private connect = async () => {
		this.mongoServer = await MongoMemoryServer.create();
		const mongoUri = this.mongoServer.getUri();
		this.connection = await MongoClient.connect(mongoUri);

		this.db = this.connection.db('test');
		logger.info('Connected to mongodb-memory-server');
	};
}

export const mongo = new MongoDbConnection();


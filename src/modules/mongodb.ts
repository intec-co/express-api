import { Db, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

class MongoDbConnection {
	private mongoServer: MongoMemoryServer;
	private connection: MongoClient;
	db: Db;

	constructor() {
		(async () => {
			this.mongoServer = await MongoMemoryServer.create();
			const mongoUri = this.mongoServer.getUri();
			this.connection = await MongoClient.connect(mongoUri);

			this.db = this.connection.db('');
		});
	}

	async close() {
		return Promise.all([
			this.connection.close(),
			this.mongoServer.stop()
		]);
	}
}

export const mongo = new MongoDbConnection();


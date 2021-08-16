import * as express from 'express';
import * as dotenv from 'dotenv';
import { logger } from './modules/logger';
import * as routes from './routes';

dotenv.config();
const app = express();

app.listen(process.env.PORT, () => {
	logger.info(`Server run in port: ${process.env.PORT}`);
});

app.use(express.json());
app.use(routes);

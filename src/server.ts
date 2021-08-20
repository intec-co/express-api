import * as express from 'express';
import * as dotenv from 'dotenv';
import { logger } from './modules/logger';
import * as routes from './routes';
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

dotenv.config();
const app = express();

const specs = swaggerJsdoc(swaggerDocument);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true })
);

app.listen(process.env.PORT, () => {
	logger.info(`Server run in port: ${process.env.PORT}`);
});

app.use(express.json());
app.use(routes);

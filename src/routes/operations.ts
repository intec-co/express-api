import * as express from 'express';
import *as  coinGeckoClient from '../controllers/coins';
import * as userOperation from '../controllers/user-operations';
import { auth } from '../controllers/auth';

const router = express.Router();

router.use(auth.validated);
router.get('/coins', coinGeckoClient.queryAll);
router.post('/add-coin', userOperation.addCoin);
router.get('/top-coins/:n', userOperation.topCoins);
router.get('/top-coins/:n/:sort', userOperation.topCoins);

export = router;

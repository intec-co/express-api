import * as express from 'express';
import * as coins from '../controllers/coins';
import * as auth from '../controllers/auth';

const router = express.Router();

router.use(auth.validated);
router.get('/coins', coins.queryAll);

export = router;

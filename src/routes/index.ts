import * as express from 'express';
import * as createAccount from '../controllers/create-account';
import { auth } from '../controllers/auth';
import * as operations from '../routes/operations';

const router = express.Router();

router.post('/create-account', createAccount.create);
router.post('/login', auth.login);
router.use('/operations', operations);

export = router;

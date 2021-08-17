import * as express from 'express';
import * as createAccount from '../controllers/create-account';
import * as login from '../controllers/login';
import * as operations from '../routes/operations';

const router = express.Router();

router.post('/create', createAccount.create);
router.post('/login', login.auth);
router.use('/operations', operations);

export = router;

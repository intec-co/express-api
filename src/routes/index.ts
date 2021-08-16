import * as express from 'express';
import * as createAccount from '../controllers/create-account';

const router = express.Router();

router.all('/create', createAccount.create);
router.all('/login');
router.all('/account');

export = router;

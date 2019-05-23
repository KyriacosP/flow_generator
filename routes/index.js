import express from 'express';
import flowsController from '../flowsControllers/flows';

const router = express.Router();

router.get('/', flowsController.info);
router.get('/info', flowsController.info);
router.post('/generate', flowsController.generateFlow);

export default router;

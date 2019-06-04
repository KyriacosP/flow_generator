import express from 'express';
import flowsController from '../flowsControllers/flows';

const router = express.Router();

//routes definition
router.get('/', flowsController.info);
router.get('/info', flowsController.info);
router.post('/generate', flowsController.generateFlow);
router.post('/forward',flowsController.forward);

export default router;

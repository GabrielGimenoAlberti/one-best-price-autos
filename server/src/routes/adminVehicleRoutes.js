import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  listVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from '../controllers/adminVehicleController.js';

const router = Router();

// Every route below this line requires a logged-in admin
router.use(requireAuth, requireAdmin);

router.get('/', listVehicles);
router.get('/:id', getVehicle);
router.post('/', createVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

export default router;
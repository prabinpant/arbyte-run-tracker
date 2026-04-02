import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

// Public: Get athlete activities
router.get('/:userId/activities', userController.getUserActivities);

// Private: Update own profile
router.patch('/me', isAuthenticated, userController.updateProfile);

export default router;

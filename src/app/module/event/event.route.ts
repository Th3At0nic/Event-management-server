import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createEventValidationSchema } from './event.validation';
import { EventController } from './event.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/add-event',
  auth(USER_ROLE.user),
  validateRequest(createEventValidationSchema),
  EventController.createEvent,
);

export const EventRoutes = router;

import { Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import { createEventValidationSchema } from './event.validation';
import { EventController } from './event.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get('/', auth(USER_ROLE.user), EventController.getAllEvents);

router.post(
  '/add-event',
  auth(USER_ROLE.user),
  validateRequest(createEventValidationSchema),
  EventController.createEvent,
);

router.get('/my-events', auth(USER_ROLE.user), EventController.getMyEvents);

router.patch(
  '/:id',
  auth(USER_ROLE.user),
  EventController.updateEvent,
);

router.delete(
  '/:id',
  auth(USER_ROLE.user),
  EventController.deleteEvent,
);

router.patch(
  '/:id/join',
  auth(USER_ROLE.user),
  EventController.assignUserAndAttendeeCount,
);

export const EventRoutes = router;

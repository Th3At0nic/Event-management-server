import { Router } from 'express';
import { AuthRoutes } from '../module/auth/auth.route';
import { EventRoutes } from '../module/event/event.route';

const router = Router();

const routeModules = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/events',
    route: EventRoutes,
  },
];

routeModules.forEach((route) => router.use(route.path, route.route));

export default router;

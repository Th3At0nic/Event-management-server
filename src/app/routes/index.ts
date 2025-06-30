import { Router } from 'express';
import { AuthRoutes } from '../module/auth/auth.route';

const router = Router();

const routeModules = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
];

routeModules.forEach((route) => router.use(route.path, route.route));

export default router;

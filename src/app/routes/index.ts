import { Router } from 'express';
import { userRoute } from '../module/user/user.route';

const router = Router();

const routeModules = [
  {
    path: '/auth',
    route: userRoute,
  },
];

routeModules.forEach((route) => router.use(route.path, route.route));

export default router;

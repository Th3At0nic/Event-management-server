import { NextFunction, Request, Response, Router } from 'express';
import { validateRequest } from '../../middlewares/validateRequest';
import {
  loginUserValidationSchema,
  refreshTokenValidationSchema,
} from './auth.validation';
import { AuthUserControllers } from './auth.controller';
import { UserValidationSchema } from '../user/user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = Router();

router.post(
  '/register',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UserValidationSchema),
  AuthUserControllers.registerUser,
);

router.post(
  '/login',
  validateRequest(loginUserValidationSchema),
  AuthUserControllers.loginUser,
);

router.post(
  '/refresh-token',
  validateRequest(refreshTokenValidationSchema),
  AuthUserControllers.createNewAccessTokenByRefreshToken,
);

export const AuthRoutes = router;

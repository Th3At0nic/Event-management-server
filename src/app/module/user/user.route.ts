import express from 'express';
import { userControllers } from './user.controller';
import { auth } from '../../middlewares/authRequest';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// router.post(
//   '/register',
//   upload.single('file'),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = JSON.parse(req.body.data);
//     next();
//   },
//   validateRequest(UserValidationSchema),
//   userControllers.registerUser,
// );

router.get('/profile', auth(USER_ROLE.user), userControllers.getSingleUser);

export const UserRoute = router;

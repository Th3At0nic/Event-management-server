import express from 'express';
import { userControllers } from './user.controller';

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

router.get('/user', userControllers.getSingleUser);

export const UserRoute = router;

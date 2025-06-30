/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user.service';
import { JwtPayload } from 'jsonwebtoken';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates

const getSingleUser = catchAsync(async (req, res, next) => {
  const { userEmail } = req.user as JwtPayload;
  const result = await userServices.getSingleUserFromDB(userEmail);
  const message = 'User Data Retrieved Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const userControllers = { getSingleUser };

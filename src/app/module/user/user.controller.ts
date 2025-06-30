/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user.service';

//imported HOF(catchAsync()) to pass the async func there to handle the promise and error, reduced boilerplates

const registerUser = catchAsync(async (req, res, next) => {
  const file = req?.file as Express.Multer.File;
  const result = await userServices.registerUserIntoDB(file, req.body);
  const message = 'User Registered Successfully';
  sendResponse(res, StatusCodes.OK, true, message, result);
});

export const userControllers = { registerUser };

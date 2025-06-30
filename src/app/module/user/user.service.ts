import { UserModel } from './user.model';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';

const getSingleUserFromDB = async (userEmail: string) => {
  const result = await UserModel.find({ email: userEmail });

  if (!result.length) {
    throwAppError(
      'email',
      'User not found with this email',
      StatusCodes.NOT_FOUND,
    );
  }

  return result;
};

export const userServices = {  getSingleUserFromDB };

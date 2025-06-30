import { UserModel } from './user.model';
import { TUser } from './user.interface';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const registerUserIntoDB = async (
  file: Express.Multer.File,
  payload: TUser,
) => {
  if (file) {
    const imgName = `${payload.email}-${Date.now()}`;

    const uploadImgResult = await sendImageToCloudinary(file.buffer, imgName);
    if (uploadImgResult?.secure_url) {
      payload.photoURL = uploadImgResult.secure_url;
    } else {
      payload.photoURL = '';
      throwAppError(
        'photoURL',
        'Failed to upload the photo to cloudinary. Try again.',
        StatusCodes.REQUEST_TIMEOUT,
      );
    }
  } else {
    throwAppError(
      'photoURL',
      'You Must Upload the Profile Photo',
      StatusCodes.BAD_REQUEST,
    );
  }

  const user: TUser = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    photoURL: payload.photoURL,
  };

  //preventing duplicate creation of student
  const userExisted = await UserModel.isUserExists(user.email as string);

  if (userExisted) {
    throwAppError(
      'email',
      `The user id: ${user.email} is already registered.`,
      StatusCodes.CONFLICT,
    );
  }

  //creating a new user
  const newUser = await UserModel.create(user);

  if (!newUser) {
    throwAppError(
      'user',
      'Failed to create user. Please try again later.',
      StatusCodes.INTERNAL_SERVER_ERROR,
    );
  }

  return newUser;
};

export const userServices = { registerUserIntoDB };

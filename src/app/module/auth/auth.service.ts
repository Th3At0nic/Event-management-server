import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import throwAppError from '../../utils/throwAppError';
import { StatusCodes } from 'http-status-codes';
import { generateToken } from './auth.utils';
import config from '../../config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUser } from '../user/user.interface';
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
    role: 'user',
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

const loginUserAuth = async (payload: TLoginUser) => {
  const { email, password: userGivenPassword } = payload;

  const user = await UserModel.isUserExists(email);

  if (!user) {
    throwAppError(
      'email',
      `This Email is not Registered.`,
      StatusCodes.UNAUTHORIZED,
    );
  }

  const isPasswordValid = await UserModel.isPasswordCorrect(
    userGivenPassword,
    user?.password as string,
  );

  if (!isPasswordValid) {
    throwAppError(
      'password',
      'Incorrect password. Please try again.',
      StatusCodes.UNAUTHORIZED,
    );
  }

  const jwtPayload = {
    userEmail: user?.email as string,
    role: user?.role as string,
  };

  // create access token and send it to the client
  const accessToken = generateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = generateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const userData = {
    name: user?.name,
    email: user?.email,
    role: user?.role,
    photoURL: user?.photoURL,
  };

  return {
    userData,
    accessToken,
    refreshToken,
  };
};

const createNewAccessTokenByRefreshToken = async (token: string) => {
  if (!token) {
    throwAppError(
      'authorization',
      'Authorization is required to access this resource.',
      StatusCodes.UNAUTHORIZED,
    );
  }

  // check if the token is valid
  // invalid token
  const decoded = jwt.verify(token, config.jwt_refresh_secret as string);

  // decoded undefined
  const { userEmail, role } = decoded as JwtPayload;

  // req.user = decoded as JwtPayload;

  const user = await UserModel.isUserExists(userEmail);

  if (!user) {
    throwAppError(
      'email',
      `The ${role} with the provided email: ${userEmail} not found in the system. Please recheck the Email and try again`,
      StatusCodes.NOT_FOUND,
    );
  }

  if (user) {
    const jwtPayload = {
      userEmail: user.email,
      role: user.role,
    };

    //create access token and send it to the client
    const accessToken = generateToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );
    return { accessToken };
  } else return null;
};

// const changePasswordIntoDB = async (
//   userData: JwtPayload,
//   payload: TChangePassData,
// ) => {
//   const user = await UserModel.isUserExists(userData.userEmail);

//   if (!user) {
//     throwAppError(
//       'email',
//       `The User with the email: ${userData.userEmail} not found in the system.`,
//       StatusCodes.NOT_FOUND,
//     );
//   }

//   const isOldPasswordValid = await UserModel.isPasswordCorrect(
//     payload.oldPassword,
//     user?.password as string,
//   );

//   if (!isOldPasswordValid) {
//     throwAppError(
//       'password',
//       'Invalid Credentials. Old password is incorrect. Please try again.',
//       StatusCodes.BAD_REQUEST,
//     );
//   }

//   //hash new password
//   const newHashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_round_salt),
//   );

//   const result = await UserModel.findOneAndUpdate(
//     {
//       email: userData.userEmail,
//       role: userData.role,
//     },
//     {
//       password: newHashedPassword,
//     },
//     { new: true },
//   );

//   return result ? {} : undefined;
// };

export const AuthUserServices = {
  registerUserIntoDB,
  loginUserAuth,
  createNewAccessTokenByRefreshToken,
};

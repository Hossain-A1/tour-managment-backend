import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import status from 'http-status-codes'
import AppError from "../errorHelpers/AppError";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifiToken } from "./jwt";
import { UserModel } from "../modules/user/user.model";

export const createUserToken =(user:Partial<IUser>)=>{
 const jwtPayload = {
    userId: user._id,
    email: user.email,
    role: user.role,
  };
  //access token
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  //refresh token
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );
  return{
    accessToken,
    refreshToken,

  }
}


export const createNewAccessTokenWithRefreshToken =async (refreshToken:string)=>{
  
   if(!refreshToken){
       throw new AppError(status.BAD_REQUEST, "No refresh token get from cookies");
    }
    
  const verifiRefreshToken = verifiToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const isUserExist = await UserModel.findOne({
    email: verifiRefreshToken.email,
  });

  if (!isUserExist) {
    throw new AppError(status.BAD_REQUEST, "User does not exist");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(status.BAD_REQUEST, `User is ${isUserExist.isActive}`);
  }

  if (isUserExist.isDeleted) {
    throw new AppError(status.BAD_REQUEST, "User is deleted");
  }

   const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const  accessToken  = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES);

return accessToken
}
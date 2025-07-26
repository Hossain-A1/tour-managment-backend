import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
//AUTH PROVIDERS
export interface IAuthProvider {
  provider: "google" | "credentials";
  providerId: string;
}
//user interface
export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isActive?: IsActive;
  isVerified?: boolean;
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
  auths: IAuthProvider[];
  role: Role;
  createdAt?:Date
}

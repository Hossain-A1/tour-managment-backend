import { Types } from "mongoose";

export interface ITourType {
  _id?: string;
  name: string;
}

export interface ITour {
  _id?: string;
  title: string;
  slug: string;
  description?: string;
  images: [];
  location?: string;
  departureLocation?: string;
  arrivalLocation?: string;
  costForm?: number;
  startDate?: Date;
  endDate?: Date;
  included?: string[];
  excluded: string[];
  amenities?: string[];
  tourPlan?: string[];
  maxGuest?: number;
  minAge?: number;
  division: Types.ObjectId;
  tourType: Types.ObjectId;
}

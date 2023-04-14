import { Document } from "mongoose";
import { IUser, IUserClient } from "./user";

export interface IBlogClient {
  _id: string;
  title: string;
  author: IUserClient;
  content: string;
  headline: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlog extends Document {
  title: string;
  author: string | IUser;
  content: string;
  headline: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

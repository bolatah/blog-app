import { Document } from "mongoose";

export interface IUser extends Document {
  uid: string;
  name: string;
}

export interface IUserClient {
  _id: string;
  uid: string;
  name: string;
}

export const DEFAULT_USER: IUserClient = {
  _id: "",
  uid: "",
  name: "",
};

export const USER_BOLATAH: IUserClient = {
  _id: "626d1868d14094e6d56a437e",
  uid: "ufJjOBfZ9uSSIFrdBEHEvalMPc73",
  name: "bolatah",
};

export const DEFAULT_FIRE_TOKEN = "";

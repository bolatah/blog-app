import { Document } from "mongoose";

export default interface IBlog extends Document {
  title: string;
  author: string;
  content: string;
  headline: string;
  picture?: string;
}

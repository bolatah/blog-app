import mongoose, { Schema } from "mongoose";
import { IBlog } from "../interfaces/blog";
import { IUser } from "../interfaces/user";

const UserSchema: Schema = new Schema({
  uid: { type: String, unique: true },
  name: { type: String },
});

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, unique: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    headline: { type: String },
    picture: { type: String },
  },
  { timestamps: true }
);
const Blog = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export { User, Blog };

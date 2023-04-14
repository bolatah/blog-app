import type { NextApiRequest, NextApiResponse } from "next";
import { Blog } from "../../../models/models";
import mongoose from "mongoose";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";
import { IBlog } from "@/interfaces/blog";
//import { firebaseMiddleware } from "@/middleware/firebaseMiddleware";

const handler = nextConnect();

//handler.use(firebaseMiddleware);

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  let { author, title, content, headline, picture } = req.body;
  const db = await mongoConnect();
  const blog: IBlog = new Blog({
    _id: new mongoose.Types.ObjectId(),
    author,
    title,
    content,
    headline,
    picture,
  });

  try {
    const newBlog = await blog.save();
    console.log(newBlog);
    return res.status(201).json(newBlog);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});
export default handler;

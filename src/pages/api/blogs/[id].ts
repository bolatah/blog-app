import type { NextApiRequest, NextApiResponse } from "next";
import { Blog } from "../../../models/models";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";
import mongoose from "mongoose";

interface CustomNextApiRequest extends NextApiRequest {
  db: any;
}

const handler = nextConnect<CustomNextApiRequest, NextApiResponse>();

handler.use(async (req, res, next) => {
  try {
    const db = await mongoConnect();
    req.db = db;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to connect to database " });
  }
});

handler.get(async (req, res) => {
  const { id } = req.query;
  return await Blog.findById(id)
    .populate("author")
    .then((blog) => {
      if (blog) {
        return res.status(200).json(blog);
      } else {
        return res.status(404).json({
          message: "blog not found",
        });
      }
    })
    .catch((error: any) => {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    });
});

handler.post(async (req, res) => {
  let { author, title, content, headline, picture } = req.body;
  const blog = new Blog({
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
    return res.status(201).json({
      blog: newBlog,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

handler.delete(async (req, res) => {
  const { id } = req.query;
  return Blog.findByIdAndDelete(id)
    .then(() => {
      return res.status(200).json({
        message: "blog deleted",
      });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, message: error.message });
    });
});

handler.get(async (req, res) => {
  return Blog.find(req.body)
    .populate("author")
    .exec()
    .then((blogs) => {
      if (blogs) {
        return res.status(200).json({ blogs });
      } else {
        return res.status(404).json({
          message: "blogs not found",
        });
      }
    })
    .catch((error) => {
      if (error instanceof Error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    });
});

export default handler;

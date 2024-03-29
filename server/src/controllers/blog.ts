import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import logging from "../config/logging";
import Blog from "../models/blog";

const create = async (req: Request, res: Response, next: NextFunction) => {
  logging.info("Attempting to register blog ...");

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
    logging.info(`New blog created ...`);
    return res.status(201).json({
      blog: newBlog,
    });
  } catch (error) {
    logging.error(error);
    return res.status(500).json({
      error,
    });
  }
};

const read = async (req: Request, res: Response, _next: NextFunction) => {
  const _id = req.params.blogID;
  console.log(req.params);
  logging.info(`Incoming read for ${_id}`);
  return Blog.findById(_id)
    .populate("author")
    .then((blog) => {
      if (blog) {
        return res.status(200).json({ blog });
      } else {
        return res.status(404).json({
          message: "blog not found",
        });
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const readAll = async (req: Request, res: Response, _next: NextFunction) => {
  logging.info(`Incoming read for all`);
  return Blog.find()
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
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const readBolatahBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logging.info(`Incoming read for all`);
  return Blog.find({
    author: {
      name: "bolatah",
      uid: " ufJjOBfZ9uSSIFrdBEHEvalMPc73",
      _id: "626d1868d14094e6d56a437e",
    },
  })
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
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const query = async (req: Request, res: Response, _next: NextFunction) => {
  logging.info(`Incoming query`);
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
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const update = async (req: Request, res: Response, _next: NextFunction) => {
  const _id = req.params.blogID;

  logging.info(`Incoming update for ${_id}`);

  return Blog.findById(_id)
    .exec()
    .then((blog) => {
      if (blog) {
        blog.set(req.body);
        blog
          .save()
          .then((newBlog) => {
            logging.info(`Blog updated ...`);
            return res.status(201).json({
              blog: newBlog,
            });
          })
          .catch((error) => {
            logging.error(error);
            return res.status(500).json({
              error,
            });
          });
      } else {
        return res.status(404).json({
          message: "blogs not found",
        });
      }
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

const deleteBlog = async (req: Request, res: Response, _next: NextFunction) => {
  const _id = req.params.blogID;
  logging.warn(`Incoming delete for ${_id}`);
  return Blog.findByIdAndDelete(_id)
    .then(() => {
      return res.status(200).json({
        message: "blog deleted",
      });
    })
    .catch((error) => {
      logging.error(error);
      return res.status(500).json({
        error,
      });
    });
};

export default {
  create,
  read,
  readAll,
  readBolatahBlogs,
  query,
  update,
  deleteBlog,
};

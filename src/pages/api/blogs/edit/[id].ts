import type { NextApiRequest, NextApiResponse } from "next";
import { Blog } from "../../../../models/models";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";
import { IBlog } from "@/interfaces/blog";
//import { firebaseMiddleware } from "@/middleware/firebaseMiddleware";

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

//handler.use(firebaseMiddleware);

handler.patch(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const db = await mongoConnect();
  return await Blog.findById(id)
    .exec()
    .then((blog) => {
      if (blog) {
        blog.set(req.body);
        blog
          .save()
          .then((newBlog: IBlog) => {
            return res.status(201).json(newBlog);
          })
          .catch((error: any) => {
            if (error instanceof Error) {
              return res.status(500).json({
                success: false,
                message: error.message,
              });
            }
          });
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

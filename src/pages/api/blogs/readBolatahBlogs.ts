import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";
import { Blog } from "../../../models/models";

const handler = nextConnect();

handler.get(async (_req: NextApiRequest, res: NextApiResponse) => {
  const db = await mongoConnect();
  return await Blog.find({
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
        return res.status(200).json(blogs);
      } else {
        return res.status(404).json({
          message: "blogs not found",
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        error,
      });
    });
});
export default handler;

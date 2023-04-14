import type { NextApiRequest, NextApiResponse } from "next";
import { Blog } from "../../../models/models";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";

const handler = nextConnect();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const db = await mongoConnect();
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
      return res.status(500).json({
        error,
      });
    });
});

export default handler;

import type { NextApiRequest, NextApiResponse } from "next";
import { Blog } from "../../../models/models";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";
import { firebaseMiddleware } from "@/middleware/firebaseMiddleware";

const handler = nextConnect();

handler.use(firebaseMiddleware);

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const db = await mongoConnect();
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
export default handler;

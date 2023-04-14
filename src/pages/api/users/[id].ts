import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../models/models";
import mongoConnect from "@/config/mongo";
import nextConnect from "next-connect";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.get(async (req, res) => {
  const id = req.query.id;
  const db = await mongoConnect();

  return await User.findById(id)
    .then((user) => {
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(404).json({
          message: "user not found",
        });
      }
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    });
});
export default handler;

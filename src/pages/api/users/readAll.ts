import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";
import { User } from "../../../models/models";
import IResponse from "@/interfaces/response";

const handler = nextConnect();

handler.get(async (_req: NextApiRequest, res: IResponse) => {
  const db = await mongoConnect();
  return await User.find({})
    .exec()
    .then((users) => {
      if (users) {
        return res.status(200).json(users);
      } else {
        return res.status(404).json({
          message: "users not found",
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

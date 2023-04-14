import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseMiddleware } from "../../../middleware/firebaseMiddleware";
import { User } from "../../../models/models";
import nextConnect from "next-connect";
import IResponse from "@/interfaces/response";
import mongoConnect from "@/config/mongo";

const handler = nextConnect();

handler.use(firebaseMiddleware);

handler.get(async (req: NextApiRequest, res: IResponse) => {
  const db = mongoConnect();
  let firebase = JSON.parse(res.getHeader("locals") as string).firebase;
  return await User.findOne({ uid: firebase?.uid })
    .then((user) => {
      if (user) {
        return res.status(200).json({ user });
      } else {
        return res.status(401).json({
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

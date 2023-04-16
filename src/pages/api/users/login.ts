import type { NextApiRequest } from "next";
import cors from "cors";
import { User } from "../../../models/models";
import mongoConnect from "@/config/mongo";
import nextConnect from "next-connect";
import { firebaseMiddleware } from "@/middleware/firebaseMiddleware";
import register from "./register";
import IResponse from "@/interfaces/response";

const handler = nextConnect();
handler.use(cors());
handler.use(firebaseMiddleware);

handler.post(async (req: NextApiRequest, res: IResponse) => {
  let { uid } = req.body;
  let fire_token = JSON.parse(res.getHeader("locals") as string).fire_token;
  const db = await mongoConnect();

  return await User.findOne({ uid })
    .then((user) => {
      if (user) {
        return res.status(200).json({
          user,
          fire_token,
        });
      } else {
        return register(req, res);
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

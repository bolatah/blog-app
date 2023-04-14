import type { NextApiRequest } from "next";
import { User } from "../../../models/models";
import mongoose from "mongoose";
import nextConnect from "next-connect";
import mongoConnect from "@/config/mongo";
import IResponse from "@/interfaces/response";
//import Firebase from "@/config/firebase";
import { IUser } from "@/interfaces/user";

const handler = nextConnect();

handler.post(async (req: NextApiRequest, res: IResponse) => {
  let { uid, name } = req.body;
  //let fire_token = res.locals.fire_token;
  //console.log(fire_token);

  const db = await mongoConnect();

  const user: IUser = new User({
    _id: new mongoose.Types.ObjectId(),
    uid,
    name,
  });

  return await user
    .save()
    .then((user) => {
      return res.status(201).json({
        user,
        //  fire_token,
      });
    })
    .catch((error) => {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    });
});
export default handler;

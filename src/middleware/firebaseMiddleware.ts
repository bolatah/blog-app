import { NextApiRequest, NextApiResponse } from "next";
import firebaseAdmin from "@/config/firebaseAdmin";
import logging from "@/config/logging";
import IResponse from "@/interfaces/response";

export const firebaseMiddleware = async (
  req: NextApiRequest,
  res: IResponse,
  next: () => void
) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (token) {
    await firebaseAdmin
      .auth()
      .verifyIdToken(token)
      .then((result) => {
        if (result) {
          // Add info to response
          res.setHeader(
            "locals",
            JSON.stringify({ firebase: result, fire_token: token })
          );
          next();
        } else {
          logging.warn("Token invalid");
          return res.status(401).json({
            message: "Unauthorized user credentials",
          });
        }
      })
      .catch((error) => {
        logging.error(error);
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      });
  } else {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }
};

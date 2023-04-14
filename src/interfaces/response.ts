import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

export default interface IResponse extends NextApiResponse {
  [x: string]: any;
  locals: {
    firebase: any;
    fire_token: any;
  };
}

import firebase from "firebase";
import { auth } from "../config/firebase";
import IUser from "../interfaces/user";
import axios from "axios";
//import config from "../config/config";
import logging from "../config/logging";

export const SignInWithSocialMedia = (provider: firebase.auth.AuthProvider) =>
  new Promise<firebase.auth.UserCredential>((resolve, reject) => {
    auth
      .signInWithPopup(provider)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });

export const Authenticate = async (
  uid: string,
  name: string,
  fire_token: string,
  callback: (error: string | null, user: IUser | null) => void
) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_SERVER_URL}/users/login`,
      data: {
        uid,
        name,
      },
      headers: { Authorization: `Bearer ${fire_token}` },
    });
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 304
    ) {
      logging.info("Successfully authenticated user");
      callback(null, response.data.user);
    } else {
      logging.warn("Failed to authenticate user");
      callback("Failed to authenticate user", null);
    }
  } catch (error) {
    logging.error(error);
    callback("Unable to authenticate", null);
  }
};

export const Validate = async (
  fire_token: string,
  callback: (error: string | null, user: IUser | null) => void
) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_SERVER_URL}/users/validate`,
      headers: { Authorization: `Bearer ${fire_token}` },
    });
    if (response.status === 200 || response.status === 304) {
      logging.info("Successfully validated");
      callback(null, response.data.user);
    } else {
      logging.warn("Failed to validate user");
      callback("Failed to validate user", null);
    }
  } catch (error) {
    logging.error(error);
    callback("Unable to validate", null);
  }
};

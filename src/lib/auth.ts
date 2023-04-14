//import firebase from "firebase/app";
//import { auth } from "firebase/auth";
import { auth } from "../config/firebaseClient";
import { IUserClient } from "../interfaces/user";
import axios from "axios";
//import config from "../config/config";
import logging from "../config/logging";
import {
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from "firebase/auth";

export const SignInWithSocialMedia = (provider: GoogleAuthProvider) =>
  new Promise<UserCredential>((resolve, reject) => {
    signInWithPopup(auth, provider)
      .then((result: any) => resolve(result))
      .catch((error: any) => reject(error));
  });

export const Authenticate = async (
  uid: string,
  name: string,
  fire_token: string,
  callback: (error: string | null, user: IUserClient | null) => void
) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/users/login`,
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
  callback: (error: string | null, user: IUserClient | null) => void
) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/users/validate`,
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

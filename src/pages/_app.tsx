import React from "react";
import { useEffect, useReducer } from "react";
import { AppProps } from "next/app";
import styled from "styled-components";
import "../styles/globals.css";
import "../styles/custom.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Validate } from "../lib/auth";
import {
  initialUserState,
  UserContextProvider,
  userReducer,
} from "../contexts/user";

const AppContainer = styled.div`
  background-color: #edc7b7;
`;

export default function App({ Component, pageProps }: AppProps) {
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);

  useEffect(() => {
    CheckLocalStorageForCredentials();
  }, []);

  const CheckLocalStorageForCredentials = () => {
    const fire_token = localStorage.getItem("fire_token");
    if (fire_token === null) {
      userDispatch({ type: "logout", payload: initialUserState });
    } else {
      return Validate(fire_token, (error, user) => {
        if (error) {
          userDispatch({ type: "logout", payload: initialUserState });
        } else if (user) {
          userDispatch({ type: "login", payload: { user, fire_token } });
        }
      });
    }
  };

  const userContextValues = {
    userState,
    userDispatch,
  };

  return (
    <UserContextProvider value={userContextValues}>
      <AppContainer>
        <Component {...pageProps} />
      </AppContainer>
    </UserContextProvider>
  );
}

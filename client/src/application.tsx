import React from "react";
// importing always from react-router-dom intead of react-router
import { Routes, Route } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import LoadingComponent from "./components/LoadingComponent";
import Test from "./components/Test";
import logging from "./config/logging";
import routes from "./config/routes";
import {
  initialUserState,
  UserContextProvider,
  userReducer,
} from "./contexts/user";
import { Validate } from "./modules/auth";

export interface IApplicationProps {}

const Application: React.FC<IApplicationProps> = (props) => {
  const [userState, userDispatch] = React.useReducer(
    userReducer,
    initialUserState
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [authStage, setAuthStage] = React.useState<string>(
    " Checking localstorage .."
  ); // Used for debugging

  React.useEffect(() => {
    setTimeout(() => {
      CheckLocalStorageForCredentials();
    }, 1000);
  }, []);

  const CheckLocalStorageForCredentials = () => {
    setAuthStage("Checking credentials");
    const fire_token = localStorage.getItem("fire_token");
    if (fire_token === null) {
      userDispatch({ type: "logout", payload: initialUserState });
      setAuthStage("No credentials found");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      return Validate(fire_token, (error, user) => {
        if (error) {
          logging.error(error);
          // setAuthStage(`User not found`);
          userDispatch({ type: "logout", payload: initialUserState });
          // setTimeout(() => {
          //   CheckLocalStorageForCredentials();
          // }, 1000);
        } else if (user) {
          // setAuthStage(`User authenticated`);
          userDispatch({ type: "login", payload: { user, fire_token } });
          setIsLoading(false);
          // setTimeout(() => {
          //   CheckLocalStorageForCredentials();
          // }, 1000);
        }
      });
    }
  };

  const userContextValues = {
    userState,
    userDispatch,
  };

  if (isLoading) {
    return <LoadingComponent>{authStage}</LoadingComponent>;
  }
  return (
    <UserContextProvider value={userContextValues}>
      <Routes>
        <Route
          path="/test"
          element={
            <AuthRoute>
              {" "}
              <Test />{" "}
            </AuthRoute>
          }
        />

        {routes.map((route, index) => {
          if (route.auth) {
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <AuthRoute>
                    <route.component />
                  </AuthRoute>
                }
              />
            );
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={<route.component />}
            />
          );
        })}
      </Routes>
    </UserContextProvider>
  );
};

export default Application;

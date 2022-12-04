import React from "react";
// importing always from react-router-dom intead of react-router
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import logging from "./config/logging";
import routes from "./config/routes";
import {
  initialUserState,
  UserContextProvider,
  userReducer,
} from "./contexts/user";
import { Validate } from "./modules/auth";

export interface IApplicationProps {}

const Application: React.FC<IApplicationProps> = (_props) => {
  const [userState, userDispatch] = React.useReducer(
    userReducer,
    initialUserState
  );

  React.useEffect(() => {
    CheckLocalStorageForCredentials();
  }, []);

  const CheckLocalStorageForCredentials = () => {
    const fire_token = localStorage.getItem("fire_token");
    if (fire_token === null) {
      userDispatch({ type: "logout", payload: initialUserState });
    } else {
      return Validate(fire_token, (error, user) => {
        if (error) {
          logging.error(error);
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
      <HashRouter>
        <Routes>
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </UserContextProvider>
  );
};

export default Application;

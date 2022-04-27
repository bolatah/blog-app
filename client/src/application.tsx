import React from "react";
// importing always from react-router-dom intead of react-router
import { Routes, Route } from "react-router-dom";
import AuthRoute from "./components/AuthRoute";
import LoadingComponent from "./components/LoadingComponent";
import routes from "./config/routes";
import {
  initialUserState,
  UserContextProvider,
  userReducer,
} from "./contexts/user";

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

  /**
   * Check localstorage for credentials
   * if we do, verify it with the backend,
   * if not, we are logged out initially
   */

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
      /**validate with the backend*/
      setAuthStage("Validating credentials");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
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
        {routes.map((route, index) => {
          if (route.auth) {
            <Route
              key={index}
              path={route.path}
              element={
                <AuthRoute>
                  <route.component />
                </AuthRoute>
              }
            />;
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

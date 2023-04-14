import React, { useContext } from "react";
import UserContext from "../contexts/user";
import LoginPage from "@/pages/login";

export interface IAuthRouteProps {
  children: React.ReactNode | Promise<boolean>;
}

const AuthRoute: React.FC<IAuthRouteProps> = (props) => {
  const { children } = props;
  const { user } = useContext(UserContext).userState;

  if (user._id === "") {
    return <LoginPage />;
  } else {
    return <>{children}</>;
  }
};

export default AuthRoute;

import React from "react";
import { useNavigate } from "react-router";
import UserContext from "../contexts/user";
import IPageProps from "../interfaces/page";
import firebase from "firebase";
import { Authenticate, SignInWithSocialMedia } from "../modules/auth";
import logging from "../config/logging";
import CenterPiece from "../components/CenterPiece";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import ErrorText from "../components/ErrorText";
import { Providers } from "../config/firebase";
import LoadingComponent from "../components/LoadingComponent";

const LoginPage: React.FC<IPageProps> = (props) => {
  const [authenticating, setAuthenticating] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");

  const userContext = React.useContext(UserContext);
  const navigate = useNavigate();
  const isLogin = window.location.pathname.includes("login");

  const SigninWithSocialMedia = (provider: firebase.auth.AuthProvider) => {
    if (error !== "") setError("");
    setAuthenticating(true);

    SignInWithSocialMedia(provider)
      .then(async (result) => {
        logging.info(result);
        let user = result.user;
        if (user) {
          let uid = user.uid;
          let name = user.displayName;
          if (name) {
            {
              try {
                let fire_token = await user.getIdToken();
                /**
                 * if we get a token, auth with the backend
                 */
                Authenticate(uid, name, fire_token, (error, _user) => {
                  if (error) {
                    setError(error);
                    setAuthenticating(false);
                  } else if (_user) {
                    userContext.userDispatch({
                      type: "login",
                      payload: { user: _user, fire_token },
                    });
                    navigate("/");
                  }
                });
              } catch (error) {
                setError("invalid");
                logging.error("error");
                setAuthenticating(false);
              }
            }
          } else {
            /**
             * if no name is returned, we could have a custom form
             * here getting the name from the user , depending on the provider
             * you are using . Google returns one, lets  just use that for now
             */
            setError("the identity provider does not have a username");
            setAuthenticating(false);
          }
        } else {
          setError("The identity provider is not invalid");
          setAuthenticating(false);
        }
      })
      .catch((error) => {
        setError(error.message);
        setAuthenticating(false);
      });
  };

  return (
    <CenterPiece>
      <Card>
        <CardHeader>{isLogin ? "Login" : "Signup"}</CardHeader>
        <CardBody>
          <ErrorText error={error} />
          <Button
            block
            disabled={authenticating}
            onClick={() => SigninWithSocialMedia(Providers.google)}
            style={{ backgroundColor: "#ea4335", borderColor: "#ea4335" }}
          >
            <i className="fab fa-google">
              {" "}
              Sign {isLogin ? "in" : "up"} with Google{" "}
            </i>
          </Button>
          {authenticating && <LoadingComponent card={false} />}
        </CardBody>
      </Card>
    </CenterPiece>
  );
};

export default LoginPage;

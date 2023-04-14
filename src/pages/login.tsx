import UserContext from "../contexts/user";
import { Authenticate, SignInWithSocialMedia } from "../lib/auth";
import logging from "../config/logging";
import CenterPiece from "../components/CenterPiece";
import { Button, Card, CardBody, CardHeader } from "reactstrap";
import ErrorText from "../components/ErrorText";
import { Provider } from "../config/firebaseClient";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
const LoginPage = () => {
  const router = useRouter();
  const [authenticating, setAuthenticating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const isLogin = router.asPath.includes("login");
  const userContext = useContext(UserContext);

  const SigninWithGoogle = (provider: typeof Provider) => {
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
                      payload: { user: _user, fire_token: fire_token },
                    });
                    router.push("/");
                  }
                });
              } catch (error) {
                setError("invalid");
                logging.error("error");
                setAuthenticating(false);
              }
            }
          } else {
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
      <Card style={{ backgroundColor: "#eee2dc", border: "none" }}>
        <CardHeader style={{ backgroundColor: "#eee2dc", border: "none" }}>
          {isLogin ? "Login" : "Signup"}
        </CardHeader>
        <CardBody>
          <ErrorText error={error} />
          <Button
            disabled={authenticating}
            onClick={() => SigninWithGoogle(Provider)}
            style={{
              backgroundColor: "#3a98db",
            }}
          >
            <i className="fab fa-google"></i> Sign {isLogin ? "in" : "up"} with
            Google
          </Button>
          {authenticating}
        </CardBody>
      </Card>
    </CenterPiece>
  );
};

export default LoginPage;

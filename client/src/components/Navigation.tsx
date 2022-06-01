import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Nav, Navbar, NavbarBrand } from "reactstrap";
import UserContext, { initialUserState } from "../contexts/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
// import SearchBar from "./Search";
export interface INavigationProps {}

const Navigation: React.FC<INavigationProps> = (props) => {
  const userContext = useContext(UserContext);
  const { user } = userContext.userState;

  const Logout = () => {
    userContext.userDispatch({ type: "logout", payload: initialUserState });
  };

  return (
    <Navbar sticky="top" expand="md">
      <NavbarBrand tag={Link} to="/">
        <FontAwesomeIcon
          className="fa-lg fa-flip"
          style={{ color: "#3a98db" }}
          icon={faPenToSquare}
        />
      </NavbarBrand>
      <Nav className="mr-auto" navbar />

      {user._id === "" ? (
        <div>
          <a href="/login" className="login">
            {" "}
            Login
          </a>

          <Button className="button-register" tag={Link} to="/register">
            Sign Up{" "}
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <Button className="button-post-a-blog" tag={Link} to="/edit">
            Post a Blog{" "}
          </Button>

          <Button className="button-logout" onClick={() => Logout()}>
            Logout
          </Button>
        </div>
      )}
    </Navbar>
  );
};

export default Navigation;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Nav, Navbar, NavbarBrand } from "reactstrap";
import UserContext, { initialUserState } from "../contexts/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../pages/search";
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
      <a href="/search" style={{ color: "#3a98db", marginRight: "0.5rem" }}>
        <FontAwesomeIcon
          className="fa-lg"
          style={{ color: "#3a98db", marginRight: "0.5rem" }}
          icon={faMagnifyingGlass}
        />{" "}
        Search
      </a>

      {user._id === "" ? (
        <div>
          <a href="/login" style={{ marginRight: "1rem", color: "black" }}>
            {" "}
            Login
          </a>

          <Button
            tag={Link}
            to="/register"
            style={{ backgroundColor: "#3a98db" }}
          >
            {" "}
            Sign Up{" "}
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <Button
            tag={Link}
            to="/edit"
            style={{
              marginRight: "1rem",
              color: "white",
              backgroundColor: "#3a98db",
            }}
          >
            Post a Blog{" "}
          </Button>

          <Button
            onClick={() => Logout()}
            style={{ backgroundColor: "#e84c3c" }}
          >
            Logout
          </Button>
        </div>
      )}
    </Navbar>
  );
};

export default Navigation;

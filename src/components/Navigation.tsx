import { useContext } from "react";
import Link from "next/link";
import { Button, Nav, Navbar } from "reactstrap";
import UserContext, { initialUserState } from "../contexts/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/custom.module.css";
import styled from "styled-components";

export interface INavigationProps {}

const ButtonLogout = styled.button`
  margin-right: 1rem;
  border-radius: 10%;
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

const Navigation: React.FC<INavigationProps> = (_props) => {
  const userContext = useContext(UserContext);
  const { user } = userContext.userState;

  const Logout = () => {
    userContext.userDispatch({ type: "logout", payload: initialUserState });
  };

  return (
    <Navbar sticky="top" expand="md">
      <Link href="/">
        <FontAwesomeIcon
          className="fa-lg fa-flip"
          style={{ color: "#3a98db" }}
          icon={faPenToSquare}
        />
      </Link>
      <Nav className="mr-auto" navbar />

      {user._id === "" ? (
        <div>
          <Link href="/login" legacyBehavior>
            <a className={styles.buttonLogin}>Login</a>
          </Link>
          <Link href="/login">
            <Button className={styles.buttonRegister}>Sign Up</Button>
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex" }}>
          <Link href="/blogs/create">
            <Button className={styles.buttonPost}>Post a Blog</Button>
          </Link>

          <ButtonLogout onClick={() => Logout()}>Logout</ButtonLogout>
        </div>
      )}
    </Navbar>
  );
};

export default Navigation;

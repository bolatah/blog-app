import { Link } from "react-router-dom";
import { Container, Nav, Navbar, NavbarBrand } from "reactstrap";

export interface INavigationProps {}

const Navigation: React.FC<INavigationProps> = (props) => {
  return (
    <Navbar color="light" sticky="top" expand="md">
      <Container>
        <NavbarBrand tag={Link} to="/">
          🗒️
        </NavbarBrand>
        <Nav className="mr-auto" navbar />
      </Container>
    </Navbar>
  );
};

export default Navigation;

import React from "react";
import { Container } from "reactstrap";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import IPageProps from "../interfaces/page";

const HomePage: React.FC<IPageProps> = (props) => {
  return (
    <Container>
      <Navigation />
      <Header title="A blog of mine" headline="Let`s start to journey" />
      <Container className="mt-5">Blog stuff here</Container>
    </Container>
  );
};

export default HomePage;

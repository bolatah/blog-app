import React from "react";
import { Container } from "reactstrap";

export interface ICenterPieceProps {
  children: React.ReactNode;
}

const CenterPiece: React.FC<ICenterPieceProps> = (props) => {
  const { children } = props;
  return (
    <Container
      style={{
        fontSize: "1.5rem",
        position: "absolute",
        textAlign: "center",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        WebkitTransform: "translate(-50%, -50%)",
        backgroundColor: "#eee2dc",
      }}
    >
      {children}
    </Container>
  );
};
export default CenterPiece;

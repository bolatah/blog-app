import React, { CSSProperties } from "react";
import { Card, CardBody } from "reactstrap";
import CenterPiece from "./CenterPiece";

const stageStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  padding: "2rem ",
  margin: "0 -5%",
  overflow: "hidden",
  backgroundColor: "#eee2dc",
};

export interface ILoadingProps {
  dotType?: string;
  children?: React.ReactNode;
  stageStyle?: typeof stageStyle;
}

export const Loading: React.FC<ILoadingProps> = (props) => {
  const { children, dotType, stageStyle } = props;
  return (
    <div style={stageStyle}>
      <div className={dotType} />
      {children}
    </div>
  );
};

Loading.defaultProps = {
  dotType: "dot-bricks",
};

export interface ILoadingComponentProps {
  card?: boolean;
  dotType?: string;
  children?: React.ReactNode;
  stageStyle?: object;
}

const LoadingComponent: React.FC<ILoadingComponentProps> = (props) => {
  const { card, children, dotType, stageStyle } = props;
  if (card) {
    return (
      <CenterPiece>
        <Card>
          <CardBody style={{ backgroundColor: "#eee2dc" }}>
            <Loading dotType={dotType}>{children}</Loading>
          </CardBody>
        </Card>
      </CenterPiece>
    );
  }
  return (
    <div>
      <div style={stageStyle}>
        <div className={dotType} />
      </div>
      {children}
    </div>
  );
};

LoadingComponent.defaultProps = {
  card: true,
  dotType: "dot-bricks",
};

export default LoadingComponent;

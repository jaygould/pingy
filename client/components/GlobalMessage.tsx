import { FC } from "react";
import * as ReactDOM from "react-dom";
import Button, { ButtonTypeEnum } from "./Button";
import { TMerge, IMessage, IModalControls } from "../types/index";

import styled from "styled-components";

// TODO: make globalMessage a generic type so string or string[] can be used

const Portal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0.5em;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  & > span {
    color: white;
    margin-right: 1em;
  }
`;

const GlobalMessage: FC<TMerge<IMessage, IModalControls>> = ({
  text,
  onClose,
  isOpen,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Portal>
      <span>{text}</span>
      <Button
        type={ButtonTypeEnum.onClick}
        onClick={() => onClose()}
        text={"x"}
        size={"small"}
      ></Button>
    </Portal>,
    document.body
  );
};

export default GlobalMessage;

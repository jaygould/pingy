import React, { FunctionComponent } from "react";
import Link from "next/link";

import styled, { css } from "styled-components";
import THEME from "../styles/theming";

const baseButtonStyles = css`
  display: inline-block;
  padding: ${(props) => (props.size === "large" ? "1em 2em" : "0.1em 0.5em")};
  border: 0;
  font-size: ${THEME.FONT_SIZE.sm};
  color: white;
  border-radius: 0.25em;
  background-color: ${(props) => props.color};
  text-align: center;
  text-decoration: none;
  cursor: pointer;
`;
const ButtonAnchor = styled.a`
  ${baseButtonStyles}
`;
const ButtonInput = styled.input`
  ${baseButtonStyles}
`;
const ButtonButton = styled.button`
  ${baseButtonStyles}
`;

enum ButtonTypeEnum {
  href = "href",
  submit = "submit",
  onClick = "onClick",
}
type ButtonSizes = "small" | "large";

interface IProps {
  text: string;
  type?: ButtonTypeEnum;
  link?: string;
  onClick?: () => void;
  color?: string;
  size?: ButtonSizes;
}

const Button: FunctionComponent<IProps> = ({
  text,
  link,
  type = "href",
  onClick,
  color = THEME.COLORS.primary,
  size = "large",
}) => {
  return type === "href" ? (
    <Link href={link}>
      <ButtonAnchor size={size} color={color}>
        {text}
      </ButtonAnchor>
    </Link>
  ) : type === "submit" ? (
    <ButtonInput size={size} color={color} type="submit" value={text} />
  ) : type === "onClick" ? (
    <ButtonButton size={size} color={color} onClick={() => onClick()}>
      {text}
    </ButtonButton>
  ) : null;
};

export default Button;
export { ButtonTypeEnum };

import { FC } from "react";
import styled from "styled-components";
import THEME from "../styles/theming";
import Link from "next/link";

const FooterInner = styled.footer`
  width: 100%;
  margin-top: 2em;
  background: ${THEME.COLORS.offWhite};
  & > div {
    padding-top: 2em;
    padding-bottom: 2em;
  }
  & div > div {
    display: flex;
    justify-items: center;
    gap: 0.5em;
  }
`;

interface IProps {}

const Footer: FC<IProps> = ({}) => {
  return (
    <FooterInner>
      <div className="container">
        <div>
          <Link href="https://jaygould.co.uk/">
            <a>By Jay Gould</a>
          </Link>
          <Link href="https://github.com/jaygould/">
            <a>GitHub</a>
          </Link>
        </div>
      </div>
    </FooterInner>
  );
};

export default Footer;

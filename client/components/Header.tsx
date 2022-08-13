import { FC } from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import THEME from "../styles/theming";
import Button, { ButtonTypeEnum } from "../components/Button";

const HeaderInner = styled.header`
  padding-top: 1em;
  padding-bottom: 1em;
  & > div {
    ${(props) =>
      props.isLoggedIn
        ? `
      display: flex;
      justify-content: flex-end;  
      `
        : null}
  }
  h1 {
    display: block;
    text-align: center;
    font-size: ${THEME.FONT_SIZE.base};
  }
  span {
    display: block;
    text-align: center;
    font-size: ${THEME.FONT_SIZE["6xl"]};
    color: ${THEME.COLORS.secondary};
    font-family: ${THEME.FONT.heading};
    -webkit-text-stroke: 2px ${THEME.COLORS.secondaryDarker};
  }
`;

interface IProps {
  isLoggedIn?: boolean;
}

const Header: FC<IProps> = ({ isLoggedIn }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["jwt"]);
  const router = useRouter();

  return (
    <HeaderInner isLoggedIn={isLoggedIn}>
      <div className="container">
        {!isLoggedIn ? (
          <>
            <span>Pingy</span>
            <h1>Monitor web pages for changes - get alerts in seconds</h1>
          </>
        ) : (
          <>
            <Button
              text="Log out"
              type={ButtonTypeEnum.onClick}
              onClick={() => {
                removeCookie("jwt");
                router.push("/");
              }}
            />
          </>
        )}
      </div>
    </HeaderInner>
  );
};

export default Header;

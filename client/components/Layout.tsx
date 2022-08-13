import { FC } from "react";
import styled from "styled-components";
import THEME from "../styles/theming";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";
import { useRouter } from "next/router";

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`;

const LayoutBody = styled.section`
  > div {
    @media only screen and (min-width: 768px) {
      flex-direction: row;
    }
    display: flex;
    flex-direction: column;
    min-height: 20em;
    padding-top: 2em;
  }
`;

const LoggedInNav = styled.nav`
  background-color: ${THEME.COLORS.secondary};
  border-radius: 1.5em;
  padding: 1.25em 0em;
  margin-bottom: 2em;
  @media only screen and (min-width: 768px) {
    margin-right: 2em;
    margin-bottom: 0em;
  }
  h2 {
    font-family: ${THEME.FONT.heading};
    color: white;
    font-size: ${THEME.FONT_SIZE["3xl"]};
    margin-bottom: 0.5em;
    padding: 0 1.1em;
    text-align: center;
    @media only screen and (min-width: 768px) {
      margin-bottom: 2em;
      font-size: ${THEME.FONT_SIZE.xl};
    }
  }
  .nav-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1em;
    padding: 0 2em;
    @media only screen and (min-width: 768px) {
      flex-direction: column;
      padding: 0;
    }
    > div {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding: 0.4em 0;
    }
    @media only screen and (min-width: 768px) {
      .current-page {
        position: absolute;
        left: 0em;
        top: 0;
        bottom: 0;
        width: 0.4em;
        background-color: ${THEME.COLORS.secondaryDark};
        border-radius: 0 0.3em 0.3em 0;
      }
    }
    img {
      width: 2em;
      @media only screen and (min-width: 768px) {
        width: 3em;
      }
    }
  }
`;

const Main = styled.main`
  margin-bottom: auto;
`;

const navItems = [
  {
    slug: "/dashboard",
    iconUrl: "/home-icon.svg",
  },
  {
    slug: "/dashboard/crawler",
    iconUrl: "/new-icon.svg",
  },
  {
    slug: "/dashboard/list-crawler",
    iconUrl: "/list-icon.svg",
  },
  {
    slug: "/dashboard/users",
    iconUrl: "/user-icon.svg",
  },
];

interface IProps {
  children: JSX.Element;
  isLoggedIn?: boolean;
}

const Layout: FC<IProps> = ({ children, isLoggedIn = false }) => {
  const router = useRouter();

  return (
    <LayoutWrapper>
      <div>
        <Header isLoggedIn={isLoggedIn}></Header>
        <LayoutBody>
          <div className="container">
            {isLoggedIn ? (
              <LoggedInNav>
                <h2>Pingy</h2>
                <div className="nav-items">
                  {navItems &&
                    navItems.map((navItem) => {
                      return (
                        <div>
                          {navItem.slug === router.pathname ? (
                            <div className="current-page"></div>
                          ) : null}
                          <Link href={navItem.slug}>
                            <a>
                              <img src={navItem.iconUrl} />
                            </a>
                          </Link>
                        </div>
                      );
                    })}
                </div>
              </LoggedInNav>
            ) : null}

            <Main>{children}</Main>
          </div>
        </LayoutBody>
      </div>
      <Footer></Footer>
    </LayoutWrapper>
  );
};

export default Layout;

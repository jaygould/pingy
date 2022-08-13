import { CookiesProvider } from "react-cookie";
import type { AppProps } from "next/app";

import "../styles/global.css";
import { GlobalStyles } from "../styles/theming";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CookiesProvider>
      <GlobalStyles> </GlobalStyles>
      <Component {...pageProps} />
    </CookiesProvider>
  );
}

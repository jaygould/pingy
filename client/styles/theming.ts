import { createGlobalStyle } from "styled-components";

const THEME = {
  COLORS: {
    primary: "#FECD45",
    secondary: "#D463FD",
    secondaryDark: "#8635a3",
    secondaryDarker: "#4a213f",
    dark: "#444444",
    darker: "#222222",
    offWhite: "#f9f9f9",
    green: "#2d9b5e",
  },
  FONT_SIZE: {
    xs: ".75rem",
    sm: ".875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
    "6xl": "4rem",
    "7xl": "5rem",
  },
  FONT: {
    heading: "'Oleo Script Swash Caps', cursive",
    body: "'Ubuntu', sans-serif",
  },
};

const GlobalStyles = createGlobalStyle`
html,
body {
  padding: 0;
  margin: 0;
}
body {
  font-family: ${THEME.FONT.body};
  color: ${THEME.COLORS.darker};
}
a {
  text-decoration: underline;
}
h1 {
  font-size: ${THEME.FONT_SIZE["3xl"]};
  @media only screen and (min-width: 768px) {
    font-size: ${THEME.FONT_SIZE["5xl"]};
  }
  margin-bottom: 0.6em;
}
h2 {
  font-size: ${THEME.FONT_SIZE["3xl"]};
  @media only screen and (min-width: 768px) {
    font-size: ${THEME.FONT_SIZE["4xl"]};
  }
  margin-bottom: 0.5em;

}
h3 {
  font-size: ${THEME.FONT_SIZE["xl"]};
}
input {
  display: block;
  border: 1px solid #cfcfcf;
  padding: 0.8em 1em;
  margin-bottom: 0.8em;
  border-radius: 8px;
}
.container {
  padding: 0 1em;
  max-width: none;
}
`;

export default THEME;
export { GlobalStyles };

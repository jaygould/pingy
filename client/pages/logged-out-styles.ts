import styled from "styled-components";

const FormWrap = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 2em;
  @media only screen and (min-width: 768px) {
    flex-direction: row;
    gap: 0;
  }
  form {
    flex: 0.4;
    display: flex;
    justify-content: center;
    > div {
    }
  }
  .landing-image {
    flex: 0.6;
    display: flex;
    justify-content: center;
    img {
      width: 80%;
    }
  }
`;

const Form = styled.form`
  margin-bottom: 2em;
  .button-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
`;

export { FormWrap, Form };

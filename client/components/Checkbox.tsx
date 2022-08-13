import React, { FunctionComponent } from "react";

import styled, { css } from "styled-components";

interface IProps {
  text: string;
  _key: string;
  group: string;
  register: any;
}

const CheckboxWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
  input {
    margin: 0;
  }
`;

const Checkbox: FunctionComponent<IProps> = ({
  text,
  _key,
  group,
  register,
}) => {
  console.log(text, _key, group);
  return (
    <CheckboxWrap>
      <input
        key={_key}
        name={`${group}-${_key}`}
        type="checkbox"
        value={_key}
        {...register(group)}
      />

      <label>{text}</label>
    </CheckboxWrap>
  );
};

export default Checkbox;

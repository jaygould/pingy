import THEME from "../styles/theming";
import styled from "styled-components";

interface IProps<T, U> {
  title: U;
  renderTitle: (title: U) => React.ReactNode;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

const AccordionWrap = styled.div`
  margin-bottom: 2em;
  h4 {
    background-color: ${THEME.COLORS.secondaryDark};
    padding: 0.4em 0.6em;
    border-radius: 0.75em;
    font-size: ${THEME.FONT_SIZE["xl"]};
    color: white;
    margin-bottom: 1em;
  }
`;

const Accordion = <T, U>({
  title,
  renderTitle,
  items,
  renderItem,
}: IProps<T, U>) => {
  return (
    <AccordionWrap>
      <h4>{renderTitle(title)}</h4>
      {items.length ? (
        <ul>
          {items.map((item) => {
            return <li>{renderItem(item)}</li>;
          })}
        </ul>
      ) : (
        <p>There are no matching items.</p>
      )}
    </AccordionWrap>
  );
};

export default Accordion;

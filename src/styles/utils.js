import styled, { keyframes, css } from "styled-components";

const rotate = keyframes`

  from{
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

`;

export const SubmitBtn = styled.button.attrs((props) => ({
  type: "submit",
  disabled: props.loading,
}))`
  background: #f6931c;
  border: 0;
  padding: 0 15px;
  margin-left: 10px;
  border-radius: 4px;

  display: flex;
  justify-content: center;
  align-items: center;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }

  ${(props) =>
    props.loading &&
    css`
      svg {
        animation: ${rotate} 2s linear infinite;
      }
    `}
`;

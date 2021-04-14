import styled from "styled-components";

import "./styles/App.scss";
export const Wrapper = styled.div`
  *:focus {
    outline: 0;
  }
  body,
  input,
  button,
  select {
    font-family: "Roboto", sans-serif;
  }
  a {
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
  }
  ul {
    list-style: none;
  }
  button {
    cursor: pointer;
    outline: 0;
  }
  .btn-light {
    color: #1c1d21 !important;
  }
  .active {
    color: #333;
    text-decoration: none;
    background-color: transparent;
  }
  .image-zoom:hover {
    cursor: zoom-in !important;
  }
`;

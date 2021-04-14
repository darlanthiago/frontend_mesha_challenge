import styled from "styled-components";

import { darken } from "polished";

export const Wrapper = styled.main`
  height: 100%;
  background: linear-gradient(-90deg, #c62127, #3399cc);
  display: flex;
  justify-content: center;
  align-items: center;
  *:focus {
    outline: 0;
  }
`;

export const Content = styled.div`
  background: #fff;
  width: 100%;
  max-width: 365px;
  height: auto;
  max-height: 550px;
  text-align: center;
  padding: 20px 30px;
  border-radius: 4px;
  opacity: 0.99;

  form {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 100%;

    input {
      background: rgba(0, 0, 0, 0.12);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #6c757d;
      margin: 0 0 10px;

      &::placeholder {
        color: rgba(108, 117, 125, 0.7);
      }
    }

    button {
      margin: 5px 0 0;
      height: 44px;
      background: #c62127;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.03, "#c62127")};
      }
    }

    a {
      color: #c62127;
      margin-top: 15px;
      font-size: 16px;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }

    span {
      color: #f72343;
      font-size: 11px;
      align-self: flex-start;
      margin: 0 0 5px;
    }

    small {
      color: #6c757d;
      font-size: 12px;
      margin-top: 25px;
      margin-bottom: 15px;
      vertical-align: baseline;

      img {
        height: 20px;
      }
    }
  }
`;

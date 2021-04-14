import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
    }
    *:focus {
        outline: 0;
    }
    html, body, #root{
        height: 100%;
    }
    body{
        -webkit-font-smoothing: antialiased;
    }
    body, input, button {
        font-family: 'Roboto', sans-serif;        
        font-size: 14px;
        font-weight: 500;
        font-style: normal;
        outline: 0;
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
`;

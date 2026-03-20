import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  :root {
    --color-primary: #fbbc04; /* Amarelo do Keep */
    --color-background: #ffffff;
    --color-sidebar-hover: #f1f3f4;
    --color-text: #202124;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: var(--color-background);
    color: var(--color-text);
    font-family: 'Roboto', 'Montserrat', sans-serif;
  }
`;
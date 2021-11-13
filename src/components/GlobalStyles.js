import { createGlobalStyle } from 'styled-components';
import {reset} from 'styled-reset'
const GlobalStyles = createGlobalStyle`
 ${reset}
:root {
  --layoutBg: #403f53;
  --borderRadius: 5px;
  --colorRed: hsl(340deg 100% 47%);
  --inOutHeight: 400px;
  --departmentColor: #5677a1;
  --userColor: #f28e2c;
  --white: #ffffff;
  --reach-dialog: 1;
  --reach-menu-button: 1;
  --length1: 3.25px;
  --length2: 6.5px;
  --length3: 13px;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  font-family: 'Fira Code', sans-serif;

}
body, h1, h2, h3, h4, h5, h6, p, figure, blockquote, ul, ol, dl, dt, dd {
  margin: 0;
}

html {
  box-sizing: border-box;
  scroll-behavior: smooth;
  font-size: 1.125rem;
  height: 100%;
}

body {
    -webkit-font-smoothing: antialiased;
    font-family: Fira Code;
    height: 100%;
    line-height: 1.4;
    background-color: var(--layoutBg);
    color: hsl(0deg 0% 95%);
  }

  img,
picture {
  max-width: 100%;
  display: block;
}
input, button, textarea, select {
  font: inherit;
}
  #___gatsby {
      isolation:isolate;
      height: 100%;
  }
  #gatsby-focus-wrapper {
      height: 100%;
  }

  table {
  max-width: initial;
  min-height: 33px;
  margin: 0;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
  font-size: 0.75rem;
  font-weight: 200;
}

thead th span {
  display: inline-block;
  width: 0.5em;
  margin-left: -0.5em;
}
tbody {

}
td,
th {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  padding: 3px 6.5px 3px 0;
}
tr > :not(:first-of-type) {
  padding-left: var(--length2);
}
tr > :last-of-type {
  padding-right: var(--length3);
}
tr > :first-of-type {
  text-overflow: unset;
  width: 19px;
}
tr > :first-of-type input {
  opacity: 0;
  margin: 0 3px 1px 4px;
}
tr :not(:last-of-type) {
    border-bottom: solid 1px #eee;
}
tr:hover > :first-of-type input:enabled,
tr > :first-of-type input:focus,
tr > :first-of-type input:checked,
tr > :first-of-type input[type=checkbox]:indeterminate {
  opacity: inherit;
}
thead tr {
  border-bottom: none;
}
thead th {
  position: sticky;
  top: 0;
  background: white;
  cursor: ns-resize;
  box-shadow: 0 1px 0 #ccc;
  font-weight: 600;
}
tbody tr:first-child td {
  padding-top: 4px;
}

`;
export default GlobalStyles;
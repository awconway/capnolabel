import React from "react";
import styled, { css } from "styled-components";


const SIZES = {
  small: {
    "--borderRadius": 2 + "px",
    "--fontSize": 16 / 16 + "rem",
    "--padding": "4px 12px"
  },
  medium: {
    "--borderRadius": 2 + "px",
    "--fontSize": 18 / 16 + "rem",
    "--padding": "12px 20px"
  },
  large: {
    "--borderRadius": 4 + "px",
    "--fontSize": 21 / 16 + "rem",
    "--padding": "16px 32px"
  }
}

const Button = ({ variant, size, children, onClick, name, disabled, key }) => {
  const styles = SIZES[size];

  let Component;
  if (variant === "fill") {
    Component = FillButton;
  } else if (variant === "outline") {
    Component = OutlineButton;
  } else if (variant === "delete") {
    Component = DeleteButton;
  } else {
    throw new Error(`Unrecognized Button variant: ${variant}`)
  }

  return <Component
    onClick={onClick}
    style={styles}
    name={name}
    disabled={disabled}
    key={key}
  >
    {children}
  </Component>
}

const ButtonBase = styled.button`
    font-size: var(--fontSize);
    padding: var(--padding);
    border-radius: var(--borderRadius);
    border: 2px solid transparent;
    outline-color: var(--layoutBg);
    cursor: pointer;
        &:focus {
          outline-offset: 4px;
        }
        ${props =>
    props.disabled ?
      css`
          opacity: 0.4;
          `: css`
          opacity: 1;
          `}
`

const FillButton = styled(ButtonBase)`
    color: var(--layoutBg);
    background-color: white;
`

const OutlineButton = styled(ButtonBase)`
    background-color: white;
    color: var(--layoutBg);
    border: 2px solid currentColor;
`
const DeleteButton = styled(ButtonBase)`
    color: white;
    background-color: hsl(355deg 64% 48%);
`


export default Button;

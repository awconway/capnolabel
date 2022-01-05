import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import styled from "styled-components"
import SignInIcon from "../images/svg/sign-in-alt.svg"
import TagsIcon from "../images/svg/tags.svg"
const HeaderWrapper = styled.header`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid rgba(51, 51, 51, 0.05);
`
const Icon = styled(SignInIcon)`
    pointer-events: none;
    width:30px;
    height: 30px;
    display: block;
    fill: var(--white);
`
const Bell = styled(TagsIcon)`
    pointer-events: none;
    width:1.5rem;
    height: 1.5rem;
    display: block;
    grid-column: 1;
    fill: var(--white);
`

const Button = styled.button`
  padding: 12px;
  background-color: rgba(51, 51, 51, 0.05);
  border-radius: 8px;
  border-width: 0;
  cursor: pointer;
  margin-left: auto;
`

const HeaderTitleWrapper = styled.div`
display: grid;
grid-template-columns: 2;
justify-content: center;
align-items: center;
grid-gap: 20px;
`

const HeaderTitle = styled.h1`
font-size: 1.3rem;
font-weight: 500;
grid-column: 2;

`

export default function Header () {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()

  return (
    <HeaderWrapper>
      <HeaderTitleWrapper>
      <Bell />
        <HeaderTitle>Capnography waveform labelling</HeaderTitle>
        </HeaderTitleWrapper>
        {isAuthenticated ? (
          <Button
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            <Icon/>
          </Button>
        ) : (
          <Button
            onClick={() => loginWithRedirect()}
          >                   
          <Icon />
          </Button>
        )}
    </HeaderWrapper>
  )
}


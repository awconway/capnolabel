import React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import App from "../components/app";
import Error from '../components/Error';
import Loading from "../components/Loading";
import Layout from "../components/Layout"
import styled from "styled-components";
import { gapSize } from "../components/Base"
import SignInIcon from "../images/svg/sign-in-alt.svg"
import { isIE } from "react-device-detect";
import { useWindowSize } from "@reach/window-size";


const MainIndex = styled.main`
    display: grid;
    grid-template-columns: 1fr min(60ch, calc(100% - ${gapSize.large})) 1fr;
    grid-gap: ${gapSize.small} ${gapSize.medium};  
`

const Main = styled.main`
//provides nice gap between sections rather than using padding
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: ${gapSize.medium};

`
const P = styled.p`
    grid-column: 2;
    font-weight: 300;
`

const Bold = styled.strong`
        font-weight: 600;
`

const Icon = styled(SignInIcon)`
    pointer-events: none;
    width:40px;
    height: 40px;
    display: inline;
    grid-column: 1;
    fill: var(--layoutBg);
`
const ButtonText = styled.span`
    grid-column: 2;
    font-size: 1.25rem;
`
const Button = styled.button`
    //layout in page
    grid-column: 2;
    justify-self: center;
    // layout of button
    display: grid;
    grid-template-columns: 2;
    justify-content: center;
    align-items: center;
    grid-gap: 10px;
    //styling of button
    padding: 5px 10px;
    background-color: var(--white);
    color: var(--layoutBg);
    border-radius: 8px;
    border-width: 0;
    max-width: fit-content;
    font-size: 0.8rem;
    cursor: pointer;
`

const InternetExplorerWarning = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`

export default function Home() {
  const { isLoading, error, user, loginWithRedirect } = useAuth0()
  const { width } = useWindowSize();

  if (isLoading) {
    return (
      <Layout>
        <MainIndex>
          <Loading width={width} height={400}/>
        </MainIndex>
      </Layout>
    )
  }

  if (isIE) return (

    <InternetExplorerWarning>
      Sorry...the Internet Explorer browser is not supported. Please use Chrome/Microsoft Edge/Firefox
    </InternetExplorerWarning>

  )


  return (
    <Layout>
      {error && <Error />}
      {!isLoading && !user ? (
        <MainIndex>

          <P>
            Please <Bold>Login</Bold>. You will be asked to
            'sign up' if this is your first time accessing the webpage.
            Please remember to use the email address you provided to the
            research team.
          </P>
          <Button
            onClick={() => loginWithRedirect()}
          >
            <Icon />
            <ButtonText>Login</ButtonText>
          </Button>


        </MainIndex>
      ) : (

        <Main>
          <App />
        </Main>
      )}
    </Layout>
  )
}



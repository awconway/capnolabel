import React from 'react';
import styled from "styled-components"
import {gapSize} from "../components/Base"
import TimesCircle from "../images/svg/times-circle.svg"
const Main = styled.main`
    display: grid;
    grid-template-columns: 1fr min(60ch, calc(100% - ${gapSize.large})) 1fr;
    grid-gap: ${gapSize.small} ${gapSize.medium};  
`

const P = styled.p`
    grid-column: 2;
`

const WarningBox = styled.div`
    grid-column: 2;
    display: grid;
    grid-template-columns: 1fr 19fr;
    grid-gap: 10px;
    background-color: #FFD2D2;
    color:  #D8000C;
    padding: 5px 10px;
    font-size: 0.8rem;
    font-family: 'Work Sans', sans-serif;
    border-radius: 8px;
`

const WarningIcon = styled(TimesCircle)`
    grid-column: 1;
    height: 0.8rem;
    justify-self: center;
    align-self: center;
    fill:  #D8000C;
`


export default function Error() {
  return (
    <Main>
      <WarningBox>
        <WarningIcon />
      <P>
      Please verify your account by clicking the link we have just emailed you and then press login again.
      </P>
      </WarningBox>
    </Main>
  );
}
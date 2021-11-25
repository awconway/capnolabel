import React from "react"
import Header from "./Header"
import styled from "styled-components"
import GlobalStyles from "./GlobalStyles"
import { gapSize } from "./Base"

import AuthorizedApolloProvider from "./AuthorizedApolloProvider"

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    //provides separation between footer/header and main
    gap: ${gapSize.small};
`


export default function Layout({ children }) {
  return (
    <Wrapper>
      <GlobalStyles />
      <Header />
      <AuthorizedApolloProvider>
        {children}
      </AuthorizedApolloProvider>
    </Wrapper>
  )
}
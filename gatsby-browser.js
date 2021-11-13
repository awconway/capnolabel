import * as React from "react"
import { navigate } from "gatsby"
import { Auth0Provider } from "@auth0/auth0-react"


const onRedirectCallback = appState => navigate(appState?.returnTo || "/")

export const wrapRootElement = ({ element }) => {

  return (
    <Auth0Provider
      domain={process.env.GATSBY_AUTH0_DOMAIN}
      clientId={process.env.GATSBY_AUTH0_CLIENT_ID}
      onRedirectCallback={onRedirectCallback}
      redirectUri={window.location.origin}
      audience={process.env.GATSBY_AUTH0_AUDIENCE}
    >
        {element}
    </Auth0Provider>

  )
}
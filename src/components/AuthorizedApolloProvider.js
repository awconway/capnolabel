import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/link-context';
import React from 'react';
import { ApolloLink } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { useAuth0 } from "@auth0/auth0-react"
//https://nextsteps.dev/apollo-client-graphQL-and-auth

const AuthorizedApolloProvider = ({ children }) => {
    const { getAccessTokenSilently } = useAuth0();
	const authMiddleware = setContext(async (_, { headers, ...context }) => {
		const token = await getAccessTokenSilently();
		if (typeof Storage !== 'undefined') {
			localStorage.setItem('token', token);
		}

		return {
			headers: {
				...headers,
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			...context,
		};
	});


	const fetcher = (...args) => {
		return window.fetch(...args);
	};

	const client = new ApolloClient({
		link: ApolloLink.from([
			authMiddleware,
			new RetryLink(),
			new BatchHttpLink({
				uri: `${process.env.GATSBY_HASURA_ENDPOINT}`,
				fetch: fetcher,
			}),
		]),
		cache: new InMemoryCache(),
	});

	return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AuthorizedApolloProvider;
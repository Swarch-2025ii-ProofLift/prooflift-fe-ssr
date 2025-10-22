import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/client-integration-nextjs";
import { cookies } from "next/headers";

export const { getClient, query } = registerApolloClient(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value || "";


  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.GRAPHQL_API_URL || "http://localhost:8083/graphql",
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
      fetchOptions: {
        cache: "no-store",
      },
    }),
  });
});

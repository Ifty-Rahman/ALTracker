import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import "./css/App.css";
import Discover from "./pages/discover";
import UserList from "./pages/Userlist";
import Login from "./pages/login";
import { Routes, Route } from "react-router-dom";

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("anilist_token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(new HttpLink({ uri: "https://graphql.anilist.co" })),
  cache: new InMemoryCache(),
});

export default function App() {
  return (
    <main className="app">
      <ApolloProvider client={client}>
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/Userlist" element={<UserList />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ApolloProvider>
    </main>
  );
}

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import "./css/App.css";
import Discover from "./pages/discover";
import UserList from "./pages/Userlist";
import Login from "./pages/login";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProfilePage from "./pages/profile";

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
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          Page: {
            keyArgs: false,
            merge(existing = {}, incoming) {
              return { ...existing, ...incoming };
            },
          },
          Viewer: {
            merge: true,
          },
        },
      },
      User: {
        keyFields: ["id"],
      },
    },
  }),
});

export default function App() {
  return (
    <main className="app">
      <ApolloProvider client={client}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Discover />} />
          <Route path="/Userlist" element={<UserList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </ApolloProvider>
    </main>
  );
}

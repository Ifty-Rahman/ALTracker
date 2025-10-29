import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/App.css";
import Discover from "./pages/Discover";
import UserList from "./pages/Userlist";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProfilePage from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import DarkVeil from "./components/DarkVeil";
import Footer from "./components/Footer";

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
    <>
      <main className="app">
        <DarkVeil />
        <ApolloProvider client={client}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/Userlist" element={<UserList />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
        </ApolloProvider>
        <Footer />
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { setContext } from "@apollo/client/link/context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./css/App.css";
import Discover from "./pages/Discover";
import UserList from "./pages/Userlist";
import Login from "./pages/Login";
import Browse from "./pages/Browse";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProfilePage from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import DarkVeil from "./components/DarkVeil";
import Footer from "./components/Footer";
import Dock from "./components/Dock";
import {
  MdDashboard,
  MdExplore,
  MdList,
  MdPerson,
  MdLogin,
} from "react-icons/md";

const clientId = 31288;
const loginUrl = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;
const token = localStorage.getItem("anilist_token");
const authLink = setContext((_, { headers }) => {
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

function DockWrapper() {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("anilist_token"),
  );

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      setAuthToken(localStorage.getItem("anilist_token"));
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);
  const navigate = useNavigate();

  const dockItems = [
    {
      label: "Dashboard",
      icon: <MdDashboard size={28} />,
      onClick: () => navigate("/Dashboard"),
      className: "dock-item-dashboard",
    },
    {
      label: "Discover",
      icon: <MdExplore size={28} />,
      onClick: () => navigate("/"),
      className: "dock-item-discover",
    },
    {
      label: "Lists",
      icon: <MdList size={28} />,
      onClick: () => navigate("/Userlist"),
      className: "dock-item-lists",
    },
    authToken
      ? {
          label: "Profile",
          icon: <MdPerson size={28} />,
          onClick: () => navigate("/Profile"),
          className: "dock-item-profile",
        }
      : {
          label: "Login with AniList",
          icon: <MdLogin size={28} />,
          onClick: () => (window.location.href = loginUrl),
          className: "dock-item-login",
        },
  ];

  return (
    <Dock
      items={dockItems}
      magnification={isMobile ? 0 : 70}
      distance={isMobile ? 0 : 200}
      panelHeight={50}
      dockHeight={256}
      baseItemSize={50}
      spring={
        isMobile
          ? { mass: 1, stiffness: 1000, damping: 1000 }
          : { mass: 0.0000000001, stiffness: 1000, damping: 5 }
      }
    />
  );
}

export default function App() {
  return (
    <>
      <main className="app">
        <DarkVeil />
        <ApolloProvider client={client}>
          <NavBar />
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/Browse" element={<Browse />} />
            <Route path="/Userlist" element={<UserList />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Profile" element={<ProfilePage />} />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
          <DockWrapper />
        </ApolloProvider>
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

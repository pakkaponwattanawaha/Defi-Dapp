import React from "react";
import { DAppProvider, ChainId } from "@usedapp/core";
import { Header } from "./components/Header";
import { Container } from "@material-ui/core";
import { Main } from "./pages/Main";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Faucets } from "./pages/Faucets";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  appContainer: {
    background:
      "radial-gradient(50% 50% at 50% 50%,#fc077d10 0,rgba(255,255,255,0) 100%)",
    width: "100%",
  },
}));
function App() {
  const classes = useStyles();
  return (
    <div className={classes.appContainer}>
      <DAppProvider
        config={{
          supportedChains: [ChainId.Kovan, ChainId.Rinkeby, 1337],
          notifications: {
            expirationPeriod: 1000,
            checkInterval: 1000,
          },
        }}
      >
        <BrowserRouter>
          <Header />
          <Container maxWidth="md">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route index element={<Main />} />
              <Route path="faucets" element={<Faucets />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<Main />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </DAppProvider>
    </div>
  );
}

export default App;

import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
import MacTokenPng from "../resources/MacToken.png";

const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    background: "white",
  },
  headerContainer: {
    padding: theme.spacing(4),
    display: "flex",
    justifyContent: "space-between",
    overflow: "auto",
    gap: theme.spacing(1),
    boxShadow: "rgb(4 17 29 / 25%) 0px 0px 8px 0px",
  },
  headerText: {
    paddingRight: theme.spacing(2),
    fontFamily: "sans-serif",
    fontSize: "18px",
    textDecoration: "none",
  },
  pageNavigatorLink: {
    paddingRight: theme.spacing(2),
    fontFamily: "sans-serif",
    fontSize: "22px",
    textDecoration: "none",
    "&:visited": { color: "inherit" },
    "&:hover": { color: "inherit" },
    "&:active": { color: "inherit" },
  },
  pageNavigatorContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing(1),
  },
  navIcon: {
    width: "40px",
  },
}));

export const Header = () => {
  const classes = useStyles();
  const { account, activateBrowserWallet, deactivate } = useEthers();
  // const isConnected = account !== undefined;
  const shortenAccountAddress = account
    ? account.substring(0, 5) +
      "..." +
      account.substring(account.length - 4, account.length)
    : "";
  return (
    <div className={classes.headerWrapper}>
      <div className={classes.headerContainer}>
        <div>
          <img src={MacTokenPng} className={classes.navIcon}></img>
        </div>
        <div className={classes.pageNavigatorContainer}>
          <div>
            <Link className={classes.pageNavigatorLink} to="/">
              Stake
            </Link>
            <Link className={classes.pageNavigatorLink} to="faucets">
              Faucets
            </Link>
            <Link className={classes.pageNavigatorLink} to="dashboard">
              Dashboard
            </Link>
            <Link className={classes.pageNavigatorLink} to="profile">
              Profile
            </Link>
          </div>
          {account ? (
            <div>
              <span className={classes.headerText}>
                {shortenAccountAddress}
              </span>
              <Button
                color="secondary"
                variant="contained"
                onClick={deactivate}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={() => activateBrowserWallet()}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

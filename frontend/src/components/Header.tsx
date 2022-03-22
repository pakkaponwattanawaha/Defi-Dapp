import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  headerWrapper: {
    background: "lightblue",
  },
  headerContainer: {
    padding: theme.spacing(4),
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(1),
  },
  headerText: {
    paddingRight: theme.spacing(2),
    fontFamily: "Roboto",
    fontSize: "18px",
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
        {account ? (
          <div>
            <span className={classes.headerText}>{shortenAccountAddress}</span>
            <Button color="secondary" variant="contained" onClick={deactivate}>
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
  );
};

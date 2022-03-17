import { useEthers } from "@usedapp/core";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(1),
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
    <div className={classes.container}>
      {account ? (
        <div>
          <Button color="secondary" variant="contained" onClick={deactivate}>
            Disconnect
          </Button>
          <span>{shortenAccountAddress}</span>
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
  );
};

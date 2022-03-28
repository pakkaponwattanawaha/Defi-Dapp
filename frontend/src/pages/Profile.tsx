import React, { useEffect } from "react";
import { useEthers } from "@usedapp/core";
import { useIssueReward } from "../hooks/useIssueReward";
import { Box, Button, CircularProgress } from "@material-ui/core";
import asuki5412 from "../resources/asuki5412.png";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  contentContainer: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(4),
    padding: theme.spacing(3),
    border: "1px solid rgb(229, 232, 235)",
    borderRadius: theme.spacing(2),
    background: "rgb(248, 248, 250)",
    fontFamily: "sans-serif",
  },
  unstakeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(2),
  },
  profilepics: {
    borderRadius: theme.spacing(2),
  },
}));
export const Profile = () => {
  const { account } = useEthers();
  const { send: transferMacToken, state: transferMacTokenState } =
    useIssueReward();

  const handleUnstakeSubmit = () => {
    transferMacToken();
  };

  const isMining = transferMacTokenState.status === "Mining"; // for check making transaction
  const classes = useStyles();

  return (
    <Box className={classes.contentContainer}>
      <img className={classes.profilepics} src={asuki5412}></img>
      <span>Address: {account}</span>
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={handleUnstakeSubmit}
        disabled={isMining}
      >
        {isMining ? <CircularProgress size={26} /> : `Issue Tokens`}
      </Button>
    </Box>
  );
};

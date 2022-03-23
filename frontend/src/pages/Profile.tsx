import React, { useEffect } from "react";
import { useIssueReward } from "../hooks/useIssueReward";
import { Button, CircularProgress } from "@material-ui/core";
import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { utils } from "ethers";

export const Profile = () => {
  const { send: transferMacToken, state: transferMacTokenState } =
    useIssueReward();

  const handleUnstakeSubmit = () => {
    transferMacToken();
  };

  const isMining = transferMacTokenState.status === "Mining"; // for check making transaction

  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={handleUnstakeSubmit}
        disabled={isMining}
      >
        {isMining ? <CircularProgress size={26} /> : `Issue Tokens`}
      </Button>
    </div>
  );
};

import React, { useEffect } from "react";
import { useTransferMacToken } from "../hooks/useTransferMacToken";
import { Button, CircularProgress } from "@material-ui/core";
import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { utils } from "ethers";
export const Faucets = () => {
  const { account, chainId } = useEthers();

  const amount = 100;
  const amountAsWei = utils.parseEther(amount.toString());
  const { send: transferMacToken, state: transferMacTokenState } =
    useTransferMacToken();
  const handletransferMacToken = () => {
    // console.log("Transfering 100 Mac");
    // console.log(account);
    transferMacToken(amountAsWei.toString(), account);
  };
  const isMining = transferMacTokenState.status === "Mining"; // for check making transaction
  // useEffect(() => {
  //   console.log("STATUSSSS", transferMacTokenState);
  // }, [transferMacTokenState]);
  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        size="large"
        onClick={handletransferMacToken}
        disabled={isMining}
      >
        {isMining ? <CircularProgress size={26} /> : `Get Mac coin`}
      </Button>
    </div>
  );
};

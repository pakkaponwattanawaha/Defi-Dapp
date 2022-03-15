import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Snackbar,
  makeStyles,
  TextField,
} from "@material-ui/core";

import { Token } from "../Main";
import { useUnstakeTokens } from "../../hooks";
import { useStakingBalance } from "../../hooks";
import Alert from "@material-ui/lab/Alert";
import { useNotifications } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { BalanceMsg } from "./BalanceMsg";
import { utils } from "ethers";

export interface UnstakeFormProps {
  token: Token;
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(4),
  },
  unstakeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(2),
  },
}));

export const UnstakeForm = ({ token }: UnstakeFormProps) => {
  const { image, address: tokenAddress, name } = token;

  const { notifications } = useNotifications();

  const balance = useStakingBalance(tokenAddress);

  const formattedBalance: number = balance
    ? parseFloat(formatUnits(balance, 18))
    : 0;

  const { send: unstakeTokensSend, state: unstakeTokensState } =
    useUnstakeTokens();

  const handleUnstakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString());
    console.log(
      "unstake with amount:",
      amountAsWei.toString(),
      "of  ",
      tokenAddress,
      "token"
    );
    return unstakeTokensSend(amountAsWei.toString(), tokenAddress);
  };
  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value);
    setAmount(newAmount);
    console.log(newAmount);
  };

  const [showUnstakeSuccess, setShowUnstakeSuccess] = useState(false);

  const handleCloseSnack = () => {
    showUnstakeSuccess && setShowUnstakeSuccess(false);
  };

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Unstake tokens"
      ).length > 0
    ) {
      !showUnstakeSuccess && setShowUnstakeSuccess(true);
    }
  }, [notifications, showUnstakeSuccess]);

  const isMining = unstakeTokensState.status === "Mining"; // for check making transaction

  const classes = useStyles();

  return (
    <div className={classes.contentContainer}>
      <BalanceMsg
        label={name}
        amount={formattedBalance}
        tokenImgSrc={image}
        type="unStake"
      />
      <div className={classes.unstakeContainer}>
        <TextField
          label="Unstake amount"
          type="number"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
        />
        <Button
          color="secondary"
          variant="contained"
          size="large"
          onClick={handleUnstakeSubmit}
          disabled={isMining}
        >
          {isMining ? <CircularProgress size={26} /> : `Unstake ${name}`}
        </Button>
      </div>
      <Snackbar
        open={showUnstakeSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Tokens unstaked successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Token } from "../../pages/Main";
import { useEthers, useTokenBalance, useNotifications } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import {
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useStakeTokens } from "../../hooks";
import { utils } from "ethers";

export interface StakeFormProps {
  token: Token;
}

const useStyles = makeStyles((theme) => ({
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: theme.spacing(2),
  },
}));
export const StakeForm = ({ token }: StakeFormProps) => {
  const { address: tokenAddress, name } = token;
  const { account } = useEthers();
  const tokenBalance = useTokenBalance(tokenAddress, account);
  const formattedTokenBalance: number = tokenBalance
    ? parseFloat(formatUnits(tokenBalance, 18))
    : 0;
  const { notifications } = useNotifications();

  const [amount, setAmount] = useState<
    number | string | Array<number | string>
  >(0);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount =
      event.target.value === "" ? "" : Number(event.target.value);
    setAmount(newAmount);
    console.log(newAmount);
  };
  //call  useStakeTokens hooks to interact with tokenFarm contract
  const { send: stakeTokensSend, state: stakeTokensState } =
    useStakeTokens(tokenAddress);

  //Handle Stake button and stake the amount given
  const handleStakeSubmit = () => {
    const amountAsWei = utils.parseEther(amount.toString());
    return stakeTokensSend(amountAsWei.toString());
  };

  const isMining = stakeTokensState.status === "Mining";
  const [showErc20ApprovalSuccess, setShowErc20ApprovalSuccess] =
    useState(false);
  const [showStakeTokenSuccess, setShowStakeTokenSuccess] = useState(false);
  const handleCloseSnack = () => {
    setShowErc20ApprovalSuccess(false);
    setShowStakeTokenSuccess(false);
  };

  useEffect(() => {
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Approve ERC20 transfer"
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(true);
      setShowStakeTokenSuccess(false);
    }
    if (
      notifications.filter(
        (notification) =>
          notification.type === "transactionSucceed" &&
          notification.transactionName === "Stake Tokens"
      ).length > 0
    ) {
      setShowErc20ApprovalSuccess(false);
      setShowStakeTokenSuccess(true);
    }
    //looking for success status and state update
  }, [notifications, showErc20ApprovalSuccess, showStakeTokenSuccess]);

  const classes = useStyles();

  return (
    <>
      <div className={classes.contentContainer}>
        <TextField
          label="Stake Amount"
          type="number"
          variant="outlined"
          onChange={handleInputChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button
          onClick={handleStakeSubmit}
          color="primary"
          variant="contained"
          size="large"
          disabled={isMining}
        >
          {isMining ? <CircularProgress size={26} /> : "STAKE"}
        </Button>
      </div>
      <Snackbar
        open={showErc20ApprovalSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          ERC-20 token transfer approved! Now approve the 2nd transaction.
        </Alert>
      </Snackbar>
      <Snackbar
        open={showStakeTokenSuccess}
        autoHideDuration={5000}
        onClose={handleCloseSnack}
      >
        <Alert onClose={handleCloseSnack} severity="success">
          Tokens Staked!
        </Alert>
      </Snackbar>
    </>
  );
};

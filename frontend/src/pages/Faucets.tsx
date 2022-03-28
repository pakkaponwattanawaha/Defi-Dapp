import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTransferMacToken } from "../hooks/useTransferMacToken";
import { Button, CircularProgress } from "@material-ui/core";
import { formatUnits } from "@ethersproject/units";
import { useEthers } from "@usedapp/core";
import { utils } from "ethers";
import { makeStyles } from "@material-ui/core";
import MacTokenPng from "../resources/MacToken.png";
import ETHTokenPng from "../resources/eth.png";
import DAITokenPng from "../resources/dai.png";
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    fontFamily: "sans-serif",
  },
  faucetWrapper: {
    marginTop: theme.spacing(3),
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
    border: "1px solid rgb(229, 232, 235)",
    borderRadius: theme.spacing(2),
    background: "rgb(248, 248, 250)",
    maxWidth: "560px",
    margin: "auto",
  },
  descContainer: {
    gap: theme.spacing(2),
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tokenImg: {
    width: "36px",
    // paddingLeft: theme.spacing(2),
  },
  amount: {
    fontWeight: 600,
    // paddingLeft: theme.spacing(2),
  },
  tokenLabel: {
    fontWeight: 400,
    // paddingLeft: theme.spacing(2),
  },
  heading: {
    marginTop: 0,
  },
}));

export const Faucets = () => {
  const { account, chainId } = useEthers();

  const amount = 100;
  const amountAsWei = utils.parseEther(amount.toString());
  const { send: transferMacToken, state: transferMacTokenState } =
    useTransferMacToken();
  const handletransferMacToken = () => {
    transferMacToken(amountAsWei.toString(), account);
  };
  const isMining = transferMacTokenState.status === "Mining"; // for check making transaction
  const classes = useStyles();
  const navigate = useNavigate();
  return (
    <div className={classes.mainContainer}>
      <h1>Faucets</h1>
      <div className={classes.faucetWrapper}>
        <h2 className={classes.heading}>MAC Token</h2>
        <div className={classes.descContainer}>
          <img
            className={classes.tokenImg}
            src={MacTokenPng}
            alt="token logo"
          />
          <span className={classes.amount}>100</span>
          <span className={classes.tokenLabel}>MAC</span>
        </div>
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={handletransferMacToken}
          disabled={isMining}
        >
          {isMining ? <CircularProgress size={26} /> : `Get Mac token`}
        </Button>
      </div>
      <div className={classes.faucetWrapper}>
        <h2 className={classes.heading}>WETH Token</h2>
        <div className={classes.descContainer}>
          <img
            className={classes.tokenImg}
            src={ETHTokenPng}
            alt="token logo"
          />

          <span className={classes.tokenLabel}>GET WETH</span>
        </div>

        <Button
          href="https://faucets.chain.link/"
          color="primary"
          variant="contained"
          size="large"
        >
          ETH faucets
        </Button>
        <Button
          href="https://kovan.etherscan.io/address/0xd0A1E359811322d97991E03f863a0C30C2cF029C"
          color="primary"
          variant="contained"
          size="large"
        >
          WETH Contract
        </Button>
      </div>
      <div className={classes.faucetWrapper}>
        <h2 className={classes.heading}>DAI Token</h2>
        <div className={classes.descContainer}>
          <img
            className={classes.tokenImg}
            src={DAITokenPng}
            alt="token logo"
          />

          <span className={classes.tokenLabel}>Mint FAU Token (our DAI) </span>
        </div>
        <Button
          href="https://erc20faucet.com/"
          color="primary"
          variant="contained"
          size="large"
        >
          erc20faucet.com
        </Button>
      </div>
    </div>
  );
};

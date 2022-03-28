import React from "react";
import { useCurrentStakeReward } from "../hooks";
import { useStakingBalance } from "../hooks";
import { formatUnits } from "@ethersproject/units";
import { WalletBalance } from "../components/Wallet/WalletBalance";
import { StakedBalance } from "../components/StakedBalance";
import { useEthers } from "@usedapp/core";

import helperConfig from "../helper-info/helper-network-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import brownieConfig from "../brownie-config.json";

import MacTokenPng from "../resources/MacToken.png";
import ETHTokenPng from "../resources/eth.png";
import DAITokenPng from "../resources/dai.png";
import { constants } from "ethers";

import { makeStyles, Box } from "@material-ui/core";

export type Token = {
  image: string;
  address: string;
  name: string;
};

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    marginTop: theme.spacing(4),
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    border: "2px solid rgb(229, 232, 235)",
    borderRadius: theme.spacing(2),
    background: "rgb(248, 248, 250)",
    fontFamily: "sans-serif",
    flexWrap: "wrap",
  },
  balanceContainer: {
    padding: theme.spacing(3),
    border: "1px solid rgb(229, 232, 235)",
    borderRadius: theme.spacing(2),
    boxShadow: "rgb(12 22 44 / 32%) 0px 8px 2",
    background: "#fbfbfb",
    minWidth: "250px",
    width: "40%",
  },
  pendingAmount: {
    fontSize: "18px",
    paddingBottom: theme.spacing(1),
  },
  balanceWrapper: {
    gap: theme.spacing(2),
    justifyContent: "space-around",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
}));

export const Dashboard = () => {
  const { chainId } = useEthers();
  const networkName = chainId ? helperConfig[chainId] : "dev";
  const MacTokenAddress = chainId
    ? networkMapping[String(chainId)]["MacToken"][0]
    : constants.AddressZero;
  const wethTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["weth_token"]
    : constants.AddressZero; // brownie config
  const fauTokenAddress = chainId
    ? brownieConfig["networks"][networkName]["fau_token"]
    : constants.AddressZero;

  const supportedTokens: Array<Token> = [
    {
      image: MacTokenPng,
      address: MacTokenAddress,
      name: "MAC",
    },
    {
      image: ETHTokenPng,
      address: wethTokenAddress,
      name: "WETH",
    },
    {
      image: DAITokenPng,
      address: fauTokenAddress,
      name: "DAI",
    },
  ];
  const currentStakeReward = useCurrentStakeReward();
  const formattedReward: number = currentStakeReward
    ? parseFloat(formatUnits(currentStakeReward, 18))
    : 0;
  const classes = useStyles();
  return (
    <div>
      <div className={classes.mainContainer}>
        <h2>Dashboard</h2>
        <div className={classes.pendingAmount}>
          Pending Staked Reward: {formattedReward} MAC
        </div>

        <Box className={classes.balanceWrapper}>
          <Box className={classes.balanceContainer}>
            <h3>Balance</h3>
            {supportedTokens.map((token, index) => {
              return <WalletBalance token={token} />;
            })}
          </Box>
          <Box className={classes.balanceContainer}>
            <h3>Staked</h3>
            {supportedTokens.map((token, index) => {
              return <StakedBalance token={token} />;
            })}
          </Box>
        </Box>
      </div>
    </div>
  );
};

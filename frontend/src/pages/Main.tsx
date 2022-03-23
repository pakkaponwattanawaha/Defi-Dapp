import React from "react";
import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-info/helper-network-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import MacTokenPng from "../resources/MacToken.png";
import DAITokenPng from "../resources/dai.png";
import ETHTokenPng from "../resources/eth.png";
import { Wallet } from "../components/Wallet/Wallet";
import { TokenFarmContract } from "../components/TokenFarmContract";
import { makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";
export type Token = {
  image: string;
  address: string;
  name: string;
};
const useStyles = makeStyles((theme) => ({
  mainContainer: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    border: "1px solid",
    borderRadius: theme.spacing(2),
  },
  headerText: {
    paddingLeft: theme.spacing(2),
    fontFamily: "Roboto",
    fontSize: "18px",
  },
}));
export const Main = () => {
  // show token value from the wallet
  // Get the address if different token
  // Get balance of user in respect to each token
  // Get information and config from brownie config

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
  const classes = useStyles();
  console.log(networkName, MacTokenAddress, wethTokenAddress, fauTokenAddress);
  return (
    <div>
      <div className={classes.mainContainer}>
        <Wallet supportedTokens={supportedTokens}></Wallet>
        <TokenFarmContract supportedTokens={supportedTokens} />
      </div>
    </div>
  );
};

import React from "react";
import { useEthers } from "@usedapp/core";
import helperConfig from "../helper-info/helper-network-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json";
import MacTokenPng from "../resources/MacToken.png";
import DAITokenPng from "../resources/dai.png";
import ETHTokenPng from "../resources/eth.png";
import { Wallet } from "./Wallet/Wallet";

export type Token = {
  image: string;
  address: string;
  name: string;
};

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
      address: MacTokenAddress,
      name: "DAI",
    },
  ];

  console.log(networkName, MacTokenAddress, wethTokenAddress, fauTokenAddress);
  return <Wallet supportedTokens={supportedTokens}></Wallet>;
};

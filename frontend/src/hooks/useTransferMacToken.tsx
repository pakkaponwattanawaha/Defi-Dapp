import { useContractFunction, useEthers } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import { utils, BigNumber, constants } from "ethers";
import networkMapping from "../chain-info/deployments/map.json";
import { Contract } from "@usedapp/core/node_modules/@ethersproject/contracts";
// Act as a faucet to get free MAC token
// for now 1MAC is = 1 DAI
export const useTransferMacToken = () => {
  const { chainId } = useEthers();

  const { abi } = TokenFarm;
  const tokenFarmContractAddress = chainId
    ? networkMapping[String(chainId)]["TokenFarm"][0]
    : constants.AddressZero;

  const tokenFarmInterface = new utils.Interface(abi);
  const tokenFarmContract = new Contract(
    tokenFarmContractAddress,
    tokenFarmInterface
  );

  const { send, state } = useContractFunction(
    tokenFarmContract,
    "transferToken",
    {
      transactionName: "transfer MAC token airdrop",
    }
  );
  return { send, state };
};

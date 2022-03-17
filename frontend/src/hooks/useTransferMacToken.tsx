import { useContractFunction, useEthers } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import { utils, BigNumber, constants } from "ethers";
import networkMapping from "../chain-info/deployments/map.json";
import { Contract } from "@usedapp/core/node_modules/@ethersproject/contracts";
/**
 * Get the staking balance of a certain token by the user in our TokenFarm contract
 * @param address - The contract address of the token
 */
export const useTransferMacToken = () => {
  const { account, chainId } = useEthers();

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

import { useCall, useEthers } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import { utils, BigNumber, constants } from "ethers";
import networkMapping from "../chain-info/deployments/map.json";
import { Contract } from "@usedapp/core/node_modules/@ethersproject/contracts";
// Issue reward MAC token for the amount each account stake!
export const useCurrentStakeReward = () : BigNumber | undefined=> {
  const { account,chainId } = useEthers();

  const { abi } = TokenFarm;
  const tokenFarmContractAddress = chainId
    ? networkMapping[String(chainId)]["TokenFarm"][0]
    : constants.AddressZero;

  const tokenFarmInterface = new utils.Interface(abi);

  const tokenFarmContract = new Contract(
    tokenFarmContractAddress,
    tokenFarmInterface
  );

  const { value, error } =
    useCall(
      tokenFarmInterface && {
        contract: tokenFarmContract,
        method: "getUserTotalValue",
        args: [account],
      }
    ) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }
  console.log(account,chainId)
  return value?.[0];
};

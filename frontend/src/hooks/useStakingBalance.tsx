import { useCall, useEthers } from "@usedapp/core";
import TokenFarm from "../chain-info/contracts/TokenFarm.json";
import { utils, BigNumber, constants } from "ethers";
import networkMapping from "../chain-info/deployments/map.json";
import { Contract } from "@usedapp/core/node_modules/@ethersproject/contracts";
/**
 * Get the staking balance of a certain token by the user in our TokenFarm contract
 * @param address - The contract address of the token
 */
export const useStakingBalance = (address: string): BigNumber | undefined => {
  const { account, chainId } = useEthers();

  const { abi } = TokenFarm;
  const tokenFarmContractAddress = chainId
    ? networkMapping[String(chainId)]["TokenFarm"][0]
    : constants.AddressZero;

  const tokenFarmInterface = new utils.Interface(abi);
  const { value, error } =
    useCall(
      tokenFarmInterface && {
        contract: new Contract(tokenFarmContractAddress, tokenFarmInterface),
        method: "stakingBalance",
        args: [address, account],
      }
    ) ?? {};
  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
  // const [stakingBalance] =
  //   useContractCall({
  //     abi: tokenFarmInterface,
  //     address: tokenFarmContractAddress,
  //     method: "stakingBalance",
  //     args: [address, account],
  //   }) ?? [];

  // return stakingBalance;
};

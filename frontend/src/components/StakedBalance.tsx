import { Token } from "../pages/Main";
import { useEthers } from "@usedapp/core";
import { formatUnits } from "@ethersproject/units";
import { BalanceMsg } from "./Wallet/BalanceMsg";
import { useStakingBalance } from "../hooks";

export interface StakedBalanceProps {
  token: Token;
}

export const StakedBalance = ({ token }: StakedBalanceProps) => {
  const { image, address: tokenAddress, name } = token;

  const balance = useStakingBalance(tokenAddress); // use coin address and account address to get user balance
  const formattedStakedBalance: number = balance
    ? parseFloat(formatUnits(balance, 18))
    : 0;
  return (
    <BalanceMsg
      label={name}
      tokenImgSrc={image}
      amount={formattedStakedBalance}
      type="stake"
    />
  );
};
